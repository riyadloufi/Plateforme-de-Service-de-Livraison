import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import AdForm from './components/AdForm';
import AdCard from './components/AdCard';
import StatsSection from './components/StatsSection';
import { setAds, setPendingAds, setRejectedAds, updateDelivery, setDeliveries } from '../../config/action';
import styles from './ManageAds.module.css';
import "leaflet/dist/leaflet.css";
import { Table, Button, Modal, Form } from 'react-bootstrap';

// Correction pour les icônes de marqueur
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Composant pour gérer les clics sur la carte
function LocationMarker({ setLocation }) {
  useMapEvents({
    click: (e) => setLocation(e.latlng),
  });
  return null;
}

export default function ManageAds() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const ads = useSelector((state) => state.ads) || [];
  const pendingAds = useSelector(state => state.pendingAds) || [];
  const rejectedAds = useSelector(state => state.rejectedAds) || [];
  const deliveries = useSelector(state => state.deliveries);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", price: "", image: null, location: null });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [editingAdId, setEditingAdId] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: "", description: "", price: "", image: null });
  const [userAds, setUserAds] = useState([]);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [message, setMessage] = useState('');

  const stats = {
    published: ads.filter(ad => ad.userId === user?.email && (ad.status === "approved" || ad.status === "published")).length,
    pending: pendingAds.filter(ad => ad.userId === user?.email).length,
    rejected: rejectedAds.filter(ad => ad.userId === user?.email).length,
    reservations: (() => {
      const deliveries = JSON.parse(localStorage.getItem("deliveries")) || [];
      return deliveries.filter(delivery => userAds.some(ad => ad.id === delivery.adId)).length;
    })()
  };

  const loadData = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    const savedAds = JSON.parse(localStorage.getItem("ads")) || [];
    const savedPendingAds = JSON.parse(localStorage.getItem("pendingAds")) || [];
    const savedRejectedAds = JSON.parse(localStorage.getItem("rejectedAds")) || [];
    const savedDeliveries = JSON.parse(localStorage.getItem("deliveries")) || [];

    const filterAndMapAds = (ads, status) => ads.filter(ad => ad.userId === user.email).map(ad => ({ ...ad, status }));

    const publishedWithStatus = filterAndMapAds(savedAds, "published");
    const pendingWithStatus = filterAndMapAds(savedPendingAds, "pending");
    const rejectedWithStatus = filterAndMapAds(savedRejectedAds, "rejected");

    dispatch(setAds(publishedWithStatus));
    dispatch(setPendingAds(pendingWithStatus));
    dispatch(setRejectedAds(rejectedWithStatus));
    dispatch(setDeliveries(savedDeliveries));

    setUserAds([...publishedWithStatus, ...pendingWithStatus, ...rejectedWithStatus]);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    loadData();
  }, [editingAdId]);

  const userAdsFiltered = user ? [
    ...ads.filter(ad => ad.userId === user.email).map(ad => ({ ...ad, status: ad.status || 'published' })),
    ...pendingAds.filter(ad => ad.userId === user.email).map(ad => ({ ...ad, status: 'pending' })),
    ...rejectedAds.filter(ad => ad.userId === user.email).map(ad => ({ ...ad, status: 'rejected' }))
  ] : [];

  const getStatusText = (status) => ({
    'published': 'Publiée',
    'pending': 'En attente de validation',
    'rejected': 'Refusée'
  }[status] || status);

  const getStatusClass = (status) => ({
    'published': styles.statusPublished,
    'pending': styles.statusPending,
    'rejected': styles.statusRejected
  }[status] || '');

  const handleSubmit = (formData, selectedLocation) => {
    const newAd = {
      id: Date.now(),
      ...formData,
      location: selectedLocation,
      userId: user.email,
      userName: user.email.split('@')[0],
      createdAt: new Date().toISOString(),
      status: "pending"
    };

    const pendingAds = JSON.parse(localStorage.getItem("pendingAds")) || [];
    localStorage.setItem("pendingAds", JSON.stringify([...pendingAds, newAd]));
    dispatch(setPendingAds([...pendingAds, newAd]));
    setShowForm(false);
  };

  const handleDelete = async (ad) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) {
      const storageKey = ad.status === "published" ? "ads" : ad.status === "pending" ? "pendingAds" : "rejectedAds";
      const items = JSON.parse(localStorage.getItem(storageKey)) || [];
      const updatedItems = items.filter(item => item.id !== ad.id);
      localStorage.setItem(storageKey, JSON.stringify(updatedItems));
      dispatch(ad.status === "published" ? setAds(updatedItems) : ad.status === "pending" ? setPendingAds(updatedItems) : setRejectedAds(updatedItems));
      setUserAds(prevAds => prevAds.filter(prevAd => prevAd.id !== ad.id));
      loadData();
      alert("Annonce supprimée avec succès !");
    }
  };

  const handleEdit = (ad) => {
    setEditingAdId(ad.id);
    setEditFormData({ title: ad.title, description: ad.description, price: ad.price, image: ad.image });
  };

  const handleCancelEdit = () => {
    setEditingAdId(null);
    setEditFormData({ title: "", description: "", price: "", image: null });
  };

  const handleSaveEdit = async (ad) => {
    const updatedAd = { ...ad, ...editFormData, modifiedAt: new Date().toISOString() };
    const storageKey = ad.status === 'published' ? 'ads' : ad.status === 'pending' ? 'pendingAds' : 'rejectedAds';
    const items = JSON.parse(localStorage.getItem(storageKey)) || [];
    const updatedItems = items.map(item => item.id === ad.id ? updatedAd : item);
    localStorage.setItem(storageKey, JSON.stringify(updatedItems));
    dispatch(ad.status === 'published' ? setAds(updatedItems) : ad.status === 'pending' ? setPendingAds(updatedItems) : setRejectedAds(updatedItems));
    loadData();
    setEditingAdId(null);
  };

  const handleAccept = () => {
    const updatedDelivery = {
      ...selectedDelivery,
      status: 'accepted',
      deliveryDate,
      message
    };
    dispatch(updateDelivery(updatedDelivery));
    setShowAcceptModal(false);
    setSelectedDelivery(null);
    setDeliveryDate('');
    setMessage('');
    loadData();
  };

  const handleReject = () => {
    const updatedDelivery = {
      ...selectedDelivery,
      status: 'rejected',
      message
    };
    dispatch(updateDelivery(updatedDelivery));
    setShowRejectModal(false);
    setSelectedDelivery(null);
    setMessage('');
    loadData();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Gérer vos annonces</h1>
        <button className={styles.createButton} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Annuler' : 'Créer une annonce'}
        </button>
      </div>

      {showForm && (
        <AdForm onSubmit={handleSubmit} showForm={showForm} setShowForm={setShowForm} />
      )}

      <StatsSection stats={stats} />

      <div className={styles.adsGrid}>
        {userAdsFiltered.map(ad => (
          <AdCard
            key={ad.id}
            ad={ad}
            editingAdId={editingAdId}
            editFormData={editFormData}
            setEditFormData={setEditFormData}
            onEdit={handleEdit}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <div className="reservations-section mt-4">
        <h3>Demandes de réservation</h3>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Annonce</th>
              <th>Prix</th>
              <th>Demandeur</th>
              <th>Email</th>
              <th>Date de demande</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {deliveries && deliveries.filter(delivery => delivery.ownerId === user?.email).map((delivery) => (
              <tr key={delivery.id}>
                <td>
                  <div className="d-flex align-items-center">
                    <img 
                      src={delivery.adImage} 
                      alt={delivery.adTitle}
                      style={{ width: '50px', marginRight: '10px' }}
                    />
                    {delivery.adTitle}
                  </div>
                </td>
                <td>{delivery.adPrice} DH</td>
                <td>{delivery.userName || 'utilisatuer'}</td>
                <td>{delivery.userEmail}</td>
                <td>{new Date(delivery.createdAt).toLocaleDateString()}</td>
                <td>
                  <span className={`status-${delivery.status}`}>
                    {delivery.status === 'pending' ? 'En attente' :
                     delivery.status === 'accepted' ? 'Acceptée' :
                     delivery.status === 'rejected' ? 'Refusée' : 
                     delivery.status}
                  </span>
                </td>
                <td>
                  {delivery.status === 'pending' && (
                    <>
                      <Button 
                        variant="success" 
                        className="me-2"
                        onClick={() => {
                          setSelectedDelivery(delivery);
                          setShowAcceptModal(true);
                        }}
                      >
                        Accepter
                      </Button>
                      <Button 
                        variant="danger"
                        onClick={() => {
                          setSelectedDelivery(delivery);
                          setShowRejectModal(true);
                        }}
                      >
                        Refuser
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {(!deliveries || deliveries.filter(delivery => delivery.ownerId === user?.email).length === 0) && (
              <tr>
                <td colSpan="7" className="text-center">
                  Aucune demande de réservation
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Modal d'acceptation */}
      <Modal show={showAcceptModal} onHide={() => setShowAcceptModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Accepter la réservation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Date de livraison</Form.Label>
              <Form.Control
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Message pour l'acheteur</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Informations sur la livraison..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAcceptModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleAccept}>
            Confirmer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de refus */}
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Refuser la réservation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Raison du refus</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Expliquez la raison du refus..."
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleReject}>
            Confirmer le refus
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}