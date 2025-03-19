export const formatTimestampToDate1 = (timestamp) => {
    const date = new Date(timestamp);
    return {
      day: date.getDate(),
      monthNumber: date.getMonth() + 1,
      monthName: date.toLocaleString('default', { month: 'long' }),
      year: date.getFullYear(),
      dayName: date.toLocaleString('default', { weekday: 'long' }),
    };
  };
  
  export const formatTimestampToDate = () => {
    const date = new Date();
    return {
      day: date.getDate(),
      monthNumber: date.getMonth() + 1,
      monthName: date.toLocaleString('default', { month: 'long' }),
      year: date.getFullYear(),
      dayName: date.toLocaleString('default', { weekday: 'long' }),
    };
  };
  
  export const produceptagsbycomparingdates = (messages) => {
    let messagedate = formatTimestampToDate1(messages);
    let currentdate = formatTimestampToDate();
    let dateTag = null;
  
    if (messagedate.year !== currentdate.year) {
      dateTag = `${messagedate.day},  ${messagedate.monthName}, ${messagedate.year}`;
    } else if (messagedate.monthNumber !== currentdate.monthNumber) {
      dateTag = `${messagedate.day}, ${messagedate.monthName}, ${messagedate.year}`;
    } else if (messagedate.day !== currentdate.day) {
      if (messagedate.day === currentdate.day - 1) {
        dateTag = 'Yesterday';
      } else if (messagedate.day === currentdate.day - 2) {
        dateTag = messagedate.dayName;
      } else if (messagedate.day === currentdate.day - 3) {
        dateTag = messagedate.dayName;
      } else if (messagedate.day === currentdate.day - 4) {
        dateTag = messagedate.dayName;
      } else if (messagedate.day === currentdate.day - 5) {
        dateTag = messagedate.dayName;
      } else if (messagedate.day === currentdate.day - 6) {
        dateTag = messagedate.dayName;
      } else {
        dateTag = `${messagedate.day}, ${messagedate.monthNumber},  ${messagedate.year}`;
      }
    } else if (messagedate.day === currentdate.day) {
      dateTag = 'Today';
    }
    return dateTag;
  };
  
  export const comparemessagedates = (message) => {
    let counter = message.length;
    const newArrayDates = [];
  
    for (let i = 1; i <= counter; i++) {
      newArrayDates.push(produceptagsbycomparingdates(message[counter - i].timestamp));
    }
    return newArrayDates;
  };