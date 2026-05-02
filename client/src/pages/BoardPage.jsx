import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { issueApi } from '../api/issueApi';
import { userApi } from '../api/userApi';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { STATUSES, STATUS_COLUMNS, ISSUE_TYPES, PRIORITIES, SDLC_PHASES } from '../utils/constants';
import { getInitials, generateAvatarColor } from '../utils/helpers';
import Icon from '../components/common/Icon';
import { Plus, X, Trash2 } from 'lucide-react';

export default function BoardPage() {
  const { projectId } = useParams();
  const { activeProject, selectProject } = useProject();
  const { user: currentUser } = useAuth();
  const [issues, setIssues] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [newIssue, setNewIssue] = useState({ title: '', type: 'task', priority: 'medium', storyPoints: 0, assignee: '', reviewer: '', qa: '', sdlcPhase: 'development', estimatedHours: 0, description: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (projectId) {
      if (!activeProject || activeProject._id !== projectId) selectProject(projectId);
      loadIssues();
      loadUsers();
    }
  }, [projectId]);

  const loadUsers = async () => {
    try { const res = await userApi.search(''); setAllUsers(res.data); }
    catch (err) { console.error(err); }
  };

  const loadIssues = async () => {
    try { const res = await issueApi.getByProject(projectId); setIssues(res.data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const getColumnIssues = (status) => issues.filter(i => i.status === status).sort((a, b) => a.order - b.order);

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    const newStatus = destination.droppableId;
    setIssues(prev => prev.map(i => i._id === draggableId ? { ...i, status: newStatus, order: destination.index } : i));
    try { await issueApi.updateStatus(draggableId, { status: newStatus, order: destination.index }); }
    catch { loadIssues(); }
  };

  const handleCreateIssue = async (e) => {
    e.preventDefault();
    if (!newIssue.title.trim()) return;
    setCreating(true);
    try {
      await issueApi.create(projectId, {
        ...newIssue,
        storyPoints: parseInt(newIssue.storyPoints) || 0,
        estimatedHours: parseFloat(newIssue.estimatedHours) || 0,
        assignee: newIssue.assignee || undefined,
        reviewer: newIssue.reviewer || undefined,
        qa: newIssue.qa || undefined
      });
      await loadIssues();
      setNewIssue({ title: '', type: 'task', priority: 'medium', storyPoints: 0, assignee: '', reviewer: '', qa: '', sdlcPhase: 'development', estimatedHours: 0, description: '' });
      setShowCreate(false);
    } catch (err) { console.error(err); }
    finally { setCreating(false); }
  };

  const members = activeProject?.members || [];

  if (loading) return <div className="page-loader"><div className="loader" /></div>;

  return (
    <div className="board-container">
      <div className="board-header">
        <h1>{activeProject?.name || 'Board'}</h1>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}><Plus size={16} /> Create Issue</button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="board-columns">
          {STATUS_COLUMNS.map(status => {
            const statusInfo = STATUSES.find(s => s.value === status);
            const columnIssues = getColumnIssues(status);
            return (
              <div className="board-column" key={status}>
                <div className="board-column-header">
                  <div className="column-title-group">
                    <Icon name={statusInfo.icon} size={14} color={statusInfo.color} />
                    <span className="column-title">{statusInfo.label}</span>
                  </div>
                  <span className="column-count">{columnIssues.length}</span>
                </div>
                <Droppable droppableId={status}>
                  {(provided, snapshot) => (
                    <div className={`board-column-body ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                      ref={provided.innerRef} {...provided.droppableProps}>
                      {columnIssues.map((issue, index) => (
                        <Draggable key={issue._id} draggableId={issue._id} index={index}>
                          {(prov, snap) => (
                            <div className={`issue-card ${snap.isDragging ? 'dragging' : ''}`}
                              ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}
                              onClick={() => setSelectedIssue(issue)}>
                              <div className="issue-card-key">{issue.issueKey}</div>
                              <div className="issue-card-title">{issue.title}</div>
                              <div className="issue-card-footer">
                                <div className="issue-card-meta">
                                  <Icon name={ISSUE_TYPES.find(t => t.value === issue.type)?.icon} size={13} color={ISSUE_TYPES.find(t => t.value === issue.type)?.color} />
                                  <Icon name={PRIORITIES.find(p => p.value === issue.priority)?.icon} size={13} color={PRIORITIES.find(p => p.value === issue.priority)?.color} />
                                  {issue.storyPoints > 0 && <span className="issue-card-points">{issue.storyPoints}</span>}
                                </div>
                                <div style={{ display: 'flex', gap: 2 }}>
                                  {issue.assignee && (
                                    <div className="avatar avatar-xs" style={{ background: generateAvatarColor(issue.assignee.name) }} title={`Assignee: ${issue.assignee.name}`}>{getInitials(issue.assignee.name)}</div>
                                  )}
                                  {issue.reviewer && (
                                    <div className="avatar avatar-xs" style={{ background: generateAvatarColor(issue.reviewer.name), border: '1.5px solid #8b5cf6' }} title={`Reviewer: ${issue.reviewer.name}`}>{getInitials(issue.reviewer.name)}</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* Create Issue Modal */}
      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Create Issue</h3>
              <button className="modal-close" onClick={() => setShowCreate(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreateIssue}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="form-group"><label className="form-label">Title *</label>
                  <input className="form-input" placeholder="What needs to be done?" value={newIssue.title} onChange={e => setNewIssue({...newIssue, title: e.target.value})} required autoFocus />
                </div>
                <div className="form-group"><label className="form-label">Description</label>
                  <textarea className="form-textarea" placeholder="Add details..." value={newIssue.description} onChange={e => setNewIssue({...newIssue, description: e.target.value})} style={{ minHeight: 60 }} />
                </div>
                <div className="flex gap-md">
                  <div className="form-group flex-1"><label className="form-label">Type</label>
                    <select className="form-select" value={newIssue.type} onChange={e => setNewIssue({...newIssue, type: e.target.value})}>{ISSUE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
                  <div className="form-group flex-1"><label className="form-label">Priority</label>
                    <select className="form-select" value={newIssue.priority} onChange={e => setNewIssue({...newIssue, priority: e.target.value})}>{PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}</select></div>
                </div>
                <div className="flex gap-md">
                  <div className="form-group flex-1"><label className="form-label">Story Points</label>
                    <input className="form-input" type="number" min="0" max="100" value={newIssue.storyPoints} onChange={e => setNewIssue({...newIssue, storyPoints: e.target.value})} /></div>
                  <div className="form-group flex-1"><label className="form-label">Est. Hours</label>
                    <input className="form-input" type="number" min="0" step="0.5" value={newIssue.estimatedHours} onChange={e => setNewIssue({...newIssue, estimatedHours: e.target.value})} /></div>
                </div>
                <div className="flex gap-md">
                  <div className="form-group flex-1"><label className="form-label">SDLC Phase</label>
                    <select className="form-select" value={newIssue.sdlcPhase} onChange={e => setNewIssue({...newIssue, sdlcPhase: e.target.value})}>{SDLC_PHASES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}</select></div>
                </div>
                <div className="flex gap-md">
                  <div className="form-group flex-1"><label className="form-label">Assignee</label>
                    <select className="form-select" value={newIssue.assignee} onChange={e => setNewIssue({...newIssue, assignee: e.target.value})}>
                      <option value="">Unassigned</option>{allUsers.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}</select></div>
                  <div className="form-group flex-1"><label className="form-label">Reporter</label>
                    <div className="form-input" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', opacity: 0.7, cursor: 'default' }}>
                      <div className="avatar avatar-xs" style={{ background: generateAvatarColor(currentUser?.name || '') }}>{getInitials(currentUser?.name || '')}</div>
                      <span className="text-sm">{currentUser?.name}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-md">
                  <div className="form-group flex-1"><label className="form-label">Reviewer</label>
                    <select className="form-select" value={newIssue.reviewer} onChange={e => setNewIssue({...newIssue, reviewer: e.target.value})}>
                      <option value="">None</option>{allUsers.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}</select></div>
                  <div className="form-group flex-1"><label className="form-label">QA</label>
                    <select className="form-select" value={newIssue.qa} onChange={e => setNewIssue({...newIssue, qa: e.target.value})}>
                      <option value="">None</option>{allUsers.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}</select></div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={creating}>{creating ? <div className="loader loader-sm" /> : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedIssue && (
        <IssueDetailPanel issue={selectedIssue} onClose={() => setSelectedIssue(null)} onUpdate={loadIssues} allUsers={allUsers} />
      )}
    </div>
  );
}

function IssueDetailPanel({ issue, onClose, onUpdate, allUsers }) {
  const [title, setTitle] = useState(issue.title);
  const [desc, setDesc] = useState(issue.description || '');
  const [status, setStatus] = useState(issue.status);
  const [priority, setPriority] = useState(issue.priority);
  const [type, setType] = useState(issue.type);
  const [points, setPoints] = useState(issue.storyPoints || 0);
  const [assignee, setAssignee] = useState(issue.assignee?._id || '');
  const [reviewer, setReviewer] = useState(issue.reviewer?._id || '');
  const [qa, setQa] = useState(issue.qa?._id || '');
  const [sdlcPhase, setSdlcPhase] = useState(issue.sdlcPhase || 'development');
  const [estimatedHours, setEstimatedHours] = useState(issue.estimatedHours || 0);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await issueApi.update(issue._id, {
        title, description: desc, status, priority, type,
        storyPoints: parseInt(points) || 0,
        assignee: assignee || null, reviewer: reviewer || null, qa: qa || null,
        sdlcPhase, estimatedHours: parseFloat(estimatedHours) || 0
      });
      onUpdate(); onClose();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this issue?')) return;
    try { await issueApi.remove(issue._id); onUpdate(); onClose(); }
    catch (err) { console.error(err); }
  };

  const typeInfo = ISSUE_TYPES.find(t => t.value === type);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 700 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-sm">
            <Icon name={typeInfo?.icon} size={16} color={typeInfo?.color} />
            <span style={{ fontSize: '.8125rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>{issue.issueKey}</span>
          </div>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input className="issue-detail-title" value={title} onChange={e => setTitle(e.target.value)} />
          <textarea className="issue-detail-desc" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Add a description..." />
          <div className="flex gap-md">
            <div className="form-group flex-1"><label className="form-label">Status</label><select className="form-select" value={status} onChange={e => setStatus(e.target.value)}>{STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}</select></div>
            <div className="form-group flex-1"><label className="form-label">Priority</label><select className="form-select" value={priority} onChange={e => setPriority(e.target.value)}>{PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}</select></div>
            <div className="form-group flex-1"><label className="form-label">Type</label><select className="form-select" value={type} onChange={e => setType(e.target.value)}>{ISSUE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
          </div>
          <div className="flex gap-md">
            <div className="form-group flex-1"><label className="form-label">Story Points</label><input className="form-input" type="number" min="0" value={points} onChange={e => setPoints(e.target.value)} /></div>
            <div className="form-group flex-1"><label className="form-label">Est. Hours</label><input className="form-input" type="number" min="0" step="0.5" value={estimatedHours} onChange={e => setEstimatedHours(e.target.value)} /></div>
            <div className="form-group flex-1"><label className="form-label">SDLC Phase</label><select className="form-select" value={sdlcPhase} onChange={e => setSdlcPhase(e.target.value)}>{SDLC_PHASES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}</select></div>
          </div>

          {/* People Section */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 14 }}>
            <div className="text-xs text-tertiary font-semibold" style={{ marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.04em' }}>People</div>
            <div className="flex gap-md">
              <div className="form-group flex-1"><label className="form-label">Assignee</label><select className="form-select" value={assignee} onChange={e => setAssignee(e.target.value)}>
                <option value="">Unassigned</option>{allUsers.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}</select></div>
              <div className="form-group flex-1"><label className="form-label">Reporter</label>
                <div className="form-input" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', opacity: 0.7, cursor: 'default' }}>
                  <div className="avatar avatar-xs" style={{ background: generateAvatarColor(issue.reporter?.name || '') }}>{getInitials(issue.reporter?.name || '')}</div>
                  <span className="text-sm">{issue.reporter?.name}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-md">
              <div className="form-group flex-1"><label className="form-label">Reviewer</label><select className="form-select" value={reviewer} onChange={e => setReviewer(e.target.value)}>
                <option value="">None</option>{allUsers.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}</select></div>
              <div className="form-group flex-1"><label className="form-label">QA</label><select className="form-select" value={qa} onChange={e => setQa(e.target.value)}>
                <option value="">None</option>{allUsers.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}</select></div>
            </div>
          </div>
        </div>
        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <button className="btn btn-danger btn-sm" onClick={handleDelete}><Trash2 size={14} /> Delete</button>
          <div className="flex gap-sm">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? <div className="loader loader-sm" /> : 'Save'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
