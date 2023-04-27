const router = require('express').Router()

const { getList, create, deleteOne } = require('../controllers/list')
const { verifyToken } = require('../verifyToken')

router.get('/', verifyToken, getList)
router.post('/', verifyToken, create)
router.delete('/:id', verifyToken, deleteOne)

module.exports = router
