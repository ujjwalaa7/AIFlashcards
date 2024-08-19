'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Box, Typography } from '@mui/material';

const FullPageOverlay = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        zIndex: 99,
        pointerEvents: 'none',
      }}
    />
  )
}

export default function Prices() {
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

    return (
        <>
            <FullPageOverlay />
            <Box sx={{ textAlign: 'center', mt: 4, px: 2, color: 'white', zIndex: 100}}>
                <Typography variant="h4" sx={{ fontSize: '2rem', fontWeight: 'bold', mb: 2}}>
                    Enjoy All Features for Free!
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1.2rem', mb: 2}}>
                    We aren't actually charging anyone at the moment. All features are free to use during this period.
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1.2rem', mb: 2}}>
                    If we see users enjoying this experience, we may introduce a paywall for future features. For now, enjoy all the features at no cost!
                </Typography>
            </Box>
        </>
    )
}
