var express = require('express')
var bodyParser = require('body-parser')
const path = require('path')
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}
require('./db/conn')

const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const ExpressError = require('./utils/ExpressError')
const passport = require('passport')
const LocalStrategy = require('passport-local')

const User = require('./models/user')

//Importing Routes
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')

const { initialize } = require('passport')

var app = express()

//Template Engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', ejsMate)
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(
	express.urlencoded({
		extended: true,
	})
)
const sessionConfig = {
	secret: 'thisshouldbeabettersecret',
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7,
	},
}
app.use(methodOverride('_method')) //Used for updating purpose

app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//Storing it in user so that we can use it anywhere
app.use((req, res, next) => {
	res.locals.currentUser = req.user
	res.locals.success = req.flash('success')
	res.locals.error = req.flash('error')
	next()
})

app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)
app.use('/', userRoutes)

//Main Page
app.get('/', (req, res) => {
	res.render('home')
})

//If we hit any route other than the above ones
app.all('*', (req, res, next) => {
	next(new ExpressError('Page Not Found', 404))
})

//Express default error handler
app.use((err, req, res, next) => {
	const { statusCode = 500 } = err
	if (!err.message) err.message = 'Oh No, Something Went Wrong'
	res.status(statusCode).render('error', { err })
})

//Server Listening
const port = process.env.PORT || 8000
app.listen(port, () => {
	console.log(`App is running at port ${port}`)
})
