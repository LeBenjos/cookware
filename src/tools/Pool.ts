export type PoolConstructor<T> = new () => T;

export interface Poolable {
    init(): void;
    reset(): void;
}

export default class Pool<T extends Poolable> {
    private static readonly _DEFAULT_INITIAL_SIZE: number = 0;

    private readonly _ctor: PoolConstructor<T>;
    protected readonly _pool: T[] = [];
    private readonly _inPool = new WeakSet();

    constructor(ctor: PoolConstructor<T>, initialSize: number = Pool._DEFAULT_INITIAL_SIZE) {
        this._ctor = ctor;
        this._prepopulate(initialSize);
    }

    private _prepopulate(count: number): void {
        for (let i = 0; i < count; i++) {
            const o = new this._ctor();
            this._pool.push(o);
            this._inPool.add(o);
        }
    }

    public get(): T {
        const o = this._pool.pop() ?? new this._ctor();
        this._inPool.delete(o);
        return o;
    }

    public release(o: T): void {
        if (this._inPool.has(o)) {
            throw new Error("Object is already in pool.");
        }
        this._inPool.add(o);
        this._pool.push(o);
    }
}
