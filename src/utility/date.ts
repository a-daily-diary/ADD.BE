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

// deprecated
export const generateLastOneYearDateList = () => {
  const toDate = new Date();

  const lastOneYearDateList = Array.from({ length: 365 }, (_, i) => {
    const pastDate = new Date();
    pastDate.setDate(toDate.getDate() - i);
    return convertDateToString(pastDate);
  });

  return lastOneYearDateList;
};

export const generateYearDateList = (targetYear: `${number}`) => {
  const targetDate = new Date(`${targetYear}-01-01`);

  const result = Array.from({ length: 365 }, (_, index) => {
    const data = new Date(targetDate);
    data.setDate(targetDate.getDate() + index);
    return convertDateToString(data);
  });

  // 윤달인 경우 처리
  if (result.at(-1) === `${targetYear}-12-30`) {
    result.push(`${targetYear}-12-31`);
  }

  return result;
};
