import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styles from './Home.module.css';

export default function Home() {
  const user = useSelector((state) => state.user);

  // Fonction pour obtenir le nom d'utilisateur
  const getUserName = (user) => {
    if (!user) return 'Utilisateur';
    return user.username || user.email.split('@')[0];  // Utilise username s'il existe, sinon email
  };

  return (
    <div className={styles.homeContainer}>
      <div className={styles.welcomeBox}>
        <h1>Bonjour, <span>{getUserName(user)}</span></h1>
        <p>Que souhaitez-vous faire aujourd'hui ?</p>
      </div>

      <div className={styles.optionsContainer}>
        <Link to="/manage-ads" className={styles.optionButton}>
          <i className="fas fa-list-ul"></i>
          Gérer mes annonces
        </Link>
        <Link to="/view-ads" className={styles.optionButton}>
          <i className="fas fa-search"></i>
          Voir les annonces
        </Link>
      </div>
    </div>
  );
}
