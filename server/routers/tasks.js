const express = require('express');
const router = express.Router();
const Task = require('../models/Task.js');

router.get('/', async (req, res) =>{
    try{
        let query = {};
        let tasks = await Task.find(query);

        return res.status(200).json({
            'success': true,
            tasks: tasks
        });
    }catch(error){

    }
})

router.post('/', async (req, res)=>{
    try{
        const { title, description, priority, date } = req.body;
        const newTask = await Task.create({
            title,
            description: description || '',
            priority: priority || 'medium',
            date: date || new Date().toISOString().split('T')[0],
        })

        return res.json({
            success: true,
            message: 'Task created successfully',
            task: newTask,
        })
    }catch(error){
        return res.status(400).json({
            success: false,
            message: 'Error creating the task',
            error: error.message,
        })
    }
})

module.exports = router;