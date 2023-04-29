const Movies = require('../models/Movies')
const { StatusCodes } = require('http-status-codes')

const create = async (req, res) => {
  //if (req.user.isAdmin) {
  try {
    const newMovie = new Movies(req.body)

    const movie = await newMovie.save()
    res.status(StatusCodes.CREATED).json(movie)
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.BAD_REQUEST).json(error)
  }
  //} else {
  //  res.status(StatusCodes.UNAUTHORIZED).json('Only Admin is allowed')
  //}
}

const getOne = async (req, res) => {
  try {
    const movie = await Movies.findById(req.params.id)
    res.status(StatusCodes.OK).json(movie)
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json(error)
  }
}

const getRandom = async (req, res) => {
  const type = req.query.type
  let movie
  try {
    if (type === 'series') {
      movie = await Movies.aggregate([
        { $match: { isSeries: true } },
        { $sample: { size: 1 } },
      ])
    } else if (type === 'movies') {
      movie = await Movies.aggregate([
        { $match: { isSeries: false } },
        { $sample: { size: 1 } },
      ])
    } else {
      movie = await Movies.aggregate([{ $sample: { size: 1 } }])
    }
    res.status(StatusCodes.OK).json(movie)
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json(error)
  }
}

const getAll = async (req, res) => {
  const query = req.query.new

  if (req.user.isAdmin) {
    try {
      const movie = query
        ? await Movies.find().sort({ _id: -1 }).limit(10)
        : await Movies.find()
      res.status(StatusCodes.OK).json(movie)
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
  if (req.user.id === req.params.id || req.user.isAdmin) {
    try {
      const updatedMovie = await Movies.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      )

      res.status(StatusCodes.OK).json(updatedMovie)
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json(error)
    }
  } else {
    res.status(StatusCodes.FORBIDDEN).json('You can only update your account')
  }
}

const deleteOne = async (req, res) => {
  try {
    await Movies.findByIdAndDelete(req.params.id)
    res.status(StatusCodes.OK).json('Movie has been deleted...')
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json(error)
  }
}

module.exports = {
  update,
  deleteOne,
  getOne,
  getAll,
  getRandom,
  create,
}
