'use client'

import Image from "next/image";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase";
import Link from 'next/link';
import { Box, Typography, Button, Container, Divider } from '@mui/material';
import Footer from "./components/footer";

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
    <div>
    <Container
      maxWidth="false"
      className="flex flex-col items-center justify-center min-h-screen"
      style={{ 
        backgroundImage: 'url(/images/usethisback.png)',
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        backgroundRepeat: 'no-repeat', 
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        marginRight: 0,
        marginLeft: 0,
        padding: 0
      }}
    >
    <Box
      fontFamily={'Comic Sans MS , cursive, sans-serif'}
      fontWeight= 'bold'
      fontSize={{ xs: 40, sm: 60, md: 80 }}
      color={'#1e6c3d'}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ 
        position: 'relative', 
        top: { xs: '30%', sm: '25%', md: '25%' },
        left: { xs: '55%', sm: '55%', md: '50%' },
        transform: 'translate(-50%, -50%)' 
      }}
      >
       WELCOME TO INTEL-O-FLASH!
      </Box>   
    <Box 
    display="flex" 
    flexDirection={{ xs: 'column', sm: 'row' }}
    gap={3}
    sx={{ 
      position: 'absolute', 
      top: { xs: '50%', sm: '40%' },
      left: '50%', 
      transform: 'translate(-50%, -50%)' 
    }}
    >
    <Link href='/login' passHref>
      <Button variant='contained' color='primary' sx={{ 
        minWidth: '120px',
        backgroundColor: '#004d00',
        '&:hover': {
          backgroundColor: '#003300' 
        },
        mb: { xs: 2, sm: 0 }
      }}>
        Login
      </Button>
    </Link>
    <Link href='/signup' passHref>
      <Button variant='contained' color='secondary' sx={{ 
        minWidth: '120px', 
        backgroundColor: '#004d00',
        '&:hover': {
          backgroundColor: '#003300'
        }
      }}>
        Sign Up
      </Button>
    </Link>
  </Box>
  </Container>
  <Footer />
  </div>
  )
}