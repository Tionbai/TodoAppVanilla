// Variables
let todoList = [];
let selectOption = 0;

const form = document.querySelector('.form');
const formInput = document.querySelector('.form__input');
const listContainer = document.getElementById('list__container');
const listTodo = document.getElementById('list__todo');
const listComplete = document.getElementById('list__completed');
const selectBtn = document.querySelector('.select__todos');

// Functions
const setTodoState = () => window.dispatchEvent(new Event('setTodoState'));
const setFilterState = () => window.dispatchEvent(new Event('setFilterState'));

const addTodo = (value) => {
  const newTodo = {
    id: Date.now(),
    title: value,
    completed: false,
  };
  todoList = [...todoList, newTodo];
  setTodoState();
};

const completeTodo = (key) => {
  const index = todoList.findIndex((todo) => todo.id === Number(key));
  const todo = todoList[index];

  if (!todo.completed) todo.completed = Date.now();
  else todo.completed = false;

  setTodoState();
};

const deleteTodo = (key) => {
  todoList = todoList.filter((todo) => todo.id !== Number(key));
  setTodoState();
};

const updateTodo = (key, value) => {
  const index = todoList.findIndex((todo) => todo.id === Number(key));
  const todo = todoList[index];

  todo.title = value;
};

const todoTemplate = (todo) => `
    <li data-key="${todo.id}" class="todo ${
  todo.completed ? 'todo--completed' : ''
}">
    <p class="todo__text ${
      todo.completed ? 'todo__text--completed' : ''
    }" contenteditable="true">${todo.title}</p>
    <button class="fas fa-check complete__btn ${
      todo.completed ? 'complete__btn--completed' : ''
    }" />
    <button class="delete__btn ${todo.completed ? 'fas fa-times' : 'hide'}" />
    </li>`;

const filterTodos = () => {
  switch (selectOption) {
    case 0:
      listTodo.style.display = 'flex';
      listComplete.style.display = 'flex';
      localStorage.setItem('selectOption', 0);
      break;
    case 1:
      listTodo.style.display = 'none';
      listComplete.style.display = 'flex';
      localStorage.setItem('selectOption', 1);
      break;
    case 2:
      listComplete.style.display = 'none';
      listTodo.style.display = 'flex';
      localStorage.setItem('selectOption', 2);
      break;
    default:
  }
};

const renderTodoList = () => {
  if (!todoList) return;

  localStorage.setItem('todoList', JSON.stringify([...todoList]));

  const completedList = [...todoList].filter(
    (todo) => todo.completed !== false
  );
  completedList.sort((a, b) => b.completed - a.completed);

  listTodo.innerHTML = `<h2 class="list__todo__header">${
    todoList.length - completedList.length
  } todos</h2>`;
  todoList.forEach((todo) => {
    if (!todo.completed) listTodo.innerHTML += todoTemplate(todo);
  });
  listTodo.innerHTML += '<footer class="list__footer"></footer>';

  if (!completedList.length) listComplete.innerHTML = '';
  else {
    listComplete.innerHTML = `<h2 class="list__completed__header">${completedList.length} completed</h2>`;
    completedList.forEach((todo) => {
      listComplete.innerHTML += todoTemplate(todo);
    });
    listComplete.innerHTML += '<footer class="list__footer"></footer>';
  }
};

// Event listeners
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const { value } = formInput;
  if (!value) return;

  addTodo(value);
  formInput.value = '';
});

listContainer.addEventListener('click', (e) => {
  const todoId = e.target.parentElement.dataset.key;
  if (e.target.classList.contains('complete__btn')) {
    completeTodo(todoId);
  }
  if (e.target.classList.contains('delete__btn')) {
    deleteTodo(todoId);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const todoListRef = localStorage.getItem('todoList');
  if (todoListRef) {
    [...todoList] = JSON.parse(todoListRef);
  }

  const selectOptionRef = localStorage.getItem('selectOption');
  if (selectOptionRef) {
    selectOption = JSON.parse(selectOptionRef);
    selectBtn.selectedIndex = selectOption;
  }

  setTodoState();
  setFilterState();
});

window.addEventListener('setTodoState', () => {
  renderTodoList();
});

window.addEventListener('setFilterState', () => {
  filterTodos();
});

selectBtn.addEventListener('change', () => {
  selectOption = selectBtn.selectedIndex;
  setFilterState();
});

listContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('todo__text')) {
    const todoTextObserver = new MutationObserver(() => {
      const todoId = e.target.parentElement.dataset.key;
      const todoTitle = e.target.innerHTML;
      updateTodo(todoId, todoTitle);

      window.addEventListener('keypress', (e2) => {
        if (e2.key === 'Enter') {
          setTodoState();
        }
      });
      window.addEventListener('click', (e3) => {
        if (!e3.target.classList.contains('todo__text')) {
          setTodoState();
        }
      });
    });
    const todoTextObserverConfig = {
      subtree: true,
      characterDataOldValue: true,
    };

    todoTextObserver.observe(e.target, todoTextObserverConfig);
  }
});
