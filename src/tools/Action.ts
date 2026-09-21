export type Listener<TParams extends unknown[]> = (...params: TParams) => unknown;

export default class Action<T extends unknown[] = []> {
    private readonly _listeners = new Set<Listener<T>>();

    public add(listener: Listener<T>): () => void {
        this._listeners.add(listener);
        return () => this.remove(listener);
    }

    public once(listener: Listener<T>): () => void {
        const wrapper: Listener<T> = (...params: T) => {
            this.remove(wrapper);
            listener(...params);
        };
        return this.add(wrapper);
    }

    public remove(listener: Listener<T>): void {
        this._listeners.delete(listener);
    }

    public removeAll(): void {
        this._listeners.clear();
    }

    public execute(...params: T): void {
        for (const listener of [...this._listeners]) {
            if (!this._listeners.has(listener)) continue;
            try {
                listener(...params);
            } catch (error) {
                console.error("Action listener failed:", error);
            }
        }
    }
}
