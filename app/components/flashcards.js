'use client'
import { useState } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

export default function FlashcardsPage() {
  const [topic, setTopic] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateFlashcards = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/generate', topic);
      setFlashcards(response.data);
    } catch (error) {
      console.error('Error generating flashcards:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-center">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardContent>
            <Typography variant="h5" component="h2" className="mb-4">
              Generate Flashcards
            </Typography>
            
            <TextField
              id="topic"
              label="Topic"
              variant="outlined"
              fullWidth
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="mb-4"
            />
            
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={generateFlashcards}
              disabled={loading}
              className="mt-2"
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate Flashcards'}
            </Button>

            {flashcards.length > 0 && (
              <div className="mt-6">
                <Typography variant="h6" component="h3" className="mb-4">
                  Flashcards
                </Typography>
                <ul className="space-y-4">
                  {flashcards.map((card, index) => (
                    <li key={index}>
                      <Card className="bg-gray-50">
                        <CardContent>
                          <Typography variant="body1" className="font-semibold">
                            Q: {card.front}
                          </Typography>
                          <Typography variant="body2" className="mt-2">
                            A: {card.back}
                          </Typography>
                        </CardContent>
                      </Card>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
