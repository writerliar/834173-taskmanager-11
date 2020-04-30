import SiteMenuComponent, {MenuItem} from "./components/site-menu";
import FiltersController from "./controllers/filter-controller";
import BoardComponent from "./components/board";
import StatisticsComponent from "./components/statistics";
import BoardController from "./controllers/board-controller";
import TasksModel from "./models/tasks";
import {tasks} from "./mock/task";
import {render, RenderPosition} from "./utils/render";

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
const siteMenuComponent = new SiteMenuComponent();

render(siteHeaderElement, siteMenuComponent, RenderPosition.BEFOREEND);

const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const filtersController = new FiltersController(siteMainElement, tasksModel);
filtersController.render();

const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent, RenderPosition.BEFOREEND);

const boardController = new BoardController(boardComponent, tasksModel);
boardController.render(tasks);

const statisticsComponent = new StatisticsComponent();
render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);
statisticsComponent.hide();

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
