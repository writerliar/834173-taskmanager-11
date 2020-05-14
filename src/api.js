import Task from "./models/task";

const Method = {
  GET: `GET`,
  PUT: `PUT`,
  DELETE: `DELETE`,
  POST: `POST`,
};

const checkStatus = (response) => {
  if (response.status >= 200 || response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const API = class {
  constructor(endPoint, authorization) {
    this._authorization = authorization;

    this._endPoint = endPoint;
  }

  getTasks() {
    return this._load({url: `tasks`})
      .then((response) => response.json())
      .then(Task.parseTasks);
  }

  updateTask(id, data) {
    return this._load({
      url: `/tasks/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data.toRaw()),
      headers: new Headers({"Content-Type": `application/json`}),
    })
      .then((response) => response.json())
      .then(Task.parseTask);
  }

  createTask(task) {
    return this._load({
      url: `/tasks`,
      method: Method.POST,
      body: JSON.stringify(task.toRaw()),
      headers: new Headers({"Content-Type": `application/json`}),
    })
      .then((response) => response.json())
      .then(Task.parseTask);
  }

  deleteTask(id) {
    return this._load({
      url: `/tasks/${id}`,
      method: Method.DELETE,
    });
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
};

export default API;
