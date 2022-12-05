const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input.txt", "utf8").split("\r\n");

const emptyLinePosition = input.findIndex((line) => line === "");
const numberOfStacks = (input[emptyLinePosition - 1].length + 2) / 4;

const stacks = input
  .slice(0, emptyLinePosition - 1)
  .map((line) => Array.from({ length: numberOfStacks }, (_, i) => line[i * 4 + 1] || " "))
  .reduce(
    (stacks, row) => stacks.map((stack, index) => [row[index], ...stack]),
    Array.from({ length: numberOfStacks }, () => [])
  )
  .map((stack) => stack.filter((crate) => crate !== " "));

const commands = input
  .slice(emptyLinePosition + 1)
  .map((line) => line.match(/\d+/g).map(Number))
  .map(([amount, from, to]) => [amount, from - 1, to - 1]);

const move9000 = (stacks, [amount, from, to]) => {
  const crates = stacks[from].splice(-amount);
  crates.reverse();
  stacks[to].push(...crates);
  return stacks;
};

const move9001 = (stacks, [amount, from, to]) => {
  const crates = stacks[from].splice(-amount);
  stacks[to].push(...crates);
  return stacks;
};

// const tops = commands
//   .reduce((tops, command) => move9000(tops, command), stacks)
//   .map((stack) => stack[stack.length - 1])
//   .join("");

const tops = commands
  .reduce((tops, command) => move9001(tops, command), stacks)
  .map((stack) => stack[stack.length - 1])
  .join("");

console.log(tops);
