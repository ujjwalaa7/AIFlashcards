import * as React from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Typography from '@mui/joy/Typography';
import Check from '@mui/icons-material/Check';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

export default function PriceBox() {
    // Style for the strikethrough list items
    const listItemStyle = {
        textDecoration: 'line-through',
        marginBottom: '8px',
        // fontSize: '16px',
        color: 'lightgrey',
    };

  return (
    <Box
      sx={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
        gap: 2,
      }}
    >
        
      <Card size="lg" variant="outlined">
        <Chip size="sm" variant="outlined" color="neutral">
          BASIC
        </Chip>
        <Typography level="h2">Basic</Typography>
        <Divider inset="none" />
        <List size="sm" sx={{ mx: 'calc(-1 * var(--ListItem-paddingX))' }}>
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
        <Divider inset="none" />
        <CardActions>
          <Typography level="title-lg" sx={{ mr: 'auto' }}>
            Free
          </Typography>
        </CardActions>
      </Card>

      <Card
        size="lg"
        variant="solid"
        color="neutral"
        invertedColors
        sx={{ bgcolor: 'neutral.900' }}
      >
        <Chip size="sm" variant="outlined">
          On Sale
        </Chip>
        <Typography level="h2">Unlimited</Typography>
        <Divider inset="none" />
        <List
          size="sm"
          sx={{
            // display: 'grid',
            // gridTemplateColumns: '1fr 1fr',
            mx: 'calc(-1 * var(--ListItem-paddingX))',
          }}
        >
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
        <Divider inset="none" />
        <CardActions>
          
          <Typography level="title-lg" sx={{ mr: 'auto' }}>
            <Box display="flex" flexDirection="column">
            
            <Box>
                $3.99{' '}
                
                <Typography fontSize="sm"textColor="text.tertiary">
                / month
                </Typography>
            </Box>

            <Box>
                <Typography style={listItemStyle}>
                    $5.99 / month
                </Typography>
            </Box>
            </Box>

          </Typography>

          <Button endDecorator={<KeyboardArrowRight />}>Start now</Button>
        </CardActions>
      </Card>
    </Box>
  );
}