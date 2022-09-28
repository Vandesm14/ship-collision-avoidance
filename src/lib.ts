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
    speed: randomRange(0.1, 2),
  };
};
// override this for testing
// export const randomShip = (): Ship => {
//   return {
//     x: 50,
//     y: 50,
//     bearing: 135,
//     speed: 1,
//   };
// };

export const tickShip = (ship: Ship) => {
  return {
    ...ship,
    x: ship.x + Math.cos(degToRad(ship.bearing - 90)) * ship.speed,
    y: ship.y + Math.sin(degToRad(ship.bearing - 90)) * ship.speed,
  };
};
