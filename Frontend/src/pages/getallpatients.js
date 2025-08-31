import React, { useEffect, useState } from 'react';
import { Typography, Box, Paper, CircularProgress, Alert, TextField, Grid, Divider, List, ListItem, ListItemText, Collapse, IconButton, Card, CardContent, Avatar, Tooltip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import BackButton from '../components/BackButton';
import LogoutButton from '../components/LogoutButton';
import { getAllPatients } from '../api';
import PersonIcon from '@mui/icons-material/Person';

const AllPatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await getAllPatients({
          headers: { Authorization: `Bearer ${token}` }
        });
        setPatients(res.data);
      } catch (err) {
        setError('Failed to load patients');
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  // Filter patients by search
  const filteredPatients = patients.filter((patient) => {
    const searchLower = search.toLowerCase();
    return (
      (patient.firstName && patient.firstName.toLowerCase().includes(searchLower)) ||
      (patient.lastName && patient.lastName.toLowerCase().includes(searchLower)) ||
      (patient.userId && patient.userId.toString().includes(searchLower))
        );
  });

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #93d0fb 0%, #43cea2 100%)', py: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Paper elevation={12} sx={{ p: 2, borderRadius: 4, maxWidth: 1200, width: { xs: '98vw', sm: '95vw', md: '90vw', lg: '80vw' }, background: (theme) => theme.palette.background.paper, boxShadow: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2, width: '100%' }}>
          <BackButton />
          <Typography variant="h4" fontWeight={900} gutterBottom color="primary.main" sx={{ flex: 1, textAlign: 'center' }}>All Patients</Typography>
          <Box sx={{ width: 48 }} />
        </Box>
        <Divider sx={{ mb: 3 }} />
        <TextField
          label="Search patients by name or ID"
          variant="outlined"
          fullWidth
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ mb: 4, background: (theme) => theme.palette.background.default, borderRadius: 50 }}
          InputProps={{ style: { fontSize: 18, fontWeight: 500 } }}
        />
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <CircularProgress size={48} thickness={5} color="secondary" />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : filteredPatients.length === 0 ? (
          <Typography>No patients found.</Typography>
        ) : (
          <Grid container spacing={5} sx={{ width: '100%', margin: 0 }}>
            {filteredPatients.map((patient, idx) => {
              const isExpanded = expanded === (patient.userId || idx);
              return (
                <Grid item xs={12} sm={6} md={4} lg={4} key={patient.userId || idx} sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                  <Card
                    sx={{
                      borderRadius: 5,
                      boxShadow: 8,
                      background: '#fff', // Make the card background pure white
                      minHeight: 320,
                      width: '100%',
                      maxWidth: 420, // wider than before
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      overflow: 'visible',
                      border: 'none',
                      transition: 'transform 0.18s, box-shadow 0.18s',
                      '&:hover': {
                        transform: 'translateY(-6px) scale(1.03)',
                        boxShadow: 16,
                        background: '#fff', // Keep white on hover
                      },
                    }}
                  >
                    <CardContent sx={{ p: 0 }}>
                      {/* Card Header with Avatar */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, background: 'rgba(33,150,243,0.08)', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, boxShadow: 3, border: '3px solid #fff' }}>
                          <PersonIcon sx={{ fontSize: 32 }} />
                        </Avatar>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Tooltip title={patient.firstName + ' ' + patient.lastName} arrow>
                            <Typography variant="h6" fontWeight={700} color="primary.main" sx={{ whiteSpace: 'normal', wordBreak: 'break-word', fontSize: 20 }}>
                              {patient.firstName} {patient.lastName}
                            </Typography>
                          </Tooltip>
                          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>ID: {patient.userId}</Typography>
                        </Box>
                      </Box>
                      {/* Card Content */}
                      <Box sx={{ flex: 1, px: 3, pt: 2, pb: 1, overflow: 'visible', display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="body2" sx={{ mb: 0.5, wordBreak: 'break-word' }}><strong>Age:</strong> {patient.dateOfBirth ? new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear() : 'N/A'}</Typography>
                        <Typography variant="body2" sx={{ mb: 0.5, wordBreak: 'break-word' }}><strong>Gender:</strong> {patient.gender || 'N/A'}</Typography>
                        <Typography variant="body2" sx={{ mb: 0.5, wordBreak: 'break-word' }}><strong>Blood Type:</strong> {patient.bloodType || 'N/A'}</Typography>
                        <Typography variant="body2" sx={{ mb: 0.5, wordBreak: 'break-word' }}><strong>Insurance:</strong> {patient.insuranceProvider} ({patient.insurancePolicyNumber})</Typography>
                      </Box>
                      <Divider sx={{ my: 0 }} />
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 1, background: 'rgba(33,150,243,0.04)' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Medical History</Typography>
                        <IconButton size="small" sx={{ ml: 1 }} onClick={e => { e.stopPropagation(); setExpanded(isExpanded ? null : (patient.userId || idx)); }}>
                          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </Box>
                      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
                          <Box sx={{
                            maxHeight: 120,
                            overflowY: 'auto',
                            pr: 1,
                            background: 'rgba(33,150,243,0.03)',
                            borderRadius: 2,
                            mt: 1,
                            border: (theme) => `1px solid ${theme.palette.divider}`,
                            boxShadow: 2,
                            mx: 2,
                            mb: 2,
                            p: 1,
                          }}>
                            <List dense>
                              {patient.medicalHistory.map((mh) => (
                                <ListItem key={mh.id} alignItems="flex-start" sx={{ py: 0.5, alignItems: 'flex-start' }}>
                                  <ListItemText
                                    primary={<Typography variant="body2" sx={{ fontWeight: 500 }}>{mh.description}</Typography>}
                                    secondary={<Typography variant="caption" color="text.secondary">{new Date(mh.recordedAt).toLocaleString()}</Typography>}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary" sx={{ px: 3, pb: 2 }}>No medical history.</Typography>
                        )}
                      </Collapse>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Paper>
      <Box sx={{ position: 'absolute', top: 24, right: 32, zIndex: 1200 }}>
        <LogoutButton />
      </Box>
    </Box>
  );
};

export default AllPatientsPage;
