export default class DomUtils {
    public static GetApp(id: string = "app"): HTMLElement {
        const existing = document.getElementById(id);
        if (existing) return existing;

        if (id === "app") {
            const root = document.getElementById("root");
            if (root) return root;
        }

        const app = document.createElement("div");
        app.id = id;
        document.body.appendChild(app);
        return app;
    }

    public static GetLoader(id: string = "loader", parent?: HTMLElement): HTMLElement {
        const existing = document.getElementById(id);
        if (existing) return existing;

        const loader = document.createElement("div");
        loader.id = id;
        (parent ?? DomUtils.GetApp()).appendChild(loader);
        return loader;
    }

    public static GetElement<T extends Element>(parent: ParentNode, selector: string, type: new () => T): T {
        const element = parent.querySelector(selector);
        if (!(element instanceof type)) throw new Error(`[DomUtils]: '${selector}' is not a ${type.name}`);
        return element;
    }
}
