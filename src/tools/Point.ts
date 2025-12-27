export default class Point {
    private _x: number;
    private _y: number;
    private _z: number;

    constructor(x = 0, y = 0, z = 0) {
        this._x = x;
        this._y = y;
        this._z = z;
    }

    public set(x: number, y: number, z: number = this._z): void {
        this._x = x;
        this._y = y;
        this._z = z;
    }

    public clear(): void {
        this._x = 0;
        this._y = 0;
        this._z = 0;
    }

    public copy(p: Point): void {
        this._x = p.x;
        this._y = p.y;
        this._z = p.z;
    }

    public clone(): Point {
        return new Point(this._x, this._y, this._z);
    }

    //#region getter setter
    //
    public get x(): number {
        return this._x;
    }
    public set x(x: number) {
        this._x = x;
    }
    public get y(): number {
        return this._y;
    }
    public set y(y: number) {
        this._y = y;
    }
    public get z(): number {
        return this._z;
    }
    public set z(z: number) {
        this._z = z;
    }
    //
    //#endregion
}
