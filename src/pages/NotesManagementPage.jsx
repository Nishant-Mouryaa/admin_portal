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
  Tooltip
} from '@mui/material';
import { Add, Edit, Delete, Note, Search } from '@mui/icons-material';
import apiService from '../services/apiService';
import { useTheme } from '@mui/material/styles';

const NotesManagementPage = () => {
  const theme = useTheme();
  const [notes, setNotes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentNote, setCurrentNote] = useState({
    title: '',
    content: '',
    board: '',
    class: '',
    subject: ''
  });

  const loadNotes = async () => {
    try {
      const data = await apiService.getNotes();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleOpenDialog = (note = null) => {
    if (note) {
      setCurrentNote({
        id: note._id,
        title: note.title,
        content: note.content,
        board: note.board,
        class: note.class,
        subject: note.subject
      });
    } else {
      setCurrentNote({
        title: '',
        content: '',
        board: '',
        class: '',
        subject: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSave = async () => {
    try {
      const noteData = {
        title: currentNote.title,
        content: currentNote.content,
        board: currentNote.board,
        class: currentNote.class,
        subject: currentNote.subject
      };

      if (currentNote.id) {
        await apiService.updateNote(currentNote.id, noteData);
      } else {
        await apiService.createNote(noteData);
      }
      handleCloseDialog();
      loadNotes();
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await apiService.deleteNote(id);
      loadNotes();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  // Filter notes by title, content, or board/subject/class
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.board.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, pb: 4 }}>
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
          <Note sx={{ 
            mr: 1.5,
            fontSize: '2rem',
            color: 'primary.main' 
          }} />
          Notes Management
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
            boxShadow: theme.shadows[2],
            '&:hover': {
              boxShadow: theme.shadows[4],
              transform: 'translateY(-1px)'
            },
            transition: 'all 0.2s ease'
          }}
        >
          Add Note
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
          placeholder="Search notes..."
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
              {['Title', 'Board', 'Class', 'Subject', 'Actions'].map((header) => (
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
            {filteredNotes.map((note) => (
              <TableRow 
                key={note._id} 
                hover 
                sx={{ 
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <TableCell sx={{ 
                  fontWeight: 500,
                  color: 'text.primary'
                }}>
                  {note.title}
                </TableCell>
                <TableCell>{note.board}</TableCell>
                <TableCell>{note.class}</TableCell>
                <TableCell>{note.subject}</TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton 
                      onClick={() => handleOpenDialog(note)}
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
                      onClick={() => handleDelete(note._id)}
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
            {filteredNotes.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ 
                  py: 4,
                  color: 'text.secondary'
                }}>
                  No notes found matching your search
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        fullWidth 
        maxWidth="md"
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
          {currentNote.id ? 'Edit Note' : 'Create New Note'}
        </DialogTitle>
        <DialogContent dividers sx={{ py: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Title"
                fullWidth
                variant="outlined"
                value={currentNote.title}
                onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Board"
                fullWidth
                variant="outlined"
                value={currentNote.board}
                onChange={(e) => setCurrentNote({ ...currentNote, board: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Class"
                fullWidth
                variant="outlined"
                value={currentNote.class}
                onChange={(e) => setCurrentNote({ ...currentNote, class: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Subject"
                fullWidth
                variant="outlined"
                value={currentNote.subject}
                onChange={(e) => setCurrentNote({ ...currentNote, subject: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Content"
                fullWidth
                multiline
                rows={6}
                variant="outlined"
                value={currentNote.content}
                onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
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
            sx={{
              px: 3,
              borderRadius: 2,
              textTransform: 'none'
            }}
          >
            {currentNote.id ? 'Update Note' : 'Create Note'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default NotesManagementPage;