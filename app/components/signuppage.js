'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signUpWithEmail } from '../utility/auth';
import { Box, Typography, TextField, Button, Stack, Container} from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase';
import 'tailwindcss/tailwind.css';

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
        router.push('/signin'); 
      }
    } catch (error) {
      alert('Error signing up: ' + error.message);
    }
  };

  return (
    <Container maxWidth="sm" className="flex flex-col items-center justify-center min-h-screen">
      <Box className="w-full p-6 bg-white rounded-lg shadow-md">
        <Typography variant="h4" className="mb-4 text-center">
          Sign Up
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
        >
            Sign Up
        </Button>
        <Button 
            variant="contained"
            color="secondary"
            fullWidth
            onClick={() => router.push('/')}>
                Home Page
            </Button>
        </Stack>
      </Box>
    </Container>
  );
};
