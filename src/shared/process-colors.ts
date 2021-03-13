const processColors = (colorArray: string[]): string => {
  let colors = "";
  if (colorArray.length > 1) {
    // Multiple color string
    colorArray.forEach((color, index) => {
      colors += (colorArray.length - 1 === index) ? `${color}` : `${color}, `;
    });
  } else {
    // One color string
    [colors] = colorArray;
  }
  return colors;
};

export default processColors;
