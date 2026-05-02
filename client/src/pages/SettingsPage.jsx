import { useParams } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { projectApi } from '../api/projectApi';
import { userApi } from '../api/userApi';
import { getInitials, generateAvatarColor, getRoleInfo } from '../utils/helpers';
import { Trash2, UserPlus } from 'lucide-react';
import Icon from '../components/common/Icon';

export default function SettingsPage() {
  const { projectId } = useParams();
  const { activeProject, selectProject } = useProject();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  
  // Member management state
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRole, setSelectedRole] = useState('member');
  const [addingMember, setAddingMember] = useState(false);

  const isGlobalAdmin = user?.role === 'admin' || user?.role === 'manager';
  const myMemberEntry = activeProject?.members?.find(m => m.user?._id === user?._id);
  const isProjectAdmin = myMemberEntry?.role === 'admin' || myMemberEntry?.role === 'manager';
  const canEdit = isGlobalAdmin || isProjectAdmin;

  useEffect(() => { 
    if (projectId && (!activeProject || activeProject._id !== projectId)) selectProject(projectId); 
    if (canEdit && allUsers.length === 0) loadAllUsers();
  }, [projectId, canEdit]);
  
  useEffect(() => { if (activeProject) { setName(activeProject.name || ''); setDesc(activeProject.description || ''); } }, [activeProject]);

  const loadAllUsers = async () => {
    try { const res = await userApi.search(''); setAllUsers(res.data); }
    catch (err) { console.error('Failed to load users', err); }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    setAddingMember(true);
    try {
      await projectApi.addMember(projectId, { userId: selectedUser, role: selectedRole });
      setSelectedUser('');
      selectProject(projectId); // refresh project data
    } catch (err) { alert(err.message); }
    finally { setAddingMember(false); }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;
    try {
      await projectApi.removeMember(projectId, userId);
      selectProject(projectId); // refresh project data
    } catch (err) { alert(err.message); }
  };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setMsg('');
    try { await projectApi.update(projectId, { name, description: desc }); setMsg('Settings saved!'); selectProject(projectId); }
    catch (err) { setMsg(err.message); }
    finally { setSaving(false); }
  };

  if (!activeProject) return <div className="page-loader"><div className="loader" /></div>;

  return (
    <div style={{ maxWidth: 600 }}>
      <h1 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 24 }}>Project Settings</h1>
      <div className="dashboard-section" style={{ marginBottom: 24 }}>
        <div className="dashboard-section-header"><h3 className="dashboard-section-title">General</h3></div>
        <form onSubmit={handleSave}>
          <div className="dashboard-section-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {msg && <div className="badge badge-success" style={{ padding: '8px 12px', fontSize: '.8125rem' }}>{msg}</div>}
            <div className="form-group"><label className="form-label">Project Name</label><input className="form-input" value={name} onChange={e => setName(e.target.value)} disabled={!canEdit} /></div>
            <div className="form-group"><label className="form-label">Key</label><input className="form-input" value={activeProject.key} disabled style={{ opacity: 0.5 }} /></div>
            <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" value={desc} onChange={e => setDesc(e.target.value)} disabled={!canEdit} /></div>
            {canEdit && <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? <div className="loader loader-sm" /> : 'Save Changes'}</button>}
          </div>
        </form>
      </div>
      <div className="dashboard-section">
        <div className="dashboard-section-header"><h3 className="dashboard-section-title">Members ({activeProject.members?.length || 0})</h3></div>
        <div className="dashboard-section-body" style={{ display: 'flex', flexDirection: 'column' }}>
          
          {canEdit && (
            <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', background: 'var(--surface-2)' }}>
              <div style={{ fontSize: '.875rem', fontWeight: 600, marginBottom: 12 }}>Add Member</div>
              <form className="flex gap-sm" onSubmit={handleAddMember}>
                <select className="form-select" style={{ flex: 2 }} value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
                  <option value="">Select user...</option>
                  {allUsers.filter(u => !activeProject.members?.some(m => m.user?._id === u._id)).map(u => (
                    <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                  ))}
                </select>
                <select className="form-select" style={{ flex: 1 }} value={selectedRole} onChange={e => setSelectedRole(e.target.value)}>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="member">Member</option>
                  <option value="qa">QA</option>
                </select>
                <button type="submit" className="btn btn-primary" disabled={!selectedUser || addingMember}>
                  {addingMember ? <div className="loader loader-sm" /> : <><UserPlus size={16} /> Add</>}
                </button>
              </form>
            </div>
          )}

          <div style={{ padding: '8px 16px' }}>
            {activeProject.members?.map(m => {
              const roleInfo = getRoleInfo(m.role);
              return (
                <div key={m.user?._id || m._id} className="flex items-center justify-between" style={{ padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <div className="flex items-center gap-md">
                    <div className="avatar avatar-sm" style={{ background: generateAvatarColor(m.user?.name) }}>{getInitials(m.user?.name)}</div>
                    <div>
                      <div className="font-medium text-sm">{m.user?.name}</div>
                      <div className="text-xs text-tertiary">{m.user?.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-md">
                    <span className="badge" style={{ background: `${roleInfo.color}18`, color: roleInfo.color, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Icon name={roleInfo.icon} size={12} /> {roleInfo.label}
                    </span>
                    {canEdit && m.user?._id !== user._id && (
                      <button className="btn btn-ghost btn-sm" onClick={() => handleRemoveMember(m.user?._id)} style={{ color: 'var(--error)' }} title="Remove Member">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
