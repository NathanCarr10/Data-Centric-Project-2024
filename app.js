var express = require('express')
var pmysql = require('promise-mysql')
var path = require('path')  // Add this line
var app = express()

// Set up EJS
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '.')) // This tells Express to look for views in the current directory

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Database connection pool
var pool
pmysql.createPool({
    connectionLimit: 3,
    host: 'localhost',
    user: 'root',
    password: '',  // Your MySQL password
    database: 'proj2024mysql'
})
.then((p) => {
    pool = p
})
.catch((e) => {
    console.log("pool error:" + e)
})

// Home page
app.get('/', (req, res) => {
    res.render('index')
})

// Students page
app.get('/students', (req, res) => {
    pool.query('SELECT * FROM student ORDER BY sid')
    .then((students) => {
        res.render('students', {students: students})
    })
    .catch((error) => {
        res.send(error)
    })
})

app.listen(3004, () => {
    console.log("Server is running on port 3004")
})