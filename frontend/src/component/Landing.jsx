import { Link } from 'react-router-dom';
import './style/Landing.css';
import background from './Images/10-1.jpeg';

function Landing() {
  return (
    <div className="landing-container" style={{ backgroundImage: `url(${background})` }}>
      <h1 className="landing-header">Welcome to Gitzzeria</h1>
      <div className="login-signupbutton"> 
        <Link to="/signup" className="cta-link">
          <button className="cta-button">Sign Up</button>
        </Link>
        <Link to="/login" className="cta-link">
          <button className="cta-button">Login</button>
        </Link>
        <Link to="/adminlogin" className="cta-link">
          <button className="cta-button">Admin Login</button>
        </Link>
      </div>
    </div>
  );
}

export default Landing;
