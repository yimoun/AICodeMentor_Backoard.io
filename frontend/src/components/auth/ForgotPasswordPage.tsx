
import React from 'react';
import  FPwdForm from './forms/FPwdForm';


const ForgotPasswordPage: React.FC = () => {
  return (
    <FPwdForm
      title="Continuez votre apprentissage !"
      subtitle="un lien de réinitialisation de mot de passe vous sera envoyé par email."
    />
  );
};

export default ForgotPasswordPage;