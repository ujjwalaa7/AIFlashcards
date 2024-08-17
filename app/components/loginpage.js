'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginWithGoogle, loginWithEmail } from '../utility/auth';
import { TextField, Button, Container, Typography, Box, Stack } from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase';
import 'tailwindcss/tailwind.css';
import { FormatBold } from '@mui/icons-material';

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
        style={{ width: '400px', padding: '24px',color:'green', fontFamily:'fantasy', FormatBold }}
      >   <Typography variant="h4" className="mb-4 text-center" style={{ fontFamily: 'Times Roman, sans-serif', fontSize: '2rem',fontWeight:'bold' }}>
                LOGIN
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
                    fullWidth
                    onClick={handleEmailLogin}
                    sx={{
                      backgroundColor: 'green',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'teal', 
                        opacity: 0.8,
                      },
                    }}
                >
                    Login
                </Button>
                <Button
                    variant="contained"
                    fullWidth
                    onClick={handleGoogleLogin}
                    style={{ backgroundColor: 'green', color: 'white' }}
                >
                    <img src='/images/google-logo.png' alt='Google Logo' style={{ width: '20px', marginRight: '8px', borderRadius: '35%' }} />
                    Sign in with Google
                </Button>
                <Button
                    variant="contained"
                    fullWidth
                    onClick={() => router.push('/')}
                    // style={{ backgroundColor: 'green', color: 'white' }}
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
