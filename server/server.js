const express = require('express');
require('dotenv').config();

const taskRouter = require('./routers/tasks');

const app = express();

const PORT = process.env.PORT || 3000;

// app.use('/api/tasks', taskRouter);

app.get('/', (req, res)=>{
    res.send('Welcome to the Task Management');
})

app.listen(PORT, ()=>{
    console.log(`App started at http://localhost:${PORT}`);
    
})