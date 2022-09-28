import { createRoot } from 'react-dom/client';
import p5Types from 'p5';
import Sketch from 'react-p5';
import React from 'react';
import { Ship } from './types';
import { randomShip, tickShip } from './lib';
import { drawShip } from './items';
import { HEIGHT, WIDTH } from './constants';
import { findShipsInFOV } from './trig';

const App = () => {
  const [ships, setShips] = React.useState<Ship[]>(
    Array(100).fill(null).map(randomShip)
  );
  const [displayShips, setDisplayShips] = React.useState<Ship[]>(ships);
  const [radar, setRadar] = React.useState(0);

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(WIDTH(), HEIGHT()).parent(canvasParentRef);

    document.onresize = () => {
      p5.resizeCanvas(WIDTH(), HEIGHT());
    };
  };

  const draw = (p5: p5Types) => {
    const radarFOV = 3;
    const newRadar = (radar + (24 / 60 / 60) * 360) % 360;
    setRadar(newRadar);

    const newShips = ships.map(tickShip);

    // the ships within visibility of the radar
    const shipsToUpdate = findShipsInFOV(
      newShips,
      WIDTH() / 2,
      HEIGHT() / 2,
      newRadar,
      radarFOV
    );
    const shipsToUpdateIds = shipsToUpdate.map((s) => s.id);

    // update the display ships to be the ships within the radar's FOV
    const newDisplayShips = displayShips.map((ship) => {
      if (shipsToUpdateIds.includes(ship.id)) {
        return newShips.find((s) => s.id === ship.id) || ship;
      }
      return ship;
    });

    setShips(newShips);
    setDisplayShips(newDisplayShips);

    p5.clear();
    p5.background(0);

    const diagonal = Math.sqrt(WIDTH() ** 2 + HEIGHT() ** 2);

    p5.push();
    p5.fill(0, 50, 0);
    p5.arc(
      WIDTH() / 2,
      HEIGHT() / 2,
      diagonal,
      diagonal,
      (newRadar - radarFOV) * (Math.PI / 180),
      (newRadar + radarFOV) * (Math.PI / 180)
    );
    p5.pop();

    displayShips.forEach((ship) => {
      const shipToUpdate = shipsToUpdate.find((s) => s.id === ship.id);
      if (shipToUpdate) drawShip(p5, shipToUpdate);
      else drawShip(p5, ship);
    });

    p5.textSize(32);
    p5.fill(255);
    p5.text(
      `Found ${shipsToUpdate.length} ships (angle ${Math.round(radar)})`,
      10,
      30
    );
  };

  return <Sketch setup={setup} draw={draw} />;
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(<App />);
