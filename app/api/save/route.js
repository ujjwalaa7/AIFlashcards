const handleSave = async () => {
    const updatedFlashcards = [...flashcards];
    if (editIndex !== null) {
      updatedFlashcards[editIndex] = { front: editFront, back: editBack };
      setFlashcards(updatedFlashcards);
      setEditIndex(null);
      setOpen(false);
    }
  
    console.log('Saving flashcards:', updatedFlashcards); // Debugging log
  
    try {
      const response = await fetch('/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFlashcards),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save flashcards');
      }
  
      alert('Flashcards saved successfully!');
    } catch (error) {
      console.error('Error saving flashcards:', error);
      alert('An error occurred while saving flashcards. Please try again.');
    }
  };
  