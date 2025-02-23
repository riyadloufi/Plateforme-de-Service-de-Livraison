import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../config/action';
import styles from './AdminSidebar.module.css';

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAdmin = useSelector(state => state.isAdmin);
  const isAuthenticated = useSelector(state => state.isAuthenticated);

  const handleLogout = () => {
    dispatch(logOut());
    navigate('/admin/login');
  };

  // Ne pas afficher la sidebar si l'admin n'est pas connecté
  if (!isAdmin || !isAuthenticated) {
    return null;
  }

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <h2>Admin Panel</h2>
      </div>
      <nav className={styles.nav}>
        <Link 
          to="/admin/pending-ads" 
          className={`${styles.navLink} ${location.pathname === '/admin/pending-ads' ? styles.active : ''}`}
        >
          Demandes d'annonces
        </Link>
        <Link 
          to="/admin/published-ads" 
          className={`${styles.navLink} ${location.pathname === '/admin/published-ads' ? styles.active : ''}`}
        >
          Annonces publiées
        </Link>
        <Link 
          to="/admin/users" 
          className={`${styles.navLink} ${location.pathname === '/admin/users' ? styles.active : ''}`}
        >
          Utilisateurs
        </Link>
        <button 
          onClick={handleLogout}
          className={styles.logoutButton}
        >
          Déconnexion
        </button>
      </nav>
    </div>
  );
} 