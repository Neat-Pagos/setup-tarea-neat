import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { adoptionsService } from '../services/adoptionsService';
import { Adoption, AdoptionStatus } from '../types/adoption';
import type { MainLayoutContext } from './MainLayout';
import './AdoptionReview.css';

type AdoptionGroup = 'under_review' | 'approved' | 'rejected';

const adoptionGroups: Record<AdoptionGroup, AdoptionStatus[]> = {
  under_review: [AdoptionStatus.PENDING, AdoptionStatus.UNDER_REVIEW],
  approved: [AdoptionStatus.APPROVED, AdoptionStatus.DELIVERED],
  rejected: [AdoptionStatus.REJECTED],
};

const AdoptionReview: React.FC = () => {
  const { openAdoptionModal } = useOutletContext<MainLayoutContext>();
  const [adoptions, setAdoptions] = useState<Adoption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingAdoptionId, setUpdatingAdoptionId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<AdoptionGroup>('under_review');

  useEffect(() => {
    void loadAdoptions();
    const handleCreated = (): void => { void loadAdoptions(); };
    window.addEventListener('adoption-created', handleCreated);
    return () => window.removeEventListener('adoption-created', handleCreated);
  }, []);

  const loadAdoptions = async (): Promise<void> => {
    try {
      setLoading(true); setError(null);
      setAdoptions(await adoptionsService.getReviewAdoptions());
    } catch (err: unknown) {
      setError(typeof err === 'object' && err !== null && 'error' in err ? String((err as { error: unknown }).error) : 'No pudimos cargar las solicitudes. Intenta nuevamente.');
    } finally { setLoading(false); }
  };

  const formatDate = (date?: { _seconds: number; _nanoseconds: number }): string => {
    if (!date) return 'No disponible';
    return new Date(date._seconds * 1000).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getStatusText = (status: AdoptionStatus): string => ({
    [AdoptionStatus.PENDING]: 'Pendiente', [AdoptionStatus.UNDER_REVIEW]: 'En revisión', [AdoptionStatus.APPROVED]: 'Aprobada', [AdoptionStatus.REJECTED]: 'Rechazada',
    [AdoptionStatus.DELIVERED]: 'Entregada', [AdoptionStatus.DELIVERY_FAILED]: 'Entrega fallida', [AdoptionStatus.SECURITY_CONCERN]: 'Alerta de seguridad',
  })[status] || status;

  const handleApprove = async (id: string): Promise<void> => {
    try { setUpdatingAdoptionId(id); setError(null); await adoptionsService.approveAdoption(id); await loadAdoptions(); }
    catch (err: unknown) { setError(typeof err === 'object' && err !== null && 'error' in err ? String((err as { error: unknown }).error) : 'No pudimos aprobar la solicitud.'); }
    finally { setUpdatingAdoptionId(null); }
  };

  const handleReject = async (id: string): Promise<void> => {
    const reason = window.prompt('Indica la razón del rechazo (opcional):');
    if (reason === null) return;
    try { setUpdatingAdoptionId(id); setError(null); await adoptionsService.rejectAdoption(id, reason); await loadAdoptions(); }
    catch (err: unknown) { setError(typeof err === 'object' && err !== null && 'error' in err ? String((err as { error: unknown }).error) : 'No pudimos rechazar la solicitud.'); }
    finally { setUpdatingAdoptionId(null); }
  };

  if (loading) return <div className="container"><div className="loading"><span className="loader-orbit" />Sincronizando solicitudes…</div></div>;
  if (error && adoptions.length === 0) return <div className="container"><div className="error"><strong>Error de sincronización</strong><span>{error}</span><button onClick={() => void loadAdoptions()}>Reintentar</button></div></div>;

  const stats = Object.fromEntries(
    Object.entries(adoptionGroups).map(([group, statuses]) => [
      group,
      adoptions.filter((item) => statuses.includes(item.status)).length,
    ]),
  ) as Record<AdoptionGroup, number>;
  const visible = adoptions.filter((item) => adoptionGroups[statusFilter].includes(item.status));

  return (
    <div className="container">
      <div className="page-heading review-heading">
        <div><h1>Revisión de adopciones</h1><p>Evalúa cada solicitud y mantén el flujo de entrega en movimiento.</p></div>
        <div className="review-heading-actions"><button className="header-action" type="button" onClick={openAdoptionModal}><span aria-hidden="true">+</span> Nueva adopción</button></div>
      </div>

      <div className="stats-bar" aria-label="Resumen y filtros de solicitudes">
        <button className={`stat-item stat-review${statusFilter === 'under_review' ? ' is-selected' : ''}`} onClick={() => setStatusFilter('under_review')}><span className="stat-number">{stats.under_review}</span><span className="stat-label">En revisión</span></button>
        <button className={`stat-item stat-approved${statusFilter === 'approved' ? ' is-selected' : ''}`} onClick={() => setStatusFilter('approved')}><span className="stat-number">{stats.approved}</span><span className="stat-label">Aprobadas</span></button>
        <button className={`stat-item stat-rejected${statusFilter === 'rejected' ? ' is-selected' : ''}`} onClick={() => setStatusFilter('rejected')}><span className="stat-number">{stats.rejected}</span><span className="stat-label">Rechazadas</span></button>
      </div>

      {error && <div className="error action-error"><strong>La acción no se completó</strong><span>{error}</span></div>}

      {visible.length === 0 ? (
        <div className="no-adoptions"><div className="empty-signal" aria-hidden="true"><span /></div><h2>No hay solicitudes en esta vista</h2><p>Prueba otro filtro o vuelve más tarde.</p></div>
      ) : (
        <div className="adoptions-grid">
          {visible.map((adoption) => (
            <article key={adoption.id} className="adoption-card">
              <div className="case-identity">
                <div className="case-stage"><span className="stage-orbit" aria-hidden="true" />{adoption.pokemonData?.imageUrl ? <img className="pokemon-image" src={adoption.pokemonData.imageUrl} alt={adoption.pokemonData.name} onError={(event) => { event.currentTarget.hidden = true; }} /> : <div className="pokemon-placeholder" role="img" aria-label="Imagen de Pokémon pendiente"><span>?</span></div>}</div>
                <div className="case-title"><div className={`status-badge status-${adoption.status}`}>{getStatusText(adoption.status)}</div><h2>{adoption.pokemonData?.name || 'Pokémon no encontrado'}</h2><p>Solicitud <span>#{adoption.id.slice(-6).toUpperCase()}</span></p></div>
              </div>
              <section className="user-info">
                <h3>Adoptante</h3><div className="user-primary"><strong>{adoption.userData?.name || 'Sin nombre'}</strong><span>{adoption.userData?.region || 'Región no indicada'}</span></div>
                <dl className="applicant-data"><div><dt>Correo</dt><dd>{adoption.userData?.email || 'No indicado'}</dd></div><div><dt>Teléfono</dt><dd>{adoption.userData?.phone || 'No indicado'}</dd></div><div><dt>Identificación</dt><dd>{adoption.userData?.idNumber || 'No indicada'}</dd></div></dl>
              </section>
              <div className="adoption-dates">
                <p><strong>Recibida</strong><span>{formatDate(adoption.createdAt as unknown as { _seconds: number; _nanoseconds: number })}</span></p>
                {adoption.reviewedAt && <p><strong>Revisada</strong><span>{formatDate(adoption.reviewedAt as unknown as { _seconds: number; _nanoseconds: number })}</span></p>}
                {adoption.approvalDate && <p><strong>Aprobada</strong><span>{formatDate(adoption.approvalDate as unknown as { _seconds: number; _nanoseconds: number })}</span></p>}
                {adoption.rejectionReason && <p><strong>Motivo</strong><span>{adoption.rejectionReason}</span></p>}
                {adoption.reviewedBy && <p><strong>Responsable</strong><span>{adoption.reviewedBy}</span></p>}
              </div>
              {(adoption.status === AdoptionStatus.PENDING || adoption.status === AdoptionStatus.UNDER_REVIEW) && <div className="adoption-actions"><button className="reject-button" disabled={updatingAdoptionId === adoption.id} onClick={() => void handleReject(adoption.id)}>Rechazar</button><button className="approve-button" disabled={updatingAdoptionId === adoption.id} onClick={() => void handleApprove(adoption.id)}>{updatingAdoptionId === adoption.id ? 'Procesando…' : 'Aprobar solicitud'}</button></div>}
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdoptionReview;
