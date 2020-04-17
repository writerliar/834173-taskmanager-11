import AbstractComponent from "./abstract-component";

const createTasksTemplate = () => {
  return (
    `<div class="board__tasks"></div>`
  );
};

export default class Board extends AbstractComponent {
  getTemplate() {
    return createTasksTemplate();
  }
}
