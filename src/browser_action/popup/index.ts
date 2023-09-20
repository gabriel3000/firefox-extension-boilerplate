interface ExtgensionMessageType {
    id: string;
    value: string;
}

const tabMessager = (message: ExtgensionMessageType) => {
    browser.tabs.query({ active: true, currentWindow: true }, (tabs:any) => {
        const activeTab = tabs[0];
        browser.tabs.sendMessage(activeTab.id, message);
    });
};

const setEditableWebAudioSettingsLocalStorage = (key: string, value: number | string | boolean) => {
    window.localStorage.setItem('editableWebAudioSettings', JSON.stringify({
        ...JSON.parse(window.localStorage.getItem('editableWebAudioSettings') as string),
        [key]: value
    }));
}

const editableWebAudioSettings = window.localStorage.getItem('editableWebAudioSettings') ? JSON.parse(window.localStorage.getItem('editableWebAudioSettings') as string) : {
    gain: 0.3,
    oscillatorType: 'sine',
    io: false
};

const gainSlider = document.getElementById('gain-slider');
gainSlider.setAttribute('value', editableWebAudioSettings.gain.toString());
const gainValueSpan = document.getElementById('gain-slider-value');
gainValueSpan.innerHTML = editableWebAudioSettings.gain.toString();

const oscillatorTypeSelect = document.getElementById('oscillator-type');
const oscillatorTypeValue = document.getElementById('oscillator-type-value');
const oscillatorTypes = ['sine', 'square', 'sawtooth', 'triangle'];
oscillatorTypes.forEach(oscillatorType => {
    const option = document.createElement('option');
    option.value = oscillatorType;
    option.innerHTML = oscillatorType;
    option.selected = oscillatorType === editableWebAudioSettings.oscillatorType;
    oscillatorTypeSelect?.appendChild(option);
});
oscillatorTypeValue.innerHTML = editableWebAudioSettings.oscillatorType;


const ioCheckbox = document.getElementById('io-checkbox');
ioCheckbox.toggleAttribute('checked', editableWebAudioSettings.io);

const ioCheckboxValue = document.getElementById('io-checkbox-value');
ioCheckboxValue.innerHTML = editableWebAudioSettings.io ? 'On' : 'Off';

gainSlider?.addEventListener('change', (e) => {
    const gain = (e.target as HTMLInputElement).value;
    editableWebAudioSettings.gain = parseFloat(gain);
    setEditableWebAudioSettingsLocalStorage('gain', gain);
    tabMessager({
        id: 'gain',
        value: gain
    });
    gainValueSpan.innerHTML = gain;
});

oscillatorTypeSelect?.addEventListener('change', (e) => {
    const oscillatorType = (e.target as HTMLSelectElement).value;
    editableWebAudioSettings.oscillatorType = oscillatorType;
    oscillatorTypeValue.innerHTML = oscillatorType;
    setEditableWebAudioSettingsLocalStorage('oscillatorType', oscillatorType);
    tabMessager({
        id: 'oscillator-type',
        value: oscillatorType
    });
});

ioCheckbox?.addEventListener('change', (e) => {
    const io = (e.target as HTMLInputElement).checked;
    ioCheckboxValue.innerHTML = io ? 'On' : 'Off';
    setEditableWebAudioSettingsLocalStorage('io', io);
    tabMessager({
        id: 'io',
        value: io ? 'On' : 'Off'
    });
});
