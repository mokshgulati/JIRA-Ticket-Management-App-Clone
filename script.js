// Filtering tickets
// colorsContainer.addEventListener("click", function (e) {
//     let element = e.target;
//     if (element != colorsContainer) {
//         let colorFilter = element.classList[1];
//         filterTickets(colorFilter);
//     }
// })

/********************************************************************************************/

let uid = new ShortUniqueId();
let selectedColor = "black";

let inputArea = document.querySelector(".text_box");
let taskCreationBox = document.querySelector(".task_creation_box");
let colorsContainer = document.querySelector(".colors_container");
let colorsSelection = document.querySelector(".colors_selection");
let allColorSelection = document.querySelectorAll(".color_box");
let restStage = document.querySelector(".rest_stage");
let add = document.querySelector(".add");
let cross = document.querySelector(".cross");

// Show Modal
add.addEventListener("click", function (e) {
    taskCreationBox.style.display = "flex";
})

// Color choosing
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

// Entering a new task
inputArea.addEventListener("keydown", function (e) {
    if (e.code == "Enter" && inputArea.value) {
        let id = uid();
        taskCreationBox.style.display = "none";
        createTask(id, inputArea.value, selectedColor);
        inputArea.value = "";
    }
})

function createTask(id, task, color) {
    let ticketBox = document.createElement("div");
    ticketBox.setAttribute("class","ticket_box");
    restStage.appendChild(ticketBox);
    ticketBox.innerHTML = `
    
        <div class="filter ${selectedColor}"></div>
        <div class="ticket_task">
        <h3 class="task-id">${id}</h3>
        <textarea class="task_text" contentEditable="true">${task}</textarea>
        </div>
        
        `;
        
        
}