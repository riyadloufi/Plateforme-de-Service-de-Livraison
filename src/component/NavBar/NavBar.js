import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logOut } from '../config/action';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import styles from './NavBar.module.css';

export default function NavBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const isAuthenticated = useSelector(state => state.isAuthenticated);
  const isAdmin = useSelector(state => state.isAdmin);

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    dispatch(logOut());
    navigate('/login');
  };

  // Fonction utilitaire pour extraire le nom d'utilisateur
  const getUserName = (user) => {
    if (!user) return '';
    // Utilise le nom d'utilisateur s'il existe, sinon utilise la partie locale de l'email
    return user.username || user.email.split('@')[0];
  };

  // Interface administrateur simplifiée
  if (isAdmin) {
    return (
      <Navbar bg="white" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/admin/pending-ads" className={styles.logo}>
            <img 
              src="/Backgroungs/Untitled design(11)(1).png"
              alt="ReoLiv Admin"
              className={styles.logoImage}
            />
          </Navbar.Brand>
          <Nav className="ms-auto">
            <Button 
              variant="danger"
              size="sm"
              onClick={handleLogout}
            >
              Déconnexion
            </Button>
          </Nav>
        </Container>
      </Navbar>
    );
  }

  // Interface utilisateur standard avec toutes les fonctionnalités
  return (
    <Navbar bg="white" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className={styles.logo}>
          <img 
            src="/Backgroungs/Untitled design(11)(1).png"
            alt="ReoLiv"
            className={styles.logoImage}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/view-ads">
              Voir les annonces
            </Nav.Link>
            
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/manage-ads">
                  Mes annonces
                </Nav.Link>
                <div className={styles.userSection}>
                  <Link to="/profile" className={styles.usernameLink}>
                    <span className={styles.username}>
                      {getUserName(user)}
                    </span>
                  </Link>
                  <Button 
                    variant="danger"
                    size="sm"
                    onClick={handleLogout}
                  >
                    Déconnexion
                  </Button>
                </div>
              </>
            ) : (
              <div className={styles.authLinks}>
                <Nav.Link as={Link} to="/login" className={styles.loginButton}>
                  Connexion
                </Nav.Link>
                <Nav.Link as={Link} to="/signup" className={styles.signupButton}>
                  Inscription
                </Nav.Link>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
} 