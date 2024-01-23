// testing admin role
const express = require('express')
const router = express.Router()

const { roleVerify } = require('../middleware/auth.ts')

router.use(roleVerify('admin'))

router.get('/', (req, res) => {
    res.status(200).json({ admin: true, message: "You are an administrator!" })
})

module.exports = router
