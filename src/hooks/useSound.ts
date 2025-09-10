import { useCallback, useRef, useState } from 'react';

// 音效类型
export type SoundType = 'deal' | 'win' | 'lose' | 'tie' | 'replace' | 'shuffle';

// 音效配置
const SOUND_CONFIG = {
  deal: {
    frequency: 800,
    duration: 100,
    type: 'sine' as OscillatorType
  },
  replace: {
    frequency: 600,
    duration: 150,
    type: 'triangle' as OscillatorType
  },
  win: {
    frequencies: [523, 659, 784, 1047], // C-E-G-C 和弦
    duration: 200,
    type: 'sine' as OscillatorType
  },
  lose: {
    frequencies: [392, 311, 247], // G-Eb-B 下行
    duration: 300,
    type: 'sawtooth' as OscillatorType
  },
  tie: {
    frequencies: [440, 440], // A音重复
    duration: 250,
    type: 'square' as OscillatorType
  },
  shuffle: {
    frequency: 200,
    duration: 50,
    type: 'triangle' as OscillatorType
  }
};

export const useSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isEnabled, setIsEnabled] = useState(true);

  // 初始化音频上下文
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.warn('Web Audio API not supported:', error);
        return null;
      }
    }
    return audioContextRef.current;
  }, []);

  // 播放单个音调
  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine', delay: number = 0) => {
    const audioContext = initAudioContext();
    if (!audioContext || !isEnabled) return;

    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + delay);
      oscillator.type = type;

      // 音量包络
      gainNode.gain.setValueAtTime(0, audioContext.currentTime + delay);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + delay + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + delay + duration / 1000);

      oscillator.start(audioContext.currentTime + delay);
      oscillator.stop(audioContext.currentTime + delay + duration / 1000);
    } catch (error) {
      console.warn('Error playing tone:', error);
    }
  }, [initAudioContext, isEnabled]);

  // 播放音效
  const playSound = useCallback((soundType: SoundType) => {
    if (!isEnabled) return;

    const config = SOUND_CONFIG[soundType];
    
    switch (soundType) {
      case 'deal':
      case 'replace':
      case 'shuffle':
        playTone(config.frequency, config.duration, config.type);
        break;
        
      case 'win':
        // 播放胜利和弦
        config.frequencies.forEach((freq, index) => {
          playTone(freq, config.duration, config.type, index * 0.1);
        });
        break;
        
      case 'lose':
        // 播放失败下行音
        config.frequencies.forEach((freq, index) => {
          playTone(freq, config.duration, config.type, index * 0.15);
        });
        break;
        
      case 'tie':
        // 播放平局音效
        config.frequencies.forEach((freq, index) => {
          playTone(freq, config.duration, config.type, index * 0.3);
        });
        break;
    }
  }, [playTone, isEnabled]);

  // 切换音效开关
  const toggleSound = useCallback(() => {
    setIsEnabled(prev => !prev);
  }, []);

  // 获取音效状态
  const isSoundEnabled = useCallback(() => {
    return isEnabled;
  }, [isEnabled]);

  return {
    playSound,
    toggleSound,
    isSoundEnabled,
    isEnabled
  };
};