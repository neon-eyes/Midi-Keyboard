const AUDIO_CONTEXT = new AudioContext();

const NOTE_DETAILS = [
    { note: 'C', key: 'Z', frequency: 261.626, active: false },
    { note: 'Db', key: 'S', frequency: 277.183, active: false },
    { note: 'D', key: 'X', frequency: 293.665, active: false },
    { note: 'Eb', key: 'D', frequency: 311.127, active: false },
    { note: 'E', key: 'C', frequency: 329.628, active: false },
    { note: 'F', key: 'V', frequency: 349.228, active: false },
    { note: 'Gb', key: 'G', frequency: 369.994, active: false },
    { note: 'G', key: 'B', frequency: 391.995, active: false },
    { note: 'Ab', key: 'H', frequency: 415.305, active: false },
    { note: 'A', key: 'N', frequency: 440, active: false },
    { note: 'Bb', key: 'J', frequency: 466.164, active: false },
    { note: 'B', key: 'M', frequency: 493.883, active: false },
];

document.addEventListener('keydown', (e) => {
    if (e.repeat) return;

    let kbKey = e.code;
    let noteDetail = getNoteDetail(kbKey);
    console.log(noteDetail);
    if (noteDetail === undefined) return;

    noteDetail.active = true;
    playNotes();
});

document.addEventListener('keyup', (e) => {
    let kbKey = e.code;
    let noteDetail = getNoteDetail(kbKey);

    if (noteDetail === undefined) return;

    noteDetail.active = false;
    playNotes();
});

//returns one note from NOTE_DETAILS
function getNoteDetail(kbKey) {
    return NOTE_DETAILS.find((n) => `Key${n.key}` === kbKey);
}

function playNotes() {
    NOTE_DETAILS.forEach((n) => {
        let elKey = document.querySelector(`[data-note="${n.note}"]`);
        elKey.classList.toggle('active', n.active);
        if (n.oscillator !== undefined) {
            n.oscillator.stop();
            n.oscillator.disconnect();
        }
    });
    let activeNotes = NOTE_DETAILS.filter((n) => n.active);
    // added gain so volume doesnt overlap each other (exceeds 100% vol)
    let gain = 1 / activeNotes.length;
    activeNotes.forEach((n) => {
        startNote(n, gain);
    });
}

// plays the sound itself
function startNote(noteDetail, gain) {
    let gainNode = AUDIO_CONTEXT.createGain();
    gainNode.gain.value = gain;
    let oscillator = AUDIO_CONTEXT.createOscillator();
    oscillator.frequency.value = noteDetail.frequency;
    oscillator.type = 'sine';
    //passes the note through the gain(to controll the volume) into speakers
    oscillator.connect(gainNode).connect(AUDIO_CONTEXT.destination);
    oscillator.start();
    noteDetail.oscillator = oscillator;
}
