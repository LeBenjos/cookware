export default class DomUtils {
    public static GetApp(selector: string = '#app'): HTMLDivElement {
        const app = document.querySelector<HTMLDivElement>(selector)
            ?? document.querySelector<HTMLDivElement>('#root');

        if (!app) {
            const newApp = document.createElement('div');
            newApp.id = selector.replace('#', '');
            document.body.appendChild(newApp);
            return newApp;
        }

        return app;
    }

    public static GetLoader(selector: string = '#loader'): HTMLDivElement {
        const loader = document.querySelector<HTMLDivElement>(selector);

        if (!loader) {
            const app = DomUtils.GetApp();
            const newLoader = document.createElement('div');
            newLoader.id = selector.replace('#', '');
            app.appendChild(newLoader);
            return newLoader;
        }

        return loader;
    }
}
