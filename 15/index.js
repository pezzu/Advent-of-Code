const fs = require("fs");

const input = fs
  .readFileSync(__dirname + "/input.txt", "utf8")
  // .readFileSync(__dirname + "/test.txt", "utf8")
  .split("\r\n");

function parseSensor(line) {
  const [sensorLocation, beaconLocation] = line
    .match(/x=-?\d+, y=-?\d+/g)
    .map((coords) => coords.match(/-?\d+/g).map(Number));

  return { sensorLocation, beaconLocation, radius: getDistance(sensorLocation, beaconLocation) };
}

function getDistance([x1, y1], [x2, y2]) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function isIntersectsY([x, y], radius, axis) {
  return (y <= axis && y + radius >= axis) || (y >= axis && y - radius <= axis);
}

function getFilledIntervalY([x, y], radius, axis) {
  const start = x - radius + Math.abs(y - axis);
  const end = x + radius - Math.abs(y - axis);
  return [start, end];
}

function countCells(intervals) {
  return intervals.reduce((acc, [start, end]) => acc + end - start, 0);
}

function compress(intervals) {
  return intervals
    .slice()
    .sort((a, b) => a[0] - b[0])
    .reduce((acc, [start, end]) => {
      if (acc.length === 0) {
        acc.push([start, end]);
        return acc;
      }

      const last = acc[acc.length - 1];
      if (start <= last[1] + 1) {
        last[1] = Math.max(last[1], end);
      } else {
        acc.push([start, end]);
      }

      return acc;
    }, []);
}

function getFilledIntervals(sensors, detectionLine) {
  const intervals = sensors
    .filter((sensor) => isIntersectsY(sensor.sensorLocation, sensor.radius, detectionLine))
    .map((sensor) => getFilledIntervalY(sensor.sensorLocation, sensor.radius, detectionLine));

  return compress(intervals);
}

function getAvailableIntervals([start, end], filledIntervals) {
  const availableIntervals = [];

  for (let i = 0; i < filledIntervals.length - 1, start < end; i++) {
    if (start < filledIntervals[i][0]) {
      availableIntervals.push([start, filledIntervals[i][0] - 1]);
      start = filledIntervals[i][1] + 1;
    } else if (start < filledIntervals[i][1]) {
      start = filledIntervals[i][1] + 1;
    }
  }

  if (start < end) availableIntervals.push([start, end]);

  return availableIntervals;
}

const sensors = input.map(parseSensor);

const filledCells = countCells(getFilledIntervals(sensors, 2000000));
console.log(filledCells);

// const borders = [0, 20];
const borders = [0, 4000000];

for (let i = borders[0]; i <= borders[1]; i++) {
  const filled = getFilledIntervals(sensors, i);
  const available = getAvailableIntervals(borders, filled);
  if (available.length > 0) {
    const frequency = available[0][0] * 4000000 + i;
    console.log(frequency);
  }
}
