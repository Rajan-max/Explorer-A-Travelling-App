const User = require('../models/user')

module.exports.renderRegisterForm = (req, res) => {
	res.render('users/register')
}

module.exports.register = async (req, res) => {
	try {
		const { username, email, password } = req.body
		const user = new User({ email, username })
		const registeredUser = await User.register(user, password)
		req.login(registeredUser, (err) => {
			//If a user registered then we should not bother him in login again
			if (err) {
				return next(err)
			}
			req.flash('success', 'Welcome to Explorer!')
			res.redirect('/campgrounds')
		})
	} catch (e) {
		req.flash('error', e.message)
		res.redirect('register')
	}
}

module.exports.renderLogin = (req, res) => {
	res.render('users/login')
}

module.exports.login = (req, res) => {
	req.flash('success', 'welcome back!')
	const redirectUrl = req.session.returnTo || '/campgrounds' //we wanna go to the route where we want to go
	delete req.session.returnTo
	res.redirect(redirectUrl)
}

module.exports.logout = (req, res) => {
	req.logOut()
	req.flash('success', 'Goodbye!')
	res.redirect('/')
}
