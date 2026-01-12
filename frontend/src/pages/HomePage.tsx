// frontend/src/pages/HomePage.tsx

import React from 'react';
import { Box } from '@mui/material';
import Intro from '../components/sections/Intro';
import Features from '../components/features/Features';
import Pricing from '../components/features/Pricing';

/**
 * Page d'accueil complète avec toutes les sections
 */
const HomePage: React.FC = () => {
  return (
    <Box>
      {/* Section Intro */}
      <Intro />
     
      {/* Section Features */}
      <Features id="features" />

      {/* Section Pricing */}
      <Pricing />

      {/* Section Pricing - à ajouter plus tard */}
      {/* <Pricing id="pricing" /> */}
    </Box>
  );
};

export default HomePage;
