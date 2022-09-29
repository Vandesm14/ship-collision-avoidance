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

export const slopeToBearing = (slope: number) => {
  return atan2ToBearing(Math.atan(slope));
};

/** Because we use bearing as a NSEW value where 0 is up,
 * we need to convert to polar degrees in which 0 is right
 */
export const bearingToAngle = (bearing: number) => {
  return (bearing + 270) % 360;
};

export const intersectionOfTwoLines = (
  x1: number,
  y1: number,
  bearing1: number,
  x2: number,
  y2: number,
  bearing2: number
) => {
  // bearing angle 0 is up
  // don't use slope, just add x and y based on bearing
  const angle1 = degToRad(bearingToAngle(bearing1));
  const angle2 = degToRad(bearingToAngle(bearing2));

  const x =
    (x1 * Math.tan(angle1) - x2 * Math.tan(angle2) + y2 - y1) /
    (Math.tan(angle1) - Math.tan(angle2));
  const y = Math.tan(angle1) * (x - x1) + y1;

  return { x, y };
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
