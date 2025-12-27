# @benjos/cookware

Collection of TypeScript tools and utilities for my personal projects.

## Installation

```bash
npm install @benjos/cookware
```

**Requirements:** TypeScript ≥ 5.0.0

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
```

## Utils (Singletons ready to use)

### AssetUtils

Manage asset paths with configurable base path.

```typescript
import { AssetUtils } from '@benjos/cookware';

// Optional: set custom base path
AssetUtils.init('/public/assets/');

const imagePath = AssetUtils.getPath('logo.png'); // "/public/assets/logo.png"
```

### DomUtils

DOM manipulation helpers.

```typescript
import { DomUtils } from '@benjos/cookware';

const app = DomUtils.getApp();       // Gets or creates #app or #root
const loader = DomUtils.getLoader(); // Gets or creates #loader
```

## License

ISC
