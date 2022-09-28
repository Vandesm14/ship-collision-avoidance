import { Ship } from './types';

export const degToRad = (deg: number) => (deg * Math.PI) / 180;

export const randomRange = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export const randomShip = (): Ship => {
  return {
    x: Math.random() * 100,
    y: Math.random() * 100,
    bearing: randomRange(90, 180),
    speed: randomRange(0.1, 0.3),
    // TODO: these are not used yet
    rudder: 0,
    throttle: 0,
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
