import React, { useEffect } from 'react';

const backgroundImage = process.env.PUBLIC_URL + '/Backgroungs/pexels-rdne-7363199.jpg';

export default function BackgroundProvider({ children }) {
  useEffect(() => {
    // Appliquer le background
    document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${backgroundImage})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.minHeight = '100vh';

    // Nettoyer le background au démontage
    return () => {
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundPosition = '';
      document.body.style.backgroundRepeat = '';
      document.body.style.minHeight = '';
    };
  }, []);

  return children;
} 