import {createSiteMenuTemplate} from "./components/site-menu";
import {createFilterTemplate} from "./components/filter";
import {createBoardTemplate} from "./components/board";
import {createTaskEditTemplate} from "./components/task-edit";
import {createTaskTemplate} from "./components/task";
import {createLoadMoreButtonTemplate} from "./components/load-more";
import {createSortingTemplate} from "./components/sorting";
import {filters} from "./mock/filter";
import {tasks} from "./mock/task";

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

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
