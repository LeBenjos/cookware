export type TickableOptions = {
    alwaysActive?: boolean;
};

export type Tickable = {
    callback: (dt: number) => void;
    options?: TickableOptions;
};

export class TickerManager {
    private static readonly _TIME_SCALE: number = 0.001;
    private static readonly _MAX_DELTA: number = 0.1;
    private static readonly _DEFAULT_DELTA: number = 0.016;

    private _rafId?: number;
    private _isRunning: boolean = false;
    private readonly _tickables: Map<(dt: number) => void, Tickable> = new Map();
    private _startTime: number = 0;
    private _currentTime: number = 0;
    private _elapsedTime: number = 0;
    private _deltaTime: number = TickerManager._DEFAULT_DELTA;

    public init(): void {
        this.start();
    }

    public dispose(): void {
        this.stop();
        this._tickables.clear();
    }

    public start(): void {
        this.stop();
        this._isRunning = true;
        this._startTime = performance.now();
        this._currentTime = this._startTime;
        this._elapsedTime = 0;
        this._deltaTime = TickerManager._DEFAULT_DELTA;
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
        this._isRunning = true;
        this._currentTime = performance.now();
        if (this._rafId === undefined) this._rafId = requestAnimationFrame(this._update);
    }

    public pause(): void {
        this._isRunning = false;
    }

    public add(callback: (dt: number) => void, options?: TickableOptions): void {
        if (this._tickables.has(callback)) {
            console.warn("TickerManager.add: callback is already registered, keeping its existing options.");
            return;
        }
        this._tickables.set(callback, { callback: callback, options: options });
    }

    public remove(callback: (dt: number) => void): void {
        this._tickables.delete(callback);
    }

    private readonly _update = (): void => {
        this._rafId = requestAnimationFrame(this._update);

        const now = performance.now();
        const delta = Math.min((now - this._currentTime) * TickerManager._TIME_SCALE, TickerManager._MAX_DELTA);
        this._currentTime = now;

        if (this._isRunning) {
            this._deltaTime = delta;
            this._elapsedTime += delta;
        }

        for (const tickable of this._tickables.values()) {
            if (this._isRunning || tickable.options?.alwaysActive) {
                try {
                    tickable.callback(delta);
                } catch (error) {
                    console.error("TickerManager tickable failed:", error);
                }
            }
        }
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
