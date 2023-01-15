const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const User = require('../models/user');

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload._id);
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      } catch (error) {
        console.error(error);
        done(error);
      }
    }
  )
)
router.post('/signup', async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      const user = new User({
        email,
        password,
        firstName,
        lastName
      });
      await user.save();
      res.status(201).send(user);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  })
  router.post('/signin', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(401).send({ error: 'Invalid login credentials' });
      }
      const token = user.generateAuthToken();
      res.send({ token });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  })
      