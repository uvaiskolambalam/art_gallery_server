const express = require('express')
const router=express.Router()
const message = require('../controllers/messageController')


router.post('/',message.newMessage)
router.get('/:conversationId',message.getMessage)

module.exports = router;