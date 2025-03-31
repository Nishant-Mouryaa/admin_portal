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
  CircularProgress,
  IconButton,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Tooltip
} from '@mui/material';
import { Add, Edit, Delete, ListAlt, Close } from '@mui/icons-material';
import apiService from '../services/apiService';
import { useTheme } from '@mui/material/styles';

const TestManagementPage = () => {
  const theme = useTheme();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // State for questions management
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');

  // Function to fetch tests from the backend
  const fetchTests = async () => {
    setLoading(true);
    try {
      const data = await apiService.getTests();
      setTests(data);
    } catch (error) {
      console.error('Error fetching tests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  // Open dialog for adding/editing a test
  const handleOpenDialog = (test = null) => {
    if (test) {
      setEditingTest(test);
      setTitle(test.title);
      setDescription(test.description || '');
    } else {
      setEditingTest(null);
      setTitle('');
      setDescription('');
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => setDialogOpen(false);

  // Save (create or update) test data
  const handleSave = async () => {
    try {
      if (editingTest) {
        await apiService.updateTest(editingTest._id, { title, description });
      } else {
        await apiService.createTest({ title, description });
      }
      handleCloseDialog();
      fetchTests();
    } catch (error) {
      console.error('Error saving test:', error);
    }
  };

  // Delete a test
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this test?')) return;
    try {
      await apiService.deleteTest(id);
      fetchTests();
    } catch (error) {
      console.error('Error deleting test:', error);
    }
  };

  // ----- QUESTION MANAGEMENT -----
  // Open the question management dialog for a test
  const handleOpenQuestionDialog = (testId, testQuestions = []) => {
    setSelectedTestId(testId);
    setQuestions(testQuestions || []);
    // Reset new question fields
    setQuestionText('');
    setOptions('');
    setCorrectAnswer('');
    setQuestionDialogOpen(true);
  };

  const handleCloseQuestionDialog = () => {
    setQuestionDialogOpen(false);
    setSelectedTestId(null);
  };

  // Add a new question for a test
  const handleAddQuestion = async () => {
    try {
      // Options should be split by comma into an array
      const optionsArray = options.split(',').map(opt => opt.trim()).filter(opt => opt);
      const questionData = { questionText, options: optionsArray, correctAnswer };
      const newQuestion = await apiService.addQuestion(selectedTestId, questionData);
      // Update local state with the new question appended
      setQuestions([...questions, newQuestion]);
      // Reset fields
      setQuestionText('');
      setOptions('');
      setCorrectAnswer('');
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  // Delete a question from a test
  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Delete this question?')) return;
    try {
      await apiService.deleteQuestion(selectedTestId, questionId);
      setQuestions(questions.filter(q => q._id !== questionId));
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };


  return (
    <Container maxWidth="xl" sx={{ mt: 4, pb: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        gap: 2
      }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          color: 'text.primary'
        }}>
          <ListAlt sx={{ 
            mr: 1.5,
            fontSize: '2rem',
            color: 'primary.main' 
          }} />
          Test Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{
            textTransform: 'none',
            px: 3,
            borderRadius: 2,
            bgcolor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark',
              boxShadow: theme.shadows[4]
            }
          }}
        >
          Add New Test
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '200px'
        }}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      ) : (
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
                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>Description</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, color: 'text.primary' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tests.map((test) => (
                <TableRow 
                  key={test._id}
                  hover
                  sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                >
                  <TableCell sx={{ fontWeight: 500, color: 'text.primary' }}>
                    {test.title}
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>
                    {test.description || 'No description'}
                  </TableCell>
                  <TableCell align="center" sx={{ minWidth: 300 }}>
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={() => handleOpenDialog(test)}
                        sx={{ '&:hover': { color: 'primary.main' } }}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => handleDelete(test._id)}
                        sx={{ mx: 2, '&:hover': { color: 'error.main' } }}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                    <Button
                      variant="outlined"
                      onClick={() => handleOpenQuestionDialog(test._id, test.questions)}
                      sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        '&:hover': {
                          bgcolor: 'primary.light + 22',
                          borderColor: 'primary.dark'
                        }
                      }}
                    >
                      Manage Questions
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {tests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    No tests found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Test Edit/Create Dialog */}
      <Dialog 
        open={dialogOpen} 
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
          {editingTest ? 'Edit Test' : 'Create New Test'}
        </DialogTitle>
        <DialogContent dividers sx={{ py: 3 }}>
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 3 }}
          />
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
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
              '&:hover': { color: 'text.primary' }
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
            {editingTest ? 'Update Test' : 'Create Test'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Question Management Dialog */}
      <Dialog 
        open={questionDialogOpen} 
        onClose={handleCloseQuestionDialog} 
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
          Manage Questions
          <IconButton
            onClick={handleCloseQuestionDialog}
            sx={{ 
              position: 'absolute', 
              right: 8, 
              top: 8,
              color: 'text.secondary'
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ py: 3 }}>
          <List sx={{ mb: 3 }}>
            {questions.map((q) => (
              <Box key={q._id} sx={{ mb: 2 }}>
                <ListItem sx={{ 
                  bgcolor: 'background.default',
                  borderRadius: 2,
                  mb: 1
                }}>
                  <ListItemText
                    primary={q.questionText}
                    primaryTypographyProps={{ 
                      variant: 'body1',
                      fontWeight: 500,
                      color: 'text.primary'
                    }}
                    secondary={
                      <Box component="div" sx={{ mt: 1 }}>
                        <Chip 
                          label={`Options: ${q.options.join(', ')}`}
                          size="small"
                          sx={{ mr: 1, bgcolor: 'primary.light + 22' }}
                        />
                        <Chip
                          label={`Correct Answer: ${q.correctAnswer}`}
                          size="small"
                          color="success"
                          sx={{ bgcolor: 'success.light + 22' }}
                        />
                      </Box>
                    }
                  />
                  <Tooltip title="Delete Question">
                    <IconButton 
                      onClick={() => handleDeleteQuestion(q._id)}
                      sx={{ '&:hover': { color: 'error.main' } }}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </ListItem>
                <Divider />
              </Box>
            ))}
            {questions.length === 0 && (
              <Typography variant="body2" align="center" sx={{ py: 2, color: 'text.secondary' }}>
                No questions added yet
              </Typography>
            )}
          </List>

          <Box sx={{ 
            p: 3,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 3
          }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
              Add New Question
            </Typography>
            <TextField
              fullWidth
              label="Question Text"
              variant="outlined"
              margin="normal"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
            />
            <TextField
              fullWidth
              label="Options (comma separated)"
              variant="outlined"
              margin="normal"
              value={options}
              onChange={(e) => setOptions(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Correct Answer"
              variant="outlined"
              margin="normal"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              sx={{ mt: 2 }}
            />
            <Button
              variant="contained"
              onClick={handleAddQuestion}
              sx={{
                mt: 3,
                px: 4,
                borderRadius: 2,
                textTransform: 'none'
              }}
            >
              Add Question
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default TestManagementPage;