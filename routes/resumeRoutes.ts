const express = require('express')
// parse multipart requests
const busboy = require('busboy')
const fs = require('fs')
const router = express.Router()

const verify = require('../middleware/auth.ts')
const parseStats = require('../models/parseModel.ts')
const { userVerify } = require('../middleware/auth.ts')

// authentication middleware
router.use(userVerify)

// upload resume and add to database (if logged in)
router.post("/files/upload", (req, res) => {
    try {
        let maxFiles = 10
        let maxFileSize = 20000000

        // parsing data
        let bb = busboy({ headers: req.headers, limits: { fileSize: maxFileSize, files: maxFiles } })
        bb.on('file', (name, file, info) => {
            console.log(`${name} uploaded with info ${info}`)
            file.on('close', () => {
                console.log("File uploaded and closed!")
            })
        })
        bb.on('close', () => {
            res.status(200).send("Files uploaded!")
        })

        req.pipe(bb)
        return

    } catch(e) {
        res.send(e)
    }
})

// compare resume with keywords
router.post("/compare", (req, res) => {
    let jobDesc = req.body.description 
    let resume = req.body.resume

    let percentage = parseStats(jobDesc, resume)
    console.log(percentage)   
})

module.exports = router
