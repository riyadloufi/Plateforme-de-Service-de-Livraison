import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import styles from './ViewAd.module.css';
import { addDelivery, cancelDelivery } from '../../config/action';

const ViewAd = ({ ad, onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const deliveries = useSelector(state => state.deliveries) || [];
  
  // Vérifier si l'utilisateur a déjà réservé cette annonce
  const [isReserved, setIsReserved] = useState(false);

  useEffect(() => {
    if (user && ad) {
      const hasReserved = deliveries.some(
        delivery => delivery.adId === ad.id && 
        delivery.userId === user.email && 
        delivery.status !== 'rejected'
      );
      setIsReserved(hasReserved);
    }
  }, [user, ad, deliveries]);

  if (!ad) return null;

  const handleReservationClick = () => {
    if (!user) {
      alert('Veuillez vous connecter pour réserver une annonce');
      return;
    }

    if (isReserved) {
      // Annuler la réservation
      if (window.confirm("Voulez-vous vraiment annuler cette réservation ?")) {
        const reservation = deliveries.find(
          d => d.adId === ad.id && d.userId === user.email
        );
        
        if (reservation) {
          dispatch(cancelDelivery(reservation.id));
          
          // Mettre à jour localStorage
          const updatedDeliveries = deliveries.filter(d => d.id !== reservation.id);
          localStorage.setItem("deliveries", JSON.stringify(updatedDeliveries));
          
          setIsReserved(false);
          alert('Réservation annulée avec succès');
        }
      }
    } else {
      // Créer une nouvelle réservation
      const newReservation = {
        id: Date.now().toString(),
        adId: ad.id,
        adTitle: ad.title,
        adPrice: ad.price,
        adImage: ad.image || '/placeholder-image.jpg',
        adDescription: ad.description,
        userId: user.email,
        userName: user.username,
        userEmail: user.email,
        ownerId: ad.userId,
        ownerName: ad.userName,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      dispatch(addDelivery(newReservation));
      
      // Mettre à jour localStorage
      const updatedDeliveries = [...deliveries, newReservation];
      localStorage.setItem("deliveries", JSON.stringify(updatedDeliveries));
      
      setIsReserved(true);
      alert('Demande de réservation envoyée avec succès!');
    }
  };

  return (
    <Modal 
      show={true} 
      onHide={onClose} 
      size="lg"
      dialogClassName={styles.modalDialog}
    >
      <Modal.Header closeButton>
        <Modal.Title>{ad.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={styles.adDetailContainer}>
          <div className={styles.mainInfo}>
            <img 
              src={ad.image} 
              alt={ad.title} 
              className={styles.adDetailImage}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'placeholder-image.jpg';
              }}
            />
            <div className={styles.adDetailInfo}>
              <h3>{ad.title}</h3>
              <p className={styles.price}>{ad.price} DH</p>
              <p className={styles.description}>{ad.description}</p>
              <div className={styles.sellerInfo}>
                <p>Vendeur : {ad.userName}</p>
                <p>Publié le : {new Date(ad.approvedAt || ad.createdAt).toLocaleDateString()}</p>
              </div>
              <Button 
                variant={isReserved ? "danger" : "primary"}
                onClick={handleReservationClick}
                disabled={user && ad.userId === user.email}
                className={styles.reserveButton}
              >
                {user && ad.userId === user.email 
                  ? "Votre annonce" 
                  : isReserved 
                    ? "Annuler la réservation" 
                    : "Réserver"}
              </Button>
            </div>
          </div>

          {ad.location && (
            <div className={styles.mapSection}>
              <h4>Localisation</h4>
              <div className={styles.mapContainer}>
                <MapContainer
                  center={[ad.location.lat, ad.location.lng]}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[ad.location.lat, ad.location.lng]}>
                    <Popup>
                      <div className={styles.mapPopup}>
                        <h5>{ad.title}</h5>
                        <p>{ad.price} DH</p>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ViewAd;
