export const getFillColor = (value: number) => {
  switch (true) {
    case value > 400:
      return [217, 78, 93];
    case value > 350:
      return [244, 109, 67];
    case value > 300:
      return [253, 174, 97];
    case value > 250:
      return [254, 224, 144];
    case value > 200:
      return [255, 255, 191];
    case value > 150:
      return [224, 243, 248];
    case value > 100:
      return [171, 217, 233];
    case value > 50:
      return [171, 217, 233];
    case value > 10:
      return [116, 173, 209];
    default:
      return [69, 117, 180];
  }
};
