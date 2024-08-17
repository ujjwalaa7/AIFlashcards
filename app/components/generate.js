'use client'

import React, { useState } from 'react'
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  IconButton,
  Modal,
  Divider,
  FormControlLabel,
  Checkbox
} from '@mui/material'
import { auth, firestore } from '@/firebase'
import { doc, setDoc } from 'firebase/firestore';
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'

export default function Generate() {
  const [text, setText] = useState('')
  const [flashcards, setFlashcards] = useState([])
  const [selectedFlashcards, setSelectedFlashcards] = useState([])
  const [editIndex, setEditIndex] = useState(null)
  const [editFront, setEditFront] = useState('')
  const [editBack, setEditBack] = useState('')
  const [saveName, setSaveName] = useState('')
  const [open, setOpen] = useState(false)

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('Please enter some text to generate flashcards.')
      return
    }
  
    try {
      const unselectedIndices = flashcards.map((_, index) => index)
        .filter(index => !selectedFlashcards.includes(index))
      const numToGenerate = unselectedIndices.length || 12 // Generate 12 if all are selected
  
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          numToGenerate,
        }),
      })
  
      if (!response.ok) {
        throw new Error('Failed to generate flashcards')
      }
  
      const newFlashcards = await response.json()
  
      setFlashcards(prevCards => {
        const selectedCards = prevCards.filter((_, index) => selectedFlashcards.includes(index))
        const updatedCards = [...selectedCards, ...newFlashcards]
        
        // Update selected flashcards
        setSelectedFlashcards(prev => {
          if (prevCards.length === 0) {
            // If there were no cards before, select all new cards
            return Array.from({ length: newFlashcards.length }, (_, i) => i)
          } else {
            // Keep current selection and don't select new cards
            return prev.filter(index => index < selectedCards.length)
          }
        })
        return updatedCards
      })
  
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

  const handleSaveSelected = async () => {
    const user = auth.currentUser
    if (!user) {
      alert('You must be logged in to save flashcards.')
      return
    }

    if (!saveName.trim()) {
      alert('Please enter a name to save the flashcards.')
      return
    }

    const userFlashcardsRef = doc(firestore, 'users', user.uid, 'flashcards', saveName)

    try {
      const selectedFlashcardsData = selectedFlashcards.map(index => flashcards[index]);

      await setDoc(userFlashcardsRef, { flashcards: selectedFlashcardsData }, { merge: true })
      alert(`Flashcards saved successfully under "${saveName}"!`)
      setSaveName('') // Clear the save name after saving
    } catch (error) {
      console.error('Error saving flashcards:', error)
      alert('An error occurred while saving flashcards. Please try again.')
    }
  }

  const handleSelectAll = () => {
    if (selectedFlashcards.length === flashcards.length) {
      setSelectedFlashcards([]) // Deselect all if all are currently selected
    } else {
      setSelectedFlashcards(flashcards.map((_, index) => index)) // Select all
    }
  }

  const handleCancel = () => {
    setEditIndex(null)
    setOpen(false)
  }
  
  const handleSelectFlashcard = (index) => {
    setSelectedFlashcards(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index)
      } else {
        return [...prev, index]
      }
    })
  }

  return (
    <Container maxWidth="false"
    className="flex items-center justify-center min-h-screen"
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundImage: 'url(/images/try3.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundColor: 'darkgreen',
      backgroundRepeat: 'no-repeat',
      margin: 0,
      padding: 0,
  }}>
    <Container maxWidth='md'> 
    <Box sx={{ my: 3 }}>
        <Typography variant="h4" justifyContent= 'center' component="h1" gutterBottom sx={{fontWeight: 'bold', color: 'white' }}>
          GENERATE FLASHCARDS
        </Typography>
        <Divider
          sx={{
            my: 2,
            height: 2,
            background: 'linear-gradient(to right, #90EE90, #228B22)',
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
      sx={{
       mb: 2,
        '& .MuiInputLabel-root': { color: 'white' },
        '& .MuiOutlinedInput-root': {
        color: 'white',
      ' & fieldset': {
          borderColor: 'white',
        },
        '&:hover fieldset': {
        borderColor: 'white',
        },
        '&.Mui-focused fieldset': {
         borderColor: 'white',
       },
      },
      '& .MuiInputBase-input': { color: 'white' },
      }}
    />
        <Button
          variant="contained"
          onClick={handleSubmit}
          fullWidth
          sx={{backgroundColor: 'darkgreen', color: 'white', '&:hover': { backgroundColor: 'green' } }}
        >
          GENERATE FLASHCARDS
        </Button>
      </Box>
      {flashcards.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'white' }}>
            GENERATED FLASHCARDS
          </Typography>
          <Divider
            sx={{
              my: 2,
              height: 2,
              background: 'linear-gradient(to right, #90EE90, #228B22)',              
              borderRadius: 2,
            }}
          />
          <Button onClick={handleSelectAll} sx={{ mb: 2, color: 'white' }}>
            {selectedFlashcards.length === flashcards.length ? 'Deselect All' : 'Select All'}
          </Button>
          <Grid container spacing={2}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <div className="card-container">
                  <div className="card" style={{backgroundColor: 'lightgreen', padding: '5px', borderRadius: '8px'}}>
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
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedFlashcards.includes(index)}
                        onChange={() => handleSelectFlashcard(index)}
                        sx={{ color: 'white' }}
                      />
                    }
                    label="Select"
                    sx={{ color: 'white' }}
                  />
                </div>
              </Grid>
            ))}
          </Grid>
          <TextField
          value={saveName}
          onChange={(e) => setSaveName(e.target.value)}
          label="Enter a name for saving"
          fullWidth
          variant="outlined"
          sx={{ mb:1, mt:2, '& .MuiInputLabel-root': { color: 'white' }, '& .MuiOutlinedInput-root': { color: 'white' }, '& .MuiInputBase-input': { color: 'white' } }}
        />
              {selectedFlashcards.length > 0 && (
                <Box sx={{ mt: 4 }}>
                <Button
              variant="contained"
              onClick={handleSaveSelected}
              fullWidth
              sx={{backgroundColor: 'darkgreen', color: 'white', '&:hover': { backgroundColor: 'green' } }}
        >
          Save Selected Flashcards
        </Button>
            </Box>
          )}
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
    </Container>
  )
}