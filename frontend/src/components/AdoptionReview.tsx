import React, { useEffect, useState } from 'react';
import { adoptionsService } from '../services/adoptionsService';
import { Adoption, AdoptionStatus, AdoptionStats } from '../types/adoption';

const AdoptionReview: React.FC = () => {
  const [adoptions, setAdoptions] = useState<Adoption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingAdoptionId, setUpdatingAdoptionId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | AdoptionStatus>('all');

  useEffect(() => { void loadAdoptions(); }, []);

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

  const stats: AdoptionStats = {
    total: adoptions.length, pending: adoptions.filter((item) => item.status === AdoptionStatus.PENDING).length,
    under_review: adoptions.filter((item) => item.status === AdoptionStatus.UNDER_REVIEW).length,
    approved: adoptions.filter((item) => item.status === AdoptionStatus.APPROVED).length,
  };
  const visible = statusFilter === 'all' ? adoptions : adoptions.filter((item) => item.status === statusFilter);

  return (
    <div className="container">
      <div className="page-heading review-heading">
        <div><h1>Revisión de adopciones</h1><p>Evalúa cada solicitud y mantén el flujo de entrega en movimiento.</p></div>
        <div className="queue-signal"><span aria-hidden="true" /> Cola activa</div>
      </div>

      <div className="stats-bar" aria-label="Resumen y filtros de solicitudes">
        <button className={`stat-item${statusFilter === 'all' ? ' is-selected' : ''}`} onClick={() => setStatusFilter('all')}><span className="stat-number">{stats.total}</span><span className="stat-label">Total</span></button>
        <button className={`stat-item stat-pending${statusFilter === AdoptionStatus.PENDING ? ' is-selected' : ''}`} onClick={() => setStatusFilter(AdoptionStatus.PENDING)}><span className="stat-number">{stats.pending}</span><span className="stat-label">Pendientes</span></button>
        <button className={`stat-item stat-review${statusFilter === AdoptionStatus.UNDER_REVIEW ? ' is-selected' : ''}`} onClick={() => setStatusFilter(AdoptionStatus.UNDER_REVIEW)}><span className="stat-number">{stats.under_review}</span><span className="stat-label">En revisión</span></button>
        <button className={`stat-item stat-approved${statusFilter === AdoptionStatus.APPROVED ? ' is-selected' : ''}`} onClick={() => setStatusFilter(AdoptionStatus.APPROVED)}><span className="stat-number">{stats.approved}</span><span className="stat-label">Aprobadas</span></button>
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
