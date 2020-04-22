import NoTasksComponent from "../components/no-tasks";
import SortingComponent from "../components/sorting";
import TasksComponent from "../components/tasks";
import LoadMoreButtonComponent from "../components/load-more";
import TaskController from "./task-controller";
import {NO_TASK, SortType} from "../consts";
import {remove, render, RenderPosition} from "../utils/render";

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const renderTasks = (taskListElement, tasks) => {
  return tasks.map((task) => {
    const taskController = new TaskController(taskListElement);

    taskController.render(task);

    return taskController;
  });
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
    this._tasks = [];
    this._showedTaskControllers = [];
    this._showingTaskCount = SHOWING_TASKS_COUNT_ON_START;

    this._noTasksComponent = new NoTasksComponent();
    this._sortingComponent = new SortingComponent();
    this._loadMoreComponent = new LoadMoreButtonComponent();
    this._tasksComponent = new TasksComponent();

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortingComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(tasks) {
    this._tasks = tasks;
    const container = this._container.getElement();

    const isAllTasksIsArchived = this._tasks.every((task) => task.isArchive);

    if (isAllTasksIsArchived || tasks.length === NO_TASK) {
      render(container, this._noTasksComponent(), RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortingComponent, RenderPosition.BEFOREEND);
    render(container, this._tasksComponent, RenderPosition.BEFOREEND);

    const taskListElement = this._tasksComponent.getElement();

    const newTasks = renderTasks(taskListElement, this._tasks.slice(0, this._showingTaskCount));
    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

    this._renderLoadMoreButton();
  }

  _renderLoadMoreButton() {
    const container = this._container.getElement();

    if (this._showingTaskCount >= this._tasks.leading) {
      return;
    }

    render(container, this._loadMoreComponent, RenderPosition.BEFOREEND);

    const taskListElement = this._tasksComponent.getElement();

    this._loadMoreComponent.setClickHandler(() => {
      const prevTasksCount = this._showingTaskCount;
      this._showingTaskCount = this._showingTaskCount + SHOWING_TASKS_COUNT_BY_BUTTON;

      const sortedTasks = getSortedTasks(this._tasks, this._sortingComponent.getSortType(), prevTasksCount, this._showingTaskCount);

      const newTasks = renderTasks(taskListElement, sortedTasks);
      this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

      if (this._showingTaskCount >= this._tasks.length) {
        remove(this._loadMoreComponent);
      }
    });
  }

  _onSortTypeChange(sortType) {
    this._showingTaskCount = SHOWING_TASKS_COUNT_BY_BUTTON;

    const taskListElement = this._tasksComponent.getElement();

    const sortedTasks = getSortedTasks(this._tasks, sortType, 0, this._showingTaskCount);

    taskListElement.innerHTML = ``;

    const newTasks = renderTasks(taskListElement, sortedTasks);
    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

    this._renderLoadMoreButton();
  }
}
