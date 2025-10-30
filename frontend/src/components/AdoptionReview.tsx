import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adoptionsService } from '../services/adoptionsService';
import { Adoption, AdoptionStatus, AdoptionStats } from '../types/adoption';

const AdoptionReview: React.FC = () => {
  const navigate = useNavigate();
  const [adoptions, setAdoptions] = useState<Adoption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAdoptions();
  }, []);

  const loadAdoptions = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data = await adoptionsService.getReviewAdoptions();
      setAdoptions(data);
    } catch (err: any) {
      setError(err.error || 'Error al cargar las adopciones');
      console.error('Error loading adoptions:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: { _seconds: number, _nanoseconds: number }): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString._seconds * 1000).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusText = (status: AdoptionStatus): string => {
    const statusMap: Record<AdoptionStatus, string> = {
      [AdoptionStatus.PENDING]: 'Pendiente',
      [AdoptionStatus.UNDER_REVIEW]: 'En Revisión',
      [AdoptionStatus.APPROVED]: 'Aprobada',
      [AdoptionStatus.REJECTED]: 'Rechazada',
      [AdoptionStatus.DELIVERED]: 'Entregada',
      [AdoptionStatus.DELIVERY_FAILED]: 'Entrega Fallida',
      [AdoptionStatus.SECURITY_CONCERN]: 'Preocupación de Seguridad'
    };
    return statusMap[status] || status;
  };

  const getStatusBadgeClass = (status: AdoptionStatus): string => {
    return `status-badge status-${status}`;
  };

  const getStats = (): AdoptionStats => {
    const stats: AdoptionStats = {
      total: adoptions.length,
      pending: adoptions.filter(a => a.status === AdoptionStatus.PENDING).length,
      under_review: adoptions.filter(a => a.status === AdoptionStatus.UNDER_REVIEW).length,
      approved: adoptions.filter(a => a.status === AdoptionStatus.APPROVED).length
    };
    return stats;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>): void => {
    const target = e.target as HTMLImageElement;
    target.src = 'https://via.placeholder.com/60x60/f0f0f0/999?text=🌟';
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          Cargando adopciones...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">
          {error}
          <br />
          <button onClick={loadAdoptions} style={{ marginTop: '1rem' }}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="container">
      <div className="header">
        <h1>Panel de Revisión de Adopciones</h1>
        <p>Gestiona y revisa las solicitudes de adopción de Pokémon</p>
      </div>

      <div className="stats-bar">
        <div className="stat-item">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{stats.pending}</div>
          <div className="stat-label">Pendientes</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{stats.under_review}</div>
          <div className="stat-label">En Revisión</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{stats.approved}</div>
          <div className="stat-label">Aprobadas</div>
        </div>
      </div>

      {adoptions.length === 0 ? (
        <div className="no-adoptions">
          <h3>No hay adopciones disponibles</h3>
          <p>No se encontraron solicitudes de adopción para revisar.</p>
        </div>
      ) : (
        <div className="adoptions-grid">
          {adoptions.map((adoption) => (
            <div 
              key={adoption.id} 
              className="adoption-card"
              style={{ cursor: 'pointer' }}
            >
              <div className="adoption-header">
                <div className="pokemon-info">
                  <h3>Pokemon ID: {adoption.pokemonId }</h3>
                </div>
              </div>

              <div className="adoption-details">
                <div className={getStatusBadgeClass(adoption.status)}>
                  {getStatusText(adoption.status)}
                </div>
              </div>

              <div className="user-info">
                <h4>Información del Adoptante</h4>
                <div className="user-field">
                  <strong>Nombre:</strong>
                  <span>{adoption.userData?.name || 'N/A'}</span>
                </div>
                <div className="user-field">
                  <strong>Email:</strong>
                  <span>{adoption.userData?.email || 'N/A'}</span>
                </div>
                <div className="user-field">
                  <strong>Teléfono:</strong>
                  <span>{adoption.userData?.phone || 'N/A'}</span>
                </div>
                <div className="user-field">
                  <strong>Región:</strong>
                  <span>{adoption.userData?.region || 'N/A'}</span>
                </div>
                <div className="user-field">
                  <strong>ID:</strong>
                  <span>{adoption.userData?.idNumber || 'N/A'}</span>
                </div>
              </div>

              <div className="adoption-dates">
                <p><strong>Fecha de Solicitud:</strong> {formatDate(adoption.createdAt as unknown as { _seconds: number, _nanoseconds: number })}</p>
                {adoption.reviewedAt && (
                  <p><strong>Fecha de Revisión:</strong> {formatDate(adoption.reviewedAt as unknown as { _seconds: number, _nanoseconds: number })}</p>
                )}
                {adoption.approvalDate && (
                  <p><strong>Fecha de Aprobación:</strong> {formatDate(adoption.approvalDate as unknown as { _seconds: number, _nanoseconds: number })}</p>
                )}
                {adoption.rejectionReason && (
                  <p><strong>Razón de Rechazo:</strong> {adoption.rejectionReason}</p>
                )}
                {adoption.reviewedBy && (
                  <p><strong>Revisado por:</strong> {adoption.reviewedBy}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdoptionReview;