# @benjos/cookware

Collection of TypeScript tools and utilities for my personal projects.

## Installation

```bash
npm install @benjos/cookware
```

Ships compiled ESM with type declarations — works with any bundler, Node, and SSR (importing the package never touches `window`; only `init()` does).

## Managers (classes)

Managers are exported as **classes** — the library doesn't create any instance for you. Instantiate them in your app and let one place own them (typically your `Experience`/app root): it creates them, calls `init()`, and calls `dispose()` when it dies. That keeps the lifecycle explicit and the dependencies visible — a module that needs the keyboard receives it, instead of importing hidden global state.

Nothing initializes itself — constructors are pure (that's what makes importing SSR-safe): call `init()` once on the client to attach listeners, and `dispose()` to tear everything down (removes DOM listeners, clears state and subscribers). Every manager follows this same `init()`/`dispose()` pair, so an app root can drive them uniformly; `PoolManager` has nothing to attach — its `init()` just resets it, and pools are created on demand.

```typescript
import { DomKeyboardManager, DomResizeManager, TickerManager } from '@benjos/cookware';

class Experience {
    public readonly ticker = new TickerManager();
    public readonly keyboard = new DomKeyboardManager();
    public readonly resize = new DomResizeManager();

    constructor() {
        this.ticker.init();
        this.keyboard.init();
        this.resize.init();
    }

    public destroy(): void {
        this.resize.dispose();
        this.keyboard.dispose();
        this.ticker.dispose();
    }
}
```

If a project really wants one shared instance importable from anywhere, create it yourself — the instantiation policy belongs to the app, not the library:

```typescript
// app/src/managers.ts
export const keyboard = new DomKeyboardManager();
```

### DomKeyboardManager

Handles global keyboard events and exposes actions for key management.

```typescript
import { DomKeyboardManager } from '@benjos/cookware';

const keyboard = new DomKeyboardManager();
keyboard.init();
keyboard.onKeyDown.add((e) => console.log('Key down:', e.key));
keyboard.onKeyUp.add((e) => console.log('Key up:', e.key));
```

#### Extra

- `keyboard.isKeyDown(code: string): boolean` — Check if a key is pressed, by physical code (`'KeyA'`, `'Space'`, …). Codes are layout-independent — `'KeyW'` is the same physical key on QWERTY and AZERTY — which is what game controls want. To react to a produced character instead, read `e.key` in an `onKeyDown` listener.
- `keyboard.isAnyKeyDown(codes: string[]): boolean` — Check if at least one key in the list is pressed.
- `keyboard.areAllKeysDown(codes: string[]): boolean` — Check if all keys in the list are pressed.
- `keyboard.isAvailableForControl(): boolean` — `false` while an input, textarea, select, or contenteditable has focus. **`isKeyDown`/`isAnyKeyDown`/`areAllKeysDown` return `false` in that state** so game controls don't fire while the user types; the `onKeyDown`/`onKeyUp` actions still fire.

Key state is tracked by physical code, cleared on window blur and tab switch, and survives the macOS quirk where `keyup` is swallowed while `Cmd` is held — no stuck keys.

### DomPointerManager

Unified pointer event management (mouse, touch, pen), exposes pointer position and actions for interactions using Pointer Events.

```typescript
import { DomPointerManager } from '@benjos/cookware';

const pointer = new DomPointerManager();
pointer.init();
pointer.onPointerMove.add((e) => {
  // e is the native PointerEvent (button, pointerId, pressure, …)
  // Or use pointer.x, y, normalizedX, normalizedY, ndcX, ndcY
});
pointer.onPointerDown.add((e) => { /* pointer down */ });
pointer.onPointerUp.add((e) => { /* pointer up */ });
```

#### Extra

- `pointer.x`, `y` — Pointer position in pixels (CSS coordinates, y grows downward).
- `pointer.normalizedX`, `normalizedY` — Normalized position (0–1). **`normalizedY` uses the WebGL convention: 0 at the bottom, 1 at the top.**
- `pointer.ndcX`, `ndcY` — Normalized device coordinates (-1 to 1), same convention: `ndcY` is +1 at the top of the screen.

### DomResizeManager

Tracks the viewport size and device pixel ratio, and notifies on change — including when only `devicePixelRatio` changes (window dragged to another monitor), and including embedded contexts (SCORM/LMS iframes, iOS Safari) where the frame is resized without a window `resize` event, via a `ResizeObserver` on the root element. That last safety net requires the page to have `html, body { height: 100% }` so the root tracks the viewport. Duplicate reports from these sources are coalesced: `onResize` only fires when width, height, or pixelRatio actually changed.

```typescript
import { DomResizeManager } from '@benjos/cookware';

const resize = new DomResizeManager();
resize.init(); // reads the viewport and fires onResize once
resize.onResize.add(() => {
  console.log(resize.width, resize.height, resize.pixelRatio);
});
```

#### Extra

- `resize.width`, `height` — Viewport size in pixels.
- `resize.pixelRatio` — `devicePixelRatio`, **clamped to 2** to cap fill-rate cost on high-density displays.

### PoolManager

Centralized management of reusable object pools (object pool pattern). Pools are created on demand — `prewarm()` is optional.

```typescript
import { PoolManager } from '@benjos/cookware';

const pools = new PoolManager();
pools.prewarm(Enemy, 50);        // at least 50 instances ready (never shrinks)
const enemy = pools.get(Enemy);  // calls enemy.init()
pools.release(enemy);            // calls enemy.reset()
pools.dispose();                 // drops every pool
```

Your class must implement the `Poolable` interface (`init()` and `reset()`), both exported as types. Objects are pooled by their **concrete** class: releasing a `Sub extends Base` goes to the `Sub` pool, not the `Base` one.

Ownership is **strict**: `release()` only accepts objects previously obtained via `get()` — releasing a hand-made `new Enemy()` or releasing the same object twice throws. Everything that goes through the pool system must be born from it.

### TickerManager

Animation loop manager based on `requestAnimationFrame`, allows adding callbacks executed every frame.

```typescript
import { TickerManager } from '@benjos/cookware';

const ticker = new TickerManager();
ticker.init();
ticker.add((dt) => {
  // dt = delta time in seconds, clamped to 0.1s after a frame gap
});
```

#### Loop control

Two distinct pairs:

- `start()` / `stop()` — tear the loop down and restart it. `start()` resets `elapsedTime`; while stopped, **nothing** runs, not even `alwaysActive` tickables.
- `pause()` / `play()` — freeze game time without killing the loop. While paused, normal tickables don't run and `deltaTime`/`elapsedTime` freeze, but `alwaysActive` tickables keep ticking. `play()` also revives the loop after a `stop()`.

#### Extra

- `ticker.add(callback, { alwaysActive: true })` — the callback keeps running while the loop is paused. Re-adding an already-registered callback keeps its existing options (a warning is logged).
- `ticker.remove(callback)` — Unregister a callback.
- A callback that throws is logged and skipped; it can't kill the loop or starve the other tickables.
- Getters: `startTime`, `currentTime`, `elapsedTime`, `deltaTime`. `elapsedTime` accumulates **clamped** game time, so it drifts from the wall clock after long frame gaps (background tab) — use `currentTime - startTime` for wall-clock elapsed.

## Tools (Classes to instantiate)

### Action

Event system for handling callbacks.

```typescript
import { Action } from '@benjos/cookware';

const onUserLogin = new Action<[string, number]>();
const dispose = onUserLogin.add((username, id) => console.log(`${username} logged in with ID ${id}`));
onUserLogin.execute('John', 42);
dispose(); // or onUserLogin.remove(listener)
```

- `add(listener): () => void` — Subscribe; returns an unsubscribe function. Adding the same function twice registers it once (Set semantics).
- `once(listener): () => void` — Subscribe for a single dispatch.
- `remove(listener)` / `removeAll()` — Unsubscribe.
- `execute(...params)` — Dispatch. Listeners added during a dispatch run on the **next** one; listeners removed during a dispatch don't run; a listener that throws is logged and doesn't block the others.

### Point

3D point class with manipulation methods (`set`, `clear`, `copy`, `clone`).

```typescript
import { Point } from '@benjos/cookware';

const point = new Point(10, 20, 30);
const clone = point.clone();
point.set(5, 15);     // z is kept as-is (2D-friendly)
point.set(5, 15, 25); // explicit z
```

### Pool

Object pool for reusing instances. `get()` calls `init()` on the object, `release()` calls `reset()` — the `Poolable` contract is always honored, whether you use `Pool` directly or through `PoolManager`.

```typescript
import { Pool, type Poolable } from '@benjos/cookware';

class Particle implements Poolable {
  init(): void { /* leaving the pool */ }
  reset(): void { /* going back to the pool */ }
}

const pool = new Pool(Particle, 10); // pre-populates 10 instances
const p = pool.get();                 // p.init() was called
pool.release(p);                      // p.reset() was called
pool.ensureSize(50);                  // grow the pool (never shrinks)
```

Ownership is strict: `release()` throws if the object is not currently borrowed from this pool — double release and hand-made objects included. `pool.size` exposes the number of pooled (idle) instances.

## Utils (Static classes)

### AssetUtils

Manage asset paths with a configurable base path.

```typescript
import { AssetUtils } from '@benjos/cookware';

AssetUtils.Init('./myAssetsFolder'); // trailing slash optional
AssetUtils.GetPath('logo.png');   // "./myAssetsFolder/logo.png"
AssetUtils.GetPath('/logo.png');  // same — leading slashes are stripped
```

### DomUtils

DOM manipulation helpers. Both take an element **id** (no `#`).

```typescript
import { DomUtils } from '@benjos/cookware';

const app = DomUtils.GetApp();                // #app, falling back to #root, created if missing
const game = DomUtils.GetApp('game');         // #game (no #root fallback for custom ids)
const loader = DomUtils.GetLoader();          // #loader, created inside GetApp() if missing
const custom = DomUtils.GetLoader('spinner', myElement); // custom id and parent
```

## Migrating from v1

v2 is a rewrite; the npm package now ships compiled ESM instead of raw `.ts` (any bundler works, Vite no longer required) and the `@benjos/spices` peer dependency is gone. Breaking changes:

| v1 | v2 |
|---|---|
| Managers were ready-made instances (`DomKeyboardManager.init()`) | Managers are **classes** — instantiate them yourself: `new DomKeyboardManager()` (see [Managers](#managers-classes)) |
| `DomResizeManager.reset()` | `dispose()` |
| `PoolManager.init()` was required before use | Optional — pools are created on demand (`init()` now just resets) |
| `PoolManager.add(ctor, n)` | `prewarm(ctor, n)` |
| `isKeyDown('a')` matched key names | **Physical codes only**: `isKeyDown('KeyA')`. ⚠️ Silent change — key names now just return `false`; grep your `isKeyDown`/`isAnyKeyDown`/`areAllKeysDown` calls |
| `PoolManager.release()` accepted any object | **Strict ownership** — releasing an object that didn't come from `get()` throws |
| `Point` implemented `Poolable` (`point.reset()`) | Removed — use `point.clear()`; to pool points, subclass: `class Particle extends Point implements Poolable` |
| `DomUtils.GetApp('#app')` took a selector | Takes an **id**: `GetApp('app')`. ⚠️ Silent if you passed a custom selector |
| Pointer Actions fired without arguments; `centralX/Y` | Listeners receive the native `PointerEvent`; renamed `ndcX/Y` |

## Development

```bash
npm run typecheck # tsc --noEmit
npm run build     # emits ESM + .d.ts into dist/
```

## License

ISC
