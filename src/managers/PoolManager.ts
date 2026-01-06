import Pool, { Poolable, PoolConstructor } from "../tools/Pool";

class PoolManager {
    declare private _pools: Map<PoolConstructor<Poolable>, Pool<Poolable>>;

    public init(): void {
        this._pools = new Map();
    }

    public add<T extends Poolable>(ctor: PoolConstructor<T>, initialSize: number = 0): void {
        if (!this._pools.has(ctor)) {
            this._pools.set(ctor, new Pool(ctor, initialSize));
        }
    }

    public get<T extends Poolable>(ctor: PoolConstructor<T>): T {
        if (!this._pools.has(ctor)) {
            this.add(ctor);
        }

        const pool = this._pools.get(ctor)!;
        const o = pool.get();
        o.init();
        return o as T;
    }

    public release<T extends Poolable>(o: T): void {
        const ctor = o.constructor as PoolConstructor<T>;
        if (!this._pools.has(ctor)) {
            this.add(ctor);
        }

        o.reset();
        const pool = this._pools.get(ctor)!;
        pool.release(o);
    }
}

export default new PoolManager();
