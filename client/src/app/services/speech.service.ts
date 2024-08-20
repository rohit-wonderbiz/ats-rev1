import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpeechService {
  private synth = window.speechSynthesis;
  private msg = new SpeechSynthesisUtterance();
  private ziraVoice: SpeechSynthesisVoice | undefined;

  constructor() {
    this.initializeVoices();
  }

  private initializeVoices() {
    this.synth.onvoiceschanged = () => {
      const voices = this.synth.getVoices();
      this.ziraVoice = voices.find((voice) =>
        voice.name.toLowerCase().includes('zira')
      );
    };
  }

  setText(t: string) {
    this.msg.text = t;
  }

  speak(lang: string = 'en-US', pitch: number = 1, rate: number = 1) {
    if (!this.msg.text) {
      return;
    }

    if (this.ziraVoice) {
      this.msg.voice = this.ziraVoice;
    } else {
      console.warn('The Zira voice is not available.');
    }
    this.msg.lang = lang;
    this.msg.pitch = pitch;
    this.msg.rate = rate;
    this.synth.speak(this.msg);
  }

  stop() {
    this.synth.cancel();
  }
}
