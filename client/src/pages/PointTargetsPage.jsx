import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { pointTargetApi } from '../api/pointTargetApi';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { getInitials, generateAvatarColor, formatDate } from '../utils/helpers';
import { POINT_PERIODS } from '../utils/constants';
import { EmptyTargetIllustration } from '../components/common/Illustrations';
import { Plus, X, Trash2, FileText, Target } from 'lucide-react';

export default function PointTargetsPage() {
  const { projectId } = useParams();
  const { activeProject, selectProject } = useProject();
  const { user } = useAuth();
  const [targets, setTargets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ user: '', targetPoints: 20, period: 'sprint', periodStart: '', periodEnd: '', notes: '' });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const isManagerOrAdmin = user?.role === 'admin' || user?.role === 'manager';

  useEffect(() => { if (projectId) { if (!activeProject || activeProject._id !== projectId) selectProject(projectId); loadTargets(); } }, [projectId]);

  const loadTargets = async () => { try { const res = await pointTargetApi.getByProject(projectId); setTargets(res.data); } catch (err) { console.error(err); } finally { setLoading(false); } };

  const handleCreate = async (e) => { e.preventDefault(); setError(''); setCreating(true); try { await pointTargetApi.create({ ...form, project: projectId }); setShowCreate(false); setForm({ user: '', targetPoints: 20, period: 'sprint', periodStart: '', periodEnd: '', notes: '' }); loadTargets(); } catch (err) { setError(err.message); } finally { setCreating(false); } };

  const handleDelete = async (id) => { if (!window.confirm('Delete this target?')) return; try { await pointTargetApi.remove(id); loadTargets(); } catch (err) { alert(err.message); } };

  if (loading) return <div className="page-loader"><div className="loader" /></div>;

  return (
    <div style={{ maxWidth: 900 }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Point Targets</h1>
          <p className="text-sm text-secondary" style={{ marginTop: 4 }}>Set and track story point targets for team members</p>
        </div>
        {isManagerOrAdmin && <button className="btn btn-primary" onClick={() => setShowCreate(true)}><Plus size={16} /> Set Target</button>}
      </div>

      {targets.length === 0 ? (
        <div className="empty-state">
          <EmptyTargetIllustration width={200} height={160} />
          <div className="empty-state-title">No targets set</div>
          <div className="empty-state-text">Managers can set story point targets for team members to track velocity</div>
          {isManagerOrAdmin && <button className="btn btn-primary" onClick={() => setShowCreate(true)}><Plus size={16} /> Set First Target</button>}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {targets.map(t => (
            <div key={t._id} className="dashboard-section" style={{ padding: '16px 20px' }}>
              <div className="flex items-center gap-md">
                <div className="avatar avatar-sm" style={{ background: generateAvatarColor(t.user?.name) }}>{getInitials(t.user?.name)}</div>
                <div style={{ flex: 1 }}>
                  <div className="font-medium" style={{ fontSize: '.875rem' }}>{t.user?.name}</div>
                  <div className="text-xs text-tertiary">{t.period} · {formatDate(t.periodStart)} → {formatDate(t.periodEnd)}</div>
                </div>
                <div style={{ textAlign: 'center', padding: '0 16px' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{t.targetPoints}</div>
                  <div className="text-xs text-tertiary">Target Points</div>
                </div>
                {t.notes && <span className="badge badge-neutral" title={t.notes}><FileText size={12} /></span>}
                <span className="text-xs text-tertiary">by {t.setBy?.name}</span>
                {isManagerOrAdmin && <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(t._id)} style={{ color: 'var(--error)' }}><Trash2 size={14} /></button>}
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Target size={18} color="var(--accent-primary)" /> Set Point Target</h3>
              <button className="modal-close" onClick={() => setShowCreate(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {error && <div className="form-error">{error}</div>}
                <div className="form-group"><label className="form-label">Team Member *</label><select className="form-select" value={form.user} onChange={e => setForm({...form, user: e.target.value})} required><option value="">Select member...</option>{activeProject?.members?.map(m => <option key={m.user?._id} value={m.user?._id}>{m.user?.name} ({m.role})</option>)}</select></div>
                <div className="flex gap-md">
                  <div className="form-group flex-1"><label className="form-label">Target Points *</label><input className="form-input" type="number" min="1" max="200" value={form.targetPoints} onChange={e => setForm({...form, targetPoints: parseInt(e.target.value) || 0})} required /></div>
                  <div className="form-group flex-1"><label className="form-label">Period</label><select className="form-select" value={form.period} onChange={e => setForm({...form, period: e.target.value})}>{POINT_PERIODS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}</select></div>
                </div>
                <div className="flex gap-md">
                  <div className="form-group flex-1"><label className="form-label">Period Start *</label><input className="form-input" type="date" value={form.periodStart} onChange={e => setForm({...form, periodStart: e.target.value})} required /></div>
                  <div className="form-group flex-1"><label className="form-label">Period End *</label><input className="form-input" type="date" value={form.periodEnd} onChange={e => setForm({...form, periodEnd: e.target.value})} required /></div>
                </div>
                <div className="form-group"><label className="form-label">Notes</label><textarea className="form-textarea" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Optional notes..." /></div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={creating}>{creating ? <div className="loader loader-sm" /> : 'Set Target'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
