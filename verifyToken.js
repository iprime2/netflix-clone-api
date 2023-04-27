const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token
  if (authHeader) {
    const token = authHeader.split(' ')[1]

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) res.status(StatusCodes.FORBIDDEN).json('Token is not valid')
      req.user = user
      next()
    })
  } else {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json('You are not authenticated')
  }
}

module.exports = { verifyToken }
