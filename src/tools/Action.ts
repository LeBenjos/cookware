type Listener<TParams extends unknown[]> = (...params: TParams) => unknown;

export default class Action<T extends unknown[] = []> {
    private _listeners = new Set<Listener<T>>();

    public add(listener: Listener<T>): void {
        this._listeners.add(listener);
    }

    public remove(listener: Listener<T>): void {
        this._listeners.delete(listener);
    }

    public removeAll(): void {
        this._listeners.clear();
    }

    public execute(...params: T): void {
        for (const listener of this._listeners) {
            listener(...params);
        }
    }
}
