import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from "../config/firebase"; // Import Firebase configuration
import './style/Login.css';

import { collection, query, where, getDocs } from "firebase/firestore";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(email, password); // Call the loginUser function
      console.log("User ID:", response.userId);
      nav('/menu', { state: {userId: email }}); // Redirect to the menu page after successful login
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };




  const loginUser = async (username, password) => {
    try {
      const collectionRef = collection(db, "Users");
      const q = query(collectionRef, where("UserID", "==", username));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        if (userData.password === password) {
          console.log("User Found");
          return { userId: querySnapshot.docs[0].id };
        } else {
          console.log(userData.password);
          throw new Error("Incorrect Password");
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
      <h1>Login</h1>
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
