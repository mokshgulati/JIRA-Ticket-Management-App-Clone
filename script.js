// variables
let uid = new ShortUniqueId();
let selectedColor = "black";
let deleteMode = false;
let currentFilterColor = "";
let colors = ["pink", "blue", "green", "black"];

// elements
let inputArea = document.querySelector(".text_box");
let taskCreationBox = document.querySelector(".task_creation_box");
let colorsContainer = document.querySelector(".colors_container");
let colorsSelection = document.querySelector(".colors_selection");
let allColorSelection = document.querySelectorAll(".color_box");
let restStage = document.querySelector(".rest_stage");
let add = document.querySelector(".add");
let cross = document.querySelector(".cross");
let lock = document.querySelector(".lock");
let unlock = document.querySelector(".unlock");

// show Modal on display (on click)
add.addEventListener("click", function (e) {
    for (let i = 0; i < allColorSelection.length; i++) {
        allColorSelection[i].classList.remove("selected");
    }
    allColorSelection[allColorSelection.length - 1].classList.add("selected");

    inputArea.value = "";
    selectedColor = "black";
    taskCreationBox.style.display = "flex";
})

// color choosing (from modal) for generating ticket
colorsSelection.addEventListener("click", function (e) {
    let element = e.target;
    if (element != colorsSelection) {
        selectedColor = element.classList[1];

        for (let i = 0; i < allColorSelection.length; i++) {
            allColorSelection[i].classList.remove("selected");
        }
        element.classList.add("selected");
    }
})

// entering a new task in the modal to create ticket
inputArea.addEventListener("keydown", function (e) {
    if (e.code == "Enter" && inputArea.value) {
        let id = uid();
        taskCreationBox.style.display = "none";

        createTicket(selectedColor, id, inputArea.value, true);
    }
})

// how tickets are made and displayed on the wall (inner working)
function createTicket(color, id, task, flag) {
    let ticketBox = document.createElement("div");
    ticketBox.setAttribute("class", "ticket_box");
    restStage.appendChild(ticketBox);
    ticketBox.innerHTML = `
        <div class="filter ${color}"></div>
        <div class="ticket_task">
            <h3 class="task_id">#${id}</h3>
            <div class="task_text" contentEditable="false">${task}</div>
        </div>
    `;

    let ticketColor = ticketBox.querySelector('.filter');
    let ticketText = ticketBox.querySelector(".task_text");
    let nextColor = "";

    ticketColor.addEventListener("click", (e) => {
        let currentColor = ticketColor.classList[1];
        let idx = colors.indexOf(currentColor);
        nextColor = colors[(idx + 1) % 4];
        ticketColor.classList.remove(currentColor);
        ticketColor.classList.add(nextColor);

        let idElement = ticketColor.parentNode.children[1].children[0];
        let id = idElement.textContent;
        id = id.slice(1);
        let ticketsStoredInLocalStorage = JSON.parse(localStorage.getItem('tasks'));
        // {color : "pink", id : "#5gdyt6e", task : "hello!!"}, {}, ...
        for (let i = 0; i < ticketsStoredInLocalStorage.length; i++) {
            if (id == ticketsStoredInLocalStorage[i].id) {
                ticketsStoredInLocalStorage[i].color = nextColor;
                break;
            }
        }
        localStorage.setItem('tasks', JSON.stringify(ticketsStoredInLocalStorage));
    })

    ticketBox.addEventListener("click", (e) => {
        if (deleteMode == true) {

            let idElement = ticketBox.children[1].children[0];
            let id = idElement.textContent;
            id = id.slice(1);
            let ticketsStoredInLocalStorage = JSON.parse(localStorage.getItem('tasks'));
            for (let i = 0; i < ticketsStoredInLocalStorage.length; i++) {
                if (id == ticketsStoredInLocalStorage[i].id) {
                    ticketsStoredInLocalStorage.splice(i, 1);
                    break;
                }
            }
            localStorage.setItem('tasks', JSON.stringify(ticketsStoredInLocalStorage));

            ticketBox.remove();
        }
    })
    ticketText.addEventListener("blur", function (e) {
        let content = ticketText.textContent;

        let idElement = ticketText.parentNode.children[0];
        let id = idElement.textContent;
        id = id.slice(1);
        let ticketsStoredInLocalStorage = JSON.parse(localStorage.getItem('tasks'));
        for (let i = 0; i < ticketsStoredInLocalStorage.length; i++) {
            if (id == ticketsStoredInLocalStorage[i].id) {
                ticketsStoredInLocalStorage[i].task = content;
                break;
            }
        }
        localStorage.setItem('tasks', JSON.stringify(ticketsStoredInLocalStorage));
    })
    if (flag == true) {
        let ticketsStoredInLocalStorage = JSON.parse(localStorage.getItem('tasks')) || [];
        let ticketObj = {
            color: color,
            id: id,
            task: task
        }
        ticketsStoredInLocalStorage.push(ticketObj);
        localStorage.setItem('tasks', JSON.stringify(ticketsStoredInLocalStorage));
    }
}

// clicking on lock button to disable editing
lock.addEventListener("click", () => {
    let ticketTextBoxes = document.querySelectorAll(".task_text");
    for (let i = 0; i < ticketTextBoxes.length; i++) {
        ticketTextBoxes[i].contentEditable = false;
    }

    unlock.classList.remove("active");
    lock.classList.add("active");
})

// clicking on unlock button to enable editing
unlock.addEventListener("click", () => {
    let ticketTextBoxes = document.querySelectorAll(".task_text");
    for (let i = 0; i < ticketTextBoxes.length; i++) {
        ticketTextBoxes[i].contentEditable = true;
    }

    lock.classList.remove("active");
    unlock.classList.add("active");
})

// enabling cross button to delete tickets
cross.addEventListener("click", (e) => {
    if (taskCreationBox.style.display == "none") {
        deleteMode = !deleteMode;

        if (deleteMode) {
            cross.classList.add("active");
        } else {
            cross.classList.remove("active");
        }
    }
})

// filtering tickets
colorsContainer.addEventListener("click", function (e) {
    let element = e.target;
    if (element != colorsContainer) {
        let colorFilter = element.classList[1];
        filterTickets(colorFilter);
    }
})

// how filtering (with color) works
function filterTickets(filterColor) {
    let allTickets = document.querySelectorAll('.ticket_box');
    if (filterColor != currentFilterColor) {
        currentFilterColor = filterColor;
        for (let i = 0; i < allTickets.length; i++) {
            let ticketColorContainer = allTickets[i].querySelector(".filter");
            let ticketColor = ticketColorContainer.classList[1];

            if (ticketColor == filterColor) {
                allTickets[i].style.display = "block";
            } else {
                allTickets[i].style.display = "none";
            }
        }
    } else {
        currentFilterColor = "";
        for (let i = 0; i < allTickets.length; i++) {
            allTickets[i].style.display = "block";
        }
    }
}

// ***************************************************************************
// LOCAL STORAGE
// local storage -> storage in every browser that doesn't delete
// even if you close the tab or the browser window.
// It's not on the web, It's just a local storage,
// basically an inbuilt inner storage of browser to collect local data and store it for future use.
// eg.
// ...
// localStorage.setItem(<KEY>, <VALUE>);
// localStorage.setItem("today", "Hello today");
// localStorage.setItem("tomorrow", "Hello tomorrow");
// localStorage.setItem("yesterday", "Hello yesterday");
// let length = localStorage.length;
// localStorage.removeItem("today");
// localStorage.clear();
// let item = localStorage.getItem("tomorrow");
// ***************************************************************************

// As soon as the web app opens,
// check if any of the tickets are in the local storage,
// if yes -> bring it to UI
(function () {
    let tickets = JSON.parse(localStorage.getItem('tasks')) || [];
    for (let i = 0; i < tickets.length; i++) {
        let { color, id, task } = tickets[i];
        createTicket(color, id, task, false);
    }

    taskCreationBox.style.display = "none";
})();