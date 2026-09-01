export class AmbientSoundManager {
  constructor() {
    this.audioCtx = null;
    this.noiseNode = null;
    this.gainNode = null;
    this.isPlaying = false;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
  }

  createWhiteNoise() {
    const bufferSize = 2 * this.audioCtx.sampleRate;
    const noiseBuffer = this.audioCtx.createBuffer(
      1,
      bufferSize,
      this.audioCtx.sampleRate,
    );
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;
    return whiteNoise;
  }

  toggleNoise(volume = 0.05) {
    this.init();

    if (this.isPlaying) {
      this.stop();
    } else {
      this.noiseNode = this.createWhiteNoise();
      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.setValueAtTime(volume, this.audioCtx.currentTime);

      this.noiseNode.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);

      this.noiseNode.start();
      this.isPlaying = true;
    }
    return this.isPlaying;
  }

  stop() {
    if (this.noiseNode) {
      this.noiseNode.stop();
      this.noiseNode.disconnect();
      this.noiseNode = null;
      this.isPlaying = false;
    }
  }
}
