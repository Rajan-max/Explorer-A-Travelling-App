const express = require('express')
var router = express.Router()
const campgrounds = require('../controllers/campgrounds')
const catchAsync = require('../utils/catchAsync')

const { isLoggedIn, validateCampground, isAuthor } = require('../middleware')

const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

//TO show All Campgrounds
router.get('/', campgrounds.index)

//TO add a new Campground
router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.post(
	'/',
	isLoggedIn,
	upload.array('image'),
	validateCampground,
	catchAsync(campgrounds.createNewForm)
)

//TO show a particular campground
router.get('/:id', catchAsync(campgrounds.showCampground))

//To Edit a particular campground
router.get(
	'/:id/edit',
	isLoggedIn,
	isAuthor,
	catchAsync(campgrounds.renderEditForm)
)

router.put(
	'/:id',
	isLoggedIn,
	isAuthor,
	upload.array('image'),
	validateCampground,
	catchAsync(campgrounds.updateForm)
)

//To delete a particular campground
router.delete(
	'/:id',
	isLoggedIn,
	isAuthor,
	catchAsync(campgrounds.deleteCampground)
)

module.exports = router
