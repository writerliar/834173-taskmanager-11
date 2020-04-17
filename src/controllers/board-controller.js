import TaskComponent from "../components/task";
import TaskEditComponent from "../components/task-edit";
import NoTasksComponent from "../components/no-tasks";
import SortingComponent from "../components/sorting";
import TasksComponent from "../components/tasks";
import LoadMoreButtonComponent from "../components/load-more";
import {NO_TASK, SortType} from "../consts";
import {remove, render, RenderPosition, replace} from "../utils/render";

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const renderTask = (taskListElement, task) => {
  const replaceTaskToEdit = () => {
    replace(taskEditComponent, taskComponent);
  };

  const replaceEditToTask = () => {
    replace(taskComponent, taskEditComponent);
  };

  const onEscKeyDown = (evt) => {
    const isEscapeKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscapeKey) {
      replaceEditToTask();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const taskComponent = new TaskComponent(task);
  taskComponent.setEditButtonClickHandler(() => {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const taskEditComponent = new TaskEditComponent(task);
  taskEditComponent.setSubmitHandler((evt) => {
    evt.preventDefault();
    replaceEditToTask();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(taskListElement, taskComponent, RenderPosition.BEFOREEND);
};

const renderTasks = (taskListElement, tasks) => {
  tasks.forEach((task) => renderTask(taskListElement, task));
};

const getSortedTasks = (tasks, sortType, from, to) => {
  let sortedTasks = [];
  const showingTasks = tasks.slice();

  switch (sortType) {
    case SortType.DEFAULT:
      sortedTasks = showingTasks;
      break;
    case SortType.DATE_UP:
      sortedTasks = showingTasks.sort((a, b) => a.dueDate - b.dueDate);
      break;
    case SortType.DATE_DOWN:
      sortedTasks = showingTasks.sort((a, b) => b.dueDate - a.dueDate);
      break;
  }

  return sortedTasks.slice(from, to);
};

export default class BoardController {
  constructor(container) {
    this._container = container;

    this._noTasksComponent = new NoTasksComponent();
    this._sortingComponent = new SortingComponent();
    this._loadMoreComponent = new LoadMoreButtonComponent();
    this._tasksComponent = new TasksComponent();
  }

  render(tasks) {
    const renderLoadMoreButton = () => {
      if (showingTaskCount >= tasks.leading) {
        return;
      }

      render(container, this._loadMoreComponent, RenderPosition.BEFOREEND);

      this._loadMoreComponent.setClickHandler(() => {
        const prevTasksCount = showingTaskCount;
        showingTaskCount = showingTaskCount + SHOWING_TASKS_COUNT_BY_BUTTON;

        const sortedTasks = getSortedTasks(tasks, this._sortingComponent.getSortType(), prevTasksCount, showingTaskCount);

        renderTasks(taskListElement, sortedTasks);

        if (showingTaskCount >= tasks.length) {
          remove(this._loadMoreComponent);
        }
      });
    };

    const container = this._container.getElement();
    const isAllTasksIsArchived = tasks.every((task) => task.isArchive);

    if (isAllTasksIsArchived || tasks.length === NO_TASK) {
      render(container, this._noTasksComponent(), RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortingComponent, RenderPosition.BEFOREEND);
    render(container, this._tasksComponent, RenderPosition.BEFOREEND);

    const taskListElement = this._tasksComponent.getElement();

    let showingTaskCount = SHOWING_TASKS_COUNT_ON_START;

    renderTasks(taskListElement, tasks.slice(0, showingTaskCount));

    renderLoadMoreButton();

    this._sortingComponent.setSortTypeChangeHandler((sortType) => {
      showingTaskCount = SHOWING_TASKS_COUNT_BY_BUTTON;

      const sortedTasks = getSortedTasks(tasks, sortType, 0, showingTaskCount);

      taskListElement.innerHTML = ``;

      renderTasks(taskListElement, sortedTasks);

      renderLoadMoreButton();
    });
  }
}
