import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Grid, Card, CardContent, 
  CircularProgress, Box, Chip, Avatar, LinearProgress,
  Tabs, Tab, Divider, IconButton, Tooltip
} from '@mui/material';
import { 
  Assignment, MenuBook, Notes, Schedule, 
  TrendingUp, Refresh, MoreVert 
} from '@mui/icons-material';
import apiService from '../services/apiService';
import { useTheme } from '@mui/material/styles';

const DashboardPage = () => {
  const theme = useTheme();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const data = await apiService.getDashboardMetrics();
      setMetrics(data);
    } catch (err) {
      console.error(err);
      setError('Error loading metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleRefresh = () => {
    fetchMetrics();
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading && !metrics) {
    return (
      <Container sx={{ 
        height: '80vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        <Box textAlign="center">
          <CircularProgress size={60} thickness={4} color="primary" />
          <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary' }}>
            Loading Dashboard Data...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Card variant="outlined" sx={{ borderColor: 'error.main' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'error.main' }}>
              <Assignment />
            </Avatar>
            <Typography variant="h6" color="error">
              {error}
            </Typography>
            <IconButton onClick={fetchMetrics} sx={{ ml: 'auto' }}>
              <Refresh />
            </IconButton>
          </CardContent>
        </Card>
      </Container>
    );
  }



  return (
    <Container maxWidth="xl" sx={{ py: 4, bgcolor: 'background.default' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TrendingUp sx={{ 
            fontSize: '2.5rem', 
            color: 'primary.main',
            bgcolor: 'primary.light + 22',
            p: 1.5,
            borderRadius: 3
          }} />
          <Typography variant="h4" sx={{ 
            fontWeight: 700,
            color: 'text.primary',
            letterSpacing: '-0.5px'
          }}>
            Dashboard Overview
          </Typography>
        </Box>
        <Chip 
          label="Last updated: Just now"
          icon={<Refresh fontSize="small" />}
          onClick={handleRefresh}
          variant="outlined"
          sx={{
            borderColor: 'divider',
            '&:hover': { bgcolor: 'action.hover' }
          }}
        />
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={10} sx={{ mb: 4 }}>
        {[
          { 
            icon: <Assignment fontSize="large" />, 
            title: 'Total Tests', 
            value: metrics.testCount,
            progress: 75,
            trend: 'up'
          },
          { 
            icon: <MenuBook fontSize="large" />, 
            title: 'Textbooks', 
            value: metrics.textbookCount,
            progress: 60,
            trend: 'steady'
          },
          { 
            icon: <Notes fontSize="large" />, 
            title: 'Study Notes', 
            value: metrics.noteCount,
            progress: 85,
            trend: 'up'
          },
        ].map((metric, index) => (
          <Grid item xs={20} sm={6} md={4} lg={4} key={index}>
            <Card sx={{ 
              height: '100%',
              width: '120%',
              p: 4,
              
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: 3,
                boxShadow: theme.shadows[3],

              bgcolor: 'background.paper',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              border: `1px solid ${theme.palette.divider}`,
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: theme.shadows[6]
              }
            }}>
              <CardContent sx={{ pb: 0 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2
                }}>
                  <Box sx={{ 
                    p: 1.5,
                    bgcolor: 'primary.light + 22',
                    borderRadius: 2,
                    color: 'primary.main'
                  }}>
                    {metric.icon}
                  </Box>
                  <Tooltip title="More options">
                    <IconButton size="small" sx={{ color: 'text.secondary' }}>
                      <MoreVert />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Typography variant="h6" sx={{ 
                  color: 'text.secondary',
                  mb: 1
                }}>
                  {metric.title}
                </Typography>
                <Typography variant="h3" sx={{ 
                  color: 'text.primary',
                  fontWeight: 800,
                  mb: 2
                }}>
                  {metric.value}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: '100%' }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={metric.progress} 
                      color={metric.trend === 'up' ? 'primary' : 'secondary'}
                      sx={{ 
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'action.selected'
                      }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ 
                    fontWeight: 500,
                    color: metric.trend === 'up' ? 'success.main' : 'text.secondary'
                  }}>
                    {metric.progress}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabs Section */}
      <Card sx={{ 
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 3,
        overflow: 'hidden'
      }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{ 
            bgcolor: 'background.paper',
            borderBottom: `1px solid ${theme.palette.divider}`
          }}
        >
          <Tab 
            label="Recent Tests" 
            icon={<Schedule />} 
            iconPosition="start"
            sx={{ minHeight: 60 }}
          />
          <Tab 
            label="Popular Resources" 
            icon={<TrendingUp />} 
            iconPosition="start"
            sx={{ minHeight: 60 }}
          />
          <Tab 
            label="Activity Log" 
            icon={<Assignment />} 
            iconPosition="start"
            sx={{ minHeight: 60 }}
          />
        </Tabs>

        {/* Recent Tests Tab */}
        {activeTab === 0 && (
          <Box>
            {metrics.recentTests.length > 0 ? (
              metrics.recentTests.map((test, index) => (
                <Box key={test._id}>
                  <Box sx={{ 
                    display: 'flex', 
                    p: 3,
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}>
                    <Avatar sx={{ 
                      bgcolor: 'primary.main', 
                      mr: 2,
                      width: 40, 
                      height: 40,
                      fontWeight: 600,
                      color: 'primary.contrastText'
                    }}>
                      {index + 1}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600,
                        color: 'text.primary'
                      }}>
                        {test.title}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: 'text.secondary',
                        mt: 0.5
                      }}>
                        {test.description || 'No description available'}
                      </Typography>
                      <Box sx={{ display: 'flex', mt: 1.5, gap: 1 }}>
                        <Chip 
                          label={test.category || 'General'} 
                          size="small" 
                          variant="outlined"
                          sx={{ 
                            borderColor: 'divider',
                            color: 'text.secondary'
                          }}
                        />
                        <Chip 
                          label={`${test.questionCount} questions`} 
                          size="small"
                          sx={{ 
                            bgcolor: 'success.light + 22',
                            color: 'success.main'
                          }}
                        />
                      </Box>
                    </Box>
                    <Tooltip title="More actions">
                      <IconButton sx={{ color: 'text.secondary' }}>
                        <MoreVert />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  {index < metrics.recentTests.length - 1 && (
                    <Divider sx={{ borderColor: 'divider' }} />
                  )}
                </Box>
              ))
            ) : (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body1" sx={{ color: 'text.disabled' }}>
                  No recent tests found
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Other Tabs */}
        {activeTab !== 0 && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              {activeTab === 1 
                ? 'Popular resources content coming soon' 
                : 'Activity log content coming soon'}
            </Typography>
          </Box>
        )}
      </Card>
    </Container>
  );
};

export default DashboardPage;