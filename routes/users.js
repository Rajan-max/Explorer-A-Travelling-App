const express = require('express')
const router = express.Router()
const users = require('../controllers/users')
const catchAsync = require('../utils/catchAsync')

const passport = require('passport')

//For Registration
router.get('/register', users.renderRegisterForm)

router.post('/register', catchAsync(users.register))

//For Login
router.get('/login', users.renderLogin)

router.post(
	'/login',
	passport.authenticate('local', {
		failureFlash: true,
		failureRedirect: '/login',
	}),
	users.login
)

//For Logout
router.get('/logout', users.logout)

module.exports = router
