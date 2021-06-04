const Campground = require('../models/campground')
const Review = require('../models/review')

module.exports.addReview = async (req, res) => {
	const campground = await Campground.findById(req.params.id)
	const review = new Review(req.body.review)
	review.author = req.user._id
	campground.reviews.push(review)
	await review.save()
	await campground.save()
	req.flash('success', 'Thanks For Your Contribution!Successfully Added!')
	res.redirect(`/campgrounds/${campground._id}`)  //Rendering the particular routes with ID
}

module.exports.deleteReview = async (req, res) => {
	const { id, reviewId } = req.params
	await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
	await Review.findByIdAndDelete(reviewId)
	req.flash('success', 'Successfully Deleted a Review')
	res.redirect(`/campgrounds/${id}`)
}
