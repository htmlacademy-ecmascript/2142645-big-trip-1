import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { DATE_FORMAT } from './const.js';

dayjs.extend(duration);

const getRandomNumber = (min, max, afterCommaNumbers) => {
  if (min >= max) {
    return NaN;
  }
  let randomValue;
  if (afterCommaNumbers === 0) {
    randomValue = min + (max - min + 1) * Math.random();
    return Math.trunc(randomValue);
  }
  randomValue = min + (max - min) * Math.random();
  return Number(randomValue.toFixed(afterCommaNumbers));
};

const getRandomItemArray = (array) => array[getRandomNumber(0, array.length - 1, 0)];

const formatsDate = (date, format) => date ? dayjs(date).format(format) : '';

const calculatesDuration = (dateFrom, dateTo) => {
  const dateFr = dayjs(dateFrom);
  const dateT = dayjs(dateTo);
  const difference = dayjs.duration(dateT.diff(dateFr));
  const hour = difference.format(DATE_FORMAT.HOURS);
  const minute = difference.minutes();
  return `${hour !== '00' ? `${hour}H` : ''} ${minute}M`;
};

export { getRandomNumber, getRandomItemArray, formatsDate, calculatesDuration };
