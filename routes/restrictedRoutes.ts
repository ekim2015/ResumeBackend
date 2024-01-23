const express = require('express')
const router = express.Router()

const { userVerify } = require('../middleware/auth.ts')

// check specific endpoints
router.use(userVerify)

// used to test JWT authentication
router.get('/', (req, res) => {
    return res.status(200).json({
        message: "You were able to access user-only features!"
    })
})

module.exports = router