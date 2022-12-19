const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input.txt", "utf8").split("\r\n");

const parseCube = (line) => {
  return line.split(",").map(Number);
};

const cubes = input.map(parseCube);

const sides = (cubes) => {
  return cubes.reduce(
    (sum, cube) => sum + (6 - neighbors(cube).filter(isExistsIn(cubes)).length),
    0
  );
};

const neighbors = (cube) => {
  const [x, y, z] = cube;
  return [
    [x + 1, y, z],
    [x - 1, y, z],
    [x, y + 1, z],
    [x, y - 1, z],
    [x, y, z + 1],
    [x, y, z - 1],
  ];
};

const isExistsIn = (cubes) => (cube) => cubes.some((other) => cube.every((c, i) => c === other[i]));

const isInBox = ([minX, minY, minZ], [maxX, maxY, maxZ]) => (cube) => {
  const [x, y, z] = cube;
  return x >= minX && x <= maxX && y >= minY && y <= maxY && z >= minZ && z <= maxZ;
};

const not = (fn) => (...args) => !fn(...args);

const surface = (cubes) => {
  const mins = cubes.reduce((box, cube) => cube.map((c, i) => Math.min(box[i], c-1)), [Infinity, Infinity, Infinity]);
  const maxs = cubes.reduce((box, cube) => cube.map((c, i) => Math.max(box[i], c+1)), [-Infinity, -Infinity, -Infinity]);

  const emptyNeighbors = (cube) => neighbors(cube).filter(isInBox(mins, maxs)).filter(not(isExistsIn(cubes)));
  const solidNeighbors = (cube) => neighbors(cube).filter(isInBox(mins, maxs)).filter(isExistsIn(cubes));

  const visited = new Set();
  const queue = [mins];
  let count = 0;

  while (queue.length) {
    const cube = queue.shift();
    if (visited.has(JSON.stringify(cube))) continue;
    visited.add(JSON.stringify(cube));
    count += solidNeighbors(cube).length;
    queue.push(...emptyNeighbors(cube));
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
    [1, 1, 1],
    [2, 1, 1],
  ])
);

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
