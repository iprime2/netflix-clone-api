const router = require('express').Router()

const {
  getOne,
  getAll,
  update,
  deleteOne,
  userStats,
} = require('../controllers/users')
const { verifyToken } = require('../verifyToken')

router.get('/', verifyToken, getAll)
router.get('/find/:id', getOne)
router.put('/:id', verifyToken, update)
router.delete('/:id', verifyToken, deleteOne)
router.get('/stats', userStats)

module.exports = router
