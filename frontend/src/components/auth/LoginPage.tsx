import React from 'react';
import  LoginForm  from './forms/LoginForm';


const LoginPage: React.FC = () => {
  return (
    // <LoginForm />
    <LoginForm showDebug={false} />
  );
};

export default LoginPage;