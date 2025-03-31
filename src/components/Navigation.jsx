import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import NotesIcon from '@mui/icons-material/Notes';

const Navigation = () => {
  return (
    <AppBar 
      position="static"
      elevation={0}
      sx={{ 
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper'
      }}
    >
      <Toolbar sx={{ gap: 2 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            flexGrow: 1, 
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <MenuBookIcon fontSize="medium" />
          Admin Portal
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {[
            { to: '/dashboard', text: 'Dashboard', icon: <DashboardIcon /> },
            { to: '/tests', text: 'Tests', icon: <AssignmentIcon /> },
            { to: '/textbooks', text: 'Textbooks', icon: <MenuBookIcon /> },
            { to: '/notes', text: 'Notes', icon: <NotesIcon /> }
          ].map((item) => (
            <Button
              key={item.to}
              component={Link}
              to={item.to}
              color="inherit"
              startIcon={item.icon}
              sx={{
                '&:hover': {
                  bgcolor: 'primary.main',
                  transition: 'background-color 0.2s ease'
                }
              }}
            >
              {item.text}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;