'use client';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestore, auth } from '@/firebase';
import { useRouter, useParams } from 'next/navigation';
import { Typography, Box, Button, IconButton, TextField, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { onAuthStateChanged } from 'firebase/auth';


export default function FlashcardSet() {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editFront, setEditFront] = useState('');
  const [editBack, setEditBack] = useState('');
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [user, setUser] = useState(null); 
  const params = useParams(); 
  const saveName = decodeURIComponent(params.saveName); 
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

    return () => unsubscribe(); // Cleanup the listener on unmount
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

    const user = auth.currentUser;
    if (user) {
      const flashcardsDocRef = doc(firestore, 'users', user.uid, 'flashcards', saveName);
      await updateDoc(flashcardsDocRef, { flashcards: updatedFlashcards });
    }
  };

  const handleDeleteSet = async () => {
    const user = auth.currentUser;
    if (user) {
      const flashcardsDocRef = doc(firestore, 'users', user.uid, 'flashcards', saveName);
      await deleteDoc(flashcardsDocRef);
      router.back(); // Go back to the flashcard sets list
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

  if (loading) {
    return <p>Loading flashcards...</p>;
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Flashcards in "{saveName}"
      </Typography>
      {flashcards.length > 0 ? (
        flashcards.some(flashcard => flashcard.front || flashcard.back) ? (
          flashcards.map((flashcard, index) => (
            <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
              {editingIndex === index ? (
                <Box>
                  <TextField
                    label="Front"
                    value={editFront}
                    onChange={(e) => setEditFront(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Back"
                    value={editBack}
                    onChange={(e) => setEditBack(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <Button variant="contained" color="primary" onClick={handleSaveEdit}>
                    Save
                  </Button>
                </Box>
              ) : (
                <Box>
                  <Typography variant="h6">{flashcard.front || "No front text available"}</Typography>
                  <Typography variant="body1">{flashcard.back || "No back text available"}</Typography>
                  <IconButton color="primary" onClick={() => handleEdit(index)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDeleteFlashcard(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
          ))
        ) : (
          <Typography>No flashcards with content available in this set.</Typography>
        )
      ) : (
        <Typography>No flashcards available in this set.</Typography>
      )}
      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography variant="h5" gutterBottom>
          Add a New Flashcard
        </Typography>
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
        <Button variant="contained" color="primary" onClick={handleAddFlashcard}>
          Add Flashcard
        </Button>
      </Box>
      <Stack spacing={2} direction={'row'}>
      <Button variant="contained" color="secondary" onClick={handleDeleteSet} sx={{ mb: 2 }}>
        Delete Set
      </Button>
      <Button variant="contained" color="primary" onClick={() => router.back()} sx={{ mb: 2}}>
        Back to Flashcard Sets
      </Button>
      </Stack>
    </Box>
  );
}
