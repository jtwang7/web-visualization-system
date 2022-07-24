function repeatWord(word: string, num: number) {
  let result = "";
  for (let i = 0; i < num; i++) {
    result += word;
  }
  return result;
}
function repeatLetter(word: string, num: number) {
  let result = "";
  for (let letter of word) {
    result += repeatWord(letter, num);
  }
  return result;
}

export const hexToRgb = (hex: string) => {
  let hexNum: any = hex.substring(1);
  hexNum = "0x" + (hexNum.length < 6 ? repeatLetter(hexNum, 2) : hexNum);
  let r = hexNum >> 16;
  let g = (hexNum >> 8) & ("0xff" as any);
  let b = hexNum & ("0xff" as any);
  return `rgb(${r},${g},${b})`;
};

export const rgbToHex = (color: string) => {
  if (color.indexOf("#") !== -1) {
    return color;
  }
  let arr = color.split(",");
  let r = +arr[0].split("(")[1];
  let g = +arr[1];
  let b = +arr[2].split(")")[0];
  let value = (1 << 24) + r * (1 << 16) + g * (1 << 8) + b;
  let strValue = value.toString(16);
  return "#" + strValue.slice(1);
};
