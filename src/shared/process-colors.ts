const processColors = (colorArray: string[]): string => {
  let colors= "";
  if (colorArray.length > 1) {
    colorArray.forEach((color, index) => {
      colorArray.length - 1 === index
        ? (colors += `${color}`)
        : (colors += `${color}, `);
    });
  } else {
    colors = colorArray[0];
  }
  return colors;
};

export default processColors;
