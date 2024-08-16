'use client'

import { useState } from 'react'
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  IconButton,
  Modal,
  Divider
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'

export default function Generate() {
  const [text, setText] = useState('')
  const [flashcards, setFlashcards] = useState([])
  const [editIndex, setEditIndex] = useState(null)
  const [editFront, setEditFront] = useState('')
  const [editBack, setEditBack] = useState('')
  const [open, setOpen] = useState(false)

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('Please enter some text to generate flashcards.')
      return
    }

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: text,
      })

      if (!response.ok) {
        throw new Error('Failed to generate flashcards')
      }

      const data = await response.json()
      setFlashcards(data)
    } catch (error) {
      console.error('Error generating flashcards:', error)
      alert('An error occurred while generating flashcards. Please try again.')
    }
  }

  const handleEdit = (index) => {
    setEditIndex(index)
    setEditFront(flashcards[index].front)
    setEditBack(flashcards[index].back)
    setOpen(true)
  }

  const handleSave = () => {
    const updatedFlashcards = [...flashcards]
    updatedFlashcards[editIndex] = { front: editFront, back: editBack }
    setFlashcards(updatedFlashcards)
    setEditIndex(null)
    setOpen(false)
  }

  const handleCancel = () => {
    setEditIndex(null)
    setOpen(false)
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Generate Flashcards
        </Typography>
        <Divider
          sx={{
            my: 2,
            height: 2,
            background: 'linear-gradient(to right, #3f51b5, #f50057)',
            borderRadius: 2,
          }}
        />
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          label="Write About a Topic"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
        >
          Generate Flashcards
        </Button>
      </Box>
      {flashcards.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Generated Flashcards
          </Typography>
          <Divider
          sx={{
            my: 2,
            height: 2,
            background: 'linear-gradient(to right, #3f51b5, #f50057)',
            borderRadius: 2,
          }}
        />
          <Grid container spacing={2}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <div className="card-container">
                  <div className="card">
                    <div className="card-front">
                      <Typography>{flashcard.front}</Typography>
                    </div>
                    <div className="card-back">
                      <Typography>{flashcard.back}</Typography>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(index)}
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                      >
                        <EditIcon />
                      </IconButton>
                    </div>
                  </div>
                </div>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      <Modal
        open={open}
        onClose={handleCancel}
        aria-labelledby="edit-flashcard-modal"
        aria-describedby="edit-flashcard-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="edit-flashcard-modal" variant="h6" component="h2" sx = {{ mb: 2 }}>
            Edit Flashcard
          </Typography>
          <TextField
            label="Front"
            value={editFront}
            onChange={(e) => setEditFront(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Back"
            value={editBack}
            onChange={(e) => setEditBack(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <IconButton color="primary" onClick={handleSave}>
              <SaveIcon />
            </IconButton>
            <IconButton color="secondary" onClick={handleCancel}>
              <CancelIcon />
            </IconButton>
          </Box>
        </Box>
      </Modal>
    </Container>
  )
}