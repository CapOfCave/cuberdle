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

function getCheckboxValue(name: string): boolean | null {
    const selectedElement: HTMLInputElement | null = document.querySelector(`input[name="settings-${name}"]`);
    return selectedElement?.checked ?? null;
}

function setCheckboxValue(name: string, value: boolean) {
    const selectedElement: HTMLInputElement | null = document.querySelector(`input[name="settings-${name}"]`);
    if (!selectedElement) {
        throw new Error(`Illegal value for checkbox ${name}: ${value}`);
    }
    selectedElement.checked = value;
}

function initCheckboxEventListener(name: string, onChange: OnChangeFunction) {
    const checkbox: HTMLInputElement | null = document.querySelector(`input[name="settings-${name}"]`);
    if (!checkbox) {
        throw new Error(`Checkbox with name ${name} was not found`);
    }
    checkbox.onchange = function () {
        onChange(checkbox.checked);
    }

}

type OnChangeFunction = (value: SettingsValue) => void;

interface InputTypeValue<ValueT extends SettingsValue> {
    get: (meta: SettingsMeta) => ValueT | null,
    set: (meta: SettingsMeta, value: ValueT) => void,
    init: (meta: SettingsMeta, onChange: OnChangeFunction) => void,
}

const inputTypes: { "radio": InputTypeValue<string>, "checkbox": InputTypeValue<boolean> } = {
    "radio": {
        get: (meta) => getRadioButtonValue(meta.name),
        set: (meta, value) => setRadioButtonValue(meta.name, value),
        init: (meta, onChange) => initRadioButtonEventListener(meta.name, onChange),
    },
    "checkbox": {
        get: (meta) => getCheckboxValue(meta.name),
        set: (meta, value) => setCheckboxValue(meta.name, value),
        init: (meta, onChange) => initCheckboxEventListener(meta.name, onChange),
    }
}

type SettingsValue = string | boolean;

type SettingsMeta = any;

const settingsMetas: { [key in keyof Settings]: SettingsMeta } = {
    // cubeControlMode: {
    //     type: "radio",
    //     name: "cube-control-mode"
    // },
    colorblindMode: {
        type: "checkbox",
        name: "colorblind-mode",
    },
    difficulty: {
        type: "radio",
        name: "difficulty",
    }
}

function settingChanged(settingId: string, newValue: string) {
    console.log("changed", settingId, newValue, `settings-changed-${settingId}`)
    updateItem({ [settingId]: newValue });

    const event = new CustomEvent(`settings-changed-${settingId}`, { detail: { newValue }});
    document.dispatchEvent(event)
}

function init() {
    const settings = loadSettings();
    for (let [key, value] of Object.entries(settings)) {
        const meta = settingsMetas[key];
        const methods = inputTypes[meta.type];
        methods.set(meta, value);
        methods.init(meta, (newValue: string) => settingChanged(key, newValue))
    }
}

init();