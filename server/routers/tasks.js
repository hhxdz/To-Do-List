const express = require('express');
const router = express.Router();
const Task = require('../models/Task.js');

router.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next(); 
})

router.get('/', async (req, res) =>{
    try{
        const { priority, sortBy } = req.query;

        let filter = {}

        if(priority){
            filter.priority = priority;
        }

        let query = Task.find(filter);


        if(sortBy === 'date'){
            query = query.sort({data: -1})
        }

        let tasks = await query;
        
        if(sortBy === 'priority'){
            const priorityOrder = {'high': 1, 'medium': 2, 'low': 3};
            tasks.sort((a, b) => {
                return (priorityOrder[a.priority] || 99) - (priorityOrder[b.priority] || 99)
            })
        }

        return res.status(200).json({
            success: true,
            tasks
        });
    }catch(error){
        return res.status(500).json({
            success: false,
            message: 'Error recieving the tasks',
            error: error.message
        })
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
            message: 'Error creating the task ',
            error: error.message,
        })
    }
})

router.put('/:id', async (req, res)=>{
    try{
        const { id } = req.params;
        const { title, description, priority, date } = req.body;

        const updatedTask = await Task.findByIdAndUpdate(
            id,
            {title, description, priority, date},
            {new: true, ranValidators: true}
        );
        
        if(!updatedTask){
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            task: updatedTask
        })
    }catch(error){
        return res.status(400).json({
            success: false,
            message: 'Error editing the task ',
            error: error.message,
        })
    }
})

router.delete("/:id", async (req, res) =>{
    try{
        const { id } = req.params;
        const deletedTask = await Task.findByIdAndDelete(id);

        if(!deletedTask){
            return res.status(404).json({
                success: false, 
                message: 'Task not found'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Task deleted successfully'
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: 'Error deleting the task',
            error: error.message,
        })
    }
})

module.exports = router;