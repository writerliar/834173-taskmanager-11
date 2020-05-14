import API from "./api";
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

const api = new API(END_POINT, AUTHORIZATION);

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

siteMenuComponent.setOnChange((menuItem) => {
  const boardController = new BoardController(boardComponent, tasksModel, api);

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

api.getTasks()
  .then((tasks) => {
    tasksModel.setTasks(tasks);
  })
  .finally(() => {
    remove(loadingComponent);
    const boardController = new BoardController(boardComponent, tasksModel, api);

    boardController.render();
  });
