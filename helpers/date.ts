const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function getFormattedDate(timestamp: number) {
  const date = new Date(timestamp);
  const dd = date.getDate();
  const month = date.getMonth();
  const mm = months[month].substring(0, 3);
  return dd + " " + mm;
}
