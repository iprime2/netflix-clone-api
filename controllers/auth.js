const User = require('../models/Users')
const CryptoJS = require('crypto-js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
  const password = req.body.password

  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    /*const encryptPassword = CryptoJS.AES.encrypt(
      password,
      process.env.PASS_SEC
    ).toString()*/
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    })

    const user = await newUser.save()
    //const { password, ...info } = user._doc
    res.status(201).json(user)
  } catch (error) {
    res.status(500).json(error)
  }
}

const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      return res.status(401).json('user not found')
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) {
      return res.status(400).json('Invalid password')
    }

    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: '5d' }
    )

    const { password, ...info } = user._doc

    res.status(200).json({ ...info, accessToken })
  } catch (error) {
    res.status(500).json(error)
  }
}

const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  })

  res.status(StatusCodes.OK).json({ msg: 'user logged out' })
}

module.exports = {
  register,
  login,
  logout,
}
