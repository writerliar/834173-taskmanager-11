import SiteMenuComponent from "./components/site-menu";
import FiltersComponent from "./components/filters";
import BoardComponent from "./components/board";
import BoardController from "./controllers/board-controller";
import TasksModel from "./models/tasks";
import {filters} from "./mock/filter";
import {tasks} from "./mock/task";
import {render, RenderPosition} from "./utils/render";

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

render(siteHeaderElement, new SiteMenuComponent(), RenderPosition.BEFOREEND);
render(siteMainElement, new FiltersComponent(filters), RenderPosition.BEFOREEND);

const boardComponent = new BoardComponent();
const boardController = new BoardController(boardComponent, tasksModel);

render(siteMainElement, boardComponent, RenderPosition.BEFOREEND);
boardController.render(tasks);
