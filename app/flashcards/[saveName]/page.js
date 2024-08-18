'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestore, auth } from '@/firebase';
import { useRouter, useParams } from 'next/navigation';
import { Typography, Box, Button, IconButton, TextField, Stack, Card, CardContent, Divider, Container } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { onAuthStateChanged } from 'firebase/auth';
import ProtectedRoute from '../../components/protectedroute';

function FlashcardSet() {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editFront, setEditFront] = useState('');
  const [editBack, setEditBack] = useState('');
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [user, setUser] = useState(null);
  const params = useParams();
  const saveName = params.saveName ? decodeURIComponent(params.saveName.replace(/\+/g, '%20')) : '';
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authenticatedUser) => {
      if (authenticatedUser) {
        setUser(authenticatedUser);
        try {
          const flashcardsDocRef = doc(firestore, 'users', authenticatedUser.uid, 'flashcards', saveName);
          const docSnap = await getDoc(flashcardsDocRef);
          if (docSnap.exists()) {
            const flashcardsData = docSnap.data().flashcards || [];
            setFlashcards(flashcardsData);
          } else {
            console.error('No flashcards found for this set');
            setFlashcards([]);
          }
        } catch (error) {
          console.error('Error fetching flashcards:', error);
          setFlashcards([]);
        }
      } else {
        console.error('No user is authenticated');
        setFlashcards([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [saveName]);

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditFront(flashcards[index].front);
    setEditBack(flashcards[index].back);
  };

  const handleSaveEdit = async () => {
    const updatedFlashcards = [...flashcards];
    updatedFlashcards[editingIndex] = { front: editFront, back: editBack };
    setFlashcards(updatedFlashcards);
    setEditingIndex(null);

    const user = auth.currentUser;
    if (user) {
      const flashcardsDocRef = doc(firestore, 'users', user.uid, 'flashcards', saveName);
      await updateDoc(flashcardsDocRef, { flashcards: updatedFlashcards });
    }
  };

  const handleDeleteFlashcard = async (index) => {
    const updatedFlashcards = flashcards.filter((_, i) => i !== index);
    setFlashcards(updatedFlashcards);
  
    // Update the current index
    if (updatedFlashcards.length === 0) {
      // If we've deleted the last card, reset to 0
      setCurrentIndex(0);
    } else if (index <= currentIndex) {
      // If we're deleting the current card or one before it,
      // decrement the index, but don't go below 0
      setCurrentIndex(prevIndex => Math.max(0, prevIndex - 1));
    }
    // If the index is after the current one, we don't need to change currentIndex
  
    const user = auth.currentUser;
    if (user) {
      const flashcardsDocRef = doc(firestore, 'users', user.uid, 'flashcards', saveName);
  
      if (updatedFlashcards.length === 0) {
        await deleteDoc(flashcardsDocRef);
      } else {
        await updateDoc(flashcardsDocRef, { flashcards: updatedFlashcards });
      }
    }
  

    setIsFlipped(false);
  };

  const handleDeleteSet = async () => {
    const user = auth.currentUser;
    if (user) {
      const flashcardsDocRef = doc(firestore, 'users', user.uid, 'flashcards', saveName);
      await deleteDoc(flashcardsDocRef);
      router.back();
    }
  };

  const handleAddFlashcard = async () => {
    if (!newFront.trim() || !newBack.trim()) {
      alert('Both the front and back text must be provided.');
      return;
    }

    const updatedFlashcards = [...flashcards, { front: newFront, back: newBack }];
    setFlashcards(updatedFlashcards);
    setNewFront('');
    setNewBack('');

    const user = auth.currentUser;
    if (user) {
      const flashcardsDocRef = doc(firestore, 'users', user.uid, 'flashcards', saveName);
      await updateDoc(flashcardsDocRef, { flashcards: updatedFlashcards });
    }
  };

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
    setIsFlipped(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
    setIsFlipped(false);
  };

  if (loading) {
    return <p>Loading flashcards...</p>;
  }

  return (
    <Container
      maxWidth={false}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundImage: 'url(/images/try3.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: 'darkgreen',
        backgroundRepeat: 'no-repeat',
        margin: 0,
        padding: 0,
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}>
            Flashcards in '{saveName}'
          </Typography>
          <Divider
            sx={{
              my: 2,
              height: 2,
              background: 'linear-gradient(to right, #90EE90, #228B22)',
              borderRadius: 2,
            }}
          />
          <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
            {flashcards.length > 0 ? (
              <div className="car-container">
                <div className={`car ${isFlipped ? 'flipped' : ''}`} onClick={editingIndex === null ? handleFlip : null}> 
                  {editingIndex === currentIndex ? (
                    <>
                      <TextField
                        label="Edit Front"
                        value={editFront}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => setEditFront(e.target.value)}
                        fullWidth
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        label="Edit Back"
                        value={editBack}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => setEditBack(e.target.value)}
                        fullWidth
                        sx={{ mb: 2 }}
                      />
                      <Stack direction="row" spacing={2}>
                        <Button variant="contained" color="primary" onClick={handleSaveEdit}>
                          Save
                        </Button>
                        <Button variant="contained" color="secondary" onClick={(e) => { e.stopPropagation(); setEditingIndex(null); }}>
                          Cancel
                        </Button>
                      </Stack>
                    </>
                  ) : (
                    <>
                      <div className="car-front">
                        <CardContent>
                          <Typography variant="h6">
                            {flashcards[currentIndex]?.front || "No flashcards available"}
                          </Typography>
                          {flashcards.length > 0 && (
                            <Typography variant="caption" sx={{ position: 'absolute', top: 8, left: 8 }}>
                              {currentIndex + 1}/{flashcards.length}
                            </Typography>
                          )}
                          <IconButton
                            color="primary"
                            onClick={(e) => { e.stopPropagation(); handleEdit(currentIndex); }}
                            sx={{ position: 'absolute', top: 8, right: 8 }}
                          >
                            <EditIcon />
                          </IconButton>
                        </CardContent>
                      </div>
                      <div className="car-back">
                        <CardContent>
                          <Typography variant="h6">
                            {flashcards[currentIndex]?.back || "No flashcards available"}
                          </Typography>
                          {flashcards.length > 0 && (
                            <Typography variant="caption" sx={{ position: 'absolute', top: 8, left: 8 }}>
                              {`${Math.min(currentIndex + 1, flashcards.length)}/${flashcards.length}`}
                            </Typography>
                          )}
                          <IconButton
                            color="secondary"
                            onClick={(e) => { e.stopPropagation(); handleDeleteFlashcard(currentIndex); }}
                            sx={{ position: 'absolute', bottom: 8, right: 8 }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </CardContent>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <Typography color="#ccecc9">No flashcards available in this set.</Typography>
            )}
          </Box>
          <Stack direction="row" justifyContent="space-between">
            <IconButton onClick={handlePrev} sx={{ color: 'lightgreen' }}>
              <ArrowBackIcon />
            </IconButton>
            <IconButton onClick={handleNext} sx={{ color: 'lightgreen' }}>
              <ArrowForwardIcon />
            </IconButton>
          </Stack>

          <Box sx={{ mt: 4, mb: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}>
              Add a New Flashcard
            </Typography>
            <Divider
              sx={{
                my: 2,
                height: 2,
                background: 'linear-gradient(to right, #90EE90, #228B22)',
                borderRadius: 2,
              }}
            />
            <TextField
              label="Front"
              value={newFront}
              onChange={(e) => setNewFront(e.target.value)}
              fullWidth
              sx={{
                mb: 1,
                mt: 2,
                '& .MuiInputLabel-root': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' },
                  color: 'white',
                },
                '& .MuiInputBase-input': { color: 'white' },
              }}
            />
            <TextField
              label="Back"
              value={newBack}
              onChange={(e) => setNewBack(e.target.value)}
              fullWidth
              sx={{
                mb: 3,
                mt: 3,
                '& .MuiInputLabel-root': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' },
                  color: 'white',
                },
                '& .MuiInputBase-input': { color: 'white' },
              }}
            />
            <Stack spacing={2} direction="row" justifyContent="center">
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddFlashcard}
                sx={{
                  backgroundColor: 'green',
                  '&:hover': {
                    backgroundColor: 'darkgreen',
                  }
                }}
              >
                Add Flashcard
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleDeleteSet}
                sx={{
                  backgroundColor: 'darkcyan',
                  '&:hover': {
                    backgroundColor: 'teal',
                  }
                }}
              >
                Delete Set
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => router.back()}
                sx={{
                  backgroundColor: 'green',
                  '&:hover': {
                    backgroundColor: 'darkgreen',
                  }
                }}
              >
                Back to Flashcard Sets
              </Button>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Container>
  );
}

export default function FlashcardSetPage() {
  return (
    <ProtectedRoute>
      <FlashcardSet />
    </ProtectedRoute>
  );
}