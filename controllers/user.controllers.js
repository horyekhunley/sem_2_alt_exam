const User = require('../models/user.model')
const passport = require("passport")
const authenticate = require("../authenticate")

exports.getAllUsers = (req, res, next) => {
	User.find({})
			.then((users) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json')
				// format result as json
				res.json(users);
			}, (err) => next(err))
			.catch((err) => next(err));
}
exports.registerUser = (req, res, next) => {
	User.register(new User({username: req.body.username}),
			req.body.password, (err, user) => {
				if(err) {
					res.statusCode = 500;
					res.setHeader('Content-Type', 'application/json')
					res.json({err: err})
				}
				else {
					// Use passport to authenticate User
					passport.authenticate('local')(req, res, () => {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json')
						res.json({success: true, status: 'Registration Successful!'})
					});
				}
			});
}
exports.loginUser = (req, res, next) => {
	// Create a token
	const token = authenticate.getToken({_id: req.user._id})

	// Response
	res.statusCode = 200
	res.setHeader('Content-Type', 'application/json')
	res.json({success: true, token: token, status: 'You are successfully logged in!'})
}
exports.logoutUser = (req, res, next) => {
	if (req.session) {
		req.session.destroy()
		res.clearCookie('session-id')
		res.redirect('/')
	}
	else {
		const err = new Error('You are not logged in!')
		err.status = 403
		next(err)
	}
}