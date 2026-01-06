import Action from "../tools/Action";
import TickerManager from "./TickerManager";

class DomResizeManager {
    private static readonly _MAX_PIXEL_RATIO: number = 2;

    private _width: number = window.innerWidth;
    private _height: number = window.innerHeight;
    private _pixelRatio: number = Math.min(window.devicePixelRatio, DomResizeManager._MAX_PIXEL_RATIO);

    public readonly onResize = new Action();

    public init(): void {
        this.reset();
        this._resize();
        TickerManager.add(this.update, { alwaysActive: true });
    }

    public reset(): void {
        TickerManager.remove(this.update);
    }

    private readonly _resize = (): void => {
        this._width = window.innerWidth;
        this._height = window.innerHeight;
        this._pixelRatio = Math.min(window.devicePixelRatio, DomResizeManager._MAX_PIXEL_RATIO);

        this.onResize.execute();
    };

    public readonly update = (_dt: number): void => {
        if (this._width !== window.innerWidth || this._height !== window.innerHeight)
            this._resize();
    };

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

export default new DomResizeManager();
