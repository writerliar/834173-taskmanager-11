import AbstractComponent from "./abstract-component";

const createLoadingTemplate = () => {
  return (
    `Loading...`
  );
};

export default class Loading extends AbstractComponent {
  getTemplate() {
    return createLoadingTemplate();
  }
}
