import SiteMenuComponent from "./components/site-menu";
import FilterComponent from "./components/filter";
import BoardComponent from "./components/board";
import TaskEditComponent from "./components/task-edit";
import TaskComponent from "./components/task";
import LoadMoreButtonComponent from "./components/load-more";
import SortingComponent from "./components/sorting";
import TasksComponent from "./components/tasks";
import {filters} from "./mock/filter";
import {tasks} from "./mock/task";
import {render, RenderPosition} from "./utils";

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render(siteHeaderElement, createSiteMenuTemplate(), `beforeend`);
render(siteMainElement, createFilterTemplate(filters), `beforeend`);
render(siteMainElement, createBoardTemplate(), `beforeend`);

const boardElement = siteMainElement.querySelector(`.board`);
const taskListElement = siteMainElement.querySelector(`.board__tasks`);

render(taskListElement, createTaskEditTemplate(tasks[0]), `beforeend`);
render(boardElement, createSortingTemplate(), `afterbegin`);

let showingTaskCount = SHOWING_TASKS_COUNT_ON_START;

tasks.slice(1, showingTaskCount)
  .forEach((task) => render(taskListElement, createTaskTemplate(task), `beforeend`));

render(boardElement, createLoadMoreButtonTemplate(), `beforeend`);

const loadMoreButton = boardElement.querySelector(`.load-more`);

loadMoreButton.addEventListener(`click`, () => {
  const prevTasksCount = showingTaskCount;
  showingTaskCount = showingTaskCount + SHOWING_TASKS_COUNT_BY_BUTTON;

  tasks.slice(prevTasksCount, showingTaskCount)
    .forEach((task) => render(taskListElement, createTaskTemplate(task), `beforeend`));

  if (showingTaskCount >= tasks.length) {
    loadMoreButton.remove();
  }
});
