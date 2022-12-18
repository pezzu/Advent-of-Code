const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input.txt", "utf8").split("\r\n");

const parseCube = (line) => {
  return line.split(",").map(Number);
};

const cubes = input.map(parseCube);

const sides = (cubes) => {
  return cubes.reduce((sum, cube) => sum + (6 - neighbors(cube, cubes)), 0);
};

const neighbors = (cube, cubes) => {
  return cubes.reduce((count, other) => {
    if (cube === other) return count;
    return count + (isNeighbor(cube, other) ? 1 : 0);
  }, 0);
};

const isNeighbor = (cube, other) => {
  return cube.map((c, i) => Math.abs(c - other[i])).reduce((sum, diff) => sum + diff, 0) === 1;
};

console.log(
  sides([
    [1, 1, 1],
    [2, 1, 1],
  ])
);

console.log(
  sides([
    [1, 2, 2],
    [3, 2, 2],
    [2, 1, 2],
    [2, 3, 2],
    [2, 2, 1],
    [2, 2, 3],
    [2, 2, 4],
    [2, 2, 6],
    [1, 2, 5],
    [3, 2, 5],
    [2, 1, 5],
    [2, 3, 5],
    [2, 2, 2],
  ])
);

console.log(sides(cubes));
