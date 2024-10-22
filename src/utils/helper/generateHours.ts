export const generateHours = () => {
    return Array.from({ length: 14 }, (_, i) => {
      const hour = i + 7 < 10 ? `0${i + 7}` : `${i + 7}`;
      return `${hour}:00`;
    });
  };