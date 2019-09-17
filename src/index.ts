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
  initialPointerPosition?: Point;
  currentPointerPosition?: Point;

  constructor(options: Options) {
    super();
    this.viewport = options.viewport;
    this.listenerNode = options.listenerNode || document.body;

    // A bit of silly type coercion here to override TypeScript, which is smart
    // enough to know that both the event names and objects are totally invalid.
    this.listenerNode.addEventListener('gesturestart' as any, this.onGestureStart as any);
    this.listenerNode.addEventListener('gesturechange' as any, this.onGestureChange as any);
    this.listenerNode.addEventListener('gestureend' as any, this.onGestureEnd as any);

    this.initialScale = 1;
  }

  public destroy(): void {
    this.listenerNode.removeEventListener('gesturestart' as any, this.onGestureStart as any);
    this.listenerNode.removeEventListener('gesturechange' as any, this.onGestureChange as any);
    this.listenerNode.removeEventListener('gestureend' as any, this.onGestureEnd as any);
  }

  public move(event: UIEvent): void {
    this.currentPointerPosition = (this.viewport as any).input.getPointerPosition(event);
  }

  private onGestureStart = (event: GestureEvent): void => {
    console.log('start', event);
    this.initialScale = this.viewport.scale.x;
    this.initialPointerPosition = (this.viewport as any).input.getPointerPosition(event);
  }

  private onGestureEnd = (event: GestureEvent): void => {
    console.log('end', event);
  }

  private onGestureChange = (event: GestureEvent) => {
    console.log('change', event);
    this.viewport.scale.x = event.scale * this.initialScale;
    this.viewport.scale.y = event.scale * this.initialScale;
    this.viewport.emit('zoomed', { viewport: this.viewport, type: 'pinch' });

    const pointerPosition = (this.viewport as any).input.getPointerPosition(event);

    if (!this.initialPointerPosition) {
      throw new Error('Missing initial pointer position');
    }

    this.viewport.x += pointerPosition.x - this.initialPointerPosition.x;
    this.viewport.y += pointerPosition.y - this.initialPointerPosition.y;
    this.viewport.emit('moved', { viewport: this.viewport, type: 'pinch' })
  }
}

export default PinchPlugin;
