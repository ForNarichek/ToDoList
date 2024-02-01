        const form = document.querySelector('#my_form');
        const titleInput = document.querySelector('#titleInput');
        const descriptionInput = document.querySelector('#descriptionInput');
        const resultBox = document.querySelector('#resultBox');

        let tasks = [];

        if (localStorage.getItem('tasks')){
            tasks = JSON.parse(localStorage.getItem('tasks'));
        }

        tasks.forEach(function(task){
            
                // const currentDate = new Date();
                // const formattedDate = `${currentDate.getSeconds()}:${currentDate.getMinutes()}:${currentDate.getHours()} ${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;


            const cssClassTitle = task.done ? 'block__title block__title--done' : 'block__title';
            const cssClassText = task.done ? 'block__text block__text--done' : 'block__text';

                const taskHTML = `<div class="block" id="${task.id}">
                                    <div class="sub_block">
                                        <label class="input" for="html">completed</label>
                                        <input class="completed" type="checkbox" data-action="done">
                                        <button class="block__btn">!</button>
                                        <button class="block__btn" data-action="delete">x</button>
                                    </div>
                                    <div class="${cssClassTitle}">${task.title}</div>
                                    <div class="${cssClassText}">${task.text}</div>
                                    <div class="block__data">${task.data}</div>
                                </div>`;

                resultBox.insertAdjacentHTML('beforeEnd', taskHTML);
        })

        form.addEventListener('submit', addTask);
        resultBox.addEventListener('click', deleteTask);
        resultBox.addEventListener('click', doneTask);

        function addTask(event) {
            event.preventDefault();
            
            const titleText = titleInput.value;
            const descriptionText = descriptionInput.value;




            if (titleText.trim() !== "") {
                const currentDate = new Date();
                const formattedDate = `${currentDate.getSeconds()}:${currentDate.getMinutes()}:${currentDate.getHours()} ${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

                const newTask = {
                id: Date.now(),
                title: titleText,
                text: descriptionText,
                data: formattedDate,
                done: false,
            };

            tasks.push(newTask)
            // console.log(tasks);
            saveToLocalStorage();


            const cssClassTitle = newTask.done ? 'block__title block__title--done' : 'block__title';
            const cssClassText = newTask.done ? 'block__text block__text--done' : 'block__text';

                const taskHTML = `<div class="block" id="${newTask.id}">
                                    <div class="sub_block">
                                        <label class="input" for="html">completed</label>
                                        <input class="completed" type="checkbox" data-action="done">
                                        <button class="block__btn">!</button>
                                        <button class="block__btn" data-action="delete">x</button>
                                    </div>
                                    <div class="${cssClassTitle}">${newTask.title}</div>
                                    <div class="${cssClassText}">${newTask.text}</div>
                                    <div class="block__data">${newTask.data}</div>
                                </div>`;

                resultBox.insertAdjacentHTML('beforeEnd', taskHTML);

                titleInput.value = "";
                descriptionInput.value = "";
                titleInput.focus();
            }
        }

function deleteTask(event) {
    // console.log('deleteTask');
    // console.log(event.target);
    if (event.target.dataset.action === 'delete'){
      // console.log('delete');
       const parentNode = event.target.closest('.block');

       const id = Number(parentNode.id);

      const index = tasks.findIndex(function (task){
        if (task.id === id) {
            return true
        }
       });
      // console.log(index);

      tasks.splice(index, 1)

      saveToLocalStorage();

       parentNode.remove();  
    }
}

function doneTask(event) {
    if (event.target.dataset.action === "done"){
        // console.log('123123')
        const parentNode = event.target.closest('.block');

        const id = Number(parentNode.id);

       const task = tasks.find(function (task){
            if (task.id === id){
                return true

            }
        })

       task.done = !task.done
       // console.log(task);

       saveToLocalStorage();

        const taskTitle = parentNode.querySelector('.block__title');
        const taskText = parentNode.querySelector('.block__text')
        taskText.classList.toggle('block__text--done')
        taskTitle.classList.toggle('block__title--done');
        // console.log(taskTitle)


    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
