'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginWithGoogle, loginWithEmail } from '../utility/auth';
import { TextField, Button, Container, Typography, Box, Stack } from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase';
import 'tailwindcss/tailwind.css';

export default function LoginPage() {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const router = useRouter();
    const [ user, loading ] = useAuthState(auth);

    useEffect(() => {
        if (!loading && user) {
            router.push('/flashcards');
        }
    }, [ user, loading, router ]);

    if (loading) {
        return <div>Loading...</div>;  
      }
    const handleEmailLogin = async () => {
        try {
          const user = await loginWithEmail(email, password);
          if (user) {
            alert('Signed in successfully');
            router.push('/flashcards'); 
          }
        } catch (error) {
          alert('Error signing in via Email: ' + error.message);
        }
      }
    
      const handleGoogleLogin = async () => {
        try {
          const user = await loginWithGoogle(); 
          if (user) {
            alert('Signed in Successfully');
            router.push('/flashcards'); 
          }
        } catch (error) {
          alert('Error signing in with Google: ' + error.message);
        }
      }

  return (
    <Container maxWidth="sm" className="flex flex-col items-center justify-center min-h-screen">
      <Box className="w-full p-6 bg-white rounded-lg shadow-md">
        <Typography variant="h4" className="mb-4 text-center">
          Login
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
          onClick={handleEmailLogin}
        >
            Login
        </Button>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleGoogleLogin}
          >
            <img src='/images/google-logo.png' alt='Google Logo' style={{ width: '20px', marginRight: '8px', borderRadius: '35%' }} />
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
  )
}