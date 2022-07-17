import { loadSettings } from "../ui/settings";

export function init() {
    document.addEventListener('settings-changed-colorblindMode', ((e: CustomEvent) => {
        console.log('e', e.detail)
        if (e.detail.newValue) {
            document.body.classList.add('colorblind')
        } else {
            document.body.classList.remove('colorblind')
        }
    }) as EventListener);

    if (loadSettings().colorblindMode) {
        document.body.classList.add('colorblind')
    }
}

