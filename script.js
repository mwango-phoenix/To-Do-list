const listsContainer = document.querySelector("[project-list]")
const newProject = document.querySelector("[data-new-project]")
const newListInput = document.querySelector("[data-new-list-input]")
const deleteList = document.querySelector("[dlt-btn]")
const todoContainer = document.querySelector("[data-todo-container]")
const listTitle = document.querySelector("[data-list-title]")
const listCount = document.querySelector("[data-list-count]")
const tasksContainer = document.querySelector("[data-tasks]")
const taskTemplate = document.getElementById('task-template')
const newTask = document.querySelector('[data-new-task]')
const newTaskInput = document.querySelector('[data-new-task-input]')
const deleteComplete = document.querySelector("[dlt-complete-tasks]")

//local storage to store information in user's browswer
const LOCAL_STORAGE_LIST_KEY = "task.lists";
const LOCAL_STORAGE_SELECTED_ID_KEY = "task.selectedListId";

//get lists from locat storage, and if non-existent, use empty array
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
//get id of selected project
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_ID_KEY);

//update selectedListId to id of current project
listsContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'li') {
    selectedListId = e.target.dataset.listId
    saveAndRender()
  }
})

// add new project to list
newProject.addEventListener("submit", (e) => {
  e.preventDefault();
  const listName = newListInput.value;
  if (listName == null || listName === "") return;
  const list = createList(listName);
  newListInput.value = null;
  lists.push(list);
  saveAndRender();
});

// add new task to list
newTask.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskName = newTaskInput.value;
  if (taskName == null || taskName === "") return;
  const task = createTask(taskName);
  newTaskInput.value = null;
  const selectedList = lists.find(list => list.id === selectedListId)
  selectedList.tasks.push(task)
  saveAndRender();
});

tasksContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'input') {
    const selectedList = lists.find(list => list.id === selectedListId)
    const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
    selectedTask.complete = e.target.checked
    save()
    taskCount(selectedList)
  }
})

function createList(name) {
  return { id: Date.now().toString(), name: name, tasks: [] };
}

function createTask(name) {
  return { id: Date.now().toString(), name: name, complete: false};
}


function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
  localStorage.setItem(LOCAL_STORAGE_SELECTED_ID_KEY, selectedListId)
}

function render() {
  clearItems(listsContainer)
  renderProjects()
  const selectedList = lists.find(list => list.id === selectedListId)
  if (selectedListId == null || !lists.length) {
    todoContainer.style.display = 'none'
  } else {
    todoContainer.style.display = ''
    listTitle.innerText = selectedList.name
    taskCount(selectedList)
  }
  clearItems(tasksContainer)
  renderTasks(selectedList)
}

function renderProjects() {
  lists.forEach((list) => {
    const listItem = document.createElement("li");
    listItem.dataset.listId = list.id;
    listItem.classList.add("project-name");
    listItem.innerText = list.name;
    if (list.id === selectedListId) {
      listItem.classList.add("active-list")
    }
    listsContainer.appendChild(listItem)
  });
}

function renderTasks(list) {
  list.tasks.forEach(task => {
    const taskElement = document.importNode(taskTemplate.content, true)
    const checkbox = taskElement.querySelector('input')
    checkbox.id = task.id
    checkbox.checked = task.complete
    const label = taskElement.querySelector('label')
    label.htmlFor = task.id
    label.append(task.name)
    tasksContainer.append(taskElement)
  })
}

function taskCount(list) {
  const incomplete = list.tasks.filter(task => !task.complete).length
  const taskStr = incomplete === 1 ? "task" : "tasks"
  listCount.innerText = `${incomplete} ${taskStr} to do`
}

function clearItems(item) {
  //clear categories list
  while (item.firstChild) {
    item.removeChild(item.firstChild);
  }
}

deleteComplete.addEventListener('click', e => {
  const selectedList = lists.find(list => list.id === selectedListId)
  selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
  saveAndRender()
})

deleteList.addEventListener('click', e => {
  lists = lists.filter(list => list.id !== selectedListId)
  selectedListId = null
  saveAndRender()
})


function saveAndRender() {
  save()
  render()
}

render()