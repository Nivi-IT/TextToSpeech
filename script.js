const textarea = document.querySelector("textarea"),
  voiceList = document.querySelector("select"),
  speechBtn = document.querySelector("button");

let synth = speechSynthesis,
  isSpeaking = true,
  interval;

function voices() {
  let availableVoices = synth.getVoices();
  if (availableVoices.length === 0) {
    console.warn("No voices available for speech synthesis.");
    return;
  }
  voiceList.innerHTML = ""; 
  for (let voice of availableVoices) {
    let selected = voice.name === "Google US English" ? "selected" : "";
    let option = `<option value="${voice.name}" ${selected}>${voice.name} (${voice.lang})</option>`;
    voiceList.insertAdjacentHTML("beforeend", option);
  }
}

synth.addEventListener("voiceschanged", voices);

function textToSpeech(text) {
  let utterance = new SpeechSynthesisUtterance(text);
  let selectedVoice = synth.getVoices().find((voice) => voice.name === voiceList.value);
  if (selectedVoice) utterance.voice = selectedVoice;

  synth.speak(utterance);

  utterance.onend = () => {
    clearInterval(interval);
    speechBtn.innerHTML = `<i class="fas fa-volume-up"></i> Convert To Speech`;
    isSpeaking = true;
  };
}

speechBtn.addEventListener("click", (e) => {
  e.preventDefault();

  if (textarea.value.trim() !== "") {
    if (!synth.speaking) {
      textToSpeech(textarea.value);
      speechBtn.innerHTML = `<i class="fas fa-pause"></i> Pause Speech`;
    } else if (isSpeaking) {
      synth.pause();
      isSpeaking = false;
      speechBtn.innerHTML = `<i class="fas fa-play"></i> Resume Speech`;
    } else {
      synth.resume();
      isSpeaking = true;
      speechBtn.innerHTML = `<i class="fas fa-pause"></i> Pause Speech`;
    }

    if (textarea.value.length > 80) {
      clearInterval(interval); 
      interval = setInterval(() => {
        if (!synth.speaking && !isSpeaking) {
          clearInterval(interval);
          speechBtn.innerHTML = `<i class="fas fa-volume-up"></i> Convert To Speech`;
          isSpeaking = true;
        }
      }, 500);
    }
  }
});
