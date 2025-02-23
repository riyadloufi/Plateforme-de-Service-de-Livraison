import React from 'react';
import styles from '../ManageAds.module.css';

const STATUS_MAPPING = {
  published: { text: 'Publiée', class: styles.statusPublished },
  pending: { text: 'En attente de validation', class: styles.statusPending },
  rejected: { text: 'Refusée', class: styles.statusRejected },
  approved: { text: 'Approuvée', class: styles.statusApproved }
};

const EditForm = ({ editFormData, setEditFormData, onSave, onCancel, ad }) => {
  const handleSave = () => {
    onSave(ad);
  };

  return (
    <div className={styles.editForm}>
      {[
        { label: 'Titre', type: 'text', field: 'title' },
        { label: 'Description', type: 'textarea', field: 'description' },
        { label: 'Prix (€)', type: 'number', field: 'price' }
      ].map(({ label, type, field }) => (
        <div key={field} className={styles.formGroup}>
          <label>{label}</label>
          {type === 'textarea' ? (
            <textarea
              value={editFormData[field]}
              onChange={e => setEditFormData({ ...editFormData, [field]: e.target.value })}
            />
          ) : (
            <input
              type={type}
              value={editFormData[field]}
              onChange={e => setEditFormData({ ...editFormData, [field]: e.target.value })}
            />
          )}
        </div>
      ))}
      <div className={styles.editButtons}>
        <button className={styles.saveButton} onClick={handleSave}>Enregistrer</button>
        <button className={styles.cancelButton} onClick={onCancel}>Annuler</button>
      </div>
    </div>
  );
};

export default function AdCard({ 
  ad, 
  editingAdId, 
  editFormData, 
  setEditFormData,
  onEdit,
  onSave,
  onCancel,
  onDelete
}) {
  const getReservationsCount = (adId) => {
    const deliveries = JSON.parse(localStorage.getItem("deliveries")) || [];
    return deliveries.filter(delivery => delivery.adId === adId).length;
  };

  if (editingAdId === ad.id) {
    return <EditForm {...{ editFormData, setEditFormData, onSave, onCancel, ad }} />;
  }

  const status = STATUS_MAPPING[ad.status] || { text: ad.status, class: '' };
  const reservationsCount = getReservationsCount(ad.id);

  return (
    <div className={styles.adCard}>
      <img src={ad.image} alt={ad.title} className={styles.adImage} />
      <div className={styles.adContent}>
        <h2>{ad.title}</h2>
        <p className={styles.price}>{ad.price} DH</p>
        <p className={styles.description}>{ad.description}</p>
        <p className={styles.date}>
          Créée le : {new Date(ad.createdAt).toLocaleDateString()}
        </p>
        <div className={styles.statsRow}>
          <div className={`${styles.status} ${status.class}`}>
            {status.text}
          </div>
          <div className={styles.reservationsCount}>
            <i className="fas fa-shopping-cart"></i>
            {reservationsCount} réservation{reservationsCount !== 1 ? 's' : ''}
          </div>
        </div>
        {ad.status === 'rejected' && (
          <div className={styles.rejectionDetails}>
            <p className={styles.rejectedDate}>
              Refusée le : {new Date(ad.rejectedAt).toLocaleDateString()}
            </p>
            <p className={styles.rejectReason}>Raison : {ad.rejectReason}</p>
          </div>
        )}
        <div className={styles.cardButtons}>
          <button className={styles.modifyButton} onClick={() => onEdit(ad)}>
            Modifier
          </button>
          <button className={styles.deleteButton} onClick={() => onDelete(ad)}>
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
} 