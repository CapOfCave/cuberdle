import { loadSettings, Settings, updateItem } from "./settings";

function getRadioButtonValue(name: string): string | null {
    const selectedElement: HTMLInputElement | null = document.querySelector(`input[name="settings-${name}"]:checked`);
    return selectedElement?.value ?? null;
}

function setRadioButtonValue(name: string, value: string) {
    const selectedElement: HTMLInputElement | null = document.querySelector(`input[name="settings-${name}"][value="${value}"]`);
    if (!selectedElement) {
        throw new Error(`Illegal value for radio button ${name}: ${value}`);
    }
    selectedElement.value = value;
}

function initRadioButtonEventListener(name: string, onChange: OnChangeFunction) {
    const radios: NodeListOf<HTMLInputElement> = document.querySelectorAll(`input[name="settings-${name}"]`);
    for (let i = 0; i < radios.length; i++) {
        radios[i].onclick = function () {
            onChange(radios[i].value);
        }
    }
}

type OnChangeFunction = (value: SettingsValue) => void;

type InputTypeKey = "radio";

interface InputType {
    get: (meta: SettingsMeta) => SettingsValue | null,
    set: (meta: SettingsMeta, value: SettingsValue) => void,
    init: (meta: SettingsMeta, onChange: OnChangeFunction) => void,
}


const inputTypes: {[key in InputTypeKey]: InputType} = {
    "radio": {
        get: (meta) => getRadioButtonValue(meta.name),
        set: (meta, value) => setRadioButtonValue(meta.name, value),
        init: (meta, onChange) => initRadioButtonEventListener(meta.name, onChange),
    }
}

type SettingsValue = string;

type SettingsMeta = any;

const settingsMetas: {[key in keyof Settings]: SettingsMeta} = {
    cubeControlMode: {
        type: "radio",
        name: "cube-control-mode"
    }
}


function init() {
    const settings = loadSettings();
    for (let [key, value] of Object.entries(settings)) {
        const meta = settingsMetas[key];
        const methods = inputTypes[meta.type];
        methods.set(meta, value);
        methods.init(meta, (newValue: string) => updateItem({ [key]: newValue }))
    }
}

init();