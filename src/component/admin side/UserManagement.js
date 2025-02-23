import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Table, Button, Modal, Container, Image, Badge } from 'react-bootstrap';
import styles from './AdminPages.module.css';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userAds, setUserAds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const isAdmin = useSelector(state => state.isAdmin);

  // Fonction pour calculer les statistiques d'un utilisateur
  const calculateUserStats = (user) => {
    const publishedAds = JSON.parse(localStorage.getItem("ads")) || [];
    const pendingAds = JSON.parse(localStorage.getItem("pendingAds")) || [];
    const deliveries = JSON.parse(localStorage.getItem("deliveries")) || [];

    const userPublishedAds = publishedAds.filter(ad => ad.userId === user.email).length;
    const userReservations = deliveries.filter(delivery => delivery.userId === user.email).length;

    return {
      publishedAds: userPublishedAds,
      reservations: userReservations
    };
  };

  useEffect(() => {
    if (!isAdmin) return;
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    // Filtrer les utilisateurs non-admin
    const regularUsers = storedUsers.filter(user => user.email !== 'admin@admin.com');
    // Ajouter les statistiques à chaque utilisateur
    const usersWithStats = regularUsers.map(user => ({
      ...user,
      stats: calculateUserStats(user)
    }));
    setUsers(usersWithStats);
  }, [isAdmin]);

  const handleViewAds = (user) => {
    // Charger toutes les annonces de l'utilisateur
    const publishedAds = JSON.parse(localStorage.getItem("ads")) || [];
    const pendingAds = JSON.parse(localStorage.getItem("pendingAds")) || [];
    const rejectedAds = JSON.parse(localStorage.getItem("rejectedAds")) || [];

    const allUserAds = [
      ...publishedAds.filter(ad => ad.userId === user.email),
      ...pendingAds.filter(ad => ad.userId === user.email),
      ...rejectedAds.filter(ad => ad.userId === user.email)
    ];

    setSelectedUser(user);
    setUserAds(allUserAds);
    setShowModal(true);
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'published':
      case 'approved':
        return 'Publiée';
      case 'pending':
        return 'En attente';
      case 'rejected':
        return 'Refusée';
      default:
        return status;
    }
  };

  // Ajout de la fonction pour les variantes de badge
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'published':
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Gestion des Utilisateurs</h1>
      </div>

      <div className={styles.contentSection}>
        <Table responsive hover className={styles.customTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom d'utilisateur</th>
              <th>Email</th>
              <th>Date d'inscription</th>
              <th>Annonces publiées</th>
              <th>Réservations effectuées</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username || 'N/A'}</td>
                <td>{user.email}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <Badge bg="success" pill className={styles.statBadge}>
                    {user.stats.publishedAds}
                  </Badge>
                </td>
                <td>
                  <Badge bg="info" pill className={styles.statBadge}>
                    {user.stats.reservations}
                  </Badge>
                </td>
                <td>
                  <Button 
                    variant="outline-primary"
                    size="sm"
                    className={styles.actionButton}
                    onClick={() => handleViewAds(user)}
                  >
                    Voir les annonces
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal pour voir les annonces */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)}
        size="lg"
        className={styles.customModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Annonces de {selectedUser?.username || selectedUser?.email}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table responsive className={styles.modalTable}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Titre</th>
                <th>Prix</th>
                <th>Statut</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {userAds.map(ad => (
                <tr key={ad.id}>
                  <td>
                    <Image 
                      src={ad.image} 
                      alt={ad.title} 
                      className={styles.adImage}
                    />
                  </td>
                  <td>{ad.title}</td>
                  <td>{ad.price} DH</td>
                  <td>
                    <Badge bg={getStatusBadgeVariant(ad.status)} pill>
                      {getStatusText(ad.status)}
                    </Badge>
                  </td>
                  <td>{new Date(ad.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {userAds.length === 0 && (
                <tr>
                  <td colSpan="5" className={styles.noDataMessage}>
                    Aucune annonce trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    </div>
  );
} 