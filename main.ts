const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const db = require('./dbInit.ts')

const app = express()
const port = 8080

const authRoutes = require("./routes/authRoutes.ts")
const resumeRoutes = require("./routes/resumeRoutes.ts")
const restrictedRoutes = require("./routes/restrictedRoutes.ts")
const adminRoutes = require("./routes/adminRoutes.ts")

let corsOptions = {
    // development purposes
    origin: "http://localhost:3000",
    credentials: true,
}

app.use(express.json())
app.use(cors(corsOptions))
app.use(cookieParser())

app.use("/auth", authRoutes)
app.use("/resume", resumeRoutes)
app.use("/restricted", restrictedRoutes)
app.use("/admin", adminRoutes)

app.get('/', (req, res) => {
    res.send('Welcome!')
})

// if endpoint does not exist
app.use((req, res) => {
    res.status(404)
    res.send('Endpoint not found.')
})

app.listen(port, () => {
    console.log(`Sample authentication app listening on port ${port}.`)
})
