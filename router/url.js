const express = require('express')
const router = express.Router()
const {createNewUrl, redirectUrl, getAnalytics} = require('../controller/url')

router.get('/:shortId', redirectUrl)
router.get('/analytics/:shortId', getAnalytics)
router.post('/', createNewUrl)

module.exports=router