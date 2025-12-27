class DomUtils {
    public getApp(): HTMLDivElement {
        const app = document.querySelector('#app') ?? document.querySelector('#root');

        if (!app) {
            const newApp = document.createElement('div');
            newApp.id = 'app';
            document.body.appendChild(newApp);
            return newApp;
        }

        return app as HTMLDivElement;
    }

    public getLoader(): HTMLDivElement {
        const loader = document.querySelector('#loader');

        if (!loader) {
            const app = this.getApp();
            const newLoader = document.createElement('div');
            newLoader.id = 'loader';
            app.appendChild(newLoader);
            return newLoader;
        }

        return loader as HTMLDivElement;
    }
}

export default new DomUtils();