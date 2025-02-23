import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from './ViewAds.module.css';
import { 
  setAds, 
  addDelivery, 
  cancelDelivery 
} from '../../config/action';
import ViewAd from './ViewAd';
import { Button } from 'react-bootstrap';

// Correction des icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const DEFAULT_IMAGE = '/placeholder-image.jpg';

export default function ViewAds() {
  const dispatch = useDispatch();
  const ads = useSelector(state => state.ads) || [];
  const [filteredAds, setFilteredAds] = useState([]);
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedAd, setSelectedAd] = useState(null);
  const user = useSelector(state => state.user);
  const deliveries = useSelector(state => state.deliveries) || [];

  useEffect(() => {
    // Charger uniquement les annonces approuvées
    const publishedAds = JSON.parse(localStorage.getItem("ads")) || [];
    const approvedAds = publishedAds.filter(ad => 
      ad.status === "approved" || ad.status === "published"
    );
    
    dispatch(setAds(approvedAds));
    setFilteredAds(approvedAds);
  }, [dispatch]);

  // Fonctions de filtrage et d'interaction
  const handleFilter = () => {
    if (maxPrice) {
      const filtered = ads.filter(ad => {
        const adPrice = parseFloat(ad.price);
        const filterPrice = parseFloat(maxPrice);
        return !isNaN(adPrice) && !isNaN(filterPrice) && adPrice <= filterPrice;
      });
      setFilteredAds(filtered);
    } else {
      setFilteredAds(ads);
    }
  };

  const handleAdClick = (ad) => {
    setSelectedAd(ad);
  };

  // Fonction pour vérifier si une annonce est réservée par l'utilisateur actuel
  const isAdReserved = (adId) => {
    return deliveries.some(
      delivery => delivery.adId === adId && 
      delivery.userId === user?.email && 
      delivery.status !== 'rejected'
    );
  };

  const handleReservation = (ad, e) => {
    e.stopPropagation();

    if (!user) {
      alert('Veuillez vous connecter pour réserver une annonce');
      return;
    }

    const reserved = isAdReserved(ad.id);

    if (reserved) {
      if (window.confirm("Voulez-vous vraiment annuler cette réservation ?")) {
        const reservation = deliveries.find(
          d => d.adId === ad.id && d.userId === user.email
        );
        
        if (reservation) {
          try {
            dispatch(cancelDelivery(reservation.id));
            
            // Mettre à jour localStorage avec gestion d'erreur
            const updatedDeliveries = deliveries.filter(d => d.id !== reservation.id);
            try {
              localStorage.setItem("deliveries", JSON.stringify(updatedDeliveries));
            } catch (error) {
              console.warn("Impossible de sauvegarder dans localStorage:", error);
              // Nettoyer les anciennes données si nécessaire
              localStorage.clear();
              localStorage.setItem("deliveries", JSON.stringify(updatedDeliveries));
            }
            
            alert('Réservation annulée avec succès');
          } catch (error) {
            console.error('Erreur lors de l\'annulation:', error);
            alert('Erreur lors de l\'annulation de la réservation');
          }
        }
      }
    } else {
      const newReservation = {
        id: Date.now().toString(),
        adId: ad.id,
        adTitle: ad.title,
        adPrice: ad.price,
        adImage: ad.image || DEFAULT_IMAGE,
        adDescription: ad.description,
        userId: user.email,
        userName: user.username,
        userEmail: user.email,
        ownerId: ad.userId,
        ownerName: ad.userName,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      try {
        dispatch(addDelivery(newReservation));
        
        // Mettre à jour localStorage avec gestion d'erreur
        const updatedDeliveries = [...deliveries, newReservation];
        try {
          localStorage.setItem("deliveries", JSON.stringify(updatedDeliveries));
        } catch (error) {
          console.warn("Impossible de sauvegarder dans localStorage:", error);
          // Nettoyer les anciennes données et réessayer
          localStorage.clear();
          localStorage.setItem("deliveries", JSON.stringify(updatedDeliveries));
        }
        
        alert('Demande de réservation envoyée avec succès!');
      } catch (error) {
        console.error('Erreur lors de la réservation:', error);
        alert('Erreur lors de l\'envoi de la demande de réservation');
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1>Annonces disponibles ({filteredAds.length})</h1>
      
      <div className={styles.topSection}>
        <div className={styles.filterSection}>
          <div className={styles.filterGroup}>
            <label>Prix maximum :</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="DH"
              className={styles.filterInput}
            />
            <button onClick={handleFilter} className={styles.filterButton}>
              Filtrer
            </button>
          </div>
        </div>

        <div className={styles.mapSection}>
          <MapContainer
            center={[34.0209, -6.8416]}
            zoom={12}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {filteredAds.map(ad => ad.location && (
              <Marker 
                key={ad.id}
                position={[ad.location.lat, ad.location.lng]}
                eventHandlers={{
                  click: () => setSelectedAd(ad)
                }}
              >
                <Popup>
                  <div className={styles.popup}>
                    <h3>{ad.title}</h3>
                    <p>{ad.price} DH</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      <div className={styles.adsGrid}>
        {filteredAds.length > 0 ? (
          filteredAds.map(ad => (
            <div 
              key={ad.id} 
              className={styles.adCard}
              onClick={() => handleAdClick(ad)}
            >
              <img 
                src={ad.image} 
                alt={ad.title} 
                className={styles.adImage}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'placeholder-image.jpg';
                }}
              />
              <div className={styles.adContent}>
                <h2>{ad.title}</h2>
                <p className={styles.price}>{ad.price} DH</p>
                <p className={styles.description}>{ad.description}</p>
                <div className={styles.adFooter}>
                  <p className={styles.seller}>
                    Vendeur : {ad.userName}
                  </p>
                  <p className={styles.date}>
                    Publié le : {new Date(ad.approvedAt || ad.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Button 
                  variant={isAdReserved(ad.id) ? "danger" : "primary"}
                  onClick={(e) => handleReservation(ad, e)}
                  disabled={user && ad.userId === user.email}
                  className={styles.reserveButton}
                >
                  {user && ad.userId === user.email 
                    ? "Votre annonce" 
                    : isAdReserved(ad.id)
                      ? "Annuler la réservation" 
                      : "Réserver"}
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noAdsMessage}>Aucune annonce disponible</p>
        )}
      </div>

      {selectedAd && (
        <ViewAd 
          ad={selectedAd} 
          onClose={() => setSelectedAd(null)}
        />
      )}
    </div>
  );
}