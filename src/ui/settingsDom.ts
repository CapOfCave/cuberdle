import { loadSettings, updateItem } from "./settings";

function getRadioButtonValue(name: string) {
    const selectedElement: HTMLInputElement | null = document.querySelector(`input[name="settings-${name}"]:checked`);
    return selectedElement?.value;
}

function setRadioButtonValue(name: string, value: string) {
    const selectedElement: HTMLInputElement | null = document.querySelector(`input[name="settings-${name}"][value="${value}"]`);
    if (!selectedElement) {
        throw new Error(`Illegal value for radio button ${name}: ${value}`);
    }
    selectedElement.value = value;
}

function initRadioButtonEventListener(name: string, onChange: (value: string) => void) {
    const radios: NodeListOf<HTMLInputElement> = document.querySelectorAll(`input[name="settings-${name}"]`);
    for (let i = 0; i < radios.length; i++) {
        radios[i].onclick = function () {
            onChange(radios[i].value);
        }
    }
}

const inputTypes = {
    "radio": {
        get: (meta) => getRadioButtonValue(meta.name),
        set: (meta, value) => setRadioButtonValue(meta.name, value),
        init: (meta, onChange) => initRadioButtonEventListener(meta.name, onChange),
    }
}


const settingsMeta = {
    cubeControlMode: {
        type: "radio",
        name: "cube-control-mode"
    }
}


function init() {
    const settings = loadSettings();
    for (let [key, value] of Object.entries(settings)) {
        const meta = settingsMeta[key];
        const methods = inputTypes[meta.type];
        methods.set(meta, value);
        methods.init(meta, (newValue: string) => updateItem({ [key]: newValue}))
    }
}

init();