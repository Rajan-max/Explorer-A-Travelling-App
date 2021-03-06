const campground = require('../models/campground')
const Campground = require('../models/campground')

module.exports.index = async (req, res) => {
	const campgrounds = await Campground.find({})
	res.render('campgrounds/index', { campgrounds })
}


module.exports.renderNewForm = (req, res) => {
	res.render('campgrounds/new')
}

module.exports.createNewForm = async (req, res) => {
	const campground = new Campground(req.body.campground)
	campground.images = req.files.map((f) => ({
		url: f.path,
		filename: f.filename,
	}))
	campground.author = req.user._id
	await campground.save()
	req.flash('success', 'Successfully Added A New Place!')
	res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req, res) => {
	const campground = await Campground.findById(req.params.id)
		.populate({
			path: 'reviews',
			populate: {
				path: 'author',
			},
		})
		.populate('author')
	if (!campground) {
		req.flash('error', 'Cannot find that Place!')
		return res.redirect('/campgrounds')
	}
	res.render('campgrounds/show', { campground })
}

module.exports.renderEditForm = async (req, res) => {
	const { id } = req.params
	const campground = await Campground.findById(id)
	if (!campground) {
		req.flash('error', 'Cannot Find That Place!')
		res.redirect('/campgrounds')
	}

	res.render('campgrounds/edit', { campground })
}

module.exports.updateForm = async (req, res) => {
	const { id } = req.params
	const campground = await Campground.findByIdAndUpdate(id, {
		...req.body.campground,
	})
	const imgs = req.files.map((f) => ({
		url: f.path,
		filename: f.filename,
	}))
	campground.images.push(...imgs)
	await campground.save()
	req.flash('success', 'Successfully Updated Existing Place!')
	res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
	const { id } = req.params
	const campground = await Campground.findById(id)
	await Campground.findByIdAndDelete(id)
	req.flash('success', 'Successfully Deleted A Place!')
	res.redirect('/campgrounds')
}
