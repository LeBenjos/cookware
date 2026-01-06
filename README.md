# @benjos/cookware

Collection of TypeScript tools and utilities for my personal projects.

## Installation

```bash
npm install @benjos/cookware
```

**Requirements:**
- TypeScript ≥ 5.0.0
- @benjos/spices ^ 1.0.1


## Managers (Singletons)

### DomKeyboardManager

Handles global keyboard events and exposes actions for key management.

```typescript
import { DomKeyboardManager } from '@benjos/cookware';

DomKeyboardManager.init();
DomKeyboardManager.onKeyDown.add((e) => console.log('Key down:', e.key));
DomKeyboardManager.onKeyUp.add((e) => console.log('Key up:', e.key));
```

#### Extra

- `DomKeyboardManager.isKeyDown(name: string): boolean` — Check if a key (by name or code) is pressed.
- `DomKeyboardManager.isAnyKeyDown(names: string[]): boolean` — Check if at least one key in the list is pressed.
- `DomKeyboardManager.areAllKeysDown(names: string[]): boolean` — Check if all keys in the list are pressed.

### DomPointerManager

Unified pointer event management (mouse, touch, pen), exposes pointer position and actions for interactions using Pointer Events.

```typescript
import { DomPointerManager } from '@benjos/cookware';

DomPointerManager.init();
DomPointerManager.onPointerMove.add(() => {
  // Use DomPointerManager.x, y, normalizedX, normalizedY, etc.
});
DomPointerManager.onPointerDown.add(() => {
  // Pointer down event
});
DomPointerManager.onPointerUp.add(() => {
  // Pointer up event
});
```

#### Extra

- `DomPointerManager.x`, `y` — Pointer position in pixels.
- `DomPointerManager.normalizedX`, `normalizedY` — Normalized position (0-1).
- `DomPointerManager.centralX`, `centralY` — Centered position (-1 to 1).
- Uses Pointer Events (`PointerEvent`) for unified input handling.

### DomResizeManager

Detects window resize events and exposes actions and useful getters.

```typescript
import { DomResizeManager } from '@benjos/cookware';

DomResizeManager.init();
DomResizeManager.onResize.add(() => {
  console.log('New size:', DomResizeManager.width, DomResizeManager.height);
});
```

### PoolManager

Centralized management of reusable object pools (object pool pattern).

```typescript
import { PoolManager } from '@benjos/cookware';

PoolManager.init();
PoolManager.add(MyClass, 5); // Pre-fills the pool with 5 instances
const obj = PoolManager.get(MyClass); // Gets an instance (calls obj.init())
PoolManager.release(obj); // Returns the object to the pool (calls obj.reset())
```

Your class must implement the `init()` and `reset()` methods.

### TickerManager

Animation loop manager based on `requestAnimationFrame`, allows adding callbacks executed every frame.

```typescript
import { TickerManager } from '@benjos/cookware';

TickerManager.init();
TickerManager.add((dt) => {
  // dt = delta time in seconds
});
```

#### Advanced options

- `TickerManager.add(callback, { alwaysActive: true })`: the callback is called even if the loop is paused.
- Methods: `start()`, `stop()`, `pause()`, `play()` to control the loop.
- Getters: `startTime`, `currentTime`, `elapsedTime`, `deltaTime`.

## Tools (Classes to instantiate)

### Action

Event system for handling callbacks.

```typescript
import { Action } from '@benjos/cookware';

const onUserLogin = new Action<[string, number]>();
onUserLogin.add((username, id) => console.log(`${username} logged in with ID ${id}`));
onUserLogin.execute('John', 42);
```

### Point

3D point class with manipulation methods.

```typescript
import { Point } from '@benjos/cookware';

const point = new Point(10, 20, 30);
const clone = point.clone();
point.set(5, 15, 25);
```

### Pool

Object pool pattern for reusing instances.

```typescript
import { Pool, Point } from '@benjos/cookware';

class PointPool extends Pool<Point> {
  constructor() {
    super(Point, 10); // Pre-populate with 10 instances
  }
}

const pool = new PointPool();
const point = pool.get();
// Use point...
pool.release(point);

class MyClass{
  public pool = new Pool(Point, 10) // Pre-populate with 10 instances
}
const myClass = new MyClass();
myClass.pool.get();
```


## Utils (Singletons ready to use)

### AssetUtils

Manage asset paths with configurable base path.

```typescript
import { AssetUtils } from '@benjos/cookware';

// Optional: set custom base path
AssetUtils.Init('./myAssetsFolder/');

const imagePath = AssetUtils.GetPath('logo.png'); // "./myAssetsFolder/logo.png"
```

### DomUtils

DOM manipulation helpers.

```typescript
import { DomUtils } from '@benjos/cookware';

const app = DomUtils.GetApp();       // Gets or creates #app or #root
const loader = DomUtils.GetLoader(); // Gets or creates #loader
```


## License

ISC
