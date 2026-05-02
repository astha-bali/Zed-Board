import { useState, useEffect } from 'react';
import { analyticsApi } from '../api/analyticsApi';
import { adminApi } from '../api/adminApi';
import { useAuth } from '../context/AuthContext';
import { getInitials, generateAvatarColor, getStatusInfo } from '../utils/helpers';
import Icon from '../components/common/Icon';
import { EmptyChartIllustration } from '../components/common/Illustrations';
import { ClipboardList, Target, CircleCheck, Users, Award, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const isAdminOrManager = user?.role === 'admin' || user?.role === 'manager';
  const [tab, setTab] = useState(isAdminOrManager ? 'overall' : 'user');
  const [selectedUser, setSelectedUser] = useState(user?._id);
  const [allUsers, setAllUsers] = useState([]);
  const [overallData, setOverallData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    if (isAdminOrManager) {
      loadAllUsers(); 
      loadOverall(); 
    } else {
      loadUserAnalytics(user?._id);
    }
  }, []);

  const loadAllUsers = async () => { try { const res = await adminApi.getUsers(); setAllUsers(res.data); } catch {} };
  const loadOverall = async () => { setLoading(true); try { const res = await analyticsApi.getOverallAnalytics(); setOverallData(res.data); } catch (err) { console.error(err); } finally { setLoading(false); } };
  const loadUserAnalytics = async (userId) => { setLoading(true); setSelectedUser(userId); setTab('user'); try { const res = await analyticsApi.getUserAnalytics(userId); setUserData(res.data); } catch (err) { console.error(err); } finally { setLoading(false); } };

  if (loading && !overallData && !userData) return <div className="page-loader"><div className="loader" /></div>;

  const tooltipStyle = { background: 'var(--surface-2)', border: '1px solid var(--border-color)', borderRadius: 8, color: 'var(--text-primary)' };

  return (
    <div style={{ maxWidth: 1200 }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Analytics Dashboard</h1>
          <p className="text-secondary text-sm" style={{ marginTop: 4 }}>Track performance, points, and velocity</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-sm" style={{ marginBottom: 24 }}>
        {isAdminOrManager && (
          <button className={`btn ${tab === 'overall' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setTab('overall'); loadOverall(); }}>
            <TrendingUp size={15} /> Overall
          </button>
        )}
        <button className={`btn ${tab === 'user' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { if (!selectedUser) loadUserAnalytics(user._id); else setTab('user'); }}>
          <Users size={15} /> Individual
        </button>
      </div>

      {tab === 'user' && isAdminOrManager && (
        <div className="flex items-center gap-md" style={{ marginBottom: 20 }}>
          <label className="form-label" style={{ margin: 0 }}>Select Member:</label>
          <select className="form-select" style={{ width: 260 }} value={selectedUser || ''} onChange={e => loadUserAnalytics(e.target.value)}>
            <option value={user._id}>Myself ({user.name})</option>
            {allUsers.filter(u => u._id !== user._id).map(u => <option key={u._id} value={u._id}>{u.name} — {u.role}</option>)}
          </select>
        </div>
      )}

      {/* OVERALL TAB */}
      {tab === 'overall' && overallData && (
        <>
          <div className="dashboard-stats">
            <div className="stat-card"><div className="stat-card-icon" style={{ background: 'var(--info-bg)', color: 'var(--info)' }}><ClipboardList size={20} /></div><div className="stat-card-value">{overallData.totalIssues}</div><div className="stat-card-label">Total Issues</div></div>
            <div className="stat-card"><div className="stat-card-icon" style={{ background: 'var(--accent-primary-bg)', color: 'var(--accent-primary)' }}><Target size={20} /></div><div className="stat-card-value">{overallData.totalPoints}</div><div className="stat-card-label">Total Points</div></div>
            <div className="stat-card"><div className="stat-card-icon" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}><CircleCheck size={20} /></div><div className="stat-card-value">{overallData.completedPoints}</div><div className="stat-card-label">Points Completed</div></div>
            <div className="stat-card"><div className="stat-card-icon" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}><Users size={20} /></div><div className="stat-card-value">{overallData.totalUsers}</div><div className="stat-card-label">Active Members</div></div>
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-section">
              <div className="dashboard-section-header"><h3 className="dashboard-section-title">Issue Status Distribution</h3></div>
              <div className="dashboard-section-body" style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart><Pie data={overallData.statusCounts.map(s => ({ name: getStatusInfo(s._id).label, value: s.count }))} cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {overallData.statusCounts.map((s, i) => <Cell key={i} fill={getStatusInfo(s._id).color} />)}
                  </Pie><Tooltip contentStyle={tooltipStyle} /></PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="dashboard-section">
              <div className="dashboard-section-header"><h3 className="dashboard-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Award size={16} color="var(--warning)" /> Points Leaderboard</h3></div>
              <div className="dashboard-section-body">
                {overallData.leaderboard.length === 0 ? (
                  <div className="empty-state" style={{ padding: 24 }}><EmptyChartIllustration width={140} height={110} /><div className="empty-state-text">No completed issues yet</div></div>
                ) : overallData.leaderboard.map((entry, idx) => (
                  <div key={entry._id} className="my-issue-item" onClick={() => loadUserAnalytics(entry._id)} style={{ cursor: 'pointer' }}>
                    <span style={{ width: 28, textAlign: 'center', fontWeight: 700, fontSize: '.75rem', color: idx < 3 ? ['#fbbf24', '#94a3b8', '#cd7f32'][idx] : 'var(--text-tertiary)' }}>
                      {idx < 3 ? <Award size={16} color={['#fbbf24', '#94a3b8', '#cd7f32'][idx]} /> : `#${idx + 1}`}
                    </span>
                    <div className="avatar avatar-xs" style={{ background: generateAvatarColor(entry.user.name) }}>{getInitials(entry.user.name)}</div>
                    <span className="my-issue-title">{entry.user.name}</span>
                    <span className="badge badge-info">{entry.completedIssues} done</span>
                    <span className="font-semibold" style={{ color: 'var(--success)', fontSize: '.875rem' }}>{entry.totalPoints} pts</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-section" style={{ gridColumn: '1 / -1' }}>
              <div className="dashboard-section-header"><h3 className="dashboard-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><TrendingUp size={16} color="var(--accent-primary)" /> Completion Trend (30 days)</h3></div>
              <div className="dashboard-section-body" style={{ padding: 24 }}>
                {overallData.dailyCompletions.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={overallData.dailyCompletions.map(d => ({ date: d._id.slice(5), issues: d.count, points: d.points }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" /><XAxis dataKey="date" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} /><YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
                      <Tooltip contentStyle={tooltipStyle} /><Legend />
                      <Bar dataKey="issues" fill="#6366f1" name="Issues" radius={[4, 4, 0, 0]} /><Bar dataKey="points" fill="#22c55e" name="Points" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (<div className="empty-state" style={{ padding: 24 }}><EmptyChartIllustration width={160} height={120} /><div className="empty-state-text">No completions in the last 30 days</div></div>)}
              </div>
            </div>

            <div className="dashboard-section" style={{ gridColumn: '1 / -1' }}>
              <div className="dashboard-section-header"><h3 className="dashboard-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Users size={16} color="var(--info)" /> Member Workload</h3></div>
              <div className="dashboard-section-body">
                {overallData.issuesPerUser.map(entry => {
                  const completionPct = entry.total > 0 ? Math.round((entry.done / entry.total) * 100) : 0;
                  return (
                    <div key={entry._id} className="my-issue-item" onClick={() => loadUserAnalytics(entry._id)} style={{ cursor: 'pointer', padding: '12px 16px' }}>
                      <div className="avatar avatar-sm" style={{ background: generateAvatarColor(entry.user.name) }}>{getInitials(entry.user.name)}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="flex items-center justify-between" style={{ marginBottom: 6 }}><span className="font-medium text-sm">{entry.user.name}</span><span className="text-xs text-tertiary">{entry.done}/{entry.total} done · {entry.points} pts</span></div>
                        <div style={{ height: 6, background: 'var(--surface-3)', borderRadius: 3, overflow: 'hidden' }}><div style={{ height: '100%', width: `${completionPct}%`, background: completionPct >= 80 ? 'var(--success)' : completionPct >= 50 ? 'var(--warning)' : 'var(--error)', borderRadius: 3, transition: 'width 0.5s ease' }} /></div>
                      </div>
                      <span className="badge badge-neutral">{completionPct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* USER TAB */}
      {tab === 'user' && userData && (
        <>
          <div className="dashboard-section" style={{ marginBottom: 24, padding: '20px 24px' }}>
            <div className="flex items-center gap-lg">
              <div className="avatar avatar-lg" style={{ background: generateAvatarColor(userData.user?.name) }}>{getInitials(userData.user?.name)}</div>
              <div style={{ flex: 1 }}><h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{userData.user?.name}</h2><p className="text-sm text-secondary">{userData.user?.email} · {userData.user?.designation || userData.user?.role}</p></div>
              <div className="flex gap-lg" style={{ textAlign: 'center' }}>
                <div><div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{userData.totalPointsAssigned}</div><div className="text-xs text-tertiary">Assigned</div></div>
                <div><div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>{userData.pointsEarned}</div><div className="text-xs text-tertiary">Completed</div></div>
                <div><div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--warning)' }}>{userData.pointsInProgress}</div><div className="text-xs text-tertiary">In Progress</div></div>
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-section">
              <div className="dashboard-section-header"><h3 className="dashboard-section-title">Status Breakdown</h3></div>
              <div className="dashboard-section-body" style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
                {userData.statusCounts.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart><Pie data={userData.statusCounts.map(s => ({ name: getStatusInfo(s._id).label, value: s.count }))} cx="50%" cy="50%" outerRadius={85} innerRadius={45} paddingAngle={3} dataKey="value">
                      {userData.statusCounts.map((s, i) => <Cell key={i} fill={getStatusInfo(s._id).color} />)}
                    </Pie><Tooltip contentStyle={tooltipStyle} /></PieChart>
                  </ResponsiveContainer>
                ) : <EmptyChartIllustration width={140} height={110} />}
              </div>
            </div>

            <div className="dashboard-section">
              <div className="dashboard-section-header"><h3 className="dashboard-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Target size={16} color="var(--accent-primary)" /> Point Targets</h3></div>
              <div className="dashboard-section-body">
                {userData.targets.length === 0 ? (
                  <div className="empty-state" style={{ padding: 24 }}><div className="empty-state-text">No targets set</div></div>
                ) : userData.targets.map(t => {
                  const earned = userData.pointsEarned;
                  const pct = t.targetPoints > 0 ? Math.min(Math.round((earned / t.targetPoints) * 100), 100) : 0;
                  return (
                    <div key={t._id} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>
                      <div className="flex items-center justify-between" style={{ marginBottom: 6 }}><span className="text-sm font-medium">{t.project?.name} · {t.period}</span><span className="text-xs text-tertiary">{earned}/{t.targetPoints} pts</span></div>
                      <div style={{ height: 8, background: 'var(--surface-3)', borderRadius: 4, overflow: 'hidden' }}><div style={{ height: '100%', width: `${pct}%`, background: pct >= 100 ? 'var(--success)' : pct >= 70 ? 'var(--warning)' : 'var(--accent-primary)', borderRadius: 4, transition: 'width 0.5s ease' }} /></div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="dashboard-section" style={{ gridColumn: '1 / -1' }}>
              <div className="dashboard-section-header"><h3 className="dashboard-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><TrendingUp size={16} /> Completion Trend</h3></div>
              <div className="dashboard-section-body" style={{ padding: 24 }}>
                {userData.completionTrend.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={userData.completionTrend.map(d => ({ date: d._id.slice(5), points: d.points, issues: d.count }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" /><XAxis dataKey="date" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} /><YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
                      <Tooltip contentStyle={tooltipStyle} /><Legend />
                      <Line type="monotone" dataKey="points" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e', r: 4 }} name="Points" />
                      <Line type="monotone" dataKey="issues" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', r: 4 }} name="Issues" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : <div className="empty-state" style={{ padding: 24 }}><EmptyChartIllustration width={160} height={120} /><div className="empty-state-text">No completions yet</div></div>}
              </div>
            </div>

            <div className="dashboard-section" style={{ gridColumn: '1 / -1' }}>
              <div className="dashboard-section-header"><h3 className="dashboard-section-title">Recently Completed</h3></div>
              <div className="dashboard-section-body">
                {userData.recentCompleted.length === 0 ? (
                  <div className="empty-state" style={{ padding: 24 }}><div className="empty-state-text">No completed issues</div></div>
                ) : userData.recentCompleted.map(issue => (
                  <div key={issue._id} className="my-issue-item">
                    <span className="my-issue-key">{issue.issueKey}</span>
                    <span className="my-issue-title">{issue.title}</span>
                    {issue.storyPoints > 0 && <span className="issue-card-points">{issue.storyPoints} pts</span>}
                    <span className="badge badge-success">Done</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
