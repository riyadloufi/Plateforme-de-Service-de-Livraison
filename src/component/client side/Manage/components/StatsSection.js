import React from 'react';
import styles from '../ManageAds.module.css';

export default function StatsSection({ stats }) {
  return (
    <div className={styles.statsSection}>
      <div className={styles.statCard}>
        <h3>Publiées</h3>
        <p className={styles.statNumber}>
          {stats.published}
        </p>
      </div>
      <div className={styles.statCard}>
        <h3>En attente</h3>
        <p className={styles.statNumber}>
          {stats.pending}
        </p>
      </div>
      <div className={styles.statCard}>
        <h3>Refusées</h3>
        <p className={styles.statNumber}>
          {stats.rejected}
        </p>
      </div>
      <div className={styles.statCard}>
        <h3>Réservations reçues</h3>
        <p className={styles.statNumber}>
          {stats.reservations}
        </p>
      </div>
    </div>
  );
} 