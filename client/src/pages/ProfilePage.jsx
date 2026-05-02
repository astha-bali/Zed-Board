import { useAuth } from '../context/AuthContext';
import { getInitials, generateAvatarColor, getRoleInfo } from '../utils/helpers';
import { UserCircle, Mail, Briefcase, Building2, Shield } from 'lucide-react';
import Icon from '../components/common/Icon';

export default function ProfilePage() {
  const { user } = useAuth();
  const roleInfo = getRoleInfo(user?.role);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 0' }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>My Profile</h1>
      </div>

      <div className="project-card animate-fade-in" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 32 }}>
        
        {/* Header Section */}
        <div className="flex items-center gap-lg">
          <div className="avatar" style={{ width: 80, height: 80, fontSize: '2rem', background: generateAvatarColor(user?.name) }}>
            {getInitials(user?.name)}
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, marginBottom: 4 }}>{user?.name}</h2>
            <div className="flex items-center gap-sm text-secondary">
              <Mail size={16} />
              <span>{user?.email}</span>
            </div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
             <span className="badge" style={{ padding: '6px 12px', fontSize: '.875rem', background: `${roleInfo?.color}18`, color: roleInfo?.color }}>
               {roleInfo?.icon && <Icon name={roleInfo.icon} size={14} />} {roleInfo?.label || user?.role}
             </span>
          </div>
        </div>

        <div style={{ height: 1, background: 'var(--border-color)', width: '100%' }} />

        {/* Details Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div className="text-xs text-tertiary font-semibold" style={{ textTransform: 'uppercase', letterSpacing: '.05em' }}>Organization</div>
            <div className="flex items-center gap-sm font-medium" style={{ fontSize: '1rem' }}>
              <Building2 size={18} className="text-secondary" />
              {user?.organization || 'Not specified'}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div className="text-xs text-tertiary font-semibold" style={{ textTransform: 'uppercase', letterSpacing: '.05em' }}>Department</div>
            <div className="flex items-center gap-sm font-medium" style={{ fontSize: '1rem' }}>
              <Briefcase size={18} className="text-secondary" />
              {user?.department || 'Not specified'}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div className="text-xs text-tertiary font-semibold" style={{ textTransform: 'uppercase', letterSpacing: '.05em' }}>Designation</div>
            <div className="flex items-center gap-sm font-medium" style={{ fontSize: '1rem' }}>
              <UserCircle size={18} className="text-secondary" />
              {user?.designation || 'Not specified'}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div className="text-xs text-tertiary font-semibold" style={{ textTransform: 'uppercase', letterSpacing: '.05em' }}>System Role</div>
            <div className="flex items-center gap-sm font-medium" style={{ fontSize: '1rem' }}>
              <Shield size={18} className="text-secondary" />
              <span style={{ textTransform: 'capitalize' }}>{user?.role}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
