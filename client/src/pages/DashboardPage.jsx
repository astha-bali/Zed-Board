import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { issueApi } from '../api/issueApi';
import { useNavigate } from 'react-router-dom';
import { getStatusInfo, getRoleInfo } from '../utils/helpers';
import { getInitials, generateAvatarColor } from '../utils/helpers';
import Icon from '../components/common/Icon';
import { EmptyInboxIllustration } from '../components/common/Illustrations';
import { ISSUE_TYPES, PRIORITIES } from '../utils/constants';
import { ClipboardList, Target, CircleCheck, Flame, TrendingUp, Eye } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    try { const res = await issueApi.getDashboardStats(); setStats(res.data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const getCount = (arr, key) => arr?.find(i => i._id === key)?.count || 0;

  if (loading) return <div className="page-loader"><div className="loader" /></div>;

  const totalIssues = stats?.statusCounts?.reduce((a, b) => a + b.count, 0) || 0;
  const ps = stats?.pointsSummary || { totalAssigned: 0, completed: 0, inProgress: 0 };
  const completionPct = ps.totalAssigned > 0 ? Math.round((ps.completed / ps.totalAssigned) * 100) : 0;
  const roleInfo = getRoleInfo(user?.role);
  const isAdminView = stats?.isAdminView;

  return (
    <div className="dashboard-page">
      <div className="dashboard-greeting">
        <div className="flex items-center justify-between">
          <div>
            <h1>Welcome back, {user?.name?.split(' ')[0]}</h1>
            <p>{isAdminView ? 'Organization-wide overview' : 'Here\'s your work overview.'}</p>
          </div>
          <div className="flex items-center gap-sm">
            {isAdminView && (
              <span className="badge badge-info" style={{ padding: '6px 12px', fontSize: '.75rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Eye size={13} /> Admin View
              </span>
            )}
            <span className="badge" style={{ background: `${roleInfo.color}18`, color: roleInfo.color, padding: '6px 14px', fontSize: '.8125rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name={roleInfo.icon} size={14} /> {roleInfo.label}
            </span>
          </div>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card"><div className="stat-card-icon" style={{ background: 'var(--info-bg)', color: 'var(--info)' }}><ClipboardList size={20} /></div><div className="stat-card-value">{totalIssues}</div><div className="stat-card-label">{isAdminView ? 'Total Issues' : 'My Issues'}</div></div>
        <div className="stat-card"><div className="stat-card-icon" style={{ background: 'var(--accent-primary-bg)', color: 'var(--accent-primary)' }}><Target size={20} /></div><div className="stat-card-value">{ps.totalAssigned}</div><div className="stat-card-label">Points Assigned</div></div>
        <div className="stat-card"><div className="stat-card-icon" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}><CircleCheck size={20} /></div><div className="stat-card-value">{ps.completed}</div><div className="stat-card-label">Points Completed</div></div>
        <div className="stat-card"><div className="stat-card-icon" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}><Flame size={20} /></div><div className="stat-card-value">{completionPct}%</div><div className="stat-card-label">Velocity</div></div>
      </div>

      <div className="dashboard-section" style={{ marginBottom: 24, padding: '16px 24px' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
          <span className="font-medium text-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><TrendingUp size={14} /> Points Progress</span>
          <span className="text-xs text-tertiary">{ps.completed} / {ps.totalAssigned} completed · {ps.inProgress} in progress</span>
        </div>
        <div style={{ height: 10, background: 'var(--surface-3)', borderRadius: 5, overflow: 'hidden', display: 'flex' }}>
          <div style={{ height: '100%', width: `${completionPct}%`, background: 'var(--success)', transition: 'width 0.5s ease' }} />
          <div style={{ height: '100%', width: `${ps.totalAssigned > 0 ? Math.round((ps.inProgress / ps.totalAssigned) * 100) : 0}%`, background: 'var(--warning)', transition: 'width 0.5s ease' }} />
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <div className="dashboard-section-header">
            <h3 className="dashboard-section-title">{isAdminView ? 'Recent Issues (All)' : 'My Issues'}</h3>
          </div>
          <div className="dashboard-section-body">
            {stats?.myIssues?.length === 0 ? (
              <div className="empty-state" style={{ padding: 24 }}>
                <EmptyInboxIllustration width={160} height={120} />
                <div className="empty-state-title">No issues {isAdminView ? 'yet' : 'assigned'}</div>
                <div className="empty-state-text">{isAdminView ? 'Create a project and start adding issues' : 'Issues assigned to you will appear here'}</div>
              </div>
            ) : stats?.myIssues?.map(issue => (
              <div key={issue._id} className="my-issue-item" onClick={() => navigate(`/project/${issue.project?._id}/board`)}>
                <Icon name={ISSUE_TYPES.find(t => t.value === issue.type)?.icon} size={14} color={ISSUE_TYPES.find(t => t.value === issue.type)?.color} />
                <span className="my-issue-key">{issue.issueKey}</span>
                <span className="my-issue-title">{issue.title}</span>
                {issue.assignee && (
                  <div className="avatar avatar-xs" style={{ background: generateAvatarColor(issue.assignee.name) }} title={issue.assignee.name}>{getInitials(issue.assignee.name)}</div>
                )}
                <Icon name={PRIORITIES.find(p => p.value === issue.priority)?.icon} size={14} color={PRIORITIES.find(p => p.value === issue.priority)?.color} />
                {issue.storyPoints > 0 && <span className="issue-card-points">{issue.storyPoints}</span>}
                <span className="badge" style={{ background: `${getStatusInfo(issue.status).color}18`, color: getStatusInfo(issue.status).color }}>
                  {getStatusInfo(issue.status).label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <div className="dashboard-section-header">
            <h3 className="dashboard-section-title">By Status</h3>
          </div>
          <div className="dashboard-section-body">
            {['backlog', 'todo', 'in_progress', 'code_review', 'testing', 'uat', 'done', 'deployed'].map(s => {
              const info = getStatusInfo(s);
              const count = getCount(stats?.statusCounts, s);
              if (count === 0) return null;
              return (
                <div key={s} className="my-issue-item" style={{ cursor: 'default' }}>
                  <Icon name={info.icon} size={14} color={info.color} />
                  <span className="my-issue-title">{info.label}</span>
                  <span className="badge badge-neutral">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
