const express = require('express')
const router = express.Router()
const passport = require('passport')
const { getAllUsers, registerUser, loginUser, logoutUser } = require("../controllers/user.controllers")

// User model
const User = require('../models/user.model');

// Get authenticate module
const authenticate = require('../authenticate')

// Get Users
router.get('/', authenticate.verifyUser, getAllUsers)

// Register User 
router.post('/signup', registerUser)

// Login 
router.post('/login', passport.authenticate('local'), loginUser)

// Logout 
router.get('/logout', logoutUser)

module.exports = router