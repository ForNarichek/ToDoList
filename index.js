const form = document.querySelector('#my_form');
const titleInput = document.querySelector('#titleInput');
const descriptionInput = document.querySelector('#descriptionInput');
const resultBox = document.querySelector('#resultBox');
const resetButton = document.querySelector('#resetDates');

let tasks = [];
let selectedTaskId = null;

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    renderTasks();
}

function renderTasks() {
    resultBox.innerHTML = '';

    tasks.forEach(function(task) {
        const cssClassTitle = task.done ? 'block__title block__title--done' : 'block__title';
        const cssClassText = task.done ? 'block__text block__text--done' : 'block__text';
        const checkedAttribute = task.done ? 'checked' : '';

        const taskHTML = `<div class="block" id="${task.id}">
                            <div class="sub_block">
                                <label class="input" for="html">completed</label>
                                <input class="completed" type="checkbox" data-action="done" ${checkedAttribute}>
                                <button class="block__btn"  id="btn__edit" data-action="edit" data-task-id="${task.id}">&#128221;</button>
                                <button class="block__btn" data-action="delete">x</button>
                            </div>
                            <div class="${cssClassTitle}">${task.title}</div>
                            <div class="${cssClassText}">${task.text}</div>
                            <div class="block__data">${task.data}</div>
                        </div>`;

        resultBox.insertAdjacentHTML('beforeEnd', taskHTML);
    });
}

function addTask(event) {
    event.preventDefault();

    const titleText = titleInput.value.trim();
    const descriptionText = descriptionInput.value.trim();

    if (titleText === "") {
        return; // Если заголовок пустой, выходим из функции
    }

    const currentDate = new Date();
    const formattedDate = `${currentDate.getSeconds()}:${currentDate.getMinutes()}:${currentDate.getHours()} ${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

    if (selectedTaskId) {
        const selectedTaskIdNumber = parseInt(selectedTaskId, 10);
        const taskToUpdate = tasks.find(task => task.id === selectedTaskIdNumber);
        if (taskToUpdate) {
            taskToUpdate.title = titleText;
            taskToUpdate.text = descriptionText;
            taskToUpdate.data = formattedDate;
        } else {
            console.log("Task with ID", selectedTaskId, "not found in tasks array.");
        }
        selectedTaskId = null;
    } else {

        const newTask = {
            id: Date.now(),
            title: titleText,
            text: descriptionText,
            data: formattedDate,
            done: false,
        };
        tasks.push(newTask);
    }

    saveToLocalStorage();
    renderTasks();

    titleInput.value = "";
    descriptionInput.value = "";
    titleInput.focus();
}

function deleteTask(event) {
    if (event.target.dataset.action === 'delete') {
        const parentNode = event.target.closest('.block');
        const id = Number(parentNode.id);

        const index = tasks.findIndex(function(task) {
            return task.id === id;
        });

        tasks.splice(index, 1);
        saveToLocalStorage();
        renderTasks();
    }
}

function toggleTaskDone(event) {
    if (event.target.dataset.action === 'done') {
        const parentNode = event.target.closest('.block');
        const id = Number(parentNode.id);

        const task = tasks.find(function(task) {
            return task.id === id;
        });

        task.done = !task.done;
        saveToLocalStorage();
        renderTasks();
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function resetBlocks() {
    resultBox.innerHTML = '';
    tasks = [];
    localStorage.removeItem('tasks');
}

function sortByTitles() {
    tasks.sort((a, b) => a.title.localeCompare(b.title));
    renderTasks();
}

function sortByDates() {
    tasks.sort((a, b) => a.id - b.id); 
    renderTasks();
}

function transferDataToForm(event) {
    const blockElement = event.target.closest('.block');
    if (!blockElement) return;

    selectedTaskId = blockElement.id;
    const titleElement = blockElement.querySelector('.block__title');
    const textElement = blockElement.querySelector('.block__text');

    titleInput.value = titleElement.textContent;
    descriptionInput.value = textElement.textContent;
}

document.querySelector('#resultBox').addEventListener('click', function(event) {
    if (event.target.classList.contains('block__btn')) {
        transferDataToForm(event);
    }
});



form.addEventListener('submit', addTask);
resultBox.addEventListener('click', deleteTask);
resultBox.addEventListener('click', toggleTaskDone);
document.querySelector('#sortByTitles').addEventListener('click', sortByTitles);
document.querySelector('#sortByDates').addEventListener('click', sortByDates);
resetButton.addEventListener('click', resetBlocks);
