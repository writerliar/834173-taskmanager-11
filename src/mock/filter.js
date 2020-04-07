import {tasks} from "./task";

const generateFilters = () => {
  return [
    {
      title: `all`,
      count: tasks.length,
    },
    {
      title: `overdue`,
      count: tasks.filter((task) => task.isExpired).length,
    },
    {
      title: `today`,
      count: tasks.filter((task) => String(task.dueDate) === String(new Date())).length,
    },
    {
      title: `favorites`,
      count: tasks.filter((task) => task.isFavorite).length,
    },
    {
      title: `repeating`,
      count: tasks.filter((task) => task.isRepeat).length,
    },
    {
      title: `archive`,
      count: tasks.filter((task) => task.isArchive).length,
    }
  ];
};

const filters = generateFilters();

export {filters};
