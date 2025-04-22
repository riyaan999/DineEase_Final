import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  IconButton,
  Chip,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ChatIcon from '@mui/icons-material/Chat';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import restaurants from '../../data/restaurants.js';

const Home = ({ setShowChatbot }) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const handleCardClick = (restaurant) => {
    setSelectedRestaurant(selectedRestaurant?.id === restaurant.id ? null : restaurant);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Discover Restaurants in Pune
      </Typography>

      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={{ width: '100%', margin: 0 }}>
        {restaurants.map((restaurant) => (
          <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  boxShadow: 2,
                  '&:hover': {
                    boxShadow: 6,
                  },
                }}
                onClick={() => handleCardClick(restaurant)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={restaurant.image}
                  alt={restaurant.name}
                  sx={{
                    objectFit: 'cover',
                    transition: '0.3s transform',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                />
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Box sx={{ mb: 1 }}>
                    <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                      {restaurant.name}
                    </Typography>
                    <Chip
                      size="small"
                      label={restaurant.cuisine}
                      color="primary"
                      variant="outlined"
                      icon={<RestaurantMenuIcon />}
                      sx={{ mb: 1 }}
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOnIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    {restaurant.location}
                  </Typography>

                  <AnimatePresence>
                    {selectedRestaurant?.id === restaurant.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
                            Popular Dishes
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                            {restaurant.popularDishes.map((dish, index) => (
                              <Chip
                                key={index}
                                label={dish}
                                size="small"
                                variant="outlined"
                                sx={{ borderRadius: 1 }}
                              />
                            ))}
                          </Box>
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AccessTimeIcon />}
                            fullWidth
                            component={Link}
                            to={`/reservation/${restaurant.id}`}
                            sx={{
                              borderRadius: 2,
                              textTransform: 'none',
                              fontWeight: 600,
                            }}
                          >
                            Make Reservation
                          </Button>
                        </Box>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Floating Chatbot Icon */}
      <IconButton
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          backgroundColor: 'primary.main',
          color: 'white',
          width: 56,
          height: 56,
          boxShadow: 3,
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
        }}
        onClick={() => setShowChatbot(true)}
      >
        <ChatIcon sx={{ fontSize: 28 }} />
      </IconButton>
    </Container>
  );
};

export default Home;