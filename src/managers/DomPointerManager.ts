import Action from "../tools/Action.js";

export class DomPointerManager {
    private _x: number = 0;
    private _y: number = 0;
    private _normalizedX: number = 0;
    private _normalizedY: number = 0;
    private _ndcX: number = 0;
    private _ndcY: number = 0;

    public readonly onPointerDown = new Action<[PointerEvent]>();
    public readonly onPointerUp = new Action<[PointerEvent]>();
    public readonly onPointerMove = new Action<[PointerEvent]>();

    public init(): void {
        this._addCallbacks();
    }

    public dispose(): void {
        this._removeCallbacks();
        this.onPointerDown.removeAll();
        this.onPointerUp.removeAll();
        this.onPointerMove.removeAll();
        this._x = 0;
        this._y = 0;
        this._normalizedX = 0;
        this._normalizedY = 0;
        this._ndcX = 0;
        this._ndcY = 0;
    }

    private _addCallbacks(): void {
        this._removeCallbacks();
        window.addEventListener("pointerdown", this._onPointerDown);
        window.addEventListener("pointerup", this._onPointerUp);
        window.addEventListener("pointermove", this._onPointerMove);
    }

    private _removeCallbacks(): void {
        window.removeEventListener("pointerdown", this._onPointerDown);
        window.removeEventListener("pointerup", this._onPointerUp);
        window.removeEventListener("pointermove", this._onPointerMove);
    }

    private readonly _onPointerDown = (event: PointerEvent): void => {
        this._updatePointerPosition(event);
        this.onPointerDown.execute(event);
    };

    private readonly _onPointerUp = (event: PointerEvent): void => {
        this._updatePointerPosition(event);
        this.onPointerUp.execute(event);
    };

    private readonly _onPointerMove = (event: PointerEvent): void => {
        this._updatePointerPosition(event);
        this.onPointerMove.execute(event);
    };

    private _updatePointerPosition(event: PointerEvent): void {
        this._x = event.clientX;
        this._y = event.clientY;
        this._normalizedX = this._x / window.innerWidth;
        this._normalizedY = 1 - this._y / window.innerHeight;
        this._ndcX = this._normalizedX * 2 - 1;
        this._ndcY = this._normalizedY * 2 - 1;
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
    public get ndcX(): number {
        return this._ndcX;
    }
    public get ndcY(): number {
        return this._ndcY;
    }
    //
    //#endregion
}
