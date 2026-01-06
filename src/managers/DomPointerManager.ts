import { DomEvent } from "@benjos/spices";
import Action from "../tools/Action";

class DomPointerManager {
    private _x: number = 0;
    private _y: number = 0;
    private _normalizedX: number = 0;
    private _normalizedY: number = 0;
    private _centralX: number = 0;
    private _centralY: number = 0;

    public readonly onPointerDown = new Action();
    public readonly onPointerUp = new Action();
    public readonly onPointerMove = new Action();

    public init(): void {
        this._addCallbacks();
    }

    private _addCallbacks(): void {
        this._removeCallbacks();
        window.addEventListener(DomEvent.POINTER_DOWN, this._onPointerDown);
        window.addEventListener(DomEvent.POINTER_UP, this._onPointerUp);
        window.addEventListener(DomEvent.POINTER_MOVE, this._onPointerMove);
    }

    private _removeCallbacks(): void {
        window.removeEventListener(DomEvent.POINTER_DOWN, this._onPointerDown);
        window.removeEventListener(DomEvent.POINTER_UP, this._onPointerUp);
        window.removeEventListener(DomEvent.POINTER_MOVE, this._onPointerMove);
    }

    private readonly _onPointerDown = (event: PointerEvent): void => {
        this._onPointerMove(event);
        this.onPointerDown.execute();
    };

    private readonly _onPointerUp = (_event: PointerEvent): void => {
        this.onPointerUp.execute();
    };

    private readonly _onPointerMove = (event: PointerEvent): void => {
        this._updatePointerPosition(event);
        this.onPointerMove.execute();
    };

    private _updatePointerPosition(event: PointerEvent): void {
        this._x = event.clientX;
        this._y = event.clientY;
        this._normalizedX = this._x / window.innerWidth;
        this._normalizedY = 1 - this._y / window.innerHeight;
        this._centralX = this._normalizedX * 2 - 1;
        this._centralY = this._normalizedY * 2 - 1;
    }

    //#region Getters
    //
    public get x(): number {
        return this._x;
    }
    public get y(): number {
        return this._y;
    }
    public get normalizedX(): number {
        return this._normalizedX;
    }
    public get normalizedY(): number {
        return this._normalizedY;
    }
    public get centralX(): number {
        return this._centralX;
    }
    public get centralY(): number {
        return this._centralY;
    }
    //
    //#endregion
}

export default new DomPointerManager();
