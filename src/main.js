import API from "./api/index";
import Provider from "./api/provider";
import Store from "./api/store";
import SiteMenuComponent, {MenuItem} from "./components/site-menu";
import FiltersController from "./controllers/filter-controller";
import BoardComponent from "./components/board";
import StatisticsComponent from "./components/statistics";
import LoadingComponent from "./components/loading";
import BoardController from "./controllers/board-controller";
import TasksModel from "./models/tasks";
import {render, remove, RenderPosition} from "./utils/render";

const dateTo = new Date();

const dateFrom = (() => {
  const d = new Date(dateTo);
  d.setDate(d.getDate() - 7);
  return d;
})();

const AUTHORIZATION = `Basic zfdxghjalidko;fjeskuyjgfbeshjk`;
const END_POINT = `https://11.ecmascript.pages.academy/task-manager`;
const STORE_PREFIX = `taskmanager-localstorage`;
const STORE_VAR = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VAR}`;

const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const tasksModel = new TasksModel();

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
const siteMenuComponent = new SiteMenuComponent();

render(siteHeaderElement, siteMenuComponent, RenderPosition.BEFOREEND);

const filtersController = new FiltersController(siteMainElement, tasksModel);
filtersController.render();

const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent, RenderPosition.BEFOREEND);

const loadingComponent = new LoadingComponent();
render(boardComponent.getElement(), loadingComponent, RenderPosition.BEFOREEND);

const statisticsComponent = new StatisticsComponent({tasks: tasksModel, dateFrom, dateTo});
render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);
statisticsComponent.hide();

const boardController = new BoardController(boardComponent, tasksModel, apiWithProvider);

siteMenuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_TASK:
      siteMenuComponent.setActiveItem(MenuItem.TASKS);
      boardController.show();
      statisticsComponent.hide();
      boardController.createTask();
      break;
    case MenuItem.STATISTICS:
      siteMenuComponent.setActiveItem(MenuItem.STATISTICS);
      boardController.hide();
      statisticsComponent.show();
      break;
    case MenuItem.TASKS:
      siteMenuComponent.setActiveItem(MenuItem.TASKS);
      boardController.show();
      statisticsComponent.hide();
      break;
  }
});

apiWithProvider.getTasks()
  .then((tasks) => {
    tasksModel.setTasks(tasks);
  })
  .finally(() => {
    remove(loadingComponent);

    boardController.render();
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
