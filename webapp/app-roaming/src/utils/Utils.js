import moment from 'moment';
const parseDate = (date) => {
  return moment(new Date(date)).format('dddd MMMM D Y');
};
const computeDateDifference = (startDate, endDate) => {
  const admissionMonth = moment(startDate, 'YYYY-MM').month();
  const dischargeMonth = moment(endDate, 'YYYY-MM').month();
  const diff = dischargeMonth - admissionMonth;
  return diff + 1;
};
const compareDates = (d1, d2) => {
  return moment(d1).isAfter(d2);
};
export {parseDate, computeDateDifference, compareDates};
