import { Ship } from './types';
import p5Types from 'p5';
import { degToRad } from './lib';

const drawTriangle = (
  p5: p5Types,
  x: number,
  y: number,
  size: number,
  angle: number
) => {
  p5.push();
  p5.translate(x, y);
  p5.rotate(degToRad(angle));
  p5.triangle(0, -size, -size, size, size, size);
  p5.pop();
};

const drawFOVArc = (
  p5: p5Types,
  x: number,
  y: number,
  angle: number,
  fov: number,
  range: number
) => {
  p5.push();
  p5.translate(x, y);
  p5.rotate(degToRad(angle - 90));
  p5.noFill();
  p5.stroke(255, 0, 0);
  p5.strokeWeight(2);
  p5.arc(0, 0, range * 2, range * 2, degToRad(-fov / 2), degToRad(fov / 2));
  p5.line(
    0,
    0,
    range * Math.cos(degToRad(-fov / 2)),
    range * Math.sin(degToRad(-fov / 2))
  );
  p5.line(
    0,
    0,
    range * Math.cos(degToRad(fov / 2)),
    range * Math.sin(degToRad(fov / 2))
  );
  p5.stroke(255);
  p5.line(0, 0, range, 0);
  p5.pop();
};

export const drawShip = (p5: p5Types, ship: Ship) => {
  const { x, y, bearing, speed } = ship;

  const radius = speed * 60 * 5;

  drawFOVArc(p5, x, y, bearing, ship.fov, radius);
  drawTriangle(p5, x, y, 10, bearing);
};

export const drawLine = (
  p5: p5Types,
  x: number,
  y: number,
  bearing: number,
  length: number
) => {
  // bearing 0 is up
  const angle = bearing - 90;
  const dx = Math.cos(degToRad(angle)) * length;
  const dy = Math.sin(degToRad(angle)) * length;

  p5.line(x, y, x + dx, y + dy);
};
