import { nanoid } from 'nanoid';
import { HEIGHT, WIDTH } from './constants';
import { Ship } from './types';

export const degToRad = (deg: number) => (deg * Math.PI) / 180;
export const radToDeg = (rad: number) => (rad * 180) / Math.PI;

export const randomRange = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export const randomShip = (): Ship => {
  const speed = randomRange(0.1, 0.4);
  const bearing = randomRange(0, 360);

  return {
    id: nanoid(),
    x: randomRange(0, WIDTH()),
    y: randomRange(0, HEIGHT()),
    bearing,
    speed,
    // TODO: these are not used yet
    rudder: bearing,
    throttle: speed,
    data: {},
    fov: 180,
  };
};

export const getAngleFromBearing = (bearing: number) => {
  return bearing - 90;
};

export const tickShip = (ship: Ship) => {
  const { x, y, bearing, speed } = ship;

  const angle = getAngleFromBearing(bearing);

  const dx = Math.cos(degToRad(angle)) * speed;
  const dy = Math.sin(degToRad(angle)) * speed;

  return {
    ...ship,
    x: x + dx,
    y: y + dy,
  };
};
