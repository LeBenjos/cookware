class AssetUtils {
    private _basePath: string;

    //#region Constants
    //
    private static readonly _DEFAULT_BASE_PATH = "./assets/";
    //
    //#endregion

    constructor() {
        this._basePath = AssetUtils._DEFAULT_BASE_PATH;
    }

    public init(basePath: string = AssetUtils._DEFAULT_BASE_PATH): void {
        this._basePath = basePath;
    }

    public getPath(path: string): string {
        path = path.trim();
        return `${this._basePath}${path}`;
    }
}

export default new AssetUtils();
