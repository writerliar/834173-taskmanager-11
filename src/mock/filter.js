const filterTitles = [
  `all`,
  `overdue`,
  `today`,
  `favorites`,
  `repeating`,
  `archive`
];

const generateFilters = () => {
  return filterTitles.map((it) => {
    return {
      title: it,
      count: Math.floor(Math.random() * 10),
    };
  });
};

const filters = generateFilters();

export {filters};
