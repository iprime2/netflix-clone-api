const router = require('express').Router()

const {
  create,
  getOne,
  getAll,
  getRandom,
  update,
  deleteOne,
} = require('../controllers/movies')
const { verifyToken } = require('../verifyToken')

router.post('/', verifyToken, create)
router.get('/', verifyToken, getAll)
router.get('/find/:id', verifyToken, getOne)
router.get('/random', getRandom)
router.put('/:id', verifyToken, update)
router.delete('/:id', verifyToken, deleteOne)

module.exports = router
