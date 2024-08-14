'use client'
import Image from "next/image";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase";
import Link from 'next/link';
import { Box, Typography, Button, Container } from '@mui/material';
import 'tailwindcss/tailwind.css';

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
        router.push('/flashcards');
    }
}, [ user, loading, router ]);

if (loading) {
  return <div>Loading...</div>;  
}

  return (
    <Container maxWidth="sm" className="flex flex-col items-center justify-center min-h-screen">
    <Box display={'flex'} flexDirection={'row'} gap={2}>
    <Link href='/login' passHref>
      <Button variant='contained' color='primary' sx={{ minWidth: '120px' }}>
        Login
      </Button>
    </Link>
    <Link href='/signup' passHref>
      <Button variant='contained' color='secondary' sx={{ minWidth: '120px' }}>
        Sign Up
      </Button>
    </Link>
  </Box>
  </Container>
  )
}
