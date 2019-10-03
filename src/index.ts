import { Viewport } from 'pixi-viewport';
import { Point } from 'pixi.js';

import BasePlugin from './base-plugin';
import GestureEvent from './gesture-event';

interface Options {
  viewport: Viewport;
  listenerNode?: HTMLElement;
}

class PinchPlugin extends BasePlugin {
  viewport: Viewport;
  listenerNode: HTMLElement;
  initialScale: number;
  initialLocalPosition?: Point;

  constructor(options: Options) {
    super();
    this.viewport = options.viewport;
    this.listenerNode = options.listenerNode || document.body;

    // A bit of silly type coercion here to override TypeScript, which is smart
    // enough to know that both the event names and objects are totally invalid.
    this.listenerNode.addEventListener(
      'gesturestart' as any,
      this.onGestureStart as any
    );
    this.listenerNode.addEventListener(
      'gesturechange' as any,
      this.onGestureChange as any
    );
    this.listenerNode.addEventListener(
      'gestureend' as any,
      this.onGestureEnd as any
    );

    this.initialScale = 1;
  }

  public destroy(): void {
    this.listenerNode.removeEventListener(
      'gesturestart' as any,
      this.onGestureStart as any
    );
    this.listenerNode.removeEventListener(
      'gesturechange' as any,
      this.onGestureChange as any
    );
    this.listenerNode.removeEventListener(
      'gestureend' as any,
      this.onGestureEnd as any
    );
  }

  private onGestureStart = (event: GestureEvent): void => {
    this.initialScale = this.viewport.scale.x;
    const initialGlobalPosition: PIXI.Point = (this
      .viewport as any).input.getPointerPosition(event);
    this.initialLocalPosition = this.viewport.toLocal(initialGlobalPosition);
  };

  private onGestureEnd = (): void => {
    this.viewport.emit('zoomed', { viewport: this.viewport, type: 'pinch' });
  };

  private onGestureChange = (event: GestureEvent) => {
    if (!this.initialLocalPosition) {
      throw new Error('Missing initial position');
    }

    const newScale = event.scale * this.initialScale;
    this.viewport.setZoom(newScale);

    const globalPosition = (this.viewport as any).input.getPointerPosition(
      event
    );
    const localPosition = this.viewport.toLocal(globalPosition);

    const deltaX = localPosition.x - this.initialLocalPosition.x;
    const deltaY = localPosition.y - this.initialLocalPosition.y;

    this.moveRelative(deltaX, deltaY);
    this.viewport.emit('moved', { viewport: this.viewport, type: 'pinch' });
  };

  private moveRelative(deltaX: number, deltaY: number) {
    this.viewport.moveCenter(
      new Point(
        this.viewport.center.x - deltaX,
        this.viewport.center.y - deltaY
      )
    );
  }
}

export default PinchPlugin;
