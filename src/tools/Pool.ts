export type PoolConstructor<T> = new () => T;

export interface Poolable {
    init(): void;
    reset(): void;
}

export default class Pool<T extends Poolable> {
    private readonly _ctor: PoolConstructor<T>;
    private readonly _pool: T[] = [];
    private readonly _lent = new WeakSet<T>();

    constructor(ctor: PoolConstructor<T>, initialSize: number = 0) {
        this._ctor = ctor;
        this.ensureSize(initialSize);
    }

    public ensureSize(count: number): void {
        for (let i = this._pool.length; i < count; i++) {
            this._pool.push(new this._ctor());
        }
    }

    public get(): T {
        const o = this._pool.pop() ?? new this._ctor();
        this._lent.add(o);
        o.init();
        return o;
    }

    public release(o: T): void {
        if (!this._lent.delete(o)) {
            throw new Error("Pool.release: object is not currently borrowed from this pool (already released, or never obtained via get()).");
        }
        o.reset();
        this._pool.push(o);
    }

    public get size(): number {
        return this._pool.length;
    }
}
