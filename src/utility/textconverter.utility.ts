export const capitalizeText = (text: string) => {
  const lowerCaseAll = text.toLowerCase();
  return lowerCaseAll
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');
};
