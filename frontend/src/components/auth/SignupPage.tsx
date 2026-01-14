import React from 'react';
import SignupForm  from '../../components/auth/forms/SignupForm';


const SignupPage: React.FC = () => {
  return (
    <SignupForm
      title="Créez votre compte"
      subtitle="Commencez votre apprentissage gratuitement"
      redirectAfterVerification="/onboarding"
      showLoginLink
      showBackLink
    />
  );
};

export default SignupPage;