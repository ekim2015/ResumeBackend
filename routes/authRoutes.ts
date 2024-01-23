const bcrypt = require('bcrypt')
const express = require('express')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

const db = require('../dbInit.ts')
const { regSchema, loginSchema } = require('../middleware/schema.ts')

const router = express.Router()
const privateKey = fs.readFileSync('./private.key')
const publicKey = fs.readFileSync('./public.key')

router.use(express.json())

router.get('/', async (req, res) => {
    try {
        await res.send("Hello!")
    } catch(e) {
        res.status(401).send(e)
    }
})

// register endpoint
router.post('/register', async (req, res) => {
    try {
        let saltRounds = 10
        let { email, username, password } = req.body

        // schema
        await regSchema.parseAsync(req.body)

        // if we have one value
        let check = await db.any("SELECT * FROM accounts WHERE username = $1 OR email = $2", [username, email])
        if (check.length > 0) {
            return res.status(401).json({message: "Email or username already exists!"})
        }

        // // use bcrypt to salt and hash password
        let hashed = await bcrypt.hash(password, saltRounds)
        let uniqueID = await uuidv4()
        await db.none("INSERT INTO accounts(email, username, password, id) VALUES ($1, $2, $3, $4)", [email, username, hashed, uniqueID])
        return res.json({message: 'Registration completed!'})
    } catch(e) {
        return res.status(401).send(e)
    }
})

router.post('/login', async (req, res) => {
    try {
        // query with username
        let body = req.body
        console.warn('Warning: Never show your JWT cookie value to anybody!')

        await loginSchema.parseAsync(req.body)

        let pw = await db.any('SELECT password FROM accounts WHERE username=$1 OR email=$1', [body.username])
        if (pw[0].password.length > 0) {
            let compare = await bcrypt.compare(body.password, pw[0].password)
            if (!compare) {
                return res.json({ message: "Password invalid, try again!" })
            }

        let payload = await db.one('SELECT id, perms, roles FROM accounts WHERE username=$1 OR email=$1', [body.username])

        let token = await jwt.sign(payload, privateKey, { algorithm: "RS256", expiresIn: "12hr" })
        return res.status(200)
            .cookie('token', token, { domain: 'localhost', expires: new Date(Date.now() + 3600000), httpOnly: true })
            .json({ message: "Token successfully generated!", token })
        } else {
            return res.json({ message: "Token failed to be signed." })
        }
    } catch(e) {
        return res.status(401).send(e)
    }
})


// should basically redirect to this
router.get('/verify', async (req, res) => {
    try {
        let token = req.cookies['token']
        let verify = await jwt.verify(token, publicKey)

        if (verify) {
            return res.status(200).json({verified: true, message: "Verification successful!"})
        } else {
            return res.status(401).json({verified: false, message: "Unable to verify, unauthorized."})
        }
    } catch(e) {
        return res.status(401).json({message: e})
    }
})

router.get('/checkCookie', (req, res) => {
    console.log(req.cookies)
})

module.exports = router
