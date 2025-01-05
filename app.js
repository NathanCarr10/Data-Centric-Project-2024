const express = require('express');
const path = require('path');
const app = express();

// EJS
app.set('view engine', 'ejs');
app.set('views', path.join('C:', 'Users', 'DCwa2024', 'Desktop', 'Project', 'Data-Centric-Project-2024'));


//Express
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.render('index');
});

// Start server
const PORT = 3004;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});