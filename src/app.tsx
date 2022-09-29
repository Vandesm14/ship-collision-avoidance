import { createRoot } from 'react-dom/client';
import p5Types from 'p5';
import Sketch from 'react-p5';
import React from 'react';
import { Ship } from './types';
import { degToRad, radToDeg, randomShip, tickShip } from './lib';
import { drawLine, drawShip } from './items';
import { HEIGHT, WIDTH } from './constants';
import {
  absoludeDegtoRelativeDeg,
  angleBetweenPoints,
  atan2ToBearing,
  distanceBetweenPoints,
  intersectionOfTwoLines,
} from './trig';

const App = () => {
  const [ships, setShips] = React.useState<Ship[]>(
    Array(50).fill(null).map(randomShip)
  );

  const diagonal = Math.sqrt(WIDTH() ** 2 + HEIGHT() ** 2);

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(WIDTH(), HEIGHT()).parent(canvasParentRef);

    document.onresize = () => {
      p5.resizeCanvas(WIDTH(), HEIGHT());
    };
  };

  const draw = (p5: p5Types) => {
    let newShips = [...ships];

    p5.clear();
    p5.background(0);

    // if (p5.frameCount % 5 === 0) {
    if (p5.frameCount % 1 === 0) {
      newShips = newShips.map((ship) => {
        const shipsWithDistance = newShips
          .filter((other) => other.id !== ship.id)
          .map((relative) => ({
            ...relative,
            angle: radToDeg(
              angleBetweenPoints(ship.x, ship.y, relative.x, relative.y)
            ),
            distance: distanceBetweenPoints(
              ship.x,
              ship.y,
              relative.x,
              relative.y
            ),
          }));

        const closest = shipsWithDistance.reduce((acc, shipWithDistance) => {
          if (shipWithDistance.distance < acc.distance) {
            return shipWithDistance;
          }

          return acc;
        }, shipsWithDistance[0]);

        const closestAngle = closest.angle;
        const angleAbsolute = atan2ToBearing(degToRad(closestAngle + 90)) % 360;

        const closestBearing = absoludeDegtoRelativeDeg(
          (angleAbsolute - ship.bearing + 180) % 360
        );

        // draw a short line from the ship in the directin of the other ships
        p5.push();
        p5.stroke(255, 0, 0);
        p5.strokeWeight(1);
        p5.translate(ship.x, ship.y);
        p5.rotate(degToRad(angleAbsolute));
        p5.line(0, 0, 0, 100);
        p5.pop();

        let newData = {
          ...ship.data,
          closest: '',
        };

        const MAX_DISTANCE = ship.speed * 60 * 5;
        const MAX_ANGLE = ship.fov / 2;

        const possibleCollision =
          closest.distance < MAX_DISTANCE &&
          Math.abs(closestBearing) < MAX_ANGLE;

        const closestSlopeIntersection = intersectionOfTwoLines(
          ship.x,
          ship.y,
          ship.bearing,
          closest.x,
          closest.y,
          closest.bearing
        );
        const timeToCollision = {
          me:
            distanceBetweenPoints(
              ship.x,
              ship.y,
              closestSlopeIntersection.x,
              closestSlopeIntersection.y
            ) /
            ship.speed /
            60,
          them:
            distanceBetweenPoints(
              closest.x,
              closest.y,
              closestSlopeIntersection.x,
              closestSlopeIntersection.y
            ) /
            closest.speed /
            60,
        };

        // debug lines to check slope
        {
          let color = `#${ship.bearing
            .toString(16)
            .padStart(6, '0')
            .replace('.', '')}`.slice(0, 7);

          p5.push();
          p5.stroke(color);
          p5.strokeWeight(1);
          drawLine(p5, ship.x, ship.y, ship.bearing, 100);
          drawLine(p5, closest.x, closest.y, closest.bearing, 100);
          p5.pop();
        }

        const newBearing =
          closestBearing > 0 ? ship.bearing - 1 : ship.bearing + 1;

        // debug points to check slope intersections
        if (closestSlopeIntersection) {
          p5.push();
          p5.stroke(0, 255, 0);
          p5.strokeWeight(10);
          p5.point(closestSlopeIntersection.x, closestSlopeIntersection.y);
          p5.pop();

          p5.push();
          p5.fill(255);
          p5.text(
            `${Math.round(timeToCollision.me)}s`,
            closestSlopeIntersection.x + 10,
            closestSlopeIntersection.y + 10
          );
          p5.pop();
        }
        newData = {
          // closest: `${Math.round(closest.distance)}nm ${Math.round(
          //   closestBearing
          // )}deg ${Math.round(ship.speed * 200)}kn`,
          // display this ships bearing and x,y (rounded)
          closest: `${Math.round(ship.bearing)}deg ${Math.round(
            ship.x
          )}, ${Math.round(ship.y)}`,
        };

        if (possibleCollision) {
          return {
            ...ship,
            bearing: newBearing,
            speed: p5.lerp(
              ship.speed,
              closest.distance < MAX_DISTANCE / 2 ? 0 : ship.throttle,
              0.1
            ),
            data: newData,
          };
        }

        return {
          ...ship,
          data: newData,
        };
      });
      // debugger;
    }

    newShips = newShips.map(tickShip);

    // wrap ships around the screen
    newShips = newShips.map((ship) => {
      const x = ship.x % WIDTH();
      const y = ship.y % HEIGHT();

      return {
        ...ship,
        x: x < 0 ? WIDTH() + x : x,
        y: y < 0 ? HEIGHT() + y : y,
      };
    });

    newShips.forEach((ship) => {
      drawShip(p5, ship);

      p5.push();
      // add text to show the ship's state
      p5.fill(255, 0, 0);
      p5.text(ship.data.closest, ship.x, ship.y);
      p5.pop();
    });

    setShips(newShips);
  };

  return <Sketch setup={setup} draw={draw} />;
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(<App />);
