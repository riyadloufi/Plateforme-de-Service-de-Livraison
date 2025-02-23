import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import styles from '../ManageAds.module.css';

// Composant pour gérer les clics sur la carte
function LocationMarker({ setLocation }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      setLocation({ lat, lng });
    },
  });
  return null;
}

export default function AdForm({ onSubmit, showForm, setShowForm }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    image: null,
    location: null
  });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, selectedLocation);
    setFormData({
      title: "",
      description: "",
      price: "",
      image: null,
      location: null
    });
    setImagePreview(null);
    setSelectedLocation(null);
    setShowForm(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: reader.result
        });
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label>Titre</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>Prix (DH)</label>
        <input
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({...formData, price: e.target.value})}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className={styles.fileInput}
          required
        />
        {imagePreview && (
          <img 
            src={imagePreview} 
            alt="Prévisualisation" 
            className={styles.imagePreview}
          />
        )}
      </div>

      <div className={styles.formGroup}>
        <label>Localisation (cliquez sur la carte)</label>
        <div className={styles.mapContainer}>
          <MapContainer
            center={[34.0209, -6.8416]}
            zoom={12}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationMarker setLocation={setSelectedLocation} />
            {selectedLocation && (
              <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
            )}
          </MapContainer>
        </div>
      </div>

      <button type="submit" className={styles.submitButton}>
        Publier l'annonce
      </button>
    </form>
  );
} 