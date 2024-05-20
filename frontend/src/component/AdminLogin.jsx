import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../config/firebase'; // Import Firebase configuration
import './style/AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(email, password);
      console.log("User ID:", response.userId);
      if (response.isAdmin) {
        navigate('/admin',{ state: {userId: email }});
      } else {
        setError('Access Denied');
      }
    } catch (error) {
      setError('Login Failed');
    }
  };

  const loginUser = async (username, password) => {
    try {
      const collectionRef = collection(db, "Users");
      const q = query(collectionRef, where("UserID", "==", username));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        if (userData.password === password && userData.AdminCheck === true) {
          console.log("Admin User Found");
          return { isAdmin: true, userId: querySnapshot.docs[0].id };
        } else if (userData.password !== password) {
          console.log(userData.password);
          throw new Error("Incorrect Password");
        } else if (userData.AdminCheck !== true) {
          throw new Error("Not an Admin");
        }
      } else {
        throw new Error("User Does Not Exist");
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="login-container">
      <h1>Admin Login</h1>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
