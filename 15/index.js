const fs = require("fs");

const input = fs
  .readFileSync(__dirname + "/input.txt", "utf8")
  // .readFileSync(__dirname + "/test.txt", "utf8")
  .split("\r\n");

const sensors = input.map(parseSensor);

let map = new Set();
// const detectionLine = 10;
const detectionLine = 2000000;

sensors.forEach((sensor, i) => {
  countLine(sensor.sensorLocation, sensor.radius, detectionLine);
});

sensors
  .filter((sensor) => sensor.beaconLocation[1] === detectionLine)
  .forEach((sensor) => {
    map.delete(sensor.beaconLocation[0]);
  });

console.log(map.size);

function parseSensor(line) {
  const [sensorLocation, beaconLocation] = line
    .match(/x=-?\d+, y=-?\d+/g)
    .map((coords) => coords.match(/-?\d+/g).map(Number));

  return { sensorLocation, beaconLocation, radius: getDistance(sensorLocation, beaconLocation) };
}

function getDistance([x1, y1], [x2, y2]) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function fillCell(x, y) {
  map.add(x);
}

function countLine([x, y], radius, max) {
  if ((y <= max && y + radius >= max) || (y >= max && y - radius <= max)) {
    for (let i = 0; i <= radius - Math.abs(y - max); i++) {
      fillCell(x + i, max);
      fillCell(x - i, max);
    }
  }
}
