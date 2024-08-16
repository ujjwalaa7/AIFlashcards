'use client';

import { useEffect, useState } from 'react'
import { Container, Typography, Grid, Card, CardContent } from '@mui/material'

export default function Flashcards() {
  const [flashcards, setFlashcards] = useState([])

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await fetch('/api/flashcards')
        if (!response.ok) {
          throw new Error('Failed to fetch flashcards')
        }
        const data = await response.json()
        setFlashcards(data)
      } catch (error) {
        console.error('Error fetching flashcards:', error)
      }
    }

    fetchFlashcards()
  }, [])

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Saved Flashcards
      </Typography>
      <Grid container spacing={2}>
        {flashcards.map((flashcard, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6">{flashcard.front}</Typography>
                <Typography variant="body2">{flashcard.back}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}