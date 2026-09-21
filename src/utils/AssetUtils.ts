export default class AssetUtils {
    private static readonly _DEFAULT_BASE_PATH = "./assets/";

    private static _BasePath: string = AssetUtils._DEFAULT_BASE_PATH;

    public static Init(basePath: string = AssetUtils._DEFAULT_BASE_PATH): void {
        AssetUtils._BasePath = basePath.endsWith("/") ? basePath : `${basePath}/`;
    }

    public static GetPath(path: string): string {
        path = path.trim().replace(/^\/+/, "");
        return `${AssetUtils._BasePath}${path}`;
    }
}
