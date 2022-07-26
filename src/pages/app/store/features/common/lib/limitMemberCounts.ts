export function limitMemberCounts<T>(
  input: Array<T>,
  value: any,
  max: number = Infinity
) {
  while (input.length >= max) {
    input.shift();
  }
  input.push(value);
  return input;
}
