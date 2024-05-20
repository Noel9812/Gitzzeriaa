
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const Navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout actions here
    // For now, let's simulate a logout by redirecting to the landing page
    Navigate('/');
  };

  return (
    <div className="profile">
      <img src="profile-picture-url.jpg" alt="Profile" />
      <h2>Name</h2>
      <p>Email</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;
