import React, { useState, useEffect } from 'react';
import { adoptionsService } from '../services/adoptionsService';
import { Adoption, AdoptionStatus, AdoptionStats } from '../types/adoption';
import AdoptionCard from './AdoptionCard';

const AdoptionReview: React.FC = () => {
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

  const getStats = (): AdoptionStats => {
    const stats: AdoptionStats = {
      total: adoptions.length,
      pending: adoptions.filter(a => a.status === AdoptionStatus.PENDING).length,
      under_review: adoptions.filter(a => a.status === AdoptionStatus.UNDER_REVIEW).length,
      approved: adoptions.filter(a => a.status === AdoptionStatus.APPROVED).length
    };
    return stats;
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
            <AdoptionCard key={adoption.id} adoption={adoption} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdoptionReview;