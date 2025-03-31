// src/components/MainLayout.jsx
import React from 'react';
import Navigation from './Navigation';
import { Container } from '@mui/material';
import { Outlet } from 'react-router-dom'; // Add this import

const MainLayout = () => { // Remove children prop
  return (
    <>
      <Navigation />
      <Container sx={{ mt: 4 }}>
        <Outlet /> {/* Replace {children} with Outlet */}
      </Container>
    </>
  );
};

export default MainLayout;