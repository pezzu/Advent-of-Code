const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input.txt", "utf8").split("");

// const size = 4;
const size = 14;

const start = input.findIndex((_, i, obj) => {
  const collected = new Set(obj.slice(i - size, i));
  return collected.size === size;
});

console.log(start);
