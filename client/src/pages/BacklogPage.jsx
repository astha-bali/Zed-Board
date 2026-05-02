import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { issueApi } from '../api/issueApi';
import { useProject } from '../context/ProjectContext';
import { getInitials, generateAvatarColor, getStatusInfo } from '../utils/helpers';
import { ISSUE_TYPES, PRIORITIES } from '../utils/constants';
import Icon from '../components/common/Icon';
import { EmptyInboxIllustration } from '../components/common/Illustrations';

export default function BacklogPage() {
  const { projectId } = useParams();
  const { activeProject, selectProject } = useProject();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="page-loader"><div className="loader" /></div>;
  const backlogIssues = issues.filter(i => !i.sprint);

  return (
    <div style={{ maxWidth: 900 }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Backlog</h1>
      </div>
      <div className="dashboard-section">
        <div className="dashboard-section-header"><h3 className="dashboard-section-title">Backlog ({backlogIssues.length} issues)</h3></div>
        <div className="dashboard-section-body">
          {backlogIssues.length === 0 ? (
            <div className="empty-state" style={{ padding: 24 }}>
              <EmptyInboxIllustration width={160} height={120} />
              <div className="empty-state-title">Backlog is empty</div>
              <div className="empty-state-text">Create issues from the board to populate the backlog</div>
            </div>
          ) : backlogIssues.map(issue => (
            <div key={issue._id} className="my-issue-item">
              <Icon name={ISSUE_TYPES.find(t => t.value === issue.type)?.icon} size={14} color={ISSUE_TYPES.find(t => t.value === issue.type)?.color} />
              <span className="my-issue-key">{issue.issueKey}</span>
              <span className="my-issue-title">{issue.title}</span>
              <Icon name={PRIORITIES.find(p => p.value === issue.priority)?.icon} size={14} color={PRIORITIES.find(p => p.value === issue.priority)?.color} />
              {issue.storyPoints > 0 && <span className="issue-card-points">{issue.storyPoints}</span>}
              <span className="badge badge-neutral">{getStatusInfo(issue.status).label}</span>
              {issue.assignee && (
                <div className="avatar avatar-xs" style={{ background: generateAvatarColor(issue.assignee.name) }} title={issue.assignee.name}>{getInitials(issue.assignee.name)}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
