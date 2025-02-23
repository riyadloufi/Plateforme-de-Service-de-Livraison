import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setAds } from '../config/action';
import styles from './AdminPages.module.css';

export default function PublishedAds() {
  const ads = useSelector(state => state.ads);
  const dispatch = useDispatch();

  useEffect(() => {
    // Charger les annonces depuis localStorage
    const savedAds = JSON.parse(localStorage.getItem("ads")) || [];
    // Ne garder que les annonces approuvées
    const publishedAds = savedAds.filter(ad => ad.status === "approved");
    dispatch(setAds(publishedAds));
  }, [dispatch]);

  return (
    <div className={styles.pageContainer}>
      <h2>Annonces publiées</h2>
      <div className={styles.tableContainer}>
        {ads.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Utilisateur</th>
                <th>Titre</th>
                <th>Prix</th>
                <th>Image</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {ads.map(ad => (
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
                  <td>
                    <span className={styles.statusPublished}>
                      Publié
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={styles.noDataMessage}>
            Aucune annonce publiée pour le moment
          </p>
        )}
      </div>
    </div>
  );
} 