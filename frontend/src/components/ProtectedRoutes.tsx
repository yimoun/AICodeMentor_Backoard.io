import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

/**
 * Hook pour vérifier l'authentification
 * TODO: Remplacer par ton vrai hook d'auth
 */
const useAuth = () => {
  // TODO: Implémenter la vraie logique d'auth
  // Exemple avec localStorage (à remplacer par ton système)
  const token = localStorage.getItem('authToken');
  
  return {
    isAuthenticated: !!token,
    // isAuthenticated: true, // Pour tester sans auth
  };
};

/**
 * Composant qui protège les routes enfants
 * Redirige vers /login si non authentifié
 */
const ProtectedRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirige vers login en sauvegardant l'URL d'origine
    // Pour pouvoir y retourner après connexion
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si authentifié, afficher les routes enfants
  return <Outlet />;
};

export default ProtectedRoutes;