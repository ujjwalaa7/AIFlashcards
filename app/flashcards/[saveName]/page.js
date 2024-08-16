'use client';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { firestore, auth } from '@/firebase';
import { useRouter, useParams } from 'next/navigation';
import { Typography, Box, Button } from '@mui/material';

export default function FlashcardSet() {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useParams(); // Get the route parameters
  const saveName = params.saveName; // Get the saveName parameter from the URL
  const router = useRouter();

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.error('No user is authenticated');
          return;
        }

        const flashcardsDocRef = doc(firestore, 'users', user.uid, 'flashcards', saveName);
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
      } finally {
        setLoading(false);
      }
    };

    if (saveName) {
      fetchFlashcards();
    } else {
      console.error('saveName is null or undefined');
      setLoading(false);
    }
  }, [saveName]);

  if (loading) {
    return <p>Loading flashcards...</p>;
  }

  return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Flashcards in "{saveName}"
        </Typography>
        {flashcards.length > 0 ? (
          flashcards.map((flashcard, index) => (
            <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
              <Typography variant="h6">{flashcard.front}</Typography>
              <Typography variant="body1">{flashcard.back}</Typography>
            </Box>
          ))
        ) : (
          <Typography>No flashcards available in this set.</Typography>
        )}
        <Button variant="contained" color="primary" onClick={() => router.back()}>
          Back to Flashcard Sets
        </Button>
      </Box>
  );
}
