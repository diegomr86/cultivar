const jwt = require('express-jwt')
const secret = process.env.SECRET || process.env.npm_package_description

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

function isSuper(req) {
  return hasRole(req, 'super')
}

function isAdminOrAbove(req) {
  return hasRole(req, 'admin') || hasRole(req, 'super')
}

function isManagerOrAbove(req) {
  return (
    hasRole(req, 'manager') || hasRole(req, 'admin') || hasRole(req, 'super')
  )
}

function isCollectorOrAbove(req) {
  return (
    hasRole(req, 'collector') ||
    hasRole(req, 'manager') ||
    hasRole(req, 'admin') ||
    hasRole(req, 'super')
  )
}

function hasRole(req, role) {
  return req.payload && req.payload.role === role
}

function authenticatedSuper(req, res, next) {
  if (isSuper(req)) {
    next()
  } else {
    return res.status(403).json({
      status: 403,
      message:
        'A permissão de super usuário é necessária para acessar este recurso.',
    })
  }
}

function authenticatedAdmin(req, res, next) {
  if (isAdminOrAbove(req)) {
    next()
  } else {
    return res.status(403).json({
      status: 403,
      message:
        'A permissão de administrador é necessária para acessar este recurso.',
    })
  }
}

function authenticatedManager(req, res, next) {
  if (isManagerOrAbove(req)) {
    next()
  } else {
    return res.status(403).json({
      status: 403,
      message:
        'A permissão de gestor ou administrador é necessária para acessar este recurso.',
    })
  }
}

function authenticatedCollector(req, res, next) {
  if (isCollectorOrAbove(req)) {
    next()
  } else {
    return res.status(403).json({
      status: 403,
      message:
        'A permissão de coletor, gestor ou administrador é necessária para acessar este recurso.',
    })
  }
}

const jwtOptions = jwt({
  secret,
  algorithms: ['HS256'],
  userProperty: 'payload',
  getToken: getTokenFromHeader,
})

const auth = {
  super: [jwtOptions, authenticatedSuper],
  adminOrAbove: [jwtOptions, authenticatedAdmin],
  managerOrAbove: [jwtOptions, authenticatedManager],
  collectorOrAbove: [jwtOptions, authenticatedCollector],
  authenticated: jwtOptions,
  optional: jwt({
    secret,
    userProperty: 'payload',
    algorithms: ['HS256'],
    credentialsRequired: false,
    getToken: getTokenFromHeader,
  }),
  isCollectorOrAbove,
  isManagerOrAbove,
  isAdminOrAbove,
  isSuper,
  hasRole,
}

module.exports = auth
