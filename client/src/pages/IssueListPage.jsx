import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { issueApi } from '../api/issueApi';
import { useProject } from '../context/ProjectContext';
import { STATUSES, PRIORITIES, ISSUE_TYPES } from '../utils/constants';
import { getInitials, generateAvatarColor, getStatusInfo, formatDate } from '../utils/helpers';
import Icon from '../components/common/Icon';
import { EmptyInboxIllustration } from '../components/common/Illustrations';
import { Search, Filter, ArrowUpDown, Clock } from 'lucide-react';

export default function IssueListPage() {
  const { projectId } = useParams();
  const { activeProject, selectProject } = useProject();
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('');
  const [reviewerFilter, setReviewerFilter] = useState('');
  const [qaFilter, setQaFilter] = useState('');
  const [sortField, setSortField] = useState('updatedAt');
  const [sortDir, setSortDir] = useState('desc');

  const projectMembers = activeProject?.members?.map(m => m.user).filter(Boolean) || [];

  useEffect(() => {
    if (projectId) {
      if (!activeProject || activeProject._id !== projectId) selectProject(projectId);
      loadIssues();
    }
  }, [projectId]);

  const loadIssues = async () => {
    try { const res = await issueApi.getByProject(projectId); setIssues(res.data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  // Client-side filter + sort
  const filtered = issues
    .filter(i => {
      if (search && !i.title.toLowerCase().includes(search.toLowerCase()) && !i.issueKey.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter && i.status !== statusFilter) return false;
      if (priorityFilter && i.priority !== priorityFilter) return false;
      if (typeFilter && i.type !== typeFilter) return false;
      if (assigneeFilter && i.assignee?._id !== assigneeFilter) return false;
      if (reviewerFilter && i.reviewer?._id !== reviewerFilter) return false;
      if (qaFilter && i.qa?._id !== qaFilter) return false;
      return true;
    })
    .sort((a, b) => {
      let va = a[sortField], vb = b[sortField];
      if (sortField === 'updatedAt' || sortField === 'createdAt') {
        va = new Date(va); vb = new Date(vb);
      }
      if (sortField === 'storyPoints') { va = va || 0; vb = vb || 0; }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const SortHeader = ({ field, children }) => (
    <th className="table-th" style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => toggleSort(field)}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        {children}
        {sortField === field && <ArrowUpDown size={12} style={{ opacity: 0.6 }} />}
      </span>
    </th>
  );

  if (loading) return <div className="page-loader"><div className="loader" /></div>;

  return (
    <div style={{ maxWidth: 1200 }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Issues</h1>
          <p className="text-sm text-secondary" style={{ marginTop: 4 }}>{filtered.length} of {issues.length} issues</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-sm" style={{ marginBottom: 16, flexWrap: 'wrap' }}>
        <div className="topbar-search" style={{ width: 240 }}>
          <Search size={14} className="icon" />
          <input placeholder="Search issues..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: 140 }}>
          <option value="">All Status</option>
          {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select className="form-select" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} style={{ width: 130 }}>
          <option value="">All Priority</option>
          {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
        <select className="form-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ width: 120 }}>
          <option value="">All Type</option>
          {ISSUE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <select className="form-select" value={assigneeFilter} onChange={e => setAssigneeFilter(e.target.value)} style={{ width: 140 }}>
          <option value="">All Assignees</option>
          {projectMembers.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
        </select>
        <select className="form-select" value={reviewerFilter} onChange={e => setReviewerFilter(e.target.value)} style={{ width: 140 }}>
          <option value="">All Reviewers</option>
          {projectMembers.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
        </select>
        <select className="form-select" value={qaFilter} onChange={e => setQaFilter(e.target.value)} style={{ width: 140 }}>
          <option value="">All QA</option>
          {projectMembers.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="dashboard-section">
        {filtered.length === 0 ? (
          <div className="empty-state" style={{ padding: 40 }}>
            <EmptyInboxIllustration width={180} height={140} />
            <div className="empty-state-title">No issues found</div>
            <div className="empty-state-text">{search || statusFilter || priorityFilter ? 'Try adjusting your filters' : 'Create issues from the board to see them here'}</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <th className="table-th" style={{ width: 40 }}>Type</th>
                  <SortHeader field="issueKey">Key</SortHeader>
                  <SortHeader field="title">Title</SortHeader>
                  <SortHeader field="status">Status</SortHeader>
                  <SortHeader field="priority">Priority</SortHeader>
                  <th className="table-th">Assignee</th>
                  <th className="table-th">Reviewer</th>
                  <th className="table-th">QA</th>
                  <SortHeader field="storyPoints">Points</SortHeader>
                  <SortHeader field="updatedAt">Updated</SortHeader>
                </tr>
              </thead>
              <tbody>
                {filtered.map(issue => {
                  const typeInfo = ISSUE_TYPES.find(t => t.value === issue.type);
                  const prioInfo = PRIORITIES.find(p => p.value === issue.priority);
                  const statusInfo = getStatusInfo(issue.status);
                  return (
                    <tr key={issue._id} style={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }}
                      onClick={() => navigate(`/project/${projectId}/board`)}
                      className="issue-list-row">
                      <td className="table-td"><Icon name={typeInfo?.icon} size={14} color={typeInfo?.color} /></td>
                      <td className="table-td"><span className="my-issue-key">{issue.issueKey}</span></td>
                      <td className="table-td"><span className="font-medium text-sm">{issue.title}</span></td>
                      <td className="table-td">
                        <span className="badge" style={{ background: `${statusInfo.color}18`, color: statusInfo.color, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <Icon name={statusInfo.icon} size={11} /> {statusInfo.label}
                        </span>
                      </td>
                      <td className="table-td"><Icon name={prioInfo?.icon} size={14} color={prioInfo?.color} /></td>
                      <td className="table-td">{issue.assignee ? (
                        <div className="flex items-center gap-sm"><div className="avatar avatar-xs" style={{ background: generateAvatarColor(issue.assignee.name) }}>{getInitials(issue.assignee.name)}</div><span className="text-xs">{issue.assignee.name}</span></div>
                      ) : <span className="text-xs text-tertiary">—</span>}</td>
                      <td className="table-td">{issue.reviewer ? (
                        <div className="flex items-center gap-sm"><div className="avatar avatar-xs" style={{ background: generateAvatarColor(issue.reviewer.name) }}>{getInitials(issue.reviewer.name)}</div><span className="text-xs">{issue.reviewer.name}</span></div>
                      ) : <span className="text-xs text-tertiary">—</span>}</td>
                      <td className="table-td">{issue.qa ? (
                        <div className="flex items-center gap-sm"><div className="avatar avatar-xs" style={{ background: generateAvatarColor(issue.qa.name) }}>{getInitials(issue.qa.name)}</div><span className="text-xs">{issue.qa.name}</span></div>
                      ) : <span className="text-xs text-tertiary">—</span>}</td>
                      <td className="table-td">{issue.storyPoints > 0 ? <span className="issue-card-points">{issue.storyPoints}</span> : <span className="text-xs text-tertiary">—</span>}</td>
                      <td className="table-td text-xs text-tertiary" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} /> {formatDate(issue.updatedAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
