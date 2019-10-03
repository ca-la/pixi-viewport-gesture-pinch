# pixi-viewport-gesture-pinch

A plugin for [pixi-viewport](https://github.com/davidfig/pixi-viewport) allowing
pinch-to-zoom behavior with the non-standard
[GestureEvent](https://developer.mozilla.org/en-US/docs/Web/API/GestureEvent)
API. Though this isn't on a standards track, it's necessary to support pinch to
zoom behavior on certain browsers (Safari).

## Usage

```javascript
import { Viewport } from 'pixi-viewport';
import GesturePinch from 'pixi-viewport-gesture-pinch';

const viewport = new Viewport(options);
viewport.pinch();

const gesturePinch = new GesturePinch({ viewport });
viewport.plugins.add('gesture-pinch', gesturePinch);
```

## Notes

If you're developing locally, you may want to `npm link` this module into your
project:

```bash
$ npm link --only=production /path/to/pixi-viewport-gesture-pinch
```

If you're using TypeScript, due to issues with module resolution for `npm
link`ed type definitions you'll need to make sure your build system preserves
symlinks. In Webpack, set `resolve.symlinks` to `false`. In a `tsconfig` file,
set `compilerOptions.preserveSymlinks` to `true`
