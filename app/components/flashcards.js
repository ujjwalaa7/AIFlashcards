'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { auth, firestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { List, ListItem, ListItemText, Typography, Box } from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';

export default function FlashCards() {
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const listSets = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          console.log("User is authenticated:", user.uid);
          const setsCollectionRef = collection(firestore, 'users', user.uid, 'flashcards');
          const snapshot = await getDocs(setsCollectionRef);

          if (!snapshot.empty) {
            const setNames = snapshot.docs.map(doc => doc.id); // Get the names of each set
            setSets(setNames);
          } else {
            console.log("No flashcard sets found for this user.");
            setSets([]);
          }
        } catch (error) {
          setSets([]);
        }
      } else {
        setSets([]);
      }
      setLoading(false);
    });

    return () => listSets(); 
  }, []);

  if (loading) {
    return <p>Loading flashcard sets...</p>;
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Saved Flashcard Sets
      </Typography>
      <List>
        {sets.length > 0 ? (
          sets.map((setName, index) => (
            <ListItem 
              button 
              key={index} 
              onClick={() => router.push(`/flashcards/${setName}`)}
            >
              <ListItemText primary={setName} />
            </ListItem>
          ))
        ) : (
          <Typography>No flashcard sets available.</Typography>
        )}
      </List>
    </Box>
  );
}
