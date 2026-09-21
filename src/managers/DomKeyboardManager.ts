import Action from "../tools/Action.js";

export class DomKeyboardManager {
    private static readonly _MODIFIER_CODES = new Set([
        "ShiftLeft", "ShiftRight",
        "ControlLeft", "ControlRight",
        "AltLeft", "AltRight",
        "MetaLeft", "MetaRight",
        "CapsLock",
    ]);

    private readonly _downCodes = new Set<string>();

    public readonly onKeyDown = new Action<[KeyboardEvent]>();
    public readonly onKeyUp = new Action<[KeyboardEvent]>();

    public init(): void {
        this._clearDownState();
        this._addCallbacks();
    }

    public dispose(): void {
        this._removeCallbacks();
        this._clearDownState();
        this.onKeyDown.removeAll();
        this.onKeyUp.removeAll();
    }

    private _addCallbacks(): void {
        this._removeCallbacks();
        window.addEventListener("keydown", this._onKeyDown);
        window.addEventListener("keyup", this._onKeyUp);
        window.addEventListener("blur", this._clearDownState);
        document.addEventListener("visibilitychange", this._onVisibilityChange);
    }

    private _removeCallbacks(): void {
        window.removeEventListener("keydown", this._onKeyDown);
        window.removeEventListener("keyup", this._onKeyUp);
        window.removeEventListener("blur", this._clearDownState);
        document.removeEventListener("visibilitychange", this._onVisibilityChange);
    }

    private readonly _onKeyDown = (e: KeyboardEvent): void => {
        this._downCodes.add(e.code);
        this.onKeyDown.execute(e);
    };

    private readonly _onKeyUp = (e: KeyboardEvent): void => {
        this._downCodes.delete(e.code);
        if (e.key === "Meta") this._clearNonModifiers();
        this.onKeyUp.execute(e);
    };

    private readonly _onVisibilityChange = (): void => {
        if (document.visibilityState === "hidden") this._clearDownState();
    };

    private readonly _clearDownState = (): void => {
        this._downCodes.clear();
    };

    private _clearNonModifiers(): void {
        for (const code of this._downCodes) {
            if (!DomKeyboardManager._MODIFIER_CODES.has(code)) {
                this._downCodes.delete(code);
            }
        }
    }

    public isKeyDown(code: string): boolean {
        return this.isAvailableForControl() && this._downCodes.has(code);
    }

    public isAnyKeyDown(codes: string[]): boolean {
        return codes.some((code) => this.isKeyDown(code));
    }

    public areAllKeysDown(codes: string[]): boolean {
        return codes.every((code) => this.isKeyDown(code));
    }

    public isAvailableForControl(): boolean {
        let active = document.activeElement;
        while (active?.shadowRoot?.activeElement) {
            active = active.shadowRoot.activeElement;
        }
        return !(
            active instanceof HTMLInputElement ||
            active instanceof HTMLTextAreaElement ||
            active instanceof HTMLSelectElement ||
            (active instanceof HTMLElement && active.isContentEditable)
        );
    }
}
