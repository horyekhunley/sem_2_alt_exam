const passport = require('passport')

// User model
const User = require('./models/user.model')

// Strategies
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const LocalStrategy = require('passport-local').Strategy

// Used to create, sign, and verify tokens
const jwt = require('jsonwebtoken')

// Local strategy with passport mongoose plugin User.authenticate() function
passport.use(new LocalStrategy(User.authenticate()))

// Required for our support for sessions in passport.
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

exports.getToken = function(user) {
    // This helps us to create the JSON Web Token
    return jwt.sign(user, process.env.JWT_SECRET,{expiresIn: 3600})
};

// Options to specify for my JWT based strategy. 
const opts = {}

// Specifies how the jsonwebtoken should be extracted from the incoming request message
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()

//Supply the secret key to be using within strategy for the sign-in. 
opts.secretOrKey = process.env.JWT_SECRET

// JWT Strategy 
exports.jwtPassport = passport.use(new JwtStrategy(opts,
    // The done is the callback provided by passport
    (jwt_payload, done) => {
       
        // Search the user with jwt.payload ID field
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            // if there is an error
            if (err) {
                return done(err, false)
            }
            // if User exist
            else if (user) {
                return done(null, user)
            }
            // if User doesn't exist
            else {
                return done(null, false)
            }
        });
    }));

// Verify an incoming user with jwt strategy we just configured above    
exports.verifyUser = passport.authenticate('jwt', { session: false })
