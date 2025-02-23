import React, { useState } from 'react';
import { Card, Modal, Badge, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { cancelDelivery } from '../../config/action';
import styles from './Profil.module.css';

const Profil = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const deliveries = useSelector(state => state.deliveries) || [];
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showReservationModal, setShowReservationModal] = useState(false);

  const handleCancelReservation = (reservation, e) => {
    e.stopPropagation(); // Empêcher l'ouverture du modal
    
    if (window.confirm("Voulez-vous vraiment annuler cette réservation ?")) {
      dispatch(cancelDelivery(reservation.id));
      
      // Mettre à jour localStorage
      const updatedDeliveries = deliveries.filter(d => d.id !== reservation.id);
      localStorage.setItem("deliveries", JSON.stringify(updatedDeliveries));
      
      alert('Réservation annulée avec succès');
    }
  };

  // Filtrer les réservations de l'utilisateur
  const userReservations = deliveries.filter(delivery => delivery.userId === user?.email);

  const getStatusBadgeVariant = (status) => {
    switch(status) {
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'danger';
      case 'pending':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'accepted':
        return 'Acceptée';
      case 'rejected':
        return 'Refusée';
      case 'pending':
        return 'En attente';
      default:
        return status;
    }
  };

  const handleImageError = (e) => {
    e.target.onerror = null; // Éviter les boucles infinies
    e.target.src = '/placeholder-image.jpg'; // Image par défaut
  };

  return (
    <div className={styles.profilContainer}>
      <div className={styles.profilContent}>
        <div className={styles.profilHeader}>
          <h1>Profil de {user.username}</h1>
          <p>Email : {user.email}</p>
        </div>

        <div className={styles.reservationsSection}>
          <h2>Mes Réservations</h2>
          <div className={styles.reservationsList}>
            {userReservations.map((reservation) => (
              <Card 
                key={reservation.id}
                className={styles.reservationCard}
                onClick={() => {
                  setSelectedReservation(reservation);
                  setShowReservationModal(true);
                }}
              >
                <Card.Body>
                  <div className={styles.reservationHeader}>
                    <Card.Title>{reservation.adTitle}</Card.Title>
                    <Badge bg={getStatusBadgeVariant(reservation.status)}>
                      {getStatusText(reservation.status)}
                    </Badge>
                  </div>
                  <div className={styles.reservationDetails}>
                    <div className={styles.imageContainer}>
                      <img 
                        src={reservation.adImage || '/placeholder-image.jpg'}
                        alt={reservation.adTitle}
                        className={styles.reservationImage}
                        onError={handleImageError}
                      />
                    </div>
                    <div className={styles.reservationInfo}>
                      <p className={styles.price}>{reservation.adPrice} DH</p>
                      {reservation.adDescription && (
                        <p className={styles.description}>
                          {reservation.adDescription}
                        </p>
                      )}
                      {reservation.ownerName && (
                        <p className={styles.seller}>
                          Vendeur: {reservation.ownerName}
                        </p>
                      )}
                      <p className={styles.date}>
                        Demande effectuée le: {new Date(reservation.createdAt).toLocaleDateString()}
                      </p>
                      {reservation.status === 'pending' && (
                        <Button 
                          variant="danger"
                          onClick={(e) => handleCancelReservation(reservation, e)}
                          className={styles.cancelButton}
                        >
                          Annuler la réservation
                        </Button>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
            {userReservations.length === 0 && (
              <p className={styles.noReservations}>
                Vous n'avez pas encore de réservations.
              </p>
            )}
          </div>
        </div>

        {/* Modal des détails de réservation */}
        <Modal 
          show={showReservationModal} 
          onHide={() => {
            setShowReservationModal(false);
            setSelectedReservation(null);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Détails de la réservation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedReservation && (
              <div className={styles.modalContent}>
                <h4>{selectedReservation.adTitle}</h4>
                <p><strong>Prix:</strong> {selectedReservation.adPrice} DH</p>
                <p>
                  <strong>Statut:</strong>{' '}
                  <Badge bg={getStatusBadgeVariant(selectedReservation.status)}>
                    {getStatusText(selectedReservation.status)}
                  </Badge>
                </p>

                {selectedReservation.status === 'accepted' && (
                  <>
                    <p><strong>Date de livraison:</strong> {new Date(selectedReservation.deliveryDate).toLocaleDateString()}</p>
                    {selectedReservation.message && (
                      <div className={styles.messageBox}>
                        <strong>Message du vendeur:</strong>
                        <p>{selectedReservation.message}</p>
                      </div>
                    )}
                  </>
                )}

                {selectedReservation.status === 'rejected' && (
                  <div className={styles.messageBox}>
                    <strong>Raison du refus:</strong>
                    <p>{selectedReservation.message}</p>
                  </div>
                )}

                {selectedReservation.status === 'pending' && (
                  <>
                    <p className={styles.pendingMessage}>
                      Votre demande est en cours de traitement. Le vendeur vous répondra bientôt.
                    </p>
                    <Button 
                      variant="danger"
                      onClick={(e) => handleCancelReservation(selectedReservation, e)}
                      className={styles.modalCancelButton}
                    >
                      Annuler la réservation
                    </Button>
                  </>
                )}

                <p className={styles.reservationDate}>
                  <small>
                    Demande effectuée le: {new Date(selectedReservation.createdAt).toLocaleDateString()}
                  </small>
                </p>
              </div>
            )}
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default Profil; 