const express = require('express');

const router = express.Router();

const { auth } = require('../middlewares/auth');

const { 
    allEvents, 
    getEvent, 
    createEvent, 
    updateEvent, 
    deleteEvent, 
    bookEvent,
    saveEvent 
} = require('../controllers/eventController');

const cacheMiddleware = require('../middlewares/cacheMiddleware');

router.post('/', cacheMiddleware(10), allEvents);

router.get('/:id', cacheMiddleware(10), getEvent);

router.post('/create', auth, createEvent);

router.post('/update', updateEvent);

router.delete('/delete/:id', auth, deleteEvent);

router.post('/book', auth, bookEvent);

router.post('/save', auth, saveEvent);

module.exports = router;