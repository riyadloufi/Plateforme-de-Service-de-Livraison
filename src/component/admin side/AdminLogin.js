import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../config/action';
import styles from './AdminLogin.module.css';
const backgroundImage = process.env.PUBLIC_URL + '/Backgroungs/pexels-goumbik-669619.jpg';

// Ajoutez cette ligne après les imports
document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`;

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Vérifier les identifiants admin
    if (email === 'admin@admin.com' && password === 'admin123') {
      const adminData = {
        email,
        role: 'admin'
      };

      dispatch(adminLogin(adminData));
      navigate('/admin/pending-ads');
    } else {
      setError('Email ou mot de passe incorrect');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h2>Admin Login</h2>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Mot de passe:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
} 