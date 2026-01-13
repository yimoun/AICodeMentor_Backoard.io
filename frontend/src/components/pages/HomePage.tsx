import React from 'react';
import { Box } from '@mui/material';
import Intro from '../sections/Intro';
import Features from '../sections/features/Features';
import Pricing from '../sections/pricing/Pricing';

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
