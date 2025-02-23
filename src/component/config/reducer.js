const initialState = {
  isAuthenticated: false,
  user: null,
  users: [],
  ads: [],
  pendingAds: [],
  rejectedAds: [],
  deliveries: JSON.parse(localStorage.getItem('deliveries')) || [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'LOG_IN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    case 'LOG_OUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    case 'SET_ADS':
      return {
        ...state,
        ads: action.payload,
      };
    case 'SET_PENDING_ADS':
      return {
        ...state,
        pendingAds: action.payload,
      };
    case 'SET_REJECTED_ADS':
      return {
        ...state,
        rejectedAds: action.payload,
      };
    case 'SET_USERS':
      return {
        ...state,
        users: action.payload
      };
    case 'REGISTER_USER':
      return {
        ...state,
        users: [...state.users, action.payload]
      };
    case 'ADMIN_LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        isAdmin: true,
        user: action.payload,
        adminData: action.payload
      };
    case 'SET_DELIVERIES':
      return {
        ...state,
        deliveries: action.payload
      };
    case 'ADD_DELIVERY':
      try {
        const newDeliveries = [...state.deliveries, action.payload];
        // Essayer de sauvegarder dans localStorage
        try {
          localStorage.setItem('deliveries', JSON.stringify(newDeliveries));
        } catch (error) {
          console.warn("Erreur localStorage, nettoyage et nouvel essai");
          localStorage.clear();
          localStorage.setItem('deliveries', JSON.stringify(newDeliveries));
        }
        return {
          ...state,
          deliveries: newDeliveries
        };
      } catch (error) {
        console.error("Erreur lors de l'ajout de la livraison:", error);
        return state;
      }
    case 'UPDATE_DELIVERY':
      const updatedDeliveries = state.deliveries.map(delivery => 
        delivery.id === action.payload.id ? action.payload : delivery
      );
      localStorage.setItem('deliveries', JSON.stringify(updatedDeliveries));
      return {
        ...state,
        deliveries: updatedDeliveries
      };
    default:
      return state;
  }
} 