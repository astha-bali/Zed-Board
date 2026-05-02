import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectApi } from '../api/projectApi';
import { adminApi } from '../api/adminApi';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { getInitials, generateAvatarColor } from '../utils/helpers';
import { EmptyBoardIllustration } from '../components/common/Illustrations';
import { Plus, X, FolderKanban, ArrowRight, UserPlus, Trash2 } from 'lucide-react';

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showMembers, setShowMembers] = useState(null); // project id
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [desc, setDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const { selectProject } = useProject();
  const navigate = useNavigate();

  const isAdmin = user?.role === 'admin';

  useEffect(() => { loadProjects(); if (isAdmin) loadUsers(); }, []);

  const loadProjects = async () => {
    try { const res = await projectApi.getAll(); setProjects(res.data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const loadUsers = async () => {
    try { const res = await adminApi.getUsers(); setAllUsers(res.data); }
    catch {}
  };

  const handleCreate = async (e) => {
    e.preventDefault(); setCreating(true);
    try {
      const res = await projectApi.create({ name, key: key.toUpperCase(), description: desc });
      await selectProject(res.data._id);
      navigate(`/project/${res.data._id}/board`);
    } catch (err) { console.error(err); }
    finally { setCreating(false); }
  };

  const handleNameChange = (val) => {
    setName(val);
    if (!key || key === name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 4)) {
      setKey(val.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 4));
    }
  };

  const handleAddMember = async (projectId) => {
    if (!selectedUser) return;
    try { await projectApi.addMember(projectId, { userId: selectedUser, role: 'member' }); setSelectedUser(''); loadProjects(); }
    catch (err) { alert(err.message); }
  };

  const handleRemoveMember = async (projectId, userId) => {
    if (!window.confirm('Remove this member?')) return;
    try { await projectApi.removeMember(projectId, userId); loadProjects(); }
    catch (err) { alert(err.message); }
  };

  if (loading) return <div className="page-loader"><div className="loader" /></div>;

  const membersProject = projects.find(p => p._id === showMembers);

  return (
    <div style={{ maxWidth: 900 }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Projects</h1>
          <p className="text-secondary text-sm" style={{ marginTop: 4 }}>{projects.length} projects</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}><Plus size={16} /> New Project</button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="empty-state">
          <EmptyBoardIllustration width={200} height={160} />
          <div className="empty-state-title">{isAdmin ? 'No projects yet' : 'No projects assigned'}</div>
          <div className="empty-state-text">{isAdmin ? 'Create your first project to get started' : 'Ask your admin to assign you to a project'}</div>
          {isAdmin && <button className="btn btn-primary" onClick={() => setShowCreate(true)}><Plus size={16} /> Create Project</button>}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {projects.map(p => (
            <div key={p._id} className="project-card">
              <div className="flex items-center gap-md" style={{ marginBottom: 12, cursor: 'pointer' }}
                onClick={() => { selectProject(p._id); navigate(`/project/${p._id}/board`); }}>
                <div className="project-card-icon" style={{ background: generateAvatarColor(p.name) }}>
                  <FolderKanban size={16} color="white" />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-xs text-tertiary">{p.key}</div>
                </div>
                <ArrowRight size={16} className="text-tertiary" />
              </div>
              {p.description && <p className="text-sm text-secondary" style={{ marginBottom: 8 }}>{p.description}</p>}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-sm">
                  {p.members?.slice(0, 5).map((m, i) => (
                    <div key={i} className="avatar avatar-xs" style={{ background: generateAvatarColor(m.user?.name), marginLeft: i > 0 ? -6 : 0, border: '2px solid var(--surface-1)' }} title={m.user?.name}>
                      {getInitials(m.user?.name)}
                    </div>
                  ))}
                  {p.members?.length > 5 && <span className="text-xs text-tertiary">+{p.members.length - 5}</span>}
                </div>
                {isAdmin && (
                  <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); setShowMembers(p._id); }} title="Manage Members">
                    <UserPlus size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal — Admin only */}
      {showCreate && isAdmin && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Create Project</h3>
              <button className="modal-close" onClick={() => setShowCreate(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-group"><label className="form-label">Project Name *</label><input className="form-input" placeholder="My Awesome Project" value={name} onChange={e => handleNameChange(e.target.value)} required autoFocus /></div>
                <div className="form-group"><label className="form-label">Key</label><input className="form-input" placeholder="PROJ" value={key} onChange={e => setKey(e.target.value.toUpperCase())} maxLength={6} /></div>
                <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" value={desc} onChange={e => setDesc(e.target.value)} placeholder="What's this project about?" /></div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={creating}>{creating ? <div className="loader loader-sm" /> : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Member Management Modal — Admin only */}
      {showMembers && membersProject && (
        <div className="modal-overlay" onClick={() => setShowMembers(null)}>
          <div className="modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Manage Members — {membersProject.name}</h3>
              <button className="modal-close" onClick={() => setShowMembers(null)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              {/* Add member */}
              <div className="flex gap-sm" style={{ marginBottom: 16 }}>
                <select className="form-select" style={{ flex: 1 }} value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
                  <option value="">Select user to add...</option>
                  {allUsers.filter(u => !membersProject.members?.some(m => m.user?._id === u._id)).map(u => (
                    <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                  ))}
                </select>
                <button className="btn btn-primary btn-sm" onClick={() => handleAddMember(membersProject._id)} disabled={!selectedUser}>
                  <UserPlus size={14} /> Add
                </button>
              </div>

              {/* Current members */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {membersProject.members?.map(m => (
                  <div key={m.user?._id} className="flex items-center gap-md" style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                    <div className="avatar avatar-sm" style={{ background: generateAvatarColor(m.user?.name) }}>{getInitials(m.user?.name)}</div>
                    <div style={{ flex: 1 }}>
                      <div className="font-medium text-sm">{m.user?.name}</div>
                      <div className="text-xs text-tertiary">{m.user?.email}</div>
                    </div>
                    <span className="badge badge-neutral">{m.role}</span>
                    {m.user?._id !== user._id && (
                      <button className="btn btn-ghost btn-sm" onClick={() => handleRemoveMember(membersProject._id, m.user?._id)} style={{ color: 'var(--error)' }}>
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
