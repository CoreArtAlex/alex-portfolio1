import { useState, useEffect, useRef } from 'react';
import './Music.css';

const songs = [
  {
    name: 'song-1',
    image: 'song-1',
    displayName: 'Song N1',
    artist: 'Jacinto Design',
  },
  {
    name: 'song-2',
    image: 'song-2',
    displayName: 'Song N2',
    artist: 'Jacinto Design',
  },
  {
    name: 'song-3',
    image: 'song-3',
    displayName: 'Song N3',
    artist: 'Jacinto Design',
  },
  {
    name: 'song-4',
    image: 'song-4',
    displayName: 'Song N4',
    artist: 'Jacinto Design',
  },
];

function Music() {
  const [songIndex, setSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const currentSong = songs[songIndex];

  useEffect(() => {
    if (isPlaying) audioRef.current?.play();
    else audioRef.current?.pause();
  }, [songIndex, isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const prevSong = () =>
    setSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
  const nextSong = () => setSongIndex((prev) => (prev + 1) % songs.length);

  const updateProgress = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const setProgress = (e: React.MouseEvent<HTMLDivElement>) => {
    const width = progressRef.current?.clientWidth || 1;
    const clickX = e.nativeEvent.offsetX;
    if (audioRef.current) {
      audioRef.current.currentTime = (clickX / width) * duration;
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60)
      .toString()
      .padStart(2, '0');
    return `${mins}:${secs}`;
  };
  return (
    <div className="player-container">
      <div className="img-container">
        <img src={`images/${currentSong.image}.jpg`} alt="album art" />
      </div>
      <h2>{currentSong.displayName}</h2>
      <h3>{currentSong.artist}</h3>
      <audio
        ref={audioRef}
        src={`music/${currentSong.name}.mp3`}
        onTimeUpdate={updateProgress}
        onLoadedMetadata={updateProgress}
        onEnded={nextSong}
      ></audio>
      <div
        className="progress-container"
        onClick={setProgress}
        ref={progressRef}
      >
        <div
          className="progress"
          style={{
            width: duration ? `${(currentTime / duration) * 100}%` : '0%',
          }}
        ></div>
        <div className="duration-wrapper">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      <div className="player-controls">
        <i className="fas fa-backward" onClick={prevSong}></i>
        <i
          className={`fas ${
            isPlaying ? 'fa-circle-pause' : 'fa-circle-play'
          } main-button`}
          onClick={togglePlay}
        ></i>
        <i className="fas fa-forward" onClick={nextSong}></i>
      </div>
    </div>
  );
}

export default Music;
