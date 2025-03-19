export const getStatusMessage = (status) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'away':
        return 'Away';
      case 'busy':
        return 'Busy';
      case 'doNotDisturb':
        return 'Do Not Disturb';
      case 'offline':
        return 'Offline';
      default:
        let date = new Date(status);
        if (!isNaN(date)) {
          return `Offline since ${date.toLocaleString()}`;
        } else {
          return 'Unknown Status';
        }
    }
  };