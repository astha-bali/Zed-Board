import { useState, useEffect } from 'react';
import { adminApi } from '../api/adminApi';
import { projectApi } from '../api/projectApi';
import { pointTargetApi } from '../api/pointTargetApi';
import { useAuth } from '../context/AuthContext';
import { getInitials, generateAvatarColor, getRoleInfo, formatDate } from '../utils/helpers';
import { ROLES, POINT_PERIODS } from '../utils/constants';
import Icon from '../components/common/Icon';
import { EmptyTeamIllustration } from '../components/common/Illustrations';
import { Plus, X, Search, ShieldCheck, Ban, Target } from 'lucide-react';

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member', designation: '', department: '' });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const [projects, setProjects] = useState([]);
  const [showTargetModal, setShowTargetModal] = useState(null); // user object
  const [targetForm, setTargetForm] = useState({ project: '', targetPoints: 20, period: 'sprint', periodStart: '', periodEnd: '', notes: '' });
  const [settingTarget, setSettingTarget] = useState(false);

  useEffect(() => { loadUsers(); loadProjects(); }, [roleFilter]);

  const loadProjects = async () => {
    try { const res = await projectApi.getAll(); setProjects(res.data); }
    catch (err) { console.error(err); }
  };

  const loadUsers = async () => {
    try {
      let params = '';
      if (roleFilter) params += `role=${roleFilter}`;
      const res = await adminApi.getUsers(params);
      setUsers(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleRoleChange = async (userId, newRole) => {
    try { await adminApi.updateRole(userId, newRole); loadUsers(); }
    catch (err) { alert(err.message); }
  };

  const handleToggleStatus = async (userId) => {
    try { await adminApi.toggleStatus(userId); loadUsers(); }
    catch (err) { alert(err.message); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(''); setCreating(true);
    try {
      await adminApi.createUser(form);
      setShowCreate(false);
      setForm({ name: '', email: '', password: '', role: 'member', designation: '', department: '' });
      loadUsers();
    } catch (err) { setError(err.message); }
    finally { setCreating(false); }
  };

  const handleSetTarget = async (e) => {
    e.preventDefault();
    setError(''); setSettingTarget(true);
    try {
      await pointTargetApi.create({ ...targetForm, user: showTargetModal._id });
      setShowTargetModal(null);
      setTargetForm({ project: '', targetPoints: 20, period: 'sprint', periodStart: '', periodEnd: '', notes: '' });
      alert('Target set successfully!');
    } catch (err) { setError(err.message); }
    finally { setSettingTarget(false); }
  };

  const filteredUsers = users.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  const isAdmin = currentUser?.role === 'admin';

  if (loading) return <div className="page-loader"><div className="loader" /></div>;

  return (
    <div style={{ maxWidth: 1100 }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Team Management</h1>
          <p className="text-secondary text-sm" style={{ marginTop: 4 }}>{users.length} team members</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}><Plus size={16} /> Add Member</button>
        )}
      </div>

      <div className="flex items-center gap-md" style={{ marginBottom: 20 }}>
        <div className="topbar-search" style={{ width: 280 }}>
          <Search size={16} className="icon" />
          <input placeholder="Search members..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{ width: 160 }}>
          <option value="">All Roles</option>
          {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
      </div>

      <div className="dashboard-section">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th className="table-th">Member</th>
                <th className="table-th">Role</th>
                <th className="table-th">Department</th>
                <th className="table-th">Designation</th>
                <th className="table-th">Status</th>
                <th className="table-th">Joined</th>
                {isAdmin && <th className="table-th">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => {
                const roleInfo = getRoleInfo(u.role);
                return (
                  <tr key={u._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td className="table-td">
                      <div className="flex items-center gap-md">
                        <div className="avatar avatar-sm" style={{ background: generateAvatarColor(u.name) }}>{getInitials(u.name)}</div>
                        <div>
                          <div className="font-medium" style={{ fontSize: '.875rem' }}>{u.name}</div>
                          <div className="text-xs text-tertiary">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="table-td">
                      {isAdmin && u._id !== currentUser._id ? (
                        <select className="form-select" value={u.role} onChange={e => handleRoleChange(u._id, e.target.value)}
                          style={{ padding: '4px 8px', fontSize: '.75rem', minWidth: 100, background: `${roleInfo.color}18`, color: roleInfo.color, border: `1px solid ${roleInfo.color}33`, fontWeight: 600 }}>
                          {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                        </select>
                      ) : (
                        <span className="badge" style={{ background: `${roleInfo.color}18`, color: roleInfo.color, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <Icon name={roleInfo.icon} size={12} /> {roleInfo.label}
                        </span>
                      )}
                    </td>
                    <td className="table-td text-sm text-secondary">{u.department || '—'}</td>
                    <td className="table-td text-sm text-secondary">{u.designation || '—'}</td>
                    <td className="table-td">
                      <span className={`badge ${u.isActive ? 'badge-success' : 'badge-error'}`}>{u.isActive ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td className="table-td text-sm text-tertiary">{formatDate(u.createdAt)}</td>
                    {isAdmin && (
                      <td className="table-td">
                        <div className="flex gap-sm">
                          <button className="btn btn-sm btn-ghost" onClick={() => setShowTargetModal(u)} title="Set Target">
                            <Target size={16} color="var(--accent-primary)" />
                          </button>
                          {u._id !== currentUser._id && (
                            <button className="btn btn-sm btn-ghost" onClick={() => handleToggleStatus(u._id)}
                              title={u.isActive ? 'Deactivate' : 'Activate'} style={{ color: u.isActive ? 'var(--error)' : 'var(--success)' }}>
                              {u.isActive ? <Ban size={16} /> : <ShieldCheck size={16} />}
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add Team Member</h3>
              <button className="modal-close" onClick={() => setShowCreate(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {error && <div className="form-error">{error}</div>}
                <div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
                <div className="form-group"><label className="form-label">Email *</label><input className="form-input" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></div>
                <div className="form-group"><label className="form-label">Password *</label><input className="form-input" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required minLength={6} /></div>
                <div className="flex gap-md">
                  <div className="form-group flex-1"><label className="form-label">Role</label><select className="form-select" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>{ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}</select></div>
                  <div className="form-group flex-1"><label className="form-label">Department</label><input className="form-input" value={form.department} onChange={e => setForm({...form, department: e.target.value})} placeholder="Engineering" /></div>
                </div>
                <div className="form-group"><label className="form-label">Designation</label><input className="form-input" value={form.designation} onChange={e => setForm({...form, designation: e.target.value})} placeholder="Senior Developer" /></div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={creating}>{creating ? <div className="loader loader-sm" /> : 'Add Member'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showTargetModal && (
        <div className="modal-overlay" onClick={() => setShowTargetModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Target size={18} color="var(--accent-primary)" /> Set Target for {showTargetModal.name}</h3>
              <button className="modal-close" onClick={() => setShowTargetModal(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSetTarget}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {error && <div className="form-error">{error}</div>}
                <div className="form-group"><label className="form-label">Project *</label><select className="form-select" value={targetForm.project} onChange={e => setTargetForm({...targetForm, project: e.target.value})} required><option value="">Select project...</option>{projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}</select></div>
                <div className="flex gap-md">
                  <div className="form-group flex-1"><label className="form-label">Target Points *</label><input className="form-input" type="number" min="1" max="200" value={targetForm.targetPoints} onChange={e => setTargetForm({...targetForm, targetPoints: parseInt(e.target.value) || 0})} required /></div>
                  <div className="form-group flex-1"><label className="form-label">Period</label><select className="form-select" value={targetForm.period} onChange={e => setTargetForm({...targetForm, period: e.target.value})}>{POINT_PERIODS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}</select></div>
                </div>
                <div className="flex gap-md">
                  <div className="form-group flex-1"><label className="form-label">Period Start *</label><input className="form-input" type="date" value={targetForm.periodStart} onChange={e => setTargetForm({...targetForm, periodStart: e.target.value})} required /></div>
                  <div className="form-group flex-1"><label className="form-label">Period End *</label><input className="form-input" type="date" value={targetForm.periodEnd} onChange={e => setTargetForm({...targetForm, periodEnd: e.target.value})} required /></div>
                </div>
                <div className="form-group"><label className="form-label">Notes</label><textarea className="form-textarea" value={targetForm.notes} onChange={e => setTargetForm({...targetForm, notes: e.target.value})} placeholder="Optional notes..." /></div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowTargetModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={settingTarget}>{settingTarget ? <div className="loader loader-sm" /> : 'Set Target'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
