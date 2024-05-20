import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from "firebase/firestore";
import {db} from '../config/firebase'; // Import Firebase configuration
import './style/SignUP.css';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (name && email && password) {
      try {
        // Add user to the Users collection
        const userRef = await addDoc(collection(db, "Users"), {
          Name: name,
          UserID: email,
          password: password,
          AdminCheck: false
        });
        console.log("User signed up with ID:", userRef.id);
        // Redirect to menu page
        navigate('/menu', { state: {userId: email }});
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    } else {
      console.error("Please fill in all fields");
    }
  };

  return (
    <div className="signup-container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSignUp}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
