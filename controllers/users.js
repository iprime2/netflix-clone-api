const User = require('../models/Users')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { StatusCodes } = require('http-status-codes')

const getOne = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    const { password, ...info } = user._doc
    res.status(StatusCodes.OK).json(info)
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json(error)
  }
}

const getAll = async (req, res) => {
  const query = req.query.new
  if (req.user.isAdmin) {
    try {
      const user = query
        ? await User.find().sort({ _id: -1 }).limit(10)
        : await User.find()
      res.status(StatusCodes.OK).json(user)
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json(error)
    }
  } else {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json('You are not admin so not allowed ')
  }
}

const update = async (req, res) => {
  console.log(req.body)
  if (req.user.id === req.params.id || req.user.isAdmin) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10)
      req.body.password = await bcrypt.hash(password, salt)
    }

    try {
      const updateUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      )

      res.status(StatusCodes.OK).json(updateUser)
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json(error)
    }
  } else {
    res.status(StatusCodes.FORBIDDEN).json('You can only update your account')
  }
}

const deleteOne = async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    try {
      const deleteUser = await User.findByIdAndDelete(req.params.id)
      res.status(StatusCodes.OK).json('User has been deleted...')
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json(error)
    }
  } else {
    res.status(StatusCodes.FORBIDDEN).json('You can only delete your account')
  }
}

const userStats = async (req, res) => {
  const today = new Date()
  const lastYear = today.setFullYear(today.setFullYear() - 1)

  const monthsArray = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  try {
    const data = await User.aggregate([
      {
        $project: {
          month: { $month: '$createdAt' },
        },
      },
      {
        $group: {
          _id: '$month',
          total: { $sum: 1 },
        },
      },
    ])
    res.status(200).json(data)
  } catch (error) {
    res.status(StatusCodes.BAD_GATEWAY).json(error)
  }
}

module.exports = {
  update,
  deleteOne,
  getOne,
  getAll,
  userStats,
}
