import NoTasksComponent from "../components/no-tasks";
import SortingComponent from "../components/sorting";
import TasksComponent from "../components/tasks";
import LoadMoreButtonComponent from "../components/load-more";
import TaskController from "./task-controller";
import {NO_TASK, SortType} from "../consts";
import {remove, render, RenderPosition} from "../utils/render";

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const renderTasks = (taskListElement, tasks, onDataChange, onViewChange) => {
  return tasks.map((task) => {
    const taskController = new TaskController(taskListElement, onDataChange, onViewChange);

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
  constructor(container, tasksModel) {
    this._container = container;

    this._tasksModel = tasksModel;
    this._showedTaskControllers = [];
    this._showingTaskCount = SHOWING_TASKS_COUNT_ON_START;

    this._noTasksComponent = new NoTasksComponent();
    this._sortingComponent = new SortingComponent();
    this._loadMoreComponent = new LoadMoreButtonComponent();
    this._tasksComponent = new TasksComponent();

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortingComponent.setSortTypeChangeHandler(this._onSortTypeChange);

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._tasksModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const container = this._container.getElement();

    const tasks = this._tasksModel.getTasks();
    const isAllTasksIsArchived = tasks.every((task) => task.isArchive);

    if (isAllTasksIsArchived || tasks.length === NO_TASK) {
      render(container, this._noTasksComponent(), RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortingComponent, RenderPosition.BEFOREEND);
    render(container, this._tasksComponent, RenderPosition.BEFOREEND);

    this._renderTasks(tasks.slice(0, this._showingTaskCount));

    this._renderLoadMoreButton();
  }

  _renderTasks(tasks) {
    const taskListElement = this._tasksComponent.getElement();

    const newTasks = renderTasks(taskListElement, tasks, this._onDataChange, this._onViewChange);
    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

    this._showingTaskCount = this._showedTaskControllers.length;
  }

  _removeTasks() {
    this._showedTaskControllers.forEach((taskController) => taskController.destroy());
    this._showedTaskControllers = [];
  }

  _updateTasks(count) {
    this._removeTasks();
    this._renderTasks(this._tasksModel.getTasks().slice(0, count));
    this._renderLoadMoreButton();
  }

  _renderLoadMoreButton() {
    remove(this._loadMoreComponent);

    const container = this._container.getElement();

    if (this._showingTaskCount >= this._tasksModel.getTasks().length) {
      return;
    }

    render(container, this._loadMoreComponent, RenderPosition.BEFOREEND);

    const taskListElement = this._tasksComponent.getElement();

    this._loadMoreComponent.setClickHandler(() => {
      const prevTasksCount = this._showingTaskCount;
      const tasks = this._tasksModel.getTasks();

      this._showingTaskCount = this._showingTaskCount + SHOWING_TASKS_COUNT_BY_BUTTON;

      const sortedTasks = getSortedTasks(tasks, this._sortingComponent.getSortType(), prevTasksCount, this._showingTaskCount);

      const newTasks = renderTasks(taskListElement, sortedTasks, this._onDataChange, this._onViewChange);
      this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);
    });
  }

  _onDataChange(oldData, newData) {
    const index = this._tasksModel.getTasks().findIndex((it) => it === oldData);
    const isSuccess = this._tasksModel.updateTask(oldData.id, newData);

    if (isSuccess) {
      this._showedTaskControllers[index].render(newData);
    }
  }

  _onViewChange() {
    this._showedTaskControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    this._showingTaskCount = SHOWING_TASKS_COUNT_BY_BUTTON;

    const taskListElement = this._tasksComponent.getElement();

    const sortedTasks = getSortedTasks(this._tasksModel.getTasks(), sortType, 0, this._showingTaskCount);

    taskListElement.innerHTML = ``;

    const newTasks = renderTasks(taskListElement, sortedTasks, this._onDataChange, this._onViewChange);
    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

    this._renderLoadMoreButton();
  }

  _onFilterChange() {
    this._updateTasks(SHOWING_TASKS_COUNT_ON_START);
  }
}
