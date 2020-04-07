import {COLORS} from "../consts";

const TASK_COUNT = 20;

const DescriptionItems = [`Изучить теорию`, `Сделать домашку`, `Пройти интенсив на соточку`];

const DefaultRepeatingDays = {
  "mo": false,
  "tu": false,
  "we": false,
  "th": false,
  "fr": false,
  "sa": false,
  "su": false,
};

const getRandomValue = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const getRandomDate = () => {
  const targetDate = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * getRandomIntegerNumber(0, 8);

  targetDate.setDate(targetDate.getDate() + diffValue);

  return targetDate;
};

const generateRepeatingDays = () => {
  return Object.assign({}, DefaultRepeatingDays, {
    "mo": Math.random() > 0.5
  });
};

const generateTask = () => {
  const dueDate = Math.random() > 0.5 ? null : getRandomDate();
  const repeatingDays = dueDate ? DefaultRepeatingDays : generateRepeatingDays();
  const isRepeat = Object.values(repeatingDays).some(Boolean);

  return {
    color: getRandomValue(COLORS),
    description: getRandomValue(DescriptionItems),
    isArchive: Math.random() > 0.5,
    isFavorite: Math.random() > 0.5,
    dueDate,
    repeatingDays,
    isExpired: dueDate instanceof Date && dueDate < Date.now(),
    isRepeat,
  };
};

const generateTasks = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateTask);
};

const tasks = generateTasks(TASK_COUNT);

export {generateTask, tasks};
