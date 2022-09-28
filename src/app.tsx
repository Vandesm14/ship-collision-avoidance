import { createRoot } from 'react-dom/client';
import p5Types from 'p5';
import Sketch from 'react-p5';
import React from 'react';
import { Ship } from './types';
import { randomShip, tickShip } from './lib';
import { drawShip } from './items';
import { HEIGHT, WIDTH } from './constants';

const App = () => {
  const [ships, setShips] = React.useState<Ship[]>(
    Array(100).fill(null).map(randomShip)
  );

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(WIDTH(), HEIGHT()).parent(canvasParentRef);

    document.onresize = () => {
      p5.resizeCanvas(WIDTH(), HEIGHT());
    };
  };

  const draw = (p5: p5Types) => {
    setShips((ships) => ships.map((ship) => tickShip(ship)));

    p5.background(0);
    ships.forEach((ship) => drawShip(p5, ship));
  };

  return <Sketch setup={setup} draw={draw} />;
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(<App />);
