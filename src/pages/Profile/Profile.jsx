import { useAuth } from '../../context/AuthContext';
import './Profile.css';

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <div className="profile-page container section">
      <h1 className="page-title">Profile</h1>

      {user && (
        <div className="profile-card">
          <div className="profile-avatar-large">{user.username.charAt(0).toUpperCase()}</div>
          <div className="profile-info">
            <div className="profile-row">
              <span className="profile-label">Username</span>
              <span className="profile-value">{user.username}</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">Email</span>
              <span className="profile-value">{user.email}</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">Member since</span>
              <span className="profile-value">
                {new Date(user.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
          <button className="btn btn-danger" onClick={logout}>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
