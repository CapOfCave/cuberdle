import { resetUi } from "./settingsDom";

export enum CubeControlMode {
    CLICK_TO_TURN = "clickToTurn",
    DRAG_TO_TURN = "dragToTurn",
}

export enum Difficulty {
    EASY = "easy",
    MEDIUM = "medium",
    HARD = "hard",
}

const DEFAULT_SETTINGS: Settings = {
    colorblindMode: false,
    difficulty: Difficulty.EASY,
}

export interface Settings {
    colorblindMode: boolean,
    difficulty: Difficulty,
}

export function saveSettings(settings) {
    window.localStorage.setItem("settings", JSON.stringify(settings));
}

export function loadSettings(): Settings {
    const settingsRaw = window.localStorage.getItem("settings");
    if (!settingsRaw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(settingsRaw) };
}

export function _updateItem(diff: Partial<Settings>): Settings {
    const oldSettings = loadSettings();
    const merged = { ...oldSettings, ...diff };
    saveSettings(merged);

    for (const [settingId, newValue] of Object.entries(diff)) {
        const event = new CustomEvent(`settings-changed-${settingId}`, { detail: { newValue } });
        document.dispatchEvent(event)
    }

    return merged;
}

export function updateItem(diff: Partial<Settings>): Settings {
    const newSettings = _updateItem(diff);
    resetUi();
    return newSettings;
}

