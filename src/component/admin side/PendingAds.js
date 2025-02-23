import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { approveAd, rejectAd, setPendingAds, setRejectedAds } from '../config/action';
import styles from './AdminPages.module.css';

export default function PendingAds() {
  const pendingAds = useSelector(state => state.pendingAds);
  const dispatch = useDispatch();
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedAdId, setSelectedAdId] = useState(null);

  useEffect(() => {
    const pendingAdsFromStorage = JSON.parse(localStorage.getItem("pendingAds")) || [];
    dispatch(setPendingAds(pendingAdsFromStorage));
  }, [dispatch]);

  const handleApprove = (adId) => {
    const pendingAdsFromStorage = JSON.parse(localStorage.getItem("pendingAds")) || [];
    const adToApprove = pendingAdsFromStorage.find(ad => ad.id === adId);
    
    if (adToApprove) {
      // Mettre à jour le statut et ajouter la date d'approbation
      const approvedAd = {
        ...adToApprove,
        status: "approved", // ou "published"
        approvedAt: new Date().toISOString()
      };
      
      // Mettre à jour les annonces approuvées dans localStorage
      const existingAds = JSON.parse(localStorage.getItem("ads")) || [];
      localStorage.setItem("ads", JSON.stringify([...existingAds, approvedAd]));
      
      // Retirer des annonces en attente
      const updatedPendingAds = pendingAdsFromStorage.filter(ad => ad.id !== adId);
      localStorage.setItem("pendingAds", JSON.stringify(updatedPendingAds));
      
      // Mettre à jour Redux
      dispatch(approveAd(adId));
      alert("Annonce approuvée avec succès !");
    }
  };

  const openRejectModal = (adId) => {
    setSelectedAdId(adId);
    setShowRejectModal(true);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert("Veuillez fournir une raison du refus");
      return;
    }

    const pendingAdsFromStorage = JSON.parse(localStorage.getItem("pendingAds")) || [];
    const adToReject = pendingAdsFromStorage.find(ad => ad.id === selectedAdId);
    
    if (adToReject) {
      const rejectedAd = {
        ...adToReject,
        status: "rejected",
        rejectedAt: new Date().toISOString(),
        rejectReason: rejectReason,
        notificationRead: false
      };

      // Ajouter aux annonces refusées
      const rejectedAds = JSON.parse(localStorage.getItem("rejectedAds")) || [];
      localStorage.setItem("rejectedAds", JSON.stringify([...rejectedAds, rejectedAd]));
      
      // Supprimer des annonces en attente
      const updatedPendingAds = pendingAdsFromStorage.filter(ad => ad.id !== selectedAdId);
      localStorage.setItem("pendingAds", JSON.stringify(updatedPendingAds));
      
      // Mettre à jour Redux
      dispatch(setPendingAds(updatedPendingAds));
      dispatch(setRejectedAds([...rejectedAds, rejectedAd]));
      
      // Réinitialiser le modal
      setRejectReason("");
      setShowRejectModal(false);
      setSelectedAdId(null);
      
      alert("Annonce refusée.");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <h2>Demandes d'annonces en attente</h2>
      {showRejectModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Raison du refus</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Expliquez pourquoi l'annonce est refusée..."
              className={styles.rejectReasonInput}
            />
            <div className={styles.modalButtons}>
              <button 
                className={styles.confirmButton}
                onClick={handleReject}
              >
                Confirmer
              </button>
              <button 
                className={styles.cancelButton}
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                  setSelectedAdId(null);
                }}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
      <div className={styles.tableContainer}>
        {pendingAds.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Utilisateur</th>
                <th>Titre</th>
                <th>Prix</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingAds.map(ad => (
                <tr key={ad.id}>
                  <td>{new Date(ad.createdAt).toLocaleDateString()}</td>
                  <td>{ad.userName}</td>
                  <td>{ad.title}</td>
                  <td>{ad.price} DH</td>
                  <td>
                    <img 
                      src={ad.image} 
                      alt={ad.title} 
                      className={styles.thumbnailImage}
                    />
                  </td>
                  <td className={styles.actions}>
                    <button 
                      onClick={() => handleApprove(ad.id)}
                      className={styles.approveButton}
                    >
                      Approuver
                    </button>
                    <button 
                      onClick={() => openRejectModal(ad.id)}
                      className={styles.rejectButton}
                    >
                      Refuser
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={styles.noDataMessage}>Aucune annonce en attente de validation</p>
        )}
      </div>
    </div>
  );
}