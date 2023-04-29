const List = require('../models/List')
const { StatusCodes } = require('http-status-codes')

const create = async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const newList = new List(req.body)

      const list = await newList.save()
      res.status(StatusCodes.CREATED).json(list)
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json(error)
    }
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json('Only Admin is allowed')
  }
}

const deleteOne = async (req, res) => {
  try {
    await List.findByIdAndDelete(req.params.id)
    res.status(StatusCodes.OK).json('list has been deleted...')
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json(error)
  }
}

const getList = async (req, res) => {
  const typeQuery = req.query.type
  const genreQuery = req.query.genre
  let list = []
  try {
    if (typeQuery) {
      if (genreQuery) {
        list = await List.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: typeQuery, genre: genreQuery } },
        ])
      } else {
        list = await List.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: typeQuery } },
        ])
      }
    } else {
      list = await List.aggregate([{ $sample: { size: 10 } }])
    }
    console.log(list)
    res.status(StatusCodes.OK).json(list)
  } catch (error) {
    //res.status(StatusCodes.BAD_REQUEST).json(error)
  }
}
module.exports = {
  create,
  deleteOne,
  getList,
}
