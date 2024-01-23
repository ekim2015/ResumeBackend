const z = require('zod')
const express = require('express')

const regSchema = z.object({
    email: z.string({
        required_error: "Email required."
    }).email('Invalid email'),
    username: z.string({
        required_error: "Username required."
    })
    .min(3, 'Username should be at least 3 chars long.'),
    password: z.string({
        required_error: "Password required."
    })
    .min(8, 'Password needs to be at least 8 chars long.')
})

const loginSchema = z.object({
    username: z.string({
        required_error: "Username required."
    })
    .min(3, 'Username should be at least 3 chars long.'),
    password: z.string({
        required_error: "Password required."
    })
    .min(1, "Password field can not be left empty.")
})


module.exports = { regSchema, loginSchema }

