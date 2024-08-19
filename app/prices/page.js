'use client';
import Prices from '../components/prices';
import PriceBox from '../components/pricebox';
import { Container, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function Price() {
  const router = useRouter();

  return (
    <Container
      maxWidth="false"
      className="flex items-center justify-center min-h-screen"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',  // Changed from 'direction' to 'flexDirection'
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
      <PriceBox />
      <Prices />
      <Button
        variant="contained"
        fullWidth
        onClick={() => router.push('/')}
        sx={{
          backgroundColor: 'green',
          color: 'white',
          '&:hover': {
            backgroundColor: 'teal', 
            opacity: 0.8,
          },
          maxWidth: '300px', 
        }}
      >
        Home Page
      </Button>
    </Container>
  );
}
