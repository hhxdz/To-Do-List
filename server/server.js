const express = require('express');
const path = require('path');
const cors = require('cors')
require('dotenv').config();

const connectDB = require('./config/db.js')
const taskRouter = require('./routers/tasks.js');

const app = express();

const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '../public')))

app.use('/api/tasks', taskRouter);

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, '../public/index.html'));
})

app.use((req, res)=>{
    res.status(404).json({
        success: false,
        message: 'Page not found'
    })
})

app.listen(PORT, ()=>{
    console.log(`App started at http://localhost:${PORT}`);
    
})