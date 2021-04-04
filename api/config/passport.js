import passport from 'passport'
import mongoose from 'mongoose'
import { Strategy as GitHubStrategy } from 'passport-github'
import { Strategy as LocalStrategy } from 'passport-local'

const User = mongoose.model('User')

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    function (email, password, done) {
      User.findOne({ email })
        .then(function (user) {
          if (!user || !user.validPassword(password)) {
            return done(null, false, 'Usuário ou senha inválidos')
          }
          return done(null, user)
        })
        .catch(done)
    }
  )
)

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    },
    (accessToken, refreshToken, profile, cb) => {
      const user = { token: accessToken, ...profile._json }
      // user.refreshToken = refreshToken
      return cb(null, user)
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})
