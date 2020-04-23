import TaskComponent from "../components/task";
import TaskEditComponent from "../components/task-edit";
import {render, RenderPosition, replace} from "../utils/render";

export default class TaskController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChange = onDataChange;

    this._taskComponent = null;
    this._taskEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(task) {
    this._taskComponent = new TaskComponent(task);
    this._taskEditComponent = new TaskEditComponent(task);

    this._taskComponent.setEditButtonClickHandler(() => {
      this._replaceTaskToEdit();
    });

    this._taskEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._taskComponent.setArchiveButtonClick(() => {
      this._onDataChange(task, Object.assign({}, task, {
        isArchive: !task.isArchive,
      }));
    });

    this._taskComponent.setFavoriteButtonClick(() => {
      this._onDataChange(task, Object.assign({}, task, {
        isFavorite: !task.isFavorite,
      }));
    });

    render(this._container, this._taskComponent, RenderPosition.BEFOREEND);
  }

  _replaceTaskToEdit() {
    document.addEventListener(`keydown`, this._onEscKeyDown);
    replace(this._taskEditComponent, this._taskComponent);
  }

  _replaceEditToTask() {
    replace(this._taskComponent, this._taskEditComponent);
  }

  _onEscKeyDown(evt) {
    const isEscapeKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscapeKey) {
      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
