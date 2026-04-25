import { useRef, useState, useCallback, useEffect } from "react";

// Tier 1 tracks - loaded initially
import t1Track1 from "@/assets/audio/T1 ROSE - Gone MV.mp3";
import t1Track2 from "@/assets/audio/T1 Painting - Sonia Gadhia.mp3";
import t1Track3 from "@/assets/audio/T1 pami - highway (Official Lyric Video) - pami.mp3";

// Tier 2 tracks - loaded only when needed
import t2Track1 from "@/assets/audio/T2 Geowulf - Saltwater (Official Video) - geowulfmusicVEVO.mp3";
import t2Track2 from "@/assets/audio/T2 Here You Are - We Are Various.mp3";
import t2Track3 from "@/assets/audio/T2 clouds in my room - kanegi.mp3";
import t2Track4 from "@/assets/audio/T1 Good Things - Cloud Pastel.mp3";

// Tier 3 tracks - loaded only when needed
import t3Track1 from "@/assets/audio/T3 Sweet Nobody - The Lasting Kind - i'm cyborg but that's ok.mp3";
import t3Track2 from "@/assets/audio/T3 With You - The Wild Wind.mp3";
import t3Track3 from "@/assets/audio/T2 Stumble - CASTLEBEAT.mp3";

const TIER_1_TRACKS = [t1Track1, t1Track2, t1Track3];
const TIER_2_TRACKS = [t2Track1, t2Track2, t2Track3, t2Track4];
const TIER_3_TRACKS = [t3Track1, t3Track2, t3Track3];

const TARGET_VOLUME = 0.1;
const FADE_DURATION = 800;
const PRELOAD_THRESHOLD = 5; // seconds before end to queue next track

const getRandomTrack = (tracks: string[]): string => {
  const randomBuffer = new Uint32Array(1);
  crypto.getRandomValues(randomBuffer);
  return tracks[randomBuffer[0] % tracks.length];
};

export const useAmbientAudio = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const currentTierRef = useRef(1);
  const nextTrackRef = useRef<string | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);

  const fadeIn = useCallback((audio: HTMLAudioElement) => {
    audio.volume = 0;
    const step = TARGET_VOLUME / (FADE_DURATION / 16);

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    fadeIntervalRef.current = window.setInterval(() => {
      if (audio.volume + step >= TARGET_VOLUME) {
        audio.volume = TARGET_VOLUME;
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
          fadeIntervalRef.current = null;
        }
      } else {
        audio.volume += step;
      }
    }, 16);
  }, []);

  const getNextTierTracks = useCallback((tier: number): string[] | null => {
    if (tier === 1) return TIER_2_TRACKS;
    if (tier === 2) return TIER_3_TRACKS;
    return null;
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !isPlaying) return;

    const timeRemaining = audio.duration - audio.currentTime;

    // Queue next track when close to end
    if (timeRemaining < PRELOAD_THRESHOLD && !nextTrackRef.current) {
      const nextTierTracks = getNextTierTracks(currentTierRef.current);
      if (nextTierTracks) {
        nextTrackRef.current = getRandomTrack(nextTierTracks);
      } else {
        // Loop back to tier 1
        nextTrackRef.current = getRandomTrack(TIER_1_TRACKS);
        currentTierRef.current = 0; // Will be incremented to 1
      }
    }
  }, [isPlaying, getNextTierTracks]);

  const handleTrackEnd = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !isPlaying) return;

    if (nextTrackRef.current) {
      currentTierRef.current += 1;
      audio.src = nextTrackRef.current;
      audio.load();
      audio.play();
      fadeIn(audio);
      nextTrackRef.current = null;
    }
  }, [isPlaying, fadeIn]);

  const toggle = useCallback(() => {
    if (!hasInteracted) {
      // First interaction: create audio and start playing
      const audio = new Audio();
      audio.preload = "none";
      audioRef.current = audio;

      const initialTrack = getRandomTrack(TIER_1_TRACKS);
      audio.src = initialTrack;
      audio.load();

      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("ended", handleTrackEnd);

      audio
        .play()
        .then(() => {
          fadeIn(audio);
          setIsPlaying(true);
          setHasInteracted(true);
        })
        .catch(console.error);

      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(console.error);
    }
  }, [hasInteracted, isPlaying, fadeIn, handleTimeUpdate, handleTrackEnd]);

  // Update event listeners when callbacks change
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleTrackEnd);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleTrackEnd);
    };
  }, [handleTimeUpdate, handleTrackEnd]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return { isPlaying, toggle };
};
