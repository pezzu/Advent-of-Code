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

const surface = (cubes) => {
  return bfs(start(cubes), cubes);
};

const max = (array) => array.reduce((max, item) => Math.max(max, item), -Infinity);
const min = (array) => array.reduce((min, item) => Math.min(min, item), Infinity);
const maxX = (cubes) => max(cubes.map((cube) => cube[0])) + 1;
const minX = (cubes) => min(cubes.map((cube) => cube[0])) - 1;
const maxY = (cubes) => max(cubes.map((cube) => cube[1])) + 1;
const minY = (cubes) => min(cubes.map((cube) => cube[1])) - 1;
const maxZ = (cubes) => max(cubes.map((cube) => cube[2])) + 1;
const minZ = (cubes) => min(cubes.map((cube) => cube[2])) - 1;

const emptyNeighbors = (cube, cubes) => {
  const [x, y, z] = cube;
  return [
    [x + 1, y, z],
    [x - 1, y, z],
    [x, y + 1, z],
    [x, y - 1, z],
    [x, y, z + 1],
    [x, y, z - 1],
  ]
    .filter(
      ([x, y, z]) =>
        x >= minX(cubes) &&
        x <= maxX(cubes) &&
        y >= minY(cubes) &&
        y <= maxY(cubes) &&
        z >= minZ(cubes) &&
        z <= maxZ(cubes)
    )
    .filter((cube) => !cubes.some((other) => JSON.stringify(cube) === JSON.stringify(other)));
};

const start = (cubes) => {
  return [minX(cubes), minY(cubes), minZ(cubes)];
};

const nonEmptySides = (cube, cubes) => {
  const [x, y, z] = cube;
  return [
    [x + 1, y, z],
    [x - 1, y, z],
    [x, y + 1, z],
    [x, y - 1, z],
    [x, y, z + 1],
    [x, y, z - 1],
  ]
    .filter(
      ([x, y, z]) =>
        x >= minX(cubes) &&
        x <= maxX(cubes) &&
        y >= minY(cubes) &&
        y <= maxY(cubes) &&
        z >= minZ(cubes) &&
        z <= maxZ(cubes)
    )
    .filter((cube) => cubes.some((other) => JSON.stringify(cube) === JSON.stringify(other))).length;
};

const bfs = (start, cubes) => {
  const visited = new Set();
  const queue = [start];
  let count = 0;
  while (queue.length) {
    const cube = queue.shift();
    if (visited.has(JSON.stringify(cube))) continue;
    visited.add(JSON.stringify(cube));
    count += nonEmptySides(cube, cubes);
    queue.push(...emptyNeighbors(cube, cubes));
  }
  return count;
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

console.log(
  surface([
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

console.log(surface(cubes));
