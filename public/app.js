const API_URL = "/api/tasks";

let currentEditId = null;
let currentFilter = 'all';
let currentSort = '';

const taskForm = document.querySelector('#task-form');
const taskTitle = document.querySelector('#task-title');
const taskDescription = document.querySelector('#task-description');
const taskPriority = document.querySelector('#task-priority');
const taskDate = document.querySelector('#task-date');
const taskList = document.querySelector('#task-list');
const createTaskBtn = document.querySelector('#create-task-btn');
const cancelEditingBtn = document.querySelector('#cancel-editing');
const editBtn = document.querySelector('.edit-btn');

const emptyState = document.querySelector('#empty-state');
const filterButtons = document.querySelectorAll('.filter-btn');
const sortSelect = document.querySelector('#sort-by');

document.addEventListener('DOMContentLoaded', ()=>{
    setupEventListeners();
    loadTasks();
})

function setupEventListeners(){
    taskForm.addEventListener('submit', handleFormSubmit)
}


async function handleFormSubmit(e){
    e.preventDefault();

    const taskData = {
        title: taskTitle.value.trim(),
        description: taskDescription.value.trim(),
        priority: taskPriority.value,
        date: taskDate.value
    };
    console.log(taskData);
    
    if(currentEditId){
        await updateTask(currentEditId, taskData);
        currentEditId = null;
        createTaskBtn.textContent = 'Create task';
        cancelEditingBtn.style.display = 'none';
    }else{
        await createTask(taskData)
    }
}


async function createTask(taskData) {
    try{
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(taskData),
        });

        const result = await response.json();

        if(result.success){
            showToast('Created the task successfully', 'success')
            loadTasks();
            taskForm.reset();
        }else{
            showToast('Error creating the task', 'error')
        }
    }catch(err){
        console.error('Error creating the task', err);
        showToast('Error connecting to the server', 'error')
        
    }
}

async function loadTasks(){
    try{
        const response = await fetch(API_URL);
        const result = await response.json();

        if(result.success){
            displayTasks(result.tasks);
            console.log(result.tasks);
        }else{
            showToast('Error loading the tasks', 'error')
        }
    }catch(err){
        console.error('Error loading the tasks', err);
        showToast('Error connecting to the server', 'error')
    }
}

function createTaskCard(task){
    const taskCard = document.createElement('div');
    taskCard.className = `task-card priority-${task.priority}`;
    const createdDate = new Date(task.createdAt);
    const formattedCreatedAt = Number.isNaN(createdDate.getTime())
        ? task.createdAt
        : createdDate.toISOString().split('T')[0];
    taskCard.innerHTML = 
        `<div class="task-header">
            <div>
                <h3 class="task-title">${task.title}</h3>
                <span class="task-priority priority-${task.priority}"></span>
            </div>
            <p class="task-description">${task.description}</p>
            <div class="task-meta">
                <div class="task-data">
                    <span>Date: ${task.date}</span>
                </div>
                <div class="task-data">
                    <span>Created: ${formattedCreatedAt}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="edit-btn" onclick="editTask('${task._id}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-pen-icon lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>
                </button>
                <button class="delete-btn" onclick="deleteTask('${task._id}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
            </div>
        </div>`

    return taskCard
}

async function editTask(id){
    try{
        const response = await fetch(API_URL);
        const result = await response.json();

        if(result.success){
            const task = result.tasks.find(t => t._id === id);
            if(task){
                currentEditId = id;
                taskTitle.value = task.title;
                taskDescription.value = task.description;
                taskPriority.value = task.priority;
                taskDate.value = task.data;

                createTaskBtn.textContent = 'Save changes';
                cancelEditingBtn.style.display = 'inline-block';
                window.scrollTo({top: 0, behavior: 'smooth'})
                

            }
        }
    }catch(err){
        console.error('Error editing the task', err)
        showToast('Error connecting to the server', 'error')
    }
}

async function updateTask(id, taskData){
    try{
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(taskData)
        })
        const result = await response.json();
        if(result.success){
            showToast(result.message, 'success');
            loadTasks();
            taskForm.reset();
        }else{
            showToast(result.message || 'Error updating the task', 'error')
        }
    }catch(err){
        console.error('Error updating the task', err)
        showToast('Error connecting to the server', 'error')
    }
}

function displayTasks(tasks){
    taskList.innerHTML = '';

    if(tasks.length === 0){
        emptyState.style.display = 'block';
        taskList.appendChild(emptyState);
        return
    }

    tasks.forEach(task => {
        const taskCard = createTaskCard(task);
        taskList.appendChild(taskCard);
    });
}


async function  deleteTask(taskId){
    if(!confirm('Are you sure that you want to delete this task?')){
        return
    }
    
    try{
        const response = await fetch(`${API_URL}/${taskId}`, {
            method: 'DELETE'
        })
        const result = await response.json();

        if(result.success){
            showToast('Deleted the task successfully', 'success')
            loadTasks();
        }else{
            showToast('Error deleting the task', 'error')
        }
    }catch(err){
        console.error('Error deleting the task', err);
        showToast('Error connecting to the server', 'error')
    }
}


function showToast(message, type = 'success'){
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = type;
    toast.classList.add('show');

    setTimeout(()=>{
        toast.classList.remove('show');
    }, 2000)
}