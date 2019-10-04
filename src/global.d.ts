import * as PIXI from 'pixi.js';
import GestureEvent from './gesture-event';

declare global {
  interface GestureEventMap extends HTMLElementEventMap {
    gesturestart: GestureEvent;
    gesturechange: GestureEvent;
    gestureend: GestureEvent;
  }

  interface HTMLElement {
    addEventListener<K extends keyof GestureEventMap>(
      eventName: K,
      listener: (
        this: HTMLElement,
        ev: GestureEventMap[K],
        options?: boolean | AddEventListenerOptions
      ) => any
    ): void;
    removeEventListener<K extends keyof GestureEventMap>(
      eventName: K,
      listener: (
        this: HTMLElement,
        ev: GestureEventMap[K],
        options?: boolean | AddEventListenerOptions
      ) => any
    ): void;
  }
}

declare module 'pixi-viewport' {
  interface Viewport {
    input: {
      getPointerPosition(event: GestureEvent): PIXI.Point;
    }
  }
}

