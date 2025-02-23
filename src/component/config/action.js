export const SIGN_UP = "SIGN_UP";
export const LOG_IN = "LOG_IN";
export const LOG_OUT = "LOG_OUT";
export const ADD_AD = "ADD_AD";
export const SET_ADS = "SET_ADS";
export const DELETE_AD = "DELETE_AD";
export const UPDATE_AD = "UPDATE_AD";
export const ADD_DELIVERY = "ADD_DELIVERY";
export const SET_DELIVERIES = "SET_DELIVERIES";
export const CANCEL_DELIVERY = "CANCEL_DELIVERY";
export const ADMIN_LOGIN = "ADMIN_LOGIN";
export const ADMIN_LOGOUT = "ADMIN_LOGOUT";
export const SUBMIT_AD_FOR_REVIEW = "SUBMIT_AD_FOR_REVIEW";
export const APPROVE_AD = "APPROVE_AD";
export const REJECT_AD = "REJECT_AD";
export const SET_PENDING_ADS = "SET_PENDING_ADS";
export const SET_REJECTED_ADS = "SET_REJECTED_ADS";
export const SET_RESERVATIONS = "SET_RESERVATIONS";
export const REGISTER_USER = "REGISTER_USER";
export const SET_USERS = "SET_USERS";
export const UPDATE_DELIVERY = "UPDATE_DELIVERY";

// Action creators
export const registerUser = (userData) => ({
  type: REGISTER_USER,
  payload: userData
});

export const setUsers = (users) => ({
  type: SET_USERS,
  payload: users
});

export const signUp = (userData) => (dispatch) => {
  // Récupérer les utilisateurs existants
  const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
  
  // Ajouter le nouvel utilisateur
  const updatedUsers = [...existingUsers, userData];
  
  // Sauvegarder dans localStorage
  localStorage.setItem('users', JSON.stringify(updatedUsers));
  
  // Mettre à jour Redux
  dispatch(setUsers(updatedUsers));
  dispatch({
    type: SIGN_UP,
    payload: userData
  });
};

export const logIn = (credentials) => (dispatch) => {
  // Récupérer les utilisateurs
  const users = JSON.parse(localStorage.getItem('users')) || [];
  
  // Trouver l'utilisateur
  const user = users.find(u => 
    u.email === credentials.email && 
    u.password === credentials.password
  );
  
  if (user) {
    dispatch({
      type: LOG_IN,
      payload: user
    });
    return true;
  }
  return false;
};

export const logOut = () => ({
  type: LOG_OUT
});

export const addAd = (adData) => ({
  type: ADD_AD,
  payload: adData
});

export const setAds = (ads) => ({
  type: SET_ADS,
  payload: ads
});

export const deleteAd = (adId) => ({
  type: DELETE_AD,
  payload: adId
});

export const updateAd = (ad) => ({
  type: UPDATE_AD,
  payload: ad
});

export const addDelivery = (delivery) => ({
  type: ADD_DELIVERY,
  payload: delivery
});

export const setDeliveries = (deliveries) => ({
  type: SET_DELIVERIES,
  payload: deliveries
});

export const cancelDelivery = (deliveryId) => ({
  type: CANCEL_DELIVERY,
  payload: deliveryId
});

export const adminLogin = (adminData) => ({
  type: ADMIN_LOGIN,
  payload: adminData
});

export const adminLogout = () => ({
  type: ADMIN_LOGOUT
});

export const submitAdForReview = (ad) => ({
  type: SUBMIT_AD_FOR_REVIEW,
  payload: ad
});

export const approveAd = (adId) => ({
  type: APPROVE_AD,
  payload: {
    approvedAd: adId,
    adId: adId
  }
});

export const approveAdAsync = (ad) => async (dispatch) => {
  try {
    const response = await fetch(`/api/ads/approve/${ad.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      dispatch(approveAd(ad));
    }
  } catch (error) {
    console.error('Error approving ad:', error);
  }
};

export const rejectAd = (adId) => ({
  type: REJECT_AD,
  payload: adId
});

export const setPendingAds = (pendingAds) => ({
  type: SET_PENDING_ADS,
  payload: pendingAds
});

export const setRejectedAds = (ads) => ({
  type: SET_REJECTED_ADS,
  payload: ads
});

export const setReservations = (reservations) => ({
  type: SET_RESERVATIONS,
  payload: reservations
});

export const updateDelivery = (delivery) => ({
  type: UPDATE_DELIVERY,
  payload: delivery
}); 