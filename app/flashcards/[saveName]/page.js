'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestore, auth } from '@/firebase';
import { useRouter, useParams } from 'next/navigation';
import { Typography, Box, Button, IconButton, TextField, Stack, Card, CardContent, Divider } from '@mui/material';
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
    })

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, [saveName]);

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditFront(flashcards[index].front);
    setEditBack(flashcards[index].back);
  }

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
  }

  const handleDeleteFlashcard = async (index) => {
    const updatedFlashcards = flashcards.filter((_, i) => i !== index);
    setFlashcards(updatedFlashcards);

    const user = auth.currentUser;
    if (user) {
      const flashcardsDocRef = doc(firestore, 'users', user.uid, 'flashcards', saveName);
      await updateDoc(flashcardsDocRef, { flashcards: updatedFlashcards });
    }
  }

  const handleDeleteSet = async () => {
    const user = auth.currentUser;
    if (user) {
      const flashcardsDocRef = doc(firestore, 'users', user.uid, 'flashcards', saveName);
      await deleteDoc(flashcardsDocRef);
      router.back(); // Go back to the flashcard sets list
    }
  }

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
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
    setIsFlipped(false);
  }

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
    setIsFlipped(false);
  }

  if (loading) {
    return <p>Loading flashcards...</p>;
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Flashcards in '{saveName}'
      </Typography>
      <Divider
            sx={{
              my: 2,
              height: 2,
              background: 'linear-gradient(to right, #3f51b5, #f50057)',
              borderRadius: 2,
            }}
          />
      {flashcards.length > 0 ? (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
          <div className="car-container">
            <div className={`car ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
              <div className="car-front">
                <CardContent>
                  <Typography variant="h6">
                    {flashcards[currentIndex].front}
                  </Typography>
                  <Typography variant="caption" sx={{ position: 'absolute', top: 8, left: 8 }}>
                    {currentIndex + 1}/{flashcards.length}
                  </Typography>
                </CardContent>
              </div>
              <div className="car-back">
                <CardContent>
                  <Typography variant="h6">
                    {flashcards[currentIndex].back}
                  </Typography>
                  <Typography variant="caption" sx={{ position: 'absolute', top: 8, left: 8 }}>
                    {currentIndex + 1}/{flashcards.length}
                  </Typography>
                </CardContent>
              </div>
            </div>
          </div>
          <Stack direction="row" justifyContent="space-between">
            <IconButton onClick={handlePrev}>
              <ArrowBackIcon />
            </IconButton>
            <IconButton onClick={handleNext}>
              <ArrowForwardIcon />
            </IconButton>
          </Stack>
        </Box>
      ) : (
        <Typography>No flashcards available in this set.</Typography>
      )}
      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography variant="h5" gutterBottom>
          Add a New Flashcard
        </Typography>
        <Divider
          sx={{
            my: 2,
            height: 2,
            background: 'linear-gradient(to right, #3f51b5, #f50057)',
            borderRadius: 2,
          }}
        />
        <TextField
          label="Front"
          value={newFront}
          onChange={(e) => setNewFront(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Back"
          value={newBack}
          onChange={(e) => setNewBack(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        
        <Stack spacing={2} direction={'row'} justifyContent={'center'}>
        <Button variant="contained" color="primary" onClick={handleAddFlashcard}>
          Add Flashcard
        </Button>

        <Button variant="contained" color="secondary" onClick={handleDeleteSet} sx={{ mb: 2 }}>
          Delete Set
        </Button>
        
        <Button variant="contained" color="primary" onClick={() => router.back()} sx={{ mb: 2 }}>
          Back to Flashcard Sets
        </Button>
        
        </Stack>
      </Box>
    </Box>
  )
}

export default function FlashcardSetPage() {
  return (
    <ProtectedRoute>
      <FlashcardSet />
    </ProtectedRoute>
  );
}
