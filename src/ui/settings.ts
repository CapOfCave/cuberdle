export enum CubeControlMode {
    CLICK_TO_TURN = "clickToTurn",
    DRAG_TO_TURN = "dragToTurn",
} 

// const settings: Settings = loadSettings();

const DEFAULT_SETTINGS: Settings = {
    cubeControlMode: CubeControlMode.DRAG_TO_TURN,
}

export interface Settings {
    cubeControlMode: CubeControlMode,
}

export function saveSettings(settings) {
    window.localStorage.setItem("settings", JSON.stringify(settings));
}

export function loadSettings(): Settings {
    const settingsRaw = window.localStorage.getItem("settings");
    if (!settingsRaw) return DEFAULT_SETTINGS;
    return JSON.parse(settingsRaw);
}

export function updateItem(diff: Partial<Settings>): Settings {
    const oldSettings = loadSettings();
    const merged = {...oldSettings, ...diff};
    saveSettings(merged);
    return merged;
}
