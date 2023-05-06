const router = require('express').Router()

const { getList, create, deleteOne, update } = require('../controllers/list')
const { verifyToken } = require('../verifyToken')

router.get('/', verifyToken, getList)
router.put('/:id', verifyToken, update)
router.post('/', verifyToken, create)
router.delete('/:id', verifyToken, deleteOne)

module.exports = router
