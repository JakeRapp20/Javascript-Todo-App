class Component {
    static _counter = 0;
    id;

    constructor() {
        this.id = ++Component._counter;
    }
    getId() {
        return this.id;
    }
    // create Element using element type
    createElement(type, classList = [], key) {
        const element = document.createElement(type);
        classList.forEach((className) => {
            element.classList.add(className)
        })
        element.dataset[key] = this.id;
        return element;
    }
}


class ProjectCard extends Component{

    static #projectArray = [];

    constructor(title, description, priority) {
        super();
        this.title = title;
        this.description = description;
        this.priority = priority;
    }

    static getProjectArray() {
        return ProjectCard.#projectArray;
    }
    renderProject() {
        const projectCard = this.createElement("div", ["project-card"], "projectCard")
        projectCard.innerHTML = `
        <div class="project-card-box project-card-title">
        <p><strong>Project:</strong> ${this.title}</p>
        </div>
        <div class="project-card-box project-card-description">
        <p><strong>Description:</strong> ${this.description}</p>
        </div>
        <div class="project-card-box project-card-priority">
        <p><strong>Priority:</strong> ${this.priority}</p>
        </div>
        <div class="task-card-box task-card-input-box">
        <label for="taskName">Task:</label> 
        <input type="text" id="taskName">
        <label for="taskDetails">Details:</label> 
        <input type="text" id="taskDetails">
        <label for="taskPriority">Priority:</label> 
        <select type="text" id="taskPriority">
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
        </select>
        <button class="task-add-button">Add Task</button>
        </div>
        <button class="project-delete-button" type="submit">Delete Project</button>
        `
        let deleteButton = projectCard.querySelector(".project-delete-button")

        deleteButton.addEventListener("click", () => {
            console.log("delete")
            this.deleteProject();
            DOMController.renderProjects()
        })

        const addTaskButton = projectCard.querySelector(".task-add-button")

        addTaskButton.addEventListener("click", () => {
            let taskName = projectCard.querySelector("#taskName")
            let taskDetails = projectCard.querySelector("#taskDetails")
            let taskPriority = projectCard.querySelector("#taskPriority")

            const newTask = new TaskCard(taskName.value, taskDetails.value, taskPriority.value)
            newTask.renderTask();
            taskName.value = ""
            taskDetails.value = ""
            taskPriority.value = ""
            
        })

        return projectCard

    }
    addProjectToArray() {
        ProjectCard.#projectArray.push(this.renderProject())
    }

    deleteProject() {
        const projectArray = ProjectCard.#projectArray;
        const projectIndex = projectArray.findIndex(project => {
            return project.dataset.projectCard === this.id.toString()
        });
        ProjectCard.#projectArray.splice(projectIndex, 1);
        DOMController.renderProjects()
    }
}

class TaskCard extends Component {
    constructor(title, description, priority) {
        super();
        this.title = title;
        this.description = description;
        this.priority = priority;
    }

    renderTask() {
        const beforeElement = document.querySelector(".project-card-priority")
        const taskCard = this.createElement("div", ["task-card-box"], "taskCard")
        taskCard.innerHTML = `
            <div class="task-card-box task-card-title">
            <p>Task: ${this.title}</p>
            </div>
            <div class="task-card-box task-card-describe">
            <p>Details: ${this.description}</p>
            </div>
            <div class="task-card-box task-card-priority">
            <p>Priority: ${this.priority}</p>
            </div>
            <button class="delete-task-button">Delete</button> 
        `
        beforeElement.after(taskCard)

        const taskDeleteButton = taskCard.querySelector(".delete-task-button")

        taskDeleteButton.addEventListener("click", () => {
            taskCard.remove();
        })

        return taskCard
    }
}

class NavCard extends Component {

    constructor(title) {
        super();
        this.title = title;
    }
    renderNav() {
        const navBar = document.querySelector("nav");
        const navElement = this.createElement("button", ["nav-button", "add-project-button"], "projectButton");
        navElement.textContent = this.title;
        navBar.appendChild(navElement);

        navElement.addEventListener("click", () => {
            this.renderModal();
        })
    }

    renderModal() {
        const modalElement = this.createElement("dialog", ["create-project-modal"], "createProjectModal")
        modalElement.innerHTML = `
        <p>
            <label>
            Project:
            <input type= "text" id="title" required />
            </label>
            </p>
                <label>
            Description:
            <input type= "text" id="description" required />
            </label>
            </p>
                <label>
            Priority:
                <select type="text" id="priority">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                </select>
            </label>
        </p>
        <button type="submit" class="create-project-button">Create</button>
        `

        modalElement.querySelector(".create-project-button").addEventListener("click", () => {
            const newProject = new ProjectCard(modalElement.querySelector("#title").value, modalElement.querySelector("#description").value, modalElement.querySelector("#priority").value)
            console.log(newProject)
            newProject.addProjectToArray();
            newProject.renderProject();
            modalElement.remove()
            DOMController.renderProjects()

        })
        const navBar = document.querySelector("nav");
        navBar.appendChild(modalElement);
        modalElement.showModal();
    }


}

const DOMController = (function () {

    const DOMInit = () => {
        const projectButton = new NavCard("Add Project");
        projectButton.renderNav();
        const test1 = new ProjectCard("Default", "Default Project", "Medium")
        test1.renderProject();
        test1.addProjectToArray();
        DOMController.renderProjects()

    }

    const mainContent = document.querySelector("main");
    const renderProjects = () => {
        mainContent.innerHTML = "";

        const projectArray = ProjectCard.getProjectArray();
        projectArray.forEach((project) => {
            mainContent.appendChild(project);
        })
    }

    return { renderProjects, DOMInit };
})();

export {ProjectCard, Component, DOMController}