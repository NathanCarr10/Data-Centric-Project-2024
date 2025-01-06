var express = require('express')
var pmysql = require('promise-mysql')
var path = require('path')
var app = express()

// EJS
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '.')) 

// Express
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Database connection pool
var pool
pmysql.createPool({
    connectionLimit: 3,
    host: 'localhost',
    user: 'root',
    password: 'root',
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

// Add Student page
app.get('/students/add', (req, res) => {
    res.render('addStudent')
})

// Process Add Student form
app.post('/students/add', (req, res) => {
    let errors = []
    let sid = req.body.sid
    let name = req.body.name
    let age = req.body.age

    // Validate input
    if (!sid || sid.length !== 4) {
        errors.push('Student ID must be exactly 4 characters')
    }
    if (!name || name.length < 2) {
        errors.push('Name must be at least 2 characters')
    }
    if (!age || age < 18) {
        errors.push('Age must be 18 or older')
    }

    if (errors.length > 0) {
        res.render('addStudent', { errors: errors, sid: sid, name: name, age: age })
        return
    }

    // Check if student ID already exists
    pool.query('SELECT * FROM student WHERE sid = ?', [sid])
    .then((result) => {
        if (result.length > 0) {
            errors.push('Student with ID ' + sid + ' already exists')
            res.render('addStudent', { errors: errors, sid: sid, name: name, age: age })
        } else {
            // Add student to database
            return pool.query('INSERT INTO student (sid, name, age) VALUES (?, ?, ?)', [sid, name, age])
            .then(() => {
                res.redirect('/students')
            })
        }
    })
    .catch((error) => {
        errors.push('Database error occurred')
        res.render('addStudent', { errors: errors, sid: sid, name: name, age: age })
    })
})

app.listen(3004, () => {
    console.log("Server is running on port 3004")
})