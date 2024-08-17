'use client'
import Image from "next/image";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase";
import Link from 'next/link';
import { Box, Typography, Button, Container } from '@mui/material';
import 'tailwindcss/tailwind.css';
import { green } from "@mui/material/colors";
import Footer from "../app/footer"

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
        backgroundImage: 'url(/images/intel-o-flash.png)',
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        backgroundRepeat: 'no-repeat', 
        width: '99vw',
        height: '100vh',
        // minHeight: '100vh',
        // width: '85vw',
        position: 'relative',
        overflow: 'hidden',
        marginRight: 0,
        marginLeft: 0,
        padding: 0
      }}
    >       
        <Box 
    display="flex" 
    flexDirection="row" 
    gap={3}
    sx={{ 
      position: 'absolute', 
      top: '40%', 
      left: '50%', 
      transform: 'translate(-50%, -50%)' 
    }}
  >
    <Link href='/login' passHref>
      <Button variant='contained' color='primary' sx={{ minWidth: '120px',backgroundColor: '#004d00', // Dark green
              '&:hover': {
                backgroundColor: '#003300' }}}>
        Login
      </Button>
    </Link>
    <Link href='/signup' passHref>
      <Button variant='contained' color='secondary' sx={{ minWidth: '120px', backgroundColor: '#004d00', // Dark green
              '&:hover': {
                backgroundColor: '#003300'}}}>
        Sign Up
      </Button>
    </Link>
  </Box>
  </Container>
  <Footer />
  </div>

  )
}