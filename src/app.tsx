import { createRoot } from 'react-dom/client';
import p5Types from 'p5';
import Sketch from 'react-p5';

const App = () => {
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(window.innerWidth, window.innerHeight).parent(
      canvasParentRef
    );
  };

  const draw = (p5: p5Types) => {
    p5.background(0);
    p5.ellipse(p5.mouseX, p5.mouseY, 70, 70);
  };

  return <Sketch setup={setup} draw={draw} />;
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(<App />);
