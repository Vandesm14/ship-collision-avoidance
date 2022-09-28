import { degToRad, radToDeg } from './lib';
import { Ship } from './types';

export const angleBetweenPoints = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  return Math.atan2(y2 - y1, x2 - x1);
};

export const findShipsInFOV = (
  ships: Ship[],
  x: number,
  y: number,
  angle: number,
  fov: number
): Array<Ship & { angleDiff: number }> => {
  const withAngle = ships.map((ship) => {
    const angleDiff = angleBetweenPoints(x, y, ship.x, ship.y);
    return {
      ...ship,
      angleDiff: (radToDeg(angleDiff) + 360) % 360,
    };
  });

  // return withAngle;

  const inFOV = withAngle.filter((ship) => {
    return (
      Math.abs(angle - ship.angleDiff) < fov / 2 ||
      Math.abs(angle - ship.angleDiff) > 360 - fov / 2
    );
  });

  return inFOV;
};
