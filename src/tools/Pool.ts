type Constructor<T> = new () => T;

export default abstract class Pool<T = unknown> {
    protected readonly _pool: Set<T> = new Set<T>();
    private readonly _ctor: Constructor<T>;

    //#region Constants
    //
    private static readonly _DEFAULT_INITIAL_SIZE: number = 0;
    //
    //#endregion

    constructor(ctor: Constructor<T>, initialSize: number = Pool._DEFAULT_INITIAL_SIZE) {
        this._ctor = ctor;
        this._prepopulate(initialSize);
    }

    private _prepopulate(number: number): void {
        for (let i = 0; i < number; i++) {
            this._pool.add(new this._ctor());
        }
    }

    public get(): T {
        if (this._pool.size > 0) {
            const o = this._pool.values().next().value!;
            this._pool.delete(o);
            return o;
        }

        return new this._ctor();
    }

    public release(o: T): void {
        this._pool.add(o);
    }
}

//#region TEMPLATE USAGE
//
// class TemplatePool extends Pool<TemplateObject> {
//     constructor() {
//         super(TemplateObject);
//     }

//     // Optional
//     public override get(): TemplateObject {
//         const o = super.get();
//         // Do any additional initialization here if necessary
//         return o;
//     }

//     // Optional
//     public override release(o: TemplateObject): void {
//         // Do any additional cleanup here if necessary
//         super.release(o);
//     }
// }

// export default new TemplatePool();
//
//#endregion
