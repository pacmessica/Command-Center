// formatDate returns a date string in the format "9/22/2019, 9:28:18 PM"
export function formatDate(date) {
  var year = date.getFullYear();
  var month = date.getMonth();
  var day = date.getDate();

  month = month + 1;
  let time = formatTime(date);
  return month + "/" + day + "/" + year + ", " + time;
}

// formatTime returns time string in the format "9:28:18 PM"
function formatTime(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  return hours + ":" + minutes + ":" + seconds + " " + ampm;
}
