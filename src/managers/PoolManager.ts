import Pool, { Poolable, PoolConstructor } from "../tools/Pool.js";

export class PoolManager {
    private readonly _pools = new Map<PoolConstructor<Poolable>, Pool<Poolable>>();

    public init(): void {
        this.dispose();
    }

    public dispose(): void {
        this._pools.clear();
    }

    public prewarm<T extends Poolable>(ctor: PoolConstructor<T>, initialSize: number = 0): void {
        this._getPool(ctor).ensureSize(initialSize);
    }

    public get<T extends Poolable>(ctor: PoolConstructor<T>): T {
        return this._getPool(ctor).get() as T;
    }

    public release<T extends Poolable>(o: T): void {
        const ctor = o.constructor as PoolConstructor<T>;
        const pool = this._pools.get(ctor);
        if (!pool) {
            throw new Error(`PoolManager.release: no pool for "${ctor.name}" — objects must be obtained via get() and are pooled by their concrete class.`);
        }
        pool.release(o);
    }

    private _getPool<T extends Poolable>(ctor: PoolConstructor<T>): Pool<Poolable> {
        let pool = this._pools.get(ctor);
        if (!pool) {
            pool = new Pool(ctor);
            this._pools.set(ctor, pool);
        }
        return pool;
    }
}
