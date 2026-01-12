import React from 'react';
import  LoginForm  from './forms/LoginForm';


const LoginPage: React.FC = () => {
  return (
    <LoginForm
      title="Bon retour !"
      subtitle="Continuez votre apprentissage"
      redirectTo="/chat"
      showForgotPassword
      showSignupLink
      showBackLink
    />
  );
};

export default LoginPage;