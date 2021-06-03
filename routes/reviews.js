const express = require('express')
var router = express.Router({ mergeParams: true })
const reviews = require('../controllers/reviews')
const catchAsync = require('../utils/catchAsync')

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')

//Adding Reviews
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.addReview))

//Deleting Reviews
router.delete(
	'/:reviewId',
	isLoggedIn,
	isReviewAuthor,
	catchAsync(reviews.deleteReview)
)

module.exports = router
