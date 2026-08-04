import { useRef, useState, useCallback, useEffect } from "react";

// Tier 1 tracks - loaded initially
import t1Track1 from "@/assets/audio/T1 Church Bells - Ordinary Child.mp3";
import t1Track2 from "@/assets/audio/T1 Painting - Sonia Gadhia.mp3";
import t1Track3 from "@/assets/audio/T1 ROSE - Gone MV.mp3";
import t1Track4 from "@/assets/audio/T1 sweet - Delorians.mp3";
import t1Track5 from "@/assets/audio/T1 The Ivy - It Was Always You.mp3";

// Tier 2 tracks - loaded only when needed
import t2Track1 from "@/assets/audio/T2 ALWAYS - minj.mp3";
import t2Track2 from "@/assets/audio/T2 Angel Youth - The Vansire Band.mp3";
import t2Track3 from "@/assets/audio/T2 clouds in my room - kanegi.mp3";
import t2Track4 from "@/assets/audio/T2 Flowers in June - Celine Wanyi.mp3";
import t2Track5 from "@/assets/audio/T2 Here You Are - We Are Various.mp3";
import t2Track6 from "@/assets/audio/T2 Nothing But Thieves - Sorry.mp3";

// Tier 3 tracks - loaded only when needed
import t3Track1 from "@/assets/audio/T3 pami - highway.mp3";
import t3Track2 from "@/assets/audio/T3 JUNE - NOTHING WITHOUT YOU.mp3";
import t3Track3 from "@/assets/audio/T3 Last Page - Su Han.mp3";
import t3Track4 from "@/assets/audio/T3 Lips - The Wildlife.mp3";
import t3Track5 from "@/assets/audio/T3 Sweet Nobody - The Lasting Kind - i'm cyborg but that's ok.mp3";

// Define track objects with both src and display name
export interface Track {
  src: string;
  name: string;
  artist?: string;
}

const TIER_1_TRACKS: Track[] = [
  { src: t1Track1, name: "Ordinary Child", artist: "Church Bells" },
  { src: t1Track2, name: "Painting", artist: "Sonia Gadhia" },
  { src: t1Track3, name: "Gone", artist: "ROSE" },
  { src: t1Track4, name: "sweet", artist: "Delorians" },
  { src: t1Track5, name: "It Was Always You", artist: "The Ivy" },
];

const TIER_2_TRACKS: Track[] = [
  { src: t2Track1, name: "ALWAYS", artist: "minj" },
  { src: t2Track2, name: "Angel Youth", artist: "The Vansire Band" },
  { src: t2Track3, name: "clouds in my room", artist: "kanegi" },
  { src: t2Track4, name: "Flowers in June", artist: "Celine Wanyi" },
  { src: t2Track5, name: "Here You Are", artist: "We Are Various" },
  { src: t2Track6, name: "Sorry", artist: "Nothing But Thieves" },
];

const TIER_3_TRACKS: Track[] = [
  { src: t3Track1, name: "highway", artist: "pami" },
  { src: t3Track2, name: "NOTHING WITHOUT YOU", artist: "JUNE" },
  { src: t3Track3, name: "Last Page", artist: "Su Han" },
  { src: t3Track4, name: "Lips", artist: "The Wildlife" },
  {
    src: t3Track5,
    name: "The Lasting Kind - i'm cyborg but that's ok",
    artist: "Sweet Nobody",
  },
];

const TARGET_VOLUME = 0.3;
const FADE_DURATION = 800;
const PRELOAD_THRESHOLD = 10; // seconds before end to queue next track

// Helper to get random track excluding played ones
const getRandomTrack = (tracks: Track[], playedTracks: Set<Track>): Track => {
  const availableTracks = tracks.filter((track) => !playedTracks.has(track));

  if (availableTracks.length === 0) {
    return tracks[Math.floor(Math.random() * tracks.length)];
  }

  const randomBuffer = new Uint32Array(1);
  crypto.getRandomValues(randomBuffer);
  return availableTracks[randomBuffer[0] % availableTracks.length];
};

// Helper to get tracks by tier
const getTierTracks = (tier: number): Track[] | null => {
  if (tier === 1) return TIER_1_TRACKS;
  if (tier === 2) return TIER_2_TRACKS;
  if (tier === 3) return TIER_3_TRACKS;
  return null;
};

export const useAmbientAudio = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const preloadRef = useRef<HTMLAudioElement | null>(null); // New: dedicated preload audio element
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const currentTierRef = useRef(1);
  const nextTrackRef = useRef<Track | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);
  const isPreloadingRef = useRef(false);

  // Track played songs for each tier
  const playedTracksRef = useRef<{
    1: Set<Track>;
    2: Set<Track>;
    3: Set<Track>;
  }>({
    1: new Set(),
    2: new Set(),
    3: new Set(),
  });

  // New: Preload the next track
  const preloadNextTrack = useCallback((track: Track) => {
    if (!preloadRef.current) {
      preloadRef.current = new Audio();
      preloadRef.current.preload = "auto";
    }

    // Only preload if not already preloading this track
    if (preloadRef.current.src !== track.src && !isPreloadingRef.current) {
      isPreloadingRef.current = true;

      // Setting a new src automatically frees the previous one
      preloadRef.current.src = track.src;
      preloadRef.current.load();

      // Reset the flag once loaded
      preloadRef.current.oncanplaythrough = () => {
        isPreloadingRef.current = false;
        // console.log("Preloaded:", track.name);
      };

      // Also reset on error
      preloadRef.current.onerror = () => {
        isPreloadingRef.current = false;
        console.error("Failed to preload:", track.name);
      };
    }
  }, []);

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

  // Reset played tracks for a specific tier when all have been played
  const resetTierIfNeeded = useCallback((tier: number) => {
    const tracks = getTierTracks(tier);
    if (!tracks) return;

    const playedSet = playedTracksRef.current[tier as 1 | 2 | 3];
    if (playedSet.size >= tracks.length) {
      playedSet.clear();
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !isPlaying) return;

    const timeRemaining = audio.duration - audio.currentTime;

    // Queue next track when close to end
    if (timeRemaining < PRELOAD_THRESHOLD && !nextTrackRef.current) {
      const currentTier = currentTierRef.current;
      const nextTier = currentTier + 1;

      // Determine which tier to play next
      let targetTier = nextTier;
      if (nextTier > 3) {
        targetTier = 1;
      }

      const nextTierTracks = getTierTracks(targetTier);

      if (nextTierTracks) {
        // Reset tier if all songs have been played
        resetTierIfNeeded(targetTier);

        // Get a random track that hasn't been played in this tier
        const playedSet = playedTracksRef.current[targetTier as 1 | 2 | 3];
        const nextTrack = getRandomTrack(nextTierTracks, playedSet);

        // Mark this track as played
        playedSet.add(nextTrack);

        nextTrackRef.current = nextTrack;
        currentTierRef.current = targetTier;

        // Preload the next track immediately
        preloadNextTrack(nextTrack);
      }
    }
  }, [isPlaying, resetTierIfNeeded, preloadNextTrack]);

  const handleTrackEnd = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !isPlaying) return;

    if (nextTrackRef.current) {
      const newTrack = nextTrackRef.current;

      // Check if preloaded audio is ready
      if (preloadRef.current && preloadRef.current.src === newTrack.src) {
        // Use the preloaded audio by transferring its buffer
        // Create a new audio element with the preloaded content
        const newAudio = new Audio(newTrack.src);
        newAudio.preload = "auto";
        newAudio.volume = 0;

        // Copy event listeners from old audio
        newAudio.addEventListener("timeupdate", handleTimeUpdate);
        newAudio.addEventListener("ended", handleTrackEnd);

        // Replace the audio element
        const oldAudio = audioRef.current;
        audioRef.current = newAudio;

        // Remove old event listeners
        if (oldAudio) {
          oldAudio.pause();
          oldAudio.removeEventListener("timeupdate", handleTimeUpdate);
          oldAudio.removeEventListener("ended", handleTrackEnd);
          oldAudio.src = "";
        }

        // Start playing the new audio
        newAudio.play().catch(() => {
          setIsPlaying(false);
        });
        fadeIn(newAudio);
        setCurrentTrack(newTrack);
        nextTrackRef.current = null;

        // Reset preload element
        if (preloadRef.current) {
          preloadRef.current.src = "";
          preloadRef.current.load();
          isPreloadingRef.current = false;
        }
      } else {
        // Fallback: load normally if preload failed
        audio.src = newTrack.src;
        audio.load();
        audio.play().catch(() => {
          setIsPlaying(false);
        });
        fadeIn(audio);
        setCurrentTrack(newTrack);
        nextTrackRef.current = null;
      }
    }
  }, [isPlaying, fadeIn, handleTimeUpdate]);

  const toggle = useCallback(() => {
    if (!hasInteracted) {
      // First interaction: create audio and start playing
      const audio = new Audio();
      audio.preload = "auto"; // Changed from "none" to "auto"
      audioRef.current = audio;

      // Get initial track from tier 1
      const initialTrack = getRandomTrack(
        TIER_1_TRACKS,
        playedTracksRef.current[1],
      );
      playedTracksRef.current[1].add(initialTrack);

      audio.src = initialTrack.src;
      audio.load();

      setCurrentTrack(initialTrack);

      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("ended", handleTrackEnd);

      setIsPlaying(true);

      audio
        .play()
        .then(() => {
          fadeIn(audio);
          setHasInteracted(true);

          // Preload the next track after a small delay
          setTimeout(() => {
            const nextTrack = getRandomTrack(
              TIER_2_TRACKS,
              playedTracksRef.current[2],
            );
            if (nextTrack) {
              playedTracksRef.current[2].add(nextTrack);
              nextTrackRef.current = nextTrack;
              currentTierRef.current = 2;
              preloadNextTrack(nextTrack);
            }
          }, 2000);
        })
        .catch((err) => {
          console.error(err);
          setIsPlaying(false);
        });

      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      audio.play().catch((err) => {
        console.error(err);
        setIsPlaying(false);
      });
    }
  }, [
    hasInteracted,
    isPlaying,
    fadeIn,
    handleTimeUpdate,
    handleTrackEnd,
    preloadNextTrack,
  ]);

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
      if (preloadRef.current) {
        preloadRef.current.pause();
        preloadRef.current.src = "";
        preloadRef.current = null;
      }
    };
  }, []);

  return {
    isPlaying,
    toggle,
    currentTrack,
  };
};
