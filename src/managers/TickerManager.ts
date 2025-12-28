export type TickableOptions = {
    alwaysActive?: boolean;
};

export type Tickable = {
    callback: (dt: number) => void;
    options?: TickableOptions;
};

class TickerManager {
    declare private _rafId?: number;
    private _isRunning: boolean = false;
    private readonly _tickables: Map<(dt: number) => void, Tickable> = new Map();
    private _startTime: number = performance.now();
    private _currentTime: number = this._startTime;
    private _elapsedTime: number = 0;
    private _deltaTime: number = 0.016;

    //#region Constants
    //
    private static readonly _TIME_SCALE: number = 0.001;
    private static readonly _MAX_DELTA: number = 0.1;
    //
    //#endregion

    public init(): void {
        this.start();
    }

    public start(): void {
        this.stop();
        this._isRunning = true;
        this._startTime = performance.now();
        this._currentTime = this._startTime;
        this._rafId = requestAnimationFrame(this._update);
    }

    public stop(): void {
        this._isRunning = false;
        if (this._rafId !== undefined) {
            cancelAnimationFrame(this._rafId);
            this._rafId = undefined;
        }
    }

    public play(): void {
        this.pause();
        this._isRunning = true;
        this._currentTime = performance.now();
    }

    public pause(): void {
        this._isRunning = false;
    }

    public add(callback: (dt: number) => void, options?: TickableOptions): void {
        this._tickables.set(callback, { callback: callback, options: options });
    }

    public remove(callback: (dt: number) => void): void {
        this._tickables.delete(callback);
    }

    private readonly _update = (): void => {
        const now = performance.now();
        let delta = Math.min((now - this._currentTime) * TickerManager._TIME_SCALE, TickerManager._MAX_DELTA);
        this._currentTime = now;

        if (this._isRunning) {
            this._deltaTime = delta;
            this._elapsedTime += this._deltaTime;
        }

        for (const tickable of this._tickables.values()) {
            if (this._isRunning || tickable.options?.alwaysActive) {
                tickable.callback(delta);
            }
        }

        this._rafId = requestAnimationFrame(this._update);
    };

    //#region Getters
    //
    public get startTime(): number {
        return this._startTime;
    }
    public get currentTime(): number {
        return this._currentTime;
    }
    public get elapsedTime(): number {
        return this._elapsedTime;
    }
    public get deltaTime(): number {
        return this._deltaTime;
    }
    //
    //#endregion
}

export default new TickerManager();
