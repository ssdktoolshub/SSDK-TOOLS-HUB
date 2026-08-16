// Core Logic for Text to Speech
export async function execute(inputs) {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
        return { outputData: 'Speech synthesis is not supported in this browser.' };
    }

    const { inputData } = inputs;
    if (!inputData) {
        throw new Error('Input text is required');
    }

    const utterance = new SpeechSynthesisUtterance(inputData);
    window.speechSynthesis.speak(utterance);

    return { outputData: 'Speech playing...' };
}

export function validate(inputs) {
    if (!inputs.inputData || typeof inputs.inputData !== 'string' || inputs.inputData.trim() === '') {
        return false;
    }
    return true;
}
