export interface Ship {
  x: number;
  y: number;
  bearing: number;
  speed: number;
  // target for the bearing
  rudder: number;
  // target for the speed
  throttle: number;
}
