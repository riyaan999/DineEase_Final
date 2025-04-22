import React from 'react';
import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const LoyaltyPoints = ({ points = 0, reservationHistory = [] }) => {
  // Calculate tier based on points
  const getTier = (points) => {
    if (points >= 1000) return 'Gold';
    if (points >= 500) return 'Silver';
    return 'Bronze';
  };

  // Calculate progress to next tier
  const getNextTierProgress = (points) => {
    if (points >= 1000) return 100;
    if (points >= 500) return (points - 500) / 5;
    return points / 5;
  };

  // Get points needed for next tier
  const getPointsToNextTier = (points) => {
    if (points >= 1000) return 0;
    if (points >= 500) return 1000 - points;
    return 500 - points;
  };

  const tier = getTier(points);
  const progress = getNextTierProgress(points);
  const pointsNeeded = getPointsToNextTier(points);

  // Benefits by tier
  const tierBenefits = {
    Bronze: [
      'Earn 1 point per $1 spent',
      'Birthday special offer',
      'Newsletter updates'
    ],
    Silver: [
      'Earn 1.5 points per $1 spent',
      'Priority reservations',
      'Free dessert on birthday',
      'Exclusive monthly offers'
    ],
    Gold: [
      'Earn 2 points per $1 spent',
      'VIP reservations',
      'Complimentary appetizer',
      'Special event invitations',
      'Dedicated concierge service'
    ]
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <StarIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6">Loyalty Program</Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="subtitle1">
            Current Tier: {tier}
          </Typography>
          <Chip
            icon={<LocalOfferIcon />}
            label={`${points} Points`}
            color="primary"
            variant="outlined"
          />
        </Box>

        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ height: 8, borderRadius: 4 }}
        />

        {pointsNeeded > 0 && (
          <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
            {pointsNeeded} points needed for next tier
          </Typography>
        )}
      </Box>

      <Typography variant="subtitle1" gutterBottom>
        Your {tier} Benefits
      </Typography>
      <List dense>
        {tierBenefits[tier].map((benefit, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <ListItemText primary={benefit} />
            </ListItem>
            {index < tierBenefits[tier].length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Recent Points Activity
        </Typography>
        <List dense>
          {reservationHistory.slice(0, 3).map((reservation, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`+${Math.floor(reservation.amount * (tier === 'Gold' ? 2 : tier === 'Silver' ? 1.5 : 1))} points`}
                secondary={`Reservation at ${reservation.restaurantName}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Paper>
  );
};

export default LoyaltyPoints;