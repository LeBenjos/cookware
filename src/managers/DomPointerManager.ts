import { DomEvent } from "@benjos/spices";
import Action from "../tools/Action";

class DomPointerManager {
    private _x: number = 0;
    private _y: number = 0;
    private _normalizedX: number = 0;
    private _normalizedY: number = 0;
    private _centralX: number = 0;
    private _centralY: number = 0;

    public readonly onMouseDown = new Action();
    public readonly onMouseUp = new Action();
    public readonly onMouseMove = new Action();

    public init(): void {
        this._addCallbacks();
    }

    private _addCallbacks(): void {
        this._removeCallbacks();
        window.addEventListener(DomEvent.TOUCH_START, this._onMouseDown);
        window.addEventListener(DomEvent.TOUCH_END, this._onMouseUp);
        window.addEventListener(DomEvent.TOUCH_MOVE, this._onMouseMove);
        window.addEventListener(DomEvent.MOUSE_DOWN, this._onMouseDown);
        window.addEventListener(DomEvent.MOUSE_UP, this._onMouseUp);
        window.addEventListener(DomEvent.MOUSE_MOVE, this._onMouseMove);
    }

    private _removeCallbacks(): void {
        window.removeEventListener(DomEvent.TOUCH_START, this._onMouseDown);
        window.removeEventListener(DomEvent.TOUCH_END, this._onMouseUp);
        window.removeEventListener(DomEvent.TOUCH_MOVE, this._onMouseMove);
        window.removeEventListener(DomEvent.MOUSE_DOWN, this._onMouseDown);
        window.removeEventListener(DomEvent.MOUSE_UP, this._onMouseUp);
        window.removeEventListener(DomEvent.MOUSE_MOVE, this._onMouseMove);
    }

    private readonly _onMouseDown = (event: MouseEvent | TouchEvent): void => {
        this._onMouseMove(event);
        this.onMouseDown.execute();
    };

    private readonly _onMouseUp = (_event: MouseEvent | TouchEvent): void => {
        this.onMouseUp.execute();
    };

    private readonly _onMouseMove = (event: MouseEvent | TouchEvent): void => {
        this._updateMousePosition(event);
    };

    private _updateMousePosition(event: Event): void {
        const { x, y } = this._getMousePosition(event);
        this._x = x;
        this._y = y;
        this._normalizedX = this._x / window.innerWidth;
        this._normalizedY = 1 - this._y / window.innerHeight;
        this._centralX = this._normalizedX * 2 - 1;
        this._centralY = this._normalizedY * 2 - 1;
        this.onMouseMove.execute();
    }

    private _getMousePosition(e: Event): { x: number; y: number } {
        if (e instanceof MouseEvent) {
            return { x: e.clientX, y: e.clientY };
        }

        if (window.TouchEvent && e instanceof TouchEvent) {
            if (e.touches.length > 0) {
                return { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
        }

        return { x: 0, y: 0 };
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
