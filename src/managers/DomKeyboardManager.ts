import { DomEvent } from "@benjos/spices";
import Action from "../tools/Action";

class DomKeyboardManager {
    private readonly _keyDownsMap = new Map<string, boolean>();
    private readonly _codeDownsMap = new Map<string, boolean>();

    public readonly onKeyDown = new Action<[KeyboardEvent]>();
    public readonly onKeyUp = new Action<[KeyboardEvent]>();

    public init(): void {
        this._keyDownsMap.clear();
        this._codeDownsMap.clear();
        this._addCallbacks();
    }

    private _addCallbacks(): void {
        this._removeCallbacks();
        window.addEventListener(DomEvent.KEY_DOWN, this._onKeyDown);
        window.addEventListener(DomEvent.KEY_UP, this._onKeyUp);
    }

    private _removeCallbacks(): void {
        window.removeEventListener(DomEvent.KEY_DOWN, this._onKeyDown);
        window.removeEventListener(DomEvent.KEY_UP, this._onKeyUp);
    }

    private readonly _onKeyDown = (e: KeyboardEvent): void => {
        this._keyDownsMap.set(e.key, true);
        this._codeDownsMap.set(e.code, true);
        this.onKeyDown.execute(e);
    };

    private readonly _onKeyUp = (e: KeyboardEvent): void => {
        this.onKeyUp.execute(e);
        this._keyDownsMap.set(e.key, false);
        this._codeDownsMap.set(e.code, false);
    };

    public isKeyDown(name: string): boolean {
        if (!this.isAvailableForControl()) return false;
        if (this._codeDownsMap.get(name)) return true;
        if (this._keyDownsMap.get(name)) return true;
        return false;
    }

    public isAnyKeyDown(names: string[]): boolean {
        if (!this.isAvailableForControl()) return false;
        return names.some((name) => this.isKeyDown(name));
    }

    public areAllKeysDown(names: string[]): boolean {
        if (!this.isAvailableForControl()) return false;
        return names.every((name) => this.isKeyDown(name));
    }

    public isAvailableForControl(): boolean {
        const active: HTMLElement = document.activeElement as HTMLElement;
        return !(
            active instanceof HTMLInputElement ||
            active instanceof HTMLTextAreaElement ||
            active?.isContentEditable
        );
    }
}

export default new DomKeyboardManager();
