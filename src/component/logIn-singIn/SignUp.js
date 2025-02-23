import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { signUp } from '../config/action';
import styles from './Auth.module.css';
import BackgroundProvider from './BackgroundProvider';

export default function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); // Réinitialiser les erreurs

    // Vérification des champs obligatoires
    if (!username || !email || !password || !confirmPassword) {
      setError("Tous les champs sont obligatoires.");
      return;
    }

    // Vérification du format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Format d'email invalide.");
      return;
    }

    // Vérification des mots de passe
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    // Vérifier si l'email existe déjà
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const emailExists = users.some(user => user.email.toLowerCase() === email.toLowerCase());
    
    if (emailExists) {
      setError("Cet email est déjà utilisé. Veuillez en choisir un autre.");
      return;
    }

    const userData = {
      id: Date.now(),
      username: username,
      email: email.toLowerCase(), // Stocker l'email en minuscules
      password: password,
      createdAt: new Date().toISOString()
    };

    // Sauvegarder dans localStorage
    localStorage.setItem("users", JSON.stringify([...users, userData]));

    // Dispatch pour Redux
    dispatch(signUp(userData));
    navigate('/login');
  };

  return (
    <BackgroundProvider>
      <div className={styles.authContainer}>
        <div className={styles.authBox}>
          <h1>Inscription</h1>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Nom d'utilisateur</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Confirmer le mot de passe</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.submitButton}>
              S'inscrire
            </button>
          </form>
          <p className={styles.switchAuth}>
            Déjà un compte ? <Link to="/login">Se connecter</Link>
          </p>
        </div>
      </div>
    </BackgroundProvider>
  );
}