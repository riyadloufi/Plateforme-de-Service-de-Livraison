import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { logIn } from '../config/action';
import styles from './Auth.module.css';
import BackgroundProvider from './BackgroundProvider';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Vérification des credentials dans le localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => 
      u.email === credentials.email && 
      u.password === credentials.password
    );

    if (user) {
      dispatch(logIn(user));
      navigate('/home');
    } else {
      setError("Email ou mot de passe incorrect");
    }
  };

  return (
    <BackgroundProvider>
      <div className={styles.authContainer}>
        <div className={styles.authBox}>
          <h1>Connexion</h1>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Mot de passe</label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" className={styles.submitButton}>
              Se connecter
            </button>
          </form>
          <p className={styles.switchAuth}>
            Pas encore de compte ? <Link to="/signup">S'inscrire</Link>
          </p>
          {error && <p className={styles.error}>{error}</p>}
        </div>
      </div>
    </BackgroundProvider>
  );
}
