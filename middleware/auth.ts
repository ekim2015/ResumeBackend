const express = require('express')
const jwt = require('jsonwebtoken')
const fs = require('fs')

const privateKey = fs.readFileSync('./private.key')

// check if they're an admin
const roleVerify = (role) => {
    return async (req, res, next) => {
        try {
            let token = req.cookies['token']
            if (!token) {
                return res.status(401).json({message: 'Header empty, try again!'})
            } 

            let verified = await jwt.verify(token, privateKey, { algorithms: ['RS256']  })
            if (!verified) {
                return res.status(401).json({message: 'Unable to authorize request.'})
            } 

            // check if the admin role is included
            if (verified['roles'] == null || !verified['roles'].includes(role)) {
                return res.status(401).json({message: 'Not given the proper roles!'})
            }

            next()
            
        } catch(e) {
            return res.status(401).json({message: e})
        }
    }
}

// check if they're a user
const userVerify = async (req, res, next) => {
    try {
        let token = req.cookies['token']
        if (!token) {
            return res.status(401).json({message: 'Header empty, try again!'})
        } 
    
        let verified = await jwt.verify(token, privateKey, { algorithms: ['RS256']  })
        if (!verified) {
            return res.status(401).json({message: 'Unable to authorize request.'})
        } 

        next()
        
    } catch(e) {
        return res.status(401).json({message: e})
    }
}

module.exports = { roleVerify, userVerify }