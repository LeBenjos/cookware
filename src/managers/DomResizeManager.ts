import Action from "../tools/Action.js";

export class DomResizeManager {
    private static readonly _MAX_PIXEL_RATIO: number = 2;

    private _width: number = 0;
    private _height: number = 0;
    private _pixelRatio: number = 1;
    private _pixelRatioQuery?: MediaQueryList;
    private _rootObserver?: ResizeObserver;

    public readonly onResize = new Action();

    public init(): void {
        this._addCallbacks();
        this._resize(true);
    }

    public dispose(): void {
        this._removeCallbacks();
        this.onResize.removeAll();
    }

    private _addCallbacks(): void {
        this._removeCallbacks();
        window.addEventListener("resize", this._onResize);
        this._watchPixelRatio();
        if (typeof ResizeObserver === "function") {
            this._rootObserver = new ResizeObserver(this._onResize);
            this._rootObserver.observe(document.documentElement);
        }
    }

    private _removeCallbacks(): void {
        window.removeEventListener("resize", this._onResize);
        this._unwatchPixelRatio();
        this._rootObserver?.disconnect();
        this._rootObserver = undefined;
    }

    private _watchPixelRatio(): void {
        this._unwatchPixelRatio();
        if (typeof window.matchMedia !== "function") return;
        this._pixelRatioQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
        this._pixelRatioQuery.addEventListener("change", this._onPixelRatioChange);
    }

    private _unwatchPixelRatio(): void {
        this._pixelRatioQuery?.removeEventListener("change", this._onPixelRatioChange);
        this._pixelRatioQuery = undefined;
    }

    private readonly _onPixelRatioChange = (): void => {
        this._watchPixelRatio();
        this._resize();
    };

    private readonly _onResize = (): void => {
        this._resize();
    };

    private _resize(force: boolean = false): void {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const pixelRatio = Math.min(window.devicePixelRatio, DomResizeManager._MAX_PIXEL_RATIO);
        if (!force && width === this._width && height === this._height && pixelRatio === this._pixelRatio) return;
        this._width = width;
        this._height = height;
        this._pixelRatio = pixelRatio;
        this.onResize.execute();
    }

    //#region Getters
    //
    public get width(): number {
        return this._width;
    }
    public get height(): number {
        return this._height;
    }
    public get pixelRatio(): number {
        return this._pixelRatio;
    }
    //
    //#endregion
}
