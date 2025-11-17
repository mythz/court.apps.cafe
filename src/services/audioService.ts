class AudioService {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private musicTrack: HTMLAudioElement | null = null;
  private soundEnabled = true;
  private musicEnabled = true;

  preloadSounds() {
    const soundFiles = {
      gavelBang: '/assets/sounds/gavel-bang.mp3',
      correctVerdict: '/assets/sounds/correct-verdict.mp3',
      incorrectVerdict: '/assets/sounds/incorrect-verdict.mp3',
      coinEarn: '/assets/sounds/coin-earn.mp3',
      buttonClick: '/assets/sounds/button-click.mp3'
    };

    Object.entries(soundFiles).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.preload = 'auto';
      this.sounds.set(key, audio);
    });
  }

  playSound(soundName: string) {
    if (!this.soundEnabled) return;

    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {});
    }
  }

  playMusic(trackPath: string) {
    if (!this.musicEnabled) return;

    if (this.musicTrack) {
      this.musicTrack.pause();
    }

    this.musicTrack = new Audio(trackPath);
    this.musicTrack.loop = true;
    this.musicTrack.volume = 0.3;
    this.musicTrack.play().catch(() => {});
  }

  setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (!enabled && this.musicTrack) {
      this.musicTrack.pause();
    }
  }
}

export const audioService = new AudioService();
