const pgp = require('pg-promise')()

let dbDetails = {
    host: 'localhost',
    port: 5432,
    database: 'sample',
    user: 'superadmin',
    password: 'userDb123',
    max: 30
}

const db = pgp(dbDetails)

module.exports = db