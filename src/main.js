import SiteMenuComponent from "./components/site-menu";
import FiltersComponent from "./components/filters";
import BoardComponent from "./components/board";
import TaskEditComponent from "./components/task-edit";
import TaskComponent from "./components/task";
import LoadMoreButtonComponent from "./components/load-more";
import SortingComponent from "./components/sorting";
import TasksComponent from "./components/tasks";
import NoTasksComponent from "./components/no-tasks";
import {filters} from "./mock/filter";
import {tasks} from "./mock/task";
import {render, RenderPosition} from "./utils/render";
import {NO_TASK} from "./consts";

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render(siteHeaderElement, new SiteMenuComponent().getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new FiltersComponent(filters).getElement(), RenderPosition.BEFOREEND);

const renderTask = (taskListElement, task) => {
  const replaceTaskToEdit = () => {
    taskListElement.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
  };

  const replaceEditToTask = () => {
    taskListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    const isEscapeKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscapeKey) {
      replaceEditToTask();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const taskComponent = new TaskComponent(task);
  const editButton = taskComponent.getElement().querySelector(`.card__btn--edit`);
  editButton.addEventListener(`click`, () => {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const taskEditComponent = new TaskEditComponent(task);
  const editForm = taskEditComponent.getElement().querySelector(`form`);
  editForm.addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceEditToTask();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(taskListElement, taskComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderBoard = (boardComponent, tasksCards) => {
  const isAllTasksIsArchived = tasksCards.every((task) => task.isArchive);

  if (isAllTasksIsArchived || tasksCards.length === NO_TASK) {
    render(boardComponent.getElement(), new NoTasksComponent().getElement(), RenderPosition.BEFOREEND);
    return;
  }

  render(boardComponent.getElement(), new SortingComponent().getElement(), RenderPosition.BEFOREEND);
  render(boardComponent.getElement(), new TasksComponent().getElement(), RenderPosition.BEFOREEND);

  const taskListElement = boardComponent.getElement().querySelector(`.board__tasks`);

  let showingTaskCount = SHOWING_TASKS_COUNT_ON_START;

  tasksCards.slice(0, showingTaskCount)
    .forEach((task) => renderTask(taskListElement, task));

  const loadMoreButtonComponent = new LoadMoreButtonComponent();
  render(boardComponent.getElement(), loadMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

  loadMoreButtonComponent.getElement().addEventListener(`click`, () => {
    const prevTasksCount = showingTaskCount;
    showingTaskCount = showingTaskCount + SHOWING_TASKS_COUNT_BY_BUTTON;

    tasksCards.slice(prevTasksCount, showingTaskCount)
      .forEach((task) => renderTask(taskListElement, task));

    if (showingTaskCount >= tasksCards.length) {
      loadMoreButtonComponent.getElement().remove();
      loadMoreButtonComponent.removeElement();
    }
  });
};

const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent.getElement(), RenderPosition.BEFOREEND);
renderBoard(boardComponent, tasks);
