const express = require('express')
const router=express.Router()
const conversation = require('../controllers/conversationController')



router.post('/',conversation.newChat)
router.get('/:userId',conversation.getChat)
module.exports = router;