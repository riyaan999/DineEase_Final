const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const auth = require('../middleware/auth');

// Get user's reservations
router.get('/user', auth, async (req, res) => {
    try {
        const reservations = await Reservation.find({ user: req.user.id })
            .populate('restaurant', ['name', 'location'])
            .sort({ date: -1 });
        res.json(reservations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Create new reservation
router.post('/', auth, async (req, res) => {
    try {
        const { restaurantId, date, time, partySize, specialRequests } = req.body;

        const newReservation = new Reservation({
            user: req.user.id,
            restaurant: restaurantId,
            date,
            time,
            partySize,
            specialRequests
        });

        const reservation = await newReservation.save();
        await reservation.populate('restaurant', ['name', 'location']);
        res.json(reservation);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update reservation
router.put('/:id', auth, async (req, res) => {
    try {
        let reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        // Make sure user owns reservation
        if (reservation.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const { date, time, partySize, specialRequests } = req.body;
        reservation = await Reservation.findByIdAndUpdate(
            req.params.id,
            { date, time, partySize, specialRequests },
            { new: true }
        ).populate('restaurant', ['name', 'location']);

        res.json(reservation);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Cancel reservation
router.delete('/:id', auth, async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        // Make sure user owns reservation
        if (reservation.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await reservation.remove();
        res.json({ message: 'Reservation cancelled' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;