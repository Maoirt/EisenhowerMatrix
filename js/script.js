// переменные категорий
const importantUrgentList = document.getElementById('important-urgent-list');
const importantNotUrgentList = document.getElementById('important-not-urgent-list');
const notImportantUrgentList = document.getElementById('not-important-urgent-list');
const notImportantNotUrgentList = document.getElementById('not-important-not-urgent-list');

// переменные счетчиков
let completedCounterAll = document.getElementById('completed-counter-all')
let timeCounterAll = document.getElementById('time-counter-all')
let createdCounterAll = document.getElementById('created-counter-all')

//для работы с localstorage, переменные  категорий 
let importantUrgentListLocal;
let importantNotUrgentListLocal;
let notImportantUrgentListLocal;
let notImportantNotUrgentListLocal;


//функция для задания значений переменных localstorage
function toLocal() {
    //категории
    importantUrgentListLocal = importantUrgentList.innerHTML;
    importantNotUrgentListLocal = importantNotUrgentList.innerHTML;
    notImportantUrgentListLocal = notImportantUrgentList.innerHTML;
    notImportantNotUrgentListLocal = notImportantNotUrgentList.innerHTML;

    //счетчики
    completedCounterAllLocal = completedCounterAll.innerHTML;
    timeCounterAllLocal = timeCounterAll.innerHTML;
    createdCounterAllLocal = createdCounterAll.innerHTML;

    //категории
    localStorage.setItem("importantUrgentListLocal", importantUrgentListLocal)
    localStorage.setItem("importantNotUrgentListLocal", importantNotUrgentListLocal)
    localStorage.setItem("notImportantUrgentListLocal", notImportantUrgentListLocal)
    localStorage.setItem("notImportantNotUrgentListLocal", notImportantNotUrgentListLocal)

    //счетчики
    localStorage.setItem("completedCounterAllLocal", completedCounterAllLocal)
    localStorage.setItem("timeCounterAllLocal", timeCounterAllLocal)
    localStorage.setItem("createdCounterAllLocal", createdCounterAllLocal)
}

// функция для выполнения задач + счетчик, считающий выполненные задачи
function markAsCompleted(event) {

    //выполнение задачи
    const li = event.target.closest('li');
    const completedButton = li.querySelector('.completed-button');
    completedButton.style.display = 'none';
    li.style.textDecoration = 'line-through';
    // const list = li.parentNode;

    //счетчик для выполненных задач
    const completedCounter = document.querySelector('.completed-counter');
    completedCounter.textContent = Number(completedCounter.textContent) + 1;
    const completedCounterAll = document.querySelector('.completed-counter-all');
    completedCounterAll.textContent = Number(completedCounterAll.textContent) + 1;

    //удаление кнопки начать таймер
    const startButton = li.querySelector('.start-button');
    startButton.remove();


    toLocal();
}


//функция начала выполнения задачи
function startTimeTask(event) {
    const startButton = event.target;
    const li = startButton.closest('li');

    //удаление кнопки завершить задачу 
    const completedButton = li.querySelector('.completed-button');
    completedButton.remove();


    //скрываем кнопку начать и старую кнопку закончить
    startButton.style.display = 'none';

    // создаем кнопку паузы
    const pauseButton = document.createElement('button');
    pauseButton.innerHTML = '⏸';
    pauseButton.classList.add('pause-button');
    pauseButton.addEventListener('click', pauseTimeTask);

    // таймер
    const timeSpan = document.createElement('span');
    timeSpan.classList.add('time-counter');
    timeSpan.innerHTML = '00:00';


    // создаем кнопку завершить
    const completeButton = document.createElement('button');
    completeButton.innerHTML = '✔️';
    completeButton.classList.add('end-button');
    completeButton.addEventListener('click', endTimeTask);
    // completeButton.addEventListener('click', markAsCompleted); ???

    //добавляем кнопки в задачу 
    //тут можно поменять последовательность кнопок
    li.appendChild(timeSpan);
    li.appendChild(completeButton);
    li.appendChild(pauseButton);
    // запуск таймера
    let seconds = 0;
    let minutes = 0;
    function updateTime() {
        seconds++;
        if (seconds >= 60) {
            minutes++;
            seconds = 0;
        }
        console.log(minutes)
        console.log(seconds)
        //сохраняем секунды и минуты
        li.setAttribute('data-timer-sec', seconds);
        li.setAttribute('data-timer-min', minutes);

        const displayMinutes = ('0' + minutes).slice(-2);
        const displaySeconds = ('0' + seconds).slice(-2);
        timeSpan.innerHTML = `${displayMinutes}:${displaySeconds}`;
    }
    const timerInterval = setInterval(updateTime, 1000);

    // сохраняем интервал
    li.setAttribute('data-timer-interval', timerInterval);
    li.setAttribute('data-time-counter', timeSpan);
    // 22.06.2023 ВАЖНО


}

//функция завершения выполнения задачи

function endTimeTask(event) {
    const endButton = event.target;
    const li = endButton.closest('li');

    //остановка таймера
    const timerInterval = li.getAttribute('data-timer-interval');
    clearInterval(timerInterval);

    //удаление атрибутов у li
    li.removeAttribute('data-timer-interval');
    li.removeAttribute('data-time-counter');
    li.removeAttribute('data-pause-start-time');

    //удаление кнопок паузы, завершения

    const pauseButton = li.querySelector('.pause-button');
    if (pauseButton) {
        pauseButton.remove();
    }
    endButton.remove();

    resumeButton = li.querySelector('.resume-button');

    if (resumeButton) {
        resumeButton.remove();
    }

    //счетчик выполненных задач

    const completedCounter = document.querySelector('.completed-counter');
    completedCounter.textContent = Number(completedCounter.textContent) + 1;
    const completedCounterAll = document.querySelector('.completed-counter-all');
    completedCounterAll.textContent = Number(completedCounterAll.textContent) + 1;

    //работаем тут сейчас
    let seconds = parseInt(li.getAttribute('data-timer-sec'));
    let minutes = parseInt(li.getAttribute('data-timer-min'));
    let timeCount = minutes + (seconds / 60);
    console.log(`мяу ${seconds} дважды гав ${minutes} флофол ${timeCount}`)
    console.log(timeCount)

    //счетчик времени
    if (seconds < 1 || isNaN(timeCount)) {
    }
    else {
        const timeCounter = document.querySelector('.time-counter-time');
        timeCounter.textContent = Number(timeCounter.textContent) + Number(timeCount);
        const timeCounterAll = document.querySelector('.time-counter-all');
        timeCounterAll.textContent = Number(timeCounterAll.textContent) + Number(timeCount);

    }

    toLocal();

}

//функция паузы выполнения задачи
function pauseTimeTask(event) {
    const pauseButton = event.target;
    const li = pauseButton.closest('li');

    // остановка таймера
    const timerInterval = li.getAttribute('data-timer-interval');
    clearInterval(timerInterval);

    // сохранение времени паузы
    const timeSpan = li.querySelector('.time-counter');
    const pauseStartTime = new Date().getTime();
    li.setAttribute('data-pause-start-time', pauseStartTime);
    //li.setAttribute('data-pause-sec', seconds);
    //li.setAttribute('data-pause-min', minutes);

    // удаление кнопки паузы
    pauseButton.remove();

    // создание кнопки возобновления
    const resumeButton = document.createElement('button');
    resumeButton.innerHTML = '▶️';
    resumeButton.classList.add('resume-button');
    resumeButton.addEventListener('click', resumeTimeTask);
    li.appendChild(resumeButton);
    let seconds = parseInt(li.getAttribute('data-timer-sec'));
    let minutes = parseInt(li.getAttribute('data-timer-min'));
    li.setAttribute('data-pause-sec', seconds);
    li.setAttribute('data-pause-min', minutes);
    toLocal();
}

//функция возобновления выполнения задачи после паузы
function resumeTimeTask(event) {

    const resumeButton = event.target;
    const li = resumeButton.closest('li');

    // получаем время паузы ??? НЕ РАБОТАЕТ 
    const pauseStartTime = parseInt(li.getAttribute('data-pause-start-time'));
    console.log('гав')

    console.log(pauseStartTime)

    // создаем кнопку паузы и удаляем кнопку возобновления
    const pauseButton = document.createElement('button');
    pauseButton.innerHTML = '⏸';
    pauseButton.classList.add('pause-button');
    pauseButton.addEventListener('click', pauseTimeTask);
    li.appendChild(pauseButton);
    resumeButton.remove();

    //высчитываем сек и мин. Эту хрень, которая снизу надо убрать
    // let seconds = Math.floor((pauseStartTime % (1000 * 60)) / 1000);
    // let minutes = Math.floor(pauseStartTime / (1000 * 60));
    const timeSpan = li.querySelector('.time-counter');
    //22.06.2023 !!!!! ВАЖНО ДОБАВЛЕНО НЕ РОБИТ
    console.log(li.getAttribute('data-timer-sec'))
    console.log(parseInt(li.getAttribute('data-timer-sec')))

    let seconds = parseInt(li.getAttribute('data-pause-sec'));
    let minutes = parseInt(li.getAttribute('data-pause-min'));

    // запуск таймера
    function updateTimeTWO() {
        seconds++;
        if (seconds >= 60) {
            minutes++;
            seconds = 0;
        }
        //сохраняем секунды и минуты
        li.setAttribute('data-timer-sec', seconds);
        li.setAttribute('data-timer-min', minutes);

        const displayMinutes = ('0' + minutes).slice(-2);
        const displaySeconds = ('0' + seconds).slice(-2);
        timeSpan.innerHTML = `${displayMinutes}:${displaySeconds}`;
    }
    updateTimeTWO();
    const timerInterval = setInterval(updateTimeTWO, 1000);

    // сохраняем интервал
    li.setAttribute('data-timer-interval', timerInterval);
    li.setAttribute('data-time-counter', timeSpan);
    li.removeAttribute('data-pause-start-time');

    toLocal();
}

//функция для удаления задач
function deleteTask(event) {
    const li = event.target.closest('li');
    li.remove();
    toLocal();
}

//функция для создания задач
function addTaskToList(list, task) {
    if (list.children.length >= 3) {
        alert('Вы достигли максимального количества задач в этой категории. Количество задач в одной категории не может превышать 3. Пожалуйста, сконцентрируйтесь на этих 3 задачах и завершите их, прежде чем добавлять новые. Это поможет вам достичь лучших результатов и максимальной продуктивности.');
        return;
    }

    //создание li
    const li = document.createElement('li');
    const taskText = document.createElement('span');
    taskText.textContent = task;
    li.appendChild(taskText);

    //создание кнопки удалить
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '✖';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', deleteTask);
    li.appendChild(deleteButton);

    //создание кнопки выполнить
    const completedButton = document.createElement('button');
    completedButton.textContent = '✔';
    completedButton.classList.add('completed-button');
    completedButton.addEventListener('click', markAsCompleted);
    li.appendChild(completedButton);

    //создание кнопки начать выполнение задачи
    const startButton = document.createElement('button');
    startButton.innerHTML = '🏁';
    startButton.classList.add('start-button');
    startButton.addEventListener('click', startTimeTask);
    li.appendChild(startButton);


    //добавление задачи
    list.appendChild(li);

    //счетчик для созданных задач
    const createdCounter = document.querySelector('.created-counter');
    createdCounter.textContent = Number(createdCounter.textContent) + 1;
    const createdCounterAll = document.querySelector('.created-counter-all');
    createdCounterAll.textContent = Number(createdCounterAll.textContent) + 1;

    toLocal();
}

//функция для проверки задачи (если пусто, то не создавать)
function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const input = form.elements.task;
    const list = form.parentNode.querySelector('ul');

    if (input.value.trim() === '') {
        return;
    }

    addTaskToList(list, input.value);
    input.value = '';
    toLocal();
}

//получение задач из localstorage
if (localStorage.getItem("importantUrgentListLocal")) {
    importantUrgentList.innerHTML = localStorage.getItem("importantUrgentListLocal");
}
if (localStorage.getItem("importantNotUrgentListLocal")) {
    importantNotUrgentList.innerHTML = localStorage.getItem("importantNotUrgentListLocal");
}
if (localStorage.getItem("notImportantUrgentListLocal")) {
    notImportantUrgentList.innerHTML = localStorage.getItem("notImportantUrgentListLocal");
}
if (localStorage.getItem("notImportantNotUrgentListLocal")) {
    notImportantNotUrgentList.innerHTML = localStorage.getItem("notImportantNotUrgentListLocal");
}

//получение счетчиков из localstorage
if (localStorage.getItem("completedCounterAllLocal")) {
    completedCounterAll.innerHTML = localStorage.getItem("completedCounterAllLocal");
}
if (localStorage.getItem("createdCounterAllLocal")) {
    createdCounterAll.innerHTML = localStorage.getItem("createdCounterAllLocal");
}
if (localStorage.getItem("timeCounterAllLocal")) {
    timeCounterAll.innerHTML = localStorage.getItem("timeCounterAllLocal");
}


//выполнение, удаление, пауза, возобновления, окончание для задач из localstorage
const deleteButtons = document.querySelectorAll('.delete-button');
deleteButtons.forEach(button => {
    button.addEventListener('click', deleteTask);
});

const completedButtons = document.querySelectorAll('.completed-button');
completedButtons.forEach(button => {
    button.addEventListener('click', markAsCompleted);
});

const startButtons = document.querySelectorAll('.start-button');
startButtons.forEach(button => {
    button.addEventListener('click', startTimeTask);
});

const pauseButtons = document.querySelectorAll('.pause-button');
pauseButtons.forEach(button => {
    button.addEventListener('click', pauseTimeTask);
});

const resumeButtons = document.querySelectorAll('.resume-button');
resumeButtons.forEach(button => {
    button.addEventListener('click', resumeTimeTask);
});

const endButtons = document.querySelectorAll('.end-button');
endButtons.forEach(button => {
    button.addEventListener('click', endTimeTask);
});


//
document.getElementById('important-urgent-form').addEventListener('submit', handleFormSubmit);
document.getElementById('important-not-urgent-form').addEventListener('submit', handleFormSubmit);
document.getElementById('not-important-urgent-form').addEventListener('submit', handleFormSubmit);
document.getElementById('not-important-not-urgent-form').addEventListener('submit', handleFormSubmit);

// Нужно реализовать:
// Сохранение таймера после обновления страницы  +- после паузы и возобновления не работает, если мы нажимаем
// задача выполнена, когда время еще идет (т.е не стоит пауза), то после обновления страницы надо еще раз нажать на выполнено
// а если таймер стоит на паузе, то все будет нормально, вознкиает ошибка
//script.js:165 Uncaught TypeError: Cannot read properties of null (reading 'remove')
//at HTMLButtonElement.endTimeTask (script.js:165:18)
// (запускаем таймер -> завершаем  задачу -> обновляем стр -> задача не выполнена -> ошибка)
// (запускаем таймер -> нажимаем паузу -> завершаем  задачу -> обновляем стр -> задача выполнена)
// после обновления страницы нельзя возобновить таймер, нужно прописать работу кнопок + решено, но
// если обновить страницу, когда таймер идет, то таймер остановится и придется два раза нажать по кнопке, чтобы он пошел. Желательно сделать, чтобы после обновления страницы все кнопки паузы изменились на кнопки возобновления
// Запись затраченного времени. Нужно записывать, когда задача закончена endTimetask потраченное время на эту задачу (sec и min) и выводить это на экран.



//На 28.06.2023
//Если обновить страницу, когда таймер идет, то задача вернется к изначальному виду.