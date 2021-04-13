const jwt = require('express-jwt')
const secret = process.env.SECRET || process.env.npm_package_name

function getTokenFromHeader(req) {
  if (
    (req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Token') ||
    (req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer')
  ) {
    return req.headers.authorization.split(' ')[1]
  }

  return null
}

function isAdmin(req) {
  return hasRole(req, 'admin')
}

function hasRole(req, role) {
  return req.user && req.user.role === role
}

function authenticatedAdmin(req, res, next) {
  if (isAdmin(req)) {
    next()
  } else {
    return res.status(403).json({
      status: 403,
      message:
        'A permissão de administrador é necessária para acessar este recurso.',
    })
  }
}

const jwtOptions = jwt({
  secret,
  algorithms: ['HS256'],
  userProperty: 'user',
  getToken: getTokenFromHeader,
})

const auth = {
  admin: [jwtOptions, authenticatedAdmin],
  authenticated: jwtOptions,
  isAdmin,
  hasRole,
}

module.exports = auth
