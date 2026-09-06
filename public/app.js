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

const emptyState = document.querySelector('#empty-state');
const filterButtons = document.querySelectorAll('.filter-btn');
const sortSelect = document.querySelector('#sort-by');

const imageInp = document.getElementById('bg-img-inp');
const bgImgBtn = document.querySelector('.bg-custom-btn');

const changeBgModal = document.querySelector('.change-bg-modal');

const openModalBtns = document.querySelectorAll('.open-modal-btn');
const modalBg = document.querySelector('.modal-bg');
const modals = document.querySelectorAll('.modal')

document.addEventListener('DOMContentLoaded', ()=>{
    setupEventListeners();
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
        // await updateTask(currentEditId, taskData)
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
    }catch(err){
        console.error('Error creating the task', err);
        
    }
}

bgImgBtn.addEventListener('click', ()=>{
    imageInp.click();
})

// changeBgBtn.addEventListener('click', ()=>{
//     changeBgModal.style.display = 'block';
// })


function closeAllModals(){
    modals.forEach(modal =>{
        modal.style.display = 'none';
    })
    modalBg.classList.remove('modal-open')
}
    
openModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const modalClass = btn.getAttribute('data-modal-class');
        const modal = document.querySelector(`.${modalClass}`);
        console.log(modal);
        
        modal.style.display = 'block';
        modalBg.classList.add('modal-open')
    });
});

modalBg.addEventListener('click', closeAllModals)
document.addEventListener('keydown', (event)=>{
    if(event.key === 'Escape') closeAllModals();
})