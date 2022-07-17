export enum CubeControlMode {
    CLICK_TO_TURN = "clickToTurn",
    DRAG_TO_TURN = "dragToTurn",
} 

export enum Difficulty {
    EASY = "easy",
    MEDIUM = "medium",
    HARD = "hard",
}

// const settings: Settings = loadSettings();

const DEFAULT_SETTINGS: Settings = {
    // cubeControlMode: CubeControlMode.DRAG_TO_TURN,
    colorblindMode: false,
    difficulty: Difficulty.EASY,
}

export interface Settings {
    colorblindMode: boolean,
    difficulty: Difficulty,
    // cubeControlMode?: CubeControlMode,
}

export function saveSettings(settings) {
    window.localStorage.setItem("settings", JSON.stringify(settings));
}

export function loadSettings(): Settings {
    const settingsRaw = window.localStorage.getItem("settings");
    if (!settingsRaw) return DEFAULT_SETTINGS;
    return {...DEFAULT_SETTINGS, ...JSON.parse(settingsRaw)};
}

export function updateItem(diff: Partial<Settings>): Settings {
    const oldSettings = loadSettings();
    const merged = {...oldSettings, ...diff};
    saveSettings(merged);
    return merged;
}
