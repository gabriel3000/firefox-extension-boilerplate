interface WebAudioInstanceDataType {
    audioContext: AudioContext;
    oscillator: OscillatorNode;
    oscillatorType: OscillatorType;
    gainNode: GainNode;
    gainValue: number;
    io: boolean;
}

const webAudioInstanceData:WebAudioInstanceDataType = {
    audioContext: null,
    oscillator: null,
    oscillatorType: 'sine',
    gainNode: null,
    gainValue: 0.1,
    io: false
};

const links = document.getElementsByTagName('a')

browser.runtime.onMessage.addListener((request) => {
    switch (request.id) {
        case 'gain':
            webAudioInstanceData.gainValue = request.value;
            break;
        case 'oscillator-type':
            webAudioInstanceData.oscillatorType = request.value;
            break;
        case 'io':
            if (request.value === 'On') {
                webAudioInstanceData.io = true;
                webAudioInstanceData.audioContext = new AudioContext();
                webAudioInstanceData.gainNode = webAudioInstanceData.audioContext.createGain();
                webAudioInstanceData.gainNode.gain.value = webAudioInstanceData.gainValue;
            } else if (request.value === 'Off') {
                webAudioInstanceData.io = false;
                webAudioInstanceData.audioContext.close().then(() => {
                    console.log('Audio context closed');
                });
                Array.from(links).forEach(link => {
                    link.style.outline = 'none';
                });
            }
            break;
        default:
            break;
    }
});

const randomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const randomColor = () => {
    return `rgb(${randomNumber(0, 255)}, ${randomNumber(0, 255)}, ${randomNumber(0, 255)})`;
}

Array.from(links).forEach(link => {
    link.addEventListener('mouseover', () => {
        if(!webAudioInstanceData.io) return;
        playNote();
        link.style.outline = `1px solid ${randomColor()}`;
    });
});

// Function to play a note using Web Audio API
const playNote = () => {
    if(!webAudioInstanceData.io) return;

    const audioContext = webAudioInstanceData.audioContext;
    const startTime = audioContext.currentTime;
    
    webAudioInstanceData.oscillator = audioContext.createOscillator();
    webAudioInstanceData.oscillator.type = webAudioInstanceData.oscillatorType;
    webAudioInstanceData.oscillator.frequency.value = randomNumber(200, 1000);

    // Create a gain node
    const gainNode = audioContext.createGain();
    webAudioInstanceData.gainNode = gainNode;

    // Set initial gain to 0
    gainNode.gain.setValueAtTime(0, startTime);

    // Set attack time (time it takes to reach full volume)
    const attackTime = 0.02; // Adjust this value as needed
    gainNode.gain.linearRampToValueAtTime(webAudioInstanceData.gainValue, startTime + attackTime);

    // Set decay time (time it takes to fade out)
    const decayTime = 0.8; // Adjust this value as needed
    gainNode.gain.linearRampToValueAtTime(0, startTime + attackTime + decayTime);

    // Connect the oscillator to the gain node
    webAudioInstanceData.oscillator.connect(gainNode);

    // Connect the gain node to the destination
    gainNode.connect(audioContext.destination);

    // Start the oscillator
    webAudioInstanceData.oscillator.start();

    // Stop the oscillator after the attack and decay times
    webAudioInstanceData.oscillator.stop(startTime + attackTime + decayTime);
}