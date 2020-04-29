import {FilterType} from "../consts";
import {isRepeating, isOneDay, isOverdueDate} from "./common";

const getNotArchivedTasks = (tasks) => {
  return tasks.filter((task) => !task.isArchive);
};

const getArchivedTasks = (tasks) => {
  return tasks.filter((task) => task.isArchive);
};

const getFavoriteTasks = (tasks) => {
  return tasks.filter((task) => task.isFavorite);
};

const getOverdueTasks = (tasks, date) => {
  return tasks.filter((task) => {
    const dueDate = task.dueDate;

    if (!dueDate) {
      return false;
    }

    return isOverdueDate(dueDate, date);
  });
};

const getTasksInOneDay = (tasks, date) => {
  return tasks.filter((task) => isOneDay(task.dueDate, date));
};

const getRepeatingTasks = (tasks) => {
  return tasks.filter((task) => isRepeating(task.repeatingDays));
};

export const getTasksByFilter = (tasks, filterType) => {
  const nowDate = new Date();

  switch (filterType) {
    case FilterType.ALL:
      return getNotArchivedTasks(tasks);
    case FilterType.ARCHIVE:
      return getArchivedTasks(tasks);
    case FilterType.FAVORITES:
      return getFavoriteTasks(getNotArchivedTasks(tasks));
    case FilterType.OVERDUE:
      return getOverdueTasks(getNotArchivedTasks(tasks), nowDate);
    case FilterType.REPEATING:
      return getRepeatingTasks(getNotArchivedTasks(tasks));
    case FilterType.TODAY:
      return getTasksInOneDay(getNotArchivedTasks(tasks), nowDate);

  }

  return tasks;
};
