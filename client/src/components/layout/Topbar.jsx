import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProject } from '../../context/ProjectContext';
import { issueApi } from '../../api/issueApi';
import { getInitials, generateAvatarColor, getStatusInfo } from '../../utils/helpers';
import { Search, LogOut, User, ChevronDown, FolderKanban } from 'lucide-react';

export default function Topbar() {
  const { user, logout } = useAuth();
  const { selectProject } = useProject();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        try {
          const res = await issueApi.searchGlobal(searchQuery);
          setSearchResults(res.data);
          setShowSearchResults(true);
        } catch (err) { console.error(err); }
        finally { setIsSearching(false); }
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSelectIssue = (issue) => {
    setShowSearchResults(false);
    setSearchQuery('');
    if (issue.project?._id) {
      selectProject(issue.project._id);
      navigate(`/project/${issue.project._id}/board`);
    }
  };

  return (
    <header className="topbar">
      <div className="topbar-search" ref={searchRef} style={{ position: 'relative' }}>
        <Search size={16} className="icon" />
        <input 
          placeholder="Search issues..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => { if (searchResults.length > 0) setShowSearchResults(true); }}
        />
        {isSearching && <div className="loader loader-sm" style={{ position: 'absolute', right: 12 }} />}
        
        {showSearchResults && (
          <div className="dropdown-menu animate-slide-up" style={{ position: 'absolute', top: '100%', left: 0, marginTop: 8, background: 'var(--surface-1)', border: '1px solid var(--border-color)', borderRadius: 8, minWidth: 320, maxWidth: 400, boxShadow: 'var(--shadow-lg)', zIndex: 100, maxHeight: 400, overflowY: 'auto' }}>
            {searchResults.length === 0 ? (
              <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '.875rem' }}>No issues found</div>
            ) : (
              searchResults.map(issue => {
                const statusInfo = getStatusInfo(issue.status);
                return (
                  <div key={issue._id} onClick={() => handleSelectIssue(issue)} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span className="my-issue-key" style={{ fontSize: '.75rem' }}>{issue.issueKey}</span>
                          {issue.project && <span style={{ fontSize: '.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}><FolderKanban size={10} /> {issue.project.key}</span>}
                        </div>
                        <div className="font-medium text-sm truncate" style={{ marginBottom: 4, lineHeight: 1.4 }}>{issue.title}</div>
                        <span className="badge" style={{ background: `${statusInfo.color}18`, color: statusInfo.color, display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '.7rem', padding: '2px 6px' }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusInfo.color }} />
                          {statusInfo.label}
                        </span>
                      </div>
                      {issue.assignee && (
                        <div className="avatar avatar-sm" style={{ background: generateAvatarColor(issue.assignee.name), flexShrink: 0 }} title={issue.assignee.name}>
                          {getInitials(issue.assignee.name)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      <div className="topbar-actions">
        <div style={{ position: 'relative' }}>
          <div className="topbar-user" onClick={() => setShowDropdown(!showDropdown)} style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="avatar avatar-sm" style={{ background: generateAvatarColor(user?.name) }}>
              {getInitials(user?.name)}
            </div>
            <span className="topbar-username">{user?.name}</span>
            <ChevronDown size={14} style={{ color: 'var(--text-tertiary)', transition: 'transform 0.2s', transform: showDropdown ? 'rotate(180deg)' : 'rotate(0)' }} />
          </div>

          {showDropdown && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 90 }} onClick={() => setShowDropdown(false)} />
              <div className="dropdown-menu animate-slide-up" style={{ position: 'absolute', top: '100%', right: 0, marginTop: 8, background: 'var(--surface-1)', border: '1px solid var(--border-color)', borderRadius: 8, padding: 8, minWidth: 160, boxShadow: 'var(--shadow-md)', zIndex: 100, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-color)', marginBottom: 4 }}>
                  <div className="font-medium text-sm">{user?.name}</div>
                  <div className="text-xs text-secondary truncate">{user?.email}</div>
                </div>
                <button onClick={() => { navigate('/profile'); setShowDropdown(false); }} className="btn btn-ghost" style={{ justifyContent: 'flex-start', padding: '8px 12px', color: 'var(--text-primary)' }}>
                  <User size={16} /> Profile
                </button>
                <button onClick={handleLogout} className="btn btn-ghost" style={{ justifyContent: 'flex-start', padding: '8px 12px', color: 'var(--error)' }}>
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
