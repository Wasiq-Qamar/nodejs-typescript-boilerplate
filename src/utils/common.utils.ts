import moment from 'moment';

const groupBy = (arr: any[], key: string) => {
  const groupedItems = arr.reduce(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (results: {[key: string]: any[]}, currentItem: any) => {
      const value = currentItem[key];

      if (!results[value]) {
        results[value] = [];
      }

      results[value].push(currentItem);

      return results;
    },
    {}
  );

  return groupedItems;
};

const safeParseJSON = (json: any): any | null => {
  try {
    return JSON.parse(json);
  } catch (e) {
    return json;
  }
};

const range = (start: number, end: number) => {
  return Array.from({length: end - start}, (_, i) => i + start);
};

const capitalizeString = (str: string): string => {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const formatDate = (date: string): string => {
  return moment(date).format('ddd, MMM DD, YYYY').toUpperCase();
};

const shuffle = (list: any[]): any[] => {
  return list.sort(() => Math.random() - 0.5);
};

export {capitalizeString, formatDate, groupBy, range, shuffle, safeParseJSON};
