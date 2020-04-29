import AbstractSmartComponent from "./abstract-smart-component";
import {COLORS, DAYS} from "../consts";
import {formatTime, formatDate, isOverdueDate, isRepeating} from "../utils/common";
import flatpickr from "flatpickr";

import "flatpickr/dist/flatpickr.min.css";

const createRepeatingDaysMarkup = (days, repeatingDays) => {
  return days
    .map((day, index) => {
      const isChecked = repeatingDays[day];

      return (
        `<input
        class="visually-hidden card__repeat-day-input"
        type="checkbox"
        id="repeat-${day}-${index}"
        name="repeat"
        value="${day}"
        ${isChecked ? `checked` : ``}>
        <label class="card__repeat-day" for="repeat-${day}-${index}">${day}</label>
        `
      );
    }).join(`\n`);
};

const createColorsMarkup = (colors, currentColor) => {
  return colors
    .map((color, index) => {

      return (
        `<input
            type="radio"
             id="color-${color}-${index}"
             class="card__color-input card__color-input--${color} visually-hidden"
             name="color"
             value="${color}"
             ${color === currentColor ? `checked` : ``}
          />
          <label
             for="color-${color}-${index}"
             class="card__color card__color--${color}"
             >${color}</label
          >`
      );
    }).join(`\n`);
};

const createTaskEditTemplate = (task, options = {}) => {
  const {description, dueDate} = task;
  const {isDateShowing, activeRepeatingDays, isRepeatingTask, color} = options;

  const isExpired = dueDate instanceof Date && isOverdueDate(dueDate, new Date());

  const isBlockSaveButton = (isRepeatingTask && isDateShowing) || (isRepeatingTask && !isRepeating(activeRepeatingDays));

  const repeatClass = isRepeatingTask ? `card--repeat` : ``;
  const deadlineClass = isExpired ? `card--deadline` : ``;

  const date = (isDateShowing && dueDate) ? formatDate(dueDate) : ``;
  const time = (isDateShowing && dueDate) ? formatTime(dueDate) : ``;

  const repeatingDaysMarkup = createRepeatingDaysMarkup(DAYS, activeRepeatingDays);
  const colorsMarkup = createColorsMarkup(COLORS, color);

  return (
    `<article class="card card--edit card--${color} ${repeatClass} ${deadlineClass}">
            <form class="card__form" method="get">
              <div class="card__inner">
                <div class="card__color-bar">
                  <svg class="card__color-bar-wave" width="100%" height="10">
                    <use xlink:href="#wave"></use>
                  </svg>
                </div>

                <div class="card__textarea-wrap">
                  <label>
                    <textarea
                      class="card__text"
                      placeholder="Start typing your text here..."
                      name="text"
                    >${description}</textarea>
                  </label>
                </div>

                <div class="card__settings">
                  <div class="card__details">
                    <div class="card__dates">
                      <button class="card__date-deadline-toggle" type="button">
                        date: <span class="card__date-status">${isDateShowing ? `yes` : `no`}</span>
                      </button>
                      
                      ${isDateShowing ?
      `
<fieldset class="card__date-deadline">
                        <label class="card__input-deadline-wrap">
                          <input
                            class="card__date"
                            type="text"
                            placeholder=""
                            name="date"
                            value="${date} ${time}"
                          />
                        </label>
                      </fieldset>`
      : ``}

                      <button class="card__repeat-toggle" type="button">
                        repeat:<span class="card__repeat-status">${isRepeatingTask ? `yes` : `no`}</span>
                      </button>

                      ${isRepeatingTask ?
      `<fieldset class="card__repeat-days">
                        <div class="card__repeat-days-inner">
                          ${repeatingDaysMarkup}
                        </div>
                      </fieldset>` : ``}
                    </div>
                  </div>

                  <div class="card__colors-inner">
                    <h3 class="card__colors-title">Color</h3>
                    <div class="card__colors-wrap">
                      ${colorsMarkup}
                    </div>
                  </div>
                </div>

                <div class="card__status-btns">
                  <button
                    class="card__save"
                    type="submit"
                    ${isBlockSaveButton ? `disabled` : ``}
                    >
                      save
                  </button>
                  <button class="card__delete" type="button">delete</button>
                </div>
              </div>
            </form>
          </article>`
  );
};


export default class TaskEdit extends AbstractSmartComponent {
  constructor(task) {
    super();
    this._task = task;
    this._isDateShowing = !!task.dueDate;
    this._isRepeatingTask = Object.values(task.repeatingDays).some(Boolean);
    this._activeRepeatingDays = Object.assign({}, task.repeatingDays);
    this._currentColor = task.color;

    this._flatpickr = null;

    this._submitHandler = null;

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createTaskEditTemplate(this._task, {
      isDateShowing: this._isDateShowing,
      activeRepeatingDays: this._activeRepeatingDays,
      isRepeatingTask: this._isRepeatingTask,
      color: this._currentColor,
    });
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();

    this._applyFlatpickr();
  }

  reset() {
    const task = this._task;

    this._isDateShowing = !!task.dueDate;
    this._isRepeatingTask = Object.values(task.repeatingDays).some(Boolean);
    this._activeRepeatingDays = Object.assign({}, task.repeatingDays);
    this._currentColor = task.color;

    this.rerender();
  }

  setSubmitHandler(handler) {
    this.getElement().querySelector(`form`)
      .addEventListener(`submit`, handler);

    this._submitHandler = handler;
  }

  _applyFlatpickr() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    if (this._isDateShowing) {
      const dateElement = this.getElement().querySelector(`.card__date`);

      this._flatpickr = flatpickr(dateElement, {
        altInput: true,
        allowInput: true,
        defaultDate: this._task.dueDate || `today`,
      });
    }
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.card__date-deadline-toggle`)
      .addEventListener(`click`, () => {
        this._isDateShowing = !this._isDateShowing;

        this.rerender();
      });

    element.querySelector(`.card__repeat-toggle`)
      .addEventListener(`click`, () => {
        this._isRepeatingTask = !this._isRepeatingTask;

        this.rerender();
      });

    const repeatDays = element.querySelector(`.card__repeat-days`);

    if (repeatDays) {
      repeatDays.addEventListener(`change`, (evt) => {
        this._activeRepeatingDays[evt.target.value] = evt.target.checked;

        this.rerender();
      });
    }

    element.querySelectorAll(`.card__color-input`)
      .forEach((color) => {
        color.addEventListener(`change`, (evt) => {
          this._currentColor = evt.target.value;

          this.rerender();
        });
      });
  }
}
