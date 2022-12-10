const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input.txt", "utf8").split("\r\n");

const parse = (line) => {
  const [action, value] = line.split(" ");
  return [action, Number(value)];
};

const addx = (value) => (x) => [x, x + value];
const noop = () => (x) => [x];

const cycles = input
  .map(parse)
  .map(([action, value]) => {
    if (action === "addx") return addx(value);
    if (action === "noop") return noop();
  })
  .reduce(
    (acc, op) => {
      return [...acc, ...op(acc[acc.length - 1])];
    },
    [1]
  );

const strength = [20, 60, 100, 140, 180, 220].map((x) => x * cycles[x - 1]).reduce((a, b) => a + b);

console.log(strength);

const draw = (cycles) => {
  return cycles
    .map((x, cycle) => {
      if (cycle - 1 <= x && x <= cycle + 1) return "#";
      return ".";
    })
    .join("");
};

for (let i = 0; i < 6; i++) {
  console.log(draw(cycles.slice(i * 40, (i + 1) * 40)));
}
