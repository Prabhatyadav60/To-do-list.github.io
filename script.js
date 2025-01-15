
function saveTasks(tasks) {
    const expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000; // 1 day in ms
    const data = { tasks, expiry: expiryTime };
    localStorage.setItem('todoList', JSON.stringify(data));
}

function loadTasks() {
    const data = JSON.parse(localStorage.getItem('todoList'));
    if (data) {
        const now = new Date().getTime();
        if (now < data.expiry) {
            return data.tasks || [];
        }
    }
    return [];
}

function renderTasks(tasks) {
    const taskList = document.getElementById('taskList');
    const taskStatus = document.getElementById('taskStatus');
    const progress = document.getElementById('progress');
    const completedTasks = tasks.filter(task => task.completed).length;

    taskStatus.textContent = `${completedTasks} of ${tasks.length} tasks completed`;
    progress.style.width = tasks.length > 0 ? `${(completedTasks / tasks.length) * 100}%` : '0%';

    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.classList.toggle('completed', task.completed);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.onchange = () => {
            task.completed = checkbox.checked;
            saveTasks(tasks);
            renderTasks(tasks);
            if (checkbox.checked) triggerConfetti();
        };

        const span = document.createElement('span');
        span.textContent = task.text;
        span.classList.add('task-content');

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => {
            showDeleteGif();
            tasks.splice(index, 1);
            saveTasks(tasks);
            renderTasks(tasks);
        };

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteButton);
        taskList.appendChild(li);
    });
}

function displayDate() {
    const currentDate = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').textContent = currentDate.toLocaleDateString(undefined, options);
}

document.addEventListener('DOMContentLoaded', () => {
    let tasks = loadTasks();
    renderTasks(tasks);

    const taskInput = document.getElementById('taskInput');
    displayDate();

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const taskText = taskInput.value.trim();
            if (taskText) {
                tasks.push({ text: taskText, completed: false });
                saveTasks(tasks);
                renderTasks(tasks);
                taskInput.value = '';
            }
        }
    });
});
