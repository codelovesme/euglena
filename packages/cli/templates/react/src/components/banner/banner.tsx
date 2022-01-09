import { useRef, useEffect, useState, useLayoutEffect } from "react";
import {
  Character,
  createE,
  createU,
  createG,
  createL,
  createN,
  createA,
} from "./characters";

export default () => {
  const defaultCharacters: Character[] = [];
  defaultCharacters.push(createE(0));
  defaultCharacters.push(createU(200));
  defaultCharacters.push(createG(440));
  defaultCharacters.push(createL(680));
  defaultCharacters.push(createE(890));
  defaultCharacters.push(createN(1090));
  defaultCharacters.push(createA(1330));

  const defaultCanvasWidth = 1530;
  const defaultCanvasHeight = 220;

  /**
   * Change this variable to change text size
   */
  const preferredCanvasWidth = 800;
  const getMargin = () => {
    const margin = (window.innerWidth - preferredCanvasWidth) / 2;
    return margin > 0 ? margin : 0;
  };

  const getScale = () => {
    const margin = getMargin();
    const innerWidth = window.innerWidth - 10 - 2 * margin; /*buffer*/
    return innerWidth < defaultCanvasWidth
      ? innerWidth / defaultCanvasWidth
      : 1;
  };

  let [state, setState] = useState<{
    characters: Character[];
    resizeListenerAttached: boolean;
  }>({
    characters: [],
    resizeListenerAttached: false
  });

  const { characters,resizeListenerAttached } = state;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas = canvasRef.current;
  const scale = getScale();
  
  const _radius = 6;
  const getRadius = () => {
    return _radius * scale;
  };

  const _borderWidth = 10;
  const getBorderWidth = () => {
    return _borderWidth * scale;
  };

  const getCanvasSize = (scale: number) => ({
    width: defaultCanvasWidth * scale,
    height: defaultCanvasHeight * scale
  });

  useEffect(() => {
    if (canvas) {
      const updateSize = () => {
        const _scale = getScale();
        /**
         * Resize characters
         */
        const _characters = defaultCharacters.map((c) => ({
          offset: c.offset * _scale,
          parts: c.parts.map((p) => ({
            x: p.x * _scale,
            y: p.y * _scale,
            w: p.w * _scale,
            h: p.h * _scale,
          })),
        }));
        setState({
          ...state,
          characters: _characters
        });
      };
      if(!resizeListenerAttached) {
        window.addEventListener("resize", updateSize);
        setState({
          ...state,
          resizeListenerAttached : true
        });
      }
      updateSize();
      return () => window.removeEventListener("resize", updateSize);
    }
    return () => undefined
  }, [canvas]);

  const getPrintableSize = (scale: number) => {
    const borderWidth = getBorderWidth();
    const canvasSize = getCanvasSize(scale);
    return {
      width: canvasSize.width - 2 * borderWidth,
      height: canvasSize.height - 2 * borderWidth,
    };
  };

  useEffect(() => {
    const contains = (X: number, Y: number) => {
      for (let { parts, offset } of characters) {
        for (let { x, y, w, h } of parts) {
          if (x + offset < X && y < Y && X < x + w + offset && Y < y + h) {
            return true;
          }
        }
      }
      return false;
    };
    const createArtist = (ctx:CanvasRenderingContext2D) =>({
      drawCircle : (x: number, y: number) => {
        ctx.beginPath();
        ctx.arc(x, y, getRadius(), 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "lightgray";
        ctx.stroke();
      }
    });
    if (canvas) {
      const ctx = canvas.getContext("2d")!;
      const artist = createArtist(ctx);
      if ((window as any).interval) clearInterval((window as any).interval);
      const _interval = setInterval(() => {
        const printableSize = getPrintableSize(scale);
        const borderWidth = getBorderWidth();
        const x = borderWidth + Math.floor(Math.random() * printableSize.width);
        const y =
        borderWidth + Math.floor(Math.random() * printableSize.height);
        if (contains(x, y)) {
          const r = Math.floor(Math.random() * 255);
          const g = Math.floor(Math.random() * 255);
          const b = Math.floor(Math.random() * 255);
          ctx.fillStyle = `rgb(${r},${g},${b})`;
          artist.drawCircle(x, y);
        }
      }, 10);
      (window as any).interval = _interval
    }
  }, [characters]);
  const _scale = getScale();
  const canvasSize = getCanvasSize(_scale);
  return (
    <canvas ref={canvasRef} {...canvasSize} />
  );
};
