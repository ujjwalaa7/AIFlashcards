'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { auth, firestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { List, ListItem, ListItemText, Typography, Box, CircularProgress, Card, CardContent, Divider } from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import { Container } from '@mui/material';


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
    })
    return () => listSets(); 
  }, [])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container
    maxWidth="false"
    className="flex items-center justify-center min-h-screen"
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundImage: 'url(/images/flashcards.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundColor: 'darkgreen',
      backgroundRepeat: 'no-repeat',
      margin: 0,
      padding: 0,
  }}
>
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Saved Flashcard Sets
      </Typography>
      <Divider
        sx={{
          my: 2,
          height: 2,
          background: 'linear-gradient(to right, #90EE90, #228B22)',
          borderRadius: 2,
        }}
      />
      <List>
        {sets.length > 0 ? (
          sets.map((setName, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <ListItem 
                  button 
                  onClick={() => router.push(`/flashcards/${setName}`)}
                  sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}
                >
                  <ListItemText primary={setName} />
                </ListItem>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography>No flashcard sets available.</Typography>
        )}
      </List>
    </Box>
    </Container>

  )
}