'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signUpWithEmail } from '../utility/auth';
import { Box, Typography, TextField, Button, Stack, Container} from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (!loading && user) {
      router.push('/flashcards'); 
    }
  }, [user, loading, router]);
  
  if (loading) {
    return <div>Loading...</div>;  
  }

  const handleSignUp = async () => {
    try {
      const user = await signUpWithEmail(email, password);
      if (user) {
        alert('Signed up successfully!');
        router.push('/login'); 
      }
    } catch (error) {
      alert('Error signing up: ' + error.message);
    }
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
      backgroundImage: 'url(/images/trees.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundColor: 'darkgreen',
      backgroundRepeat: 'no-repeat',
      margin: 0,
      padding: 0,
  }}
>
<Box
        className="bg-green rounded-lg shadow-md"
        style={{ width: '400px', padding: '24px',color:'green', fontFamily:'fantasy'}}
      >   <Typography variant="h4" className="mb-4 text-center" style={{ fontFamily: 'Times Roman, sans-serif', fontSize: '2rem',fontWeight:'bold' }}>
                SIGN UP
            </Typography>
        <Stack spacing={2} className="mb-4">
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          className="mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          className="mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSignUp}
          sx={{
            backgroundColor: 'green',
            color: 'white',
            '&:hover': {
              backgroundColor: 'teal', 
              opacity: 0.8,
            },
          }}

        >
            Sign Up
        </Button>
        <Button 
            variant="contained"
            color="secondary"
            fullWidth
            onClick={() => router.push('/')}
            sx={{
              backgroundColor: 'green',
              color: 'white',
              '&:hover': {
                backgroundColor: 'teal', 
                opacity: 0.8,
              },
            }}
>
                Home Page
            </Button>
        </Stack>
      </Box>
    </Container>
  )
}