import { NavLink } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { generateAvatarColor } from '../../utils/helpers';
import { Home, FolderKanban, LayoutDashboard, Settings, Users, Target, BarChart3, KanbanSquare, Inbox, List, ChevronDown } from 'lucide-react';

export default function Sidebar() {
  const { projects, activeProject, selectProject, fetchProjects } = useProject();
  const { user } = useAuth();
  const [showProjects, setShowProjects] = useState(false);

  const isAdmin = user?.role === 'admin' || user?.role === 'manager';
  
  const myProjectMember = activeProject?.members?.find(m => m.user?._id === user?._id || m.user === user?._id);
  const isProjectAdmin = isAdmin || myProjectMember?.role === 'admin' || myProjectMember?.role === 'manager';

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo"><KanbanSquare size={18} /></div>
        <span className="sidebar-title">ZedBoard</span>
      </div>

      {/* Project Selector */}
      <div className="project-selector">
        <button className="project-selector-btn" onClick={() => setShowProjects(!showProjects)}>
          {activeProject ? (
            <>
              <div className="project-selector-icon" style={{ background: generateAvatarColor(activeProject.name) }}>
                {activeProject.key?.slice(0, 2)}
              </div>
              <span className="truncate flex-1" style={{ textAlign: 'left' }}>{activeProject.name}</span>
              <ChevronDown size={14} style={{ color: 'var(--text-tertiary)', transition: 'transform 0.2s', transform: showProjects ? 'rotate(180deg)' : 'rotate(0)' }} />
            </>
          ) : (
            <>
              <span className="truncate flex-1" style={{ textAlign: 'left' }}>Select Project</span>
              <ChevronDown size={14} style={{ color: 'var(--text-tertiary)', transition: 'transform 0.2s', transform: showProjects ? 'rotate(180deg)' : 'rotate(0)' }} />
            </>
          )}
        </button>
        {showProjects && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setShowProjects(false)} />
            <div className="project-selector-dropdown">
              {projects?.length > 0 ? (
                projects.map(p => (
                  <div key={p._id} className={`project-selector-item ${activeProject?._id === p._id ? 'active' : ''}`}
                    onClick={() => { selectProject(p._id); setShowProjects(false); }}>
                    <div className="project-selector-icon" style={{ background: generateAvatarColor(p.name), width: 24, height: 24, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.625rem', fontWeight: 700 }}>
                      {p.key?.slice(0, 2)}
                    </div>
                    <span>{p.name}</span>
                  </div>
                ))
              ) : (
                <div style={{ padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginBottom: 8 }}>No projects found</div>
                  {isAdmin && (
                    <NavLink to="/projects" onClick={() => setShowProjects(false)} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                      Create Project
                    </NavLink>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-title">Menu</div>
        <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Home size={18} className="icon" /> Dashboard
        </NavLink>
        <NavLink to="/projects" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <FolderKanban size={18} className="icon" /> Projects
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <BarChart3 size={18} className="icon" /> Analytics
        </NavLink>

        {/* Admin Section */}
        {isAdmin && (
          <>
            <div className="sidebar-section-title" style={{ marginTop: 16 }}>Management</div>
            <NavLink to="/admin/users" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Users size={18} className="icon" /> Team
            </NavLink>
          </>
        )}

        {activeProject && (
          <>
            <div className="sidebar-section-title" style={{ marginTop: 16 }}>Current Project</div>
            <NavLink to={`/project/${activeProject._id}/board`} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} className="icon" /> Board
            </NavLink>
            <NavLink to={`/project/${activeProject._id}/issues`} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <List size={18} className="icon" /> Issues
            </NavLink>
            <NavLink to={`/project/${activeProject._id}/backlog`} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Inbox size={18} className="icon" /> Backlog
            </NavLink>
            {isProjectAdmin && (
              <>
                <NavLink to={`/project/${activeProject._id}/targets`} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                  <Target size={18} className="icon" /> Point Targets
                </NavLink>
                <NavLink to={`/project/${activeProject._id}/settings`} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                  <Settings size={18} className="icon" /> Settings
                </NavLink>
              </>
            )}
          </>
        )}
      </nav>
    </aside>
  );
}
