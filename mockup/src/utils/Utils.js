import moment from "moment";
const parseDate = (date) => {
  return moment(new Date(date)).format("dddd MMMM D Y");
};
const computeDateDifference = (startDate, endDate) => {
  var admission = moment(startDate, "YYYY-MM");
  var discharge = moment(endDate, "YYYY-MM");
  const diff = discharge.diff(admission, "months");
  return diff;
};
const compareDates = (d1, d2) => {
  return moment(d1).isAfter(d2);
};
export { parseDate, computeDateDifference, compareDates };
