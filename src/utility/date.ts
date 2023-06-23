export const convertDateToString = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const paddingMonth =
    month.toString().length === 1 ? month.toString().padStart(2, '0') : month;
  const paddingDay =
    day.toString().length === 1 ? day.toString().padStart(2, '0') : day;

  return `${year}-${paddingMonth}-${paddingDay}`;
};

export const generateLastOneYearDateList = () => {
  const toDate = new Date();

  const lastOneYearDateList = Array.from({ length: 365 }, (_, i) => {
    const pastDate = new Date();
    pastDate.setDate(toDate.getDate() - i);
    return convertDateToString(pastDate);
  });

  return lastOneYearDateList;
};
