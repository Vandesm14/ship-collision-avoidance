import { radToDeg } from './lib';
import { Ship } from './types';

export const angleBetweenPoints = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  return Math.atan2(y2 - y1, x2 - x1);
};

export const atan2ToBearing = (angle: number) => {
  return radToDeg(angle + Math.PI) % 360;
};

export const absoludeDegtoRelativeDeg = (deg: number) => {
  return deg > 180 ? deg - 360 : deg;
};

export const distanceBetweenPoints = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
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

  const inFOV = withAngle.filter((ship) => {
    return (
      Math.abs(angle - ship.angleDiff) < fov / 2 ||
      Math.abs(angle - ship.angleDiff) > 360 - fov / 2
    );
  });

  return inFOV;
};
