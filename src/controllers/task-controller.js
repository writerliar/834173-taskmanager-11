import TaskComponent from "../components/task";
import TaskEditComponent from "../components/task-edit";
import {render, RenderPosition, replace, remove} from "../utils/render";

export const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const EmptyTask = {};

export default class TaskController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._taskComponent = null;
    this._taskEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(task, mode) {
    const oldTaskComponent = this._taskComponent;
    const oldTaskEditComponent = this._taskEditComponent;
    this._mode = mode;

    this._taskComponent = new TaskComponent(task);
    this._taskEditComponent = new TaskEditComponent(task);

    this._taskComponent.setEditButtonClickHandler(() => {
      this._replaceTaskToEdit();
    });

    this._taskEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._taskEditComponent.getData();
      this._onDataChange(this, task, data);
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._taskEditComponent.setDeleteButtonCLickHandler(() => this._onDataChange(task, null));

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

    if (oldTaskComponent && oldTaskEditComponent) {
      replace(this._taskComponent, oldTaskComponent);
      replace(this._taskEditComponent, oldTaskEditComponent);
      this._replaceEditToTask();
    } else {
      render(this._container, this._taskComponent, RenderPosition.BEFOREEND);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToTask();
    }
  }

  destroy() {
    remove(this._taskEditComponent);
    remove(this._taskComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _replaceTaskToEdit() {
    this._onViewChange();
    document.addEventListener(`keydown`, this._onEscKeyDown);
    replace(this._taskEditComponent, this._taskComponent);
    this._mode = Mode.EDIT;
  }

  _replaceEditToTask() {
    this._taskEditComponent.reset();
    if (document.contains(this._taskEditComponent.getElement())) {
      replace(this._taskComponent, this._taskEditComponent);
    }

    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscapeKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscapeKey) {
      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
