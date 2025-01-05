const mysql = require('mysql2/promise');
const { MongoClient } = require('mongodb');

// MySQL connection
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'proj2024mysql',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// MongoDB connection
const mongoURI = 'mongodb://localhost:27017';
const mongoClient = new MongoClient(mongoURI);

async function connectToMongo() {
    try {
        await mongoClient.connect();
        console.log('Connected to MongoDB');
        return mongoClient.db('proj2024MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}

module.exports = {
    pool,
    connectToMongo
};