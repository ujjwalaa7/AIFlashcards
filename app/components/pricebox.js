'use client';

import { Box, Button, Divider, Typography, Card, List, CardActions, ListItem, Chip } from '@mui/material';
import  { ListItemDecorator } from '@mui/joy';
import Check from '@mui/icons-material/Check';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import getStripe from '../utility/get-stripe';


export default function PriceBox() {  

  const handleSubmit = async () => {
    try {
      const checkoutSession = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: { origin: 'http://localhost:3000' },
      });

      const checkoutSessionJson = await checkoutSession.json();

      const stripe = await getStripe();
        if (!stripe) {
          console.error("Failed to load Stripe.js");
          return;
        }


      const { error } = await stripe.redirectToCheckout({
        sessionId: checkoutSessionJson.id,
      });

      if (error) {
        console.warn(error.message);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  const listItemStyle = {
    textDecoration: 'line-through',
    marginBottom: '8px',
    color: 'lightgrey',
  }

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
        padding: 2,
        gap: 2,
      }}
    >
      <Card size="lg" variant="outlined">
        <Chip size="small" variant="outlined" label="BASIC" />
        <Box display='flex' justifyContent='center'>
        <Typography variant="h6">Basic</Typography>
        </Box>
        <Divider />
        <List>
          <ListItem>
            <ListItemDecorator>
              <Check />
            </ListItemDecorator>
            6 Card Limit per Prompt
          </ListItem>
          <ListItem>
            <ListItemDecorator>
              <Check />
            </ListItemDecorator>
            Save up to 2 cards
          </ListItem>
        </List>
        <Divider />
        <CardActions>
          <Typography sx={{ mr: 'auto' }}>
            Free
          </Typography>
        </CardActions>
      </Card>

      <Card size="lg" variant="solid"  sx={{ bgcolor: 'grey.900', color: 'white' }}>
        <Chip size="small" variant="outlined" label="ON SALE" sx={{color:'white'}} />
        <Box display='flex' justifyContent='center'>
        <Typography variant="h6">Unlimited</Typography>
        </Box>
        <Divider />
        <List>
          <ListItem>
            <ListItemDecorator>
              <Check />
            </ListItemDecorator>
            12 Cards per Prompt
          </ListItem>
          <ListItem>
            <ListItemDecorator>
              <Check />
            </ListItemDecorator>
            Save Unlimited Cards
          </ListItem>
        </List>
        <Divider />
        <CardActions>
          <Typography sx={{ mr: 'auto' }}>
            <Box display="flex" flexDirection="column">
              <Box>
                $4.99{' '}
                <Typography fontSize="small" color="textSecondary">
                  / month
                </Typography>
              </Box>
              <Box>
                <Typography style={listItemStyle}>
                  $9.99 / month
                </Typography>
              </Box>
            </Box>
          </Typography>
          <Button onClick={handleSubmit} endIcon={<KeyboardArrowRight />}>
            Start now
          </Button>
        </CardActions>
      </Card>
    </Box>
  )
}