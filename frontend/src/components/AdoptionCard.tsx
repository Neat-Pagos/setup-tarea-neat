import React, { useState } from 'react';
import { Adoption, AdoptionStatus } from '../types/adoption';
import { adoptionsService } from '../services/adoptionsService';
import { useBroadcastRefresh } from '../hooks/useBroadcastRefresh';

interface AdoptionCardProps {
  adoption: Adoption;
}

const STATUS_TEXT: Record<AdoptionStatus, string> = {
  [AdoptionStatus.PENDING]: 'Pendiente',
  [AdoptionStatus.UNDER_REVIEW]: 'En Revisión',
  [AdoptionStatus.APPROVED]: 'Aprobada',
  [AdoptionStatus.REJECTED]: 'Rechazada',
  [AdoptionStatus.DELIVERED]: 'Entregada',
  [AdoptionStatus.DELIVERY_FAILED]: 'Entrega Fallida',
  [AdoptionStatus.SECURITY_CONCERN]: 'Preocupación de Seguridad',
};

type FirestoreTimestamp = { _seconds: number; _nanoseconds: number };

const formatDate = (dateString?: FirestoreTimestamp): string => {
  if (!dateString) return 'N/A';
  return new Date(dateString._seconds * 1000).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const AdoptionCard: React.FC<AdoptionCardProps> = ({ adoption }) => {
  const [status, setStatus] = useState<AdoptionStatus>(adoption.status);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { broadcast: broadcastPokemonUpdate } = useBroadcastRefresh('pokemons');

  const handleStatusChange = async (newStatus: AdoptionStatus): Promise<void> => {
    const actionable = [
      AdoptionStatus.APPROVED,
      AdoptionStatus.REJECTED,
      AdoptionStatus.DELIVERED,
      AdoptionStatus.DELIVERY_FAILED,
      AdoptionStatus.SECURITY_CONCERN,
    ];

    if (!actionable.includes(newStatus)) {
      setStatus(newStatus);
      return;
    }

    setIsLoading(true);
    try {
      switch (newStatus) {
        case AdoptionStatus.APPROVED:
          await adoptionsService.approveAdoption(adoption.id);
          broadcastPokemonUpdate();
          break;
        case AdoptionStatus.REJECTED:
          await adoptionsService.rejectAdoption(adoption.id, '');
          break;
        case AdoptionStatus.DELIVERED:
          await adoptionsService.markDelivered(adoption.id);
          break;
        case AdoptionStatus.DELIVERY_FAILED:
          await adoptionsService.markDeliveryFailed(adoption.id, '');
          break;
        case AdoptionStatus.SECURITY_CONCERN:
          await adoptionsService.markSecurityConcern(adoption.id, '');
          break;
      }
      setStatus(newStatus);
    } catch (err) {
      console.error('Error updating adoption status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="adoption-card" style={{ cursor: 'pointer' }}>
      <div className="adoption-header">
        <div className="pokemon-info">
          <h3>Pokemon ID: {adoption.pokemonId}</h3>
        </div>
      </div>

      <div className="adoption-details">
        {isLoading ? (
          <select className={`status-badge status-${status}`} disabled>
            <option>Actualizando...</option>
          </select>
        ) : (
          <select
            className={`status-badge status-${status}`}
            value={status}
            onChange={(e) => handleStatusChange(e.target.value as AdoptionStatus)}
          >
            {Object.keys(AdoptionStatus).map((key) => {
              const value = AdoptionStatus[key as keyof typeof AdoptionStatus];
              return (
                <option key={key} value={value}>
                  {STATUS_TEXT[value]}
                </option>
              );
            })}
          </select>
        )}
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
        <p><strong>Fecha de Solicitud:</strong> {formatDate(adoption.createdAt as unknown as FirestoreTimestamp)}</p>
        {adoption.reviewedAt && (
          <p><strong>Fecha de Revisión:</strong> {formatDate(adoption.reviewedAt as unknown as FirestoreTimestamp)}</p>
        )}
        {adoption.approvalDate && (
          <p><strong>Fecha de Aprobación:</strong> {formatDate(adoption.approvalDate as unknown as FirestoreTimestamp)}</p>
        )}
        {adoption.rejectionReason && (
          <p><strong>Razón de Rechazo:</strong> {adoption.rejectionReason}</p>
        )}
        {adoption.reviewedBy && (
          <p><strong>Revisado por:</strong> {adoption.reviewedBy}</p>
        )}
      </div>
    </div>
  );
};

export default AdoptionCard;
