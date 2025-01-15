
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
            if (checkbox.checked) showLottieAnimation(li);
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


function showLottieAnimation(parentElement) {
    const lottie = document.createElement('lottie-player');
    lottie.setAttribute('src', 'https://lottie.host/embed/00770f2e-13a1-43ad-a45f-7d3868e95637/WJFul7gYpG.json');
    lottie.setAttribute('background', 'transparent');
    lottie.setAttribute('speed', '1');
    lottie.setAttribute('autoplay', 'true');
    lottie.style.width = '50px';
    lottie.style.height = '50px';
    lottie.style.marginLeft = '10px';

    parentElement.appendChild(lottie);


    setTimeout(() => {
        parentElement.removeChild(lottie);
    }, 1500);
}


function displayDate() {
    const currentDate = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').textContent = currentDate.toLocaleDateString(undefined, options);
}


function showDeleteGif() {
    const gifContainer = document.getElementById('deleteGifContainer');
    gifContainer.innerHTML = `<img src="https://media.giphy.com/media/3orieRYTXkNkUG1UMU/giphy.gif" alt="Deleted" />`;
    setTimeout(() => {
        gifContainer.innerHTML = '';
    }, 2000);
}


function triggerConfetti() {
    const confettiCanvas = document.getElementById('confettiCanvas');
    const confetti = new JSConfetti({ canvas: confettiCanvas });
    confetti.addConfetti({
        confettiColors: ['#9eeb34', '#fff'],
    });
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
