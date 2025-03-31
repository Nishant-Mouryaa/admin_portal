import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  IconButton,
  Box,
  LinearProgress,
  Avatar,
  Tooltip
} from '@mui/material';
import { Add, Edit, Delete, Book, CloudUpload, Search } from '@mui/icons-material';
import apiService from '../services/apiService';
import { useTheme } from '@mui/material/styles';

const TextbookManagementPage = () => {
  const theme = useTheme();
  const [textbooks, setTextbooks] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTextbook, setCurrentTextbook] = useState({
    title: '',
    author: '',
    subject: '',
    gradeLevel: '',
    file: null
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const loadTextbooks = async () => {
    try {
      const data = await apiService.getTextbooks();
      setTextbooks(data);
    } catch (error) {
      console.error('Error fetching textbooks:', error);
    }
  };

  useEffect(() => {
    loadTextbooks();
  }, []);

  const handleOpenDialog = (textbook = null) => {
    if (textbook) {
      setCurrentTextbook({
        id: textbook._id,
        title: textbook.title,
        author: textbook.author,
        subject: textbook.subject,
        gradeLevel: textbook.gradeLevel,
        file: null
      });
    } else {
      setCurrentTextbook({
        title: '',
        author: '',
        subject: '',
        gradeLevel: '',
        file: null
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setUploadProgress(0);
    setIsUploading(false);
  };

  const handleFileChange = (e) => {
    setCurrentTextbook({...currentTextbook, file: e.target.files[0]});
  };
  const handleSave = async () => {
    if (!currentTextbook.file && !currentTextbook.id) {
      alert('Please select a file to upload');
      return;
    }
  
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', currentTextbook.title);
      formData.append('author', currentTextbook.author);
      formData.append('subject', currentTextbook.subject);
      formData.append('gradeLevel', currentTextbook.gradeLevel);
      // Use key "pdf" to match backend Multer configuration
      if (currentTextbook.file) {
        formData.append('pdf', currentTextbook.file);
      }
  
      if (currentTextbook.id) {
        await apiService.updateTextbook(currentTextbook.id, formData, {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        });
      } else {
        await apiService.createTextbook(formData, {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        });
      }
      handleCloseDialog();
      loadTextbooks();
    } catch (error) {
      console.error('Save error:', error);
      setIsUploading(false);
    }
  };
  

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this textbook?')) return;
    try {
      await apiService.deleteTextbook(id);
      loadTextbooks();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const filteredTextbooks = textbooks.filter(textbook =>
    textbook.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    textbook.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    textbook.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );
    

  return (
    <Container maxWidth="xl" sx={{ mt: 4, pb: 4, bgcolor: 'background.default' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        gap: 2
      }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          color: 'text.primary'
        }}>
          <Book sx={{ 
            mr: 1.5,
            fontSize: '2rem',
            color: 'primary.main' 
          }} />
          Textbook Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{
            textTransform: 'none',
            px: 3,
            py: 1,
            borderRadius: 2,
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
            '&:hover': {
              boxShadow: theme.shadows[4],
              transform: 'translateY(-1px)'
            },
            transition: 'all 0.2s ease'
          }}
        >
          Add Textbook
        </Button>
      </Box>

      <Paper elevation={0} sx={{ 
        mb: 3,
        bgcolor: 'background.paper',
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`
      }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search textbooks..."
          InputProps={{
            startAdornment: <Search sx={{ 
              color: 'text.secondary', 
              mr: 1.5 
            }} />,
            sx: {
              borderRadius: 3,
              '&:hover fieldset': { 
                borderColor: 'primary.light !important' 
              }
            }
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main'
              }
            }
          }}
        />
      </Paper>

      <TableContainer component={Paper} elevation={0} sx={{ 
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 3
      }}>
        <Table>
          <TableHead sx={{ 
            bgcolor: 'background.default',
            borderBottom: `2px solid ${theme.palette.divider}`
          }}>
            <TableRow>
              {['Cover', 'Title', 'Author', 'Subject', 'Grade Level', 'Actions'].map((header) => (
                <TableCell key={header} sx={{ 
                  py: 2,
                  fontWeight: 600,
                  color: 'text.primary'
                }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTextbooks.map((textbook) => (
              <TableRow 
                key={textbook._id} 
                hover 
                sx={{ 
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <TableCell>
                  <Avatar 
                    variant="rounded"
                    src={textbook.coverUrl || '/default-textbook.png'}
                    sx={{ 
                      width: 60, 
                      height: 75,
                      bgcolor: 'background.paper',
                      borderRadius: 2
                    }}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 500, color: 'text.primary' }}>
                  {textbook.title}
                </TableCell>
                <TableCell>{textbook.author}</TableCell>
                <TableCell>{textbook.subject}</TableCell>
                <TableCell>{textbook.gradeLevel}</TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton 
                      onClick={() => handleOpenDialog(textbook)}
                      sx={{
                        '&:hover': {
                          color: 'primary.main',
                          bgcolor: 'primary.light + 22'
                        }
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton 
                      onClick={() => handleDelete(textbook._id)}
                      sx={{
                        ml: 1,
                        '&:hover': {
                          color: 'error.main',
                          bgcolor: 'error.light + 22'
                        }
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        fullWidth 
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: 'background.paper'
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: 'background.default',
          borderBottom: `1px solid ${theme.palette.divider}`,
          py: 2
        }}>
          {currentTextbook.id ? 'Edit Textbook' : 'Upload New Textbook'}
        </DialogTitle>
        <DialogContent dividers sx={{ py: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Title"
                fullWidth
                variant="outlined"
                value={currentTextbook.title}
                onChange={(e) => setCurrentTextbook({...currentTextbook, title: e.target.value})}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Author"
                fullWidth
                variant="outlined"
                value={currentTextbook.author}
                onChange={(e) => setCurrentTextbook({...currentTextbook, author: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Subject"
                fullWidth
                variant="outlined"
                value={currentTextbook.subject}
                onChange={(e) => setCurrentTextbook({...currentTextbook, subject: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Grade Level"
                fullWidth
                variant="outlined"
                value={currentTextbook.gradeLevel}
                onChange={(e) => setCurrentTextbook({...currentTextbook, gradeLevel: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<CloudUpload />}
                sx={{ 
                  mt: 2,
                  borderStyle: 'dashed',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'primary.light + 08'
                  }
                }}
              >
                {currentTextbook.file?.name || 'Select PDF File'}
                <input
                  type="file"
                  hidden
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
              </Button>
              {isUploading && (
                <Box sx={{ width: '100%', mt: 2 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={uploadProgress} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="caption" sx={{ 
                    display: 'block', 
                    textAlign: 'center',
                    color: 'text.secondary',
                    mt: 1
                  }}>
                    {uploadProgress}% uploaded
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ 
          px: 3,
          py: 2,
          borderTop: `1px solid ${theme.palette.divider}`
        }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{ 
              color: 'text.secondary',
              '&:hover': {
                color: 'text.primary'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSave} 
            disabled={isUploading}
            sx={{
              px: 3,
              borderRadius: 2,
              textTransform: 'none',
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`
            }}
          >
            {currentTextbook.id ? 'Update Textbook' : 'Upload Textbook'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TextbookManagementPage;
