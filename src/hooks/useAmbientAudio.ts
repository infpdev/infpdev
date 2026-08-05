import { useRef, useState, useCallback, useEffect } from "react";

// Tier 1 tracks - loaded initially
import t1Track1 from "@/assets/audio/T1 Church Bells - Ordinary Child.mp3";
import t1Track2 from "@/assets/audio/T1 Painting - Sonia Gadhia.mp3";
import t1Track3 from "@/assets/audio/T1 ROSE - Gone MV.mp3";
import t1Track4 from "@/assets/audio/T1 sweet - Delorians.mp3";
import t1Track5 from "@/assets/audio/T1 The Ivy - It Was Always You.mp3";
import monthlySalaryMeow from "@/assets/audio/Easter Toyoki.mp3";

// Tier 2 tracks - loaded only when needed
import t2Track1 from "@/assets/audio/T2 ALWAYS - minj.mp3";
import t2Track2 from "@/assets/audio/T2 Angel Youth - The Vansire Band.mp3";
import t2Track3 from "@/assets/audio/T2 Flowers in June - Celine Wanyi.mp3";
import t2Track4 from "@/assets/audio/T2 Here You Are - We Are Various.mp3";
import t2Track5 from "@/assets/audio/T2 Nothing But Thieves - Sorry.mp3";

// Tier 3 tracks - loaded only when needed
import t3Track1 from "@/assets/audio/T3 pami - highway.mp3";
import t3Track2 from "@/assets/audio/T3 JUNE - NOTHING WITHOUT YOU.mp3";
import t3Track3 from "@/assets/audio/T3 Last Page - Su Han.mp3";
import t3Track4 from "@/assets/audio/T3 Lips - The Wildlife.mp3";
import t3Track5 from "@/assets/audio/T3 Sweet Nobody - The Lasting Kind.mp3";

// Define track objects with both src and display name
export interface Track {
  src: string;
  name: string;
  artist?: string;
  easterEgg?: boolean; // Optional property to indicate if it's an Easter egg track
}

const EASTER_TRACKS: Track[] = [
  { src: monthlySalaryMeow, name: "Toyoki", artist: "Roi Le", easterEgg: true },
];

const TIER_1_TRACKS: Track[] = [
  { src: t1Track1, name: "Church Bells", artist: "Ordinary Child" },
  { src: t1Track2, name: "Painting", artist: "Sonia Gadhia" },
  { src: t1Track3, name: "Gone", artist: "ROSE" },
  { src: t1Track4, name: "sweet", artist: "Delorians" },
  { src: t1Track5, name: "It Was Always You", artist: "The Ivy" },
];

const TIER_2_TRACKS: Track[] = [
  { src: t2Track1, name: "Always", artist: "minj" },
  { src: t2Track2, name: "Angel Youth", artist: "The Vansire Band" },
  { src: t2Track3, name: "Flowers in June", artist: "Celine Wanyi" },
  { src: t2Track4, name: "Here You Are", artist: "We Are Various" },
  { src: t2Track5, name: "Sorry", artist: "Nothing But Thieves" },
];

const TIER_3_TRACKS: Track[] = [
  { src: t3Track1, name: "highway", artist: "pami" },
  { src: t3Track2, name: "Nothing without you", artist: "june" },
  { src: t3Track3, name: "Last Page", artist: "Su Han" },
  { src: t3Track4, name: "Lips", artist: "The Wildlife" },
  {
    src: t3Track5,
    name: "The Lasting Kind",
    artist: "Sweet Nobody",
  },
];

const TARGET_VOLUME = 0.2;
const FADE_DURATION = 800;
const PRELOAD_THRESHOLD = 10; // seconds before end to queue next track

// Helper to get random track excluding played ones
const getRandomTrack = (tracks: Track[], playedTracks: Set<Track>): Track => {
  // Filter out invalid tracks
  const validTracks = tracks.filter((track) => track && track.src);
  const availableTracks = validTracks.filter(
    (track) => !playedTracks.has(track),
  );

  if (availableTracks.length === 0) {
    // Reset and try again with valid tracks
    playedTracks.clear();
    const fallbackTracks = validTracks.length > 0 ? validTracks : tracks;
    return fallbackTracks[Math.floor(Math.random() * fallbackTracks.length)];
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
  const [queueEaster, setQueueEaster] = useState(false); // New: state to queue Easter egg track
  const currentTierRef = useRef(1);
  const nextTrackRef = useRef<Track | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);
  const isPreloadingRef = useRef(false);
  const easterEggTriggeredRef = useRef(false);

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

    if (preloadRef.current.src !== track.src && !isPreloadingRef.current) {
      isPreloadingRef.current = true;
      preloadRef.current.src = track.src;

      // Use load() but catch any errors
      try {
        preloadRef.current.load();
      } catch (e) {
        // Ignore cache errors
        isPreloadingRef.current = false;
        return;
      }

      preloadRef.current.oncanplaythrough = () => {
        isPreloadingRef.current = false;
      };

      preloadRef.current.onerror = () => {
        isPreloadingRef.current = false;
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
    // Only count non-Easter tracks
    const nonEasterPlayed = [...playedSet].filter((track) => !track.easterEgg);
    if (nonEasterPlayed.length >= tracks.length) {
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

      // Validate that the track has a valid src
      if (!newTrack || !newTrack.src) {
        console.error("Invalid next track:", newTrack);
        nextTrackRef.current = null;
        setIsPlaying(false);
        return;
      }

      // Check if preloaded audio is ready
      if (preloadRef.current && preloadRef.current.src === newTrack.src) {
        // Use the preloaded audio by transferring its buffer
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
        newAudio
          .play()
          .then(() => {
            fadeIn(newAudio);
            setCurrentTrack(newTrack);
            nextTrackRef.current = null;
          })
          .catch((err) => {
            console.error("Failed to play preloaded track:", err);
            setIsPlaying(false);
          });

        // Reset preload element
        if (preloadRef.current) {
          preloadRef.current.src = "";
          preloadRef.current.load();
          isPreloadingRef.current = false;
        }
      } else {
        // Fallback: load normally if preload failed
        try {
          audio.src = newTrack.src;
          audio.load();
          audio
            .play()
            .then(() => {
              fadeIn(audio);
              setCurrentTrack(newTrack);
              nextTrackRef.current = null;
            })
            .catch((err) => {
              console.error("Failed to play fallback track:", err);
              setIsPlaying(false);
            });
        } catch (err) {
          console.error("Error loading fallback track:", err);
          setIsPlaying(false);
        }
      }
    }
  }, [isPlaying, fadeIn, handleTimeUpdate]);

  // Skip to next track (as if the current track ended)
  const skipToNext = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    // Get current tier by checking which array contains the track
    let currentTier = 0;
    if (currentTrack.easterEgg) {
      // Treat Easter track as Tier 1
      currentTier = 1;
    } else if (TIER_1_TRACKS.some((t) => t.src === currentTrack.src)) {
      currentTier = 1;
    } else if (TIER_2_TRACKS.some((t) => t.src === currentTrack.src)) {
      currentTier = 2;
    } else if (TIER_3_TRACKS.some((t) => t.src === currentTrack.src)) {
      currentTier = 3;
    }

    if (currentTier === 0) return;

    const nextTier = currentTier + 1;

    // Determine which tier to play next
    let targetTier = nextTier;
    if (nextTier > 3) {
      targetTier = 1;
    }

    const nextTierTracks = getTierTracks(targetTier);
    if (!nextTierTracks) return;

    // Reset tier if all songs have been played
    resetTierIfNeeded(targetTier);

    // Get a random track that hasn't been played in this tier
    const playedSet = playedTracksRef.current[targetTier as 1 | 2 | 3];
    const nextTrack = getRandomTrack(nextTierTracks, playedSet);

    // Mark this track as played
    playedSet.add(nextTrack);

    // Set as next track
    nextTrackRef.current = nextTrack;
    currentTierRef.current = targetTier;

    // Preload the next track
    preloadNextTrack(nextTrack);

    // Trigger the end handler
    handleTrackEnd();
  }, [currentTrack, resetTierIfNeeded, preloadNextTrack, handleTrackEnd]);

  // Swap to a different track in the same tier
  const swapTrack = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    // Get current tier by checking which array contains the track
    let currentTier = 0;
    if (currentTrack.easterEgg) {
      // Treat Easter track as Tier 1
      currentTier = 1;
    } else if (TIER_1_TRACKS.some((t) => t.src === currentTrack.src)) {
      currentTier = 1;
    } else if (TIER_2_TRACKS.some((t) => t.src === currentTrack.src)) {
      currentTier = 2;
    } else if (TIER_3_TRACKS.some((t) => t.src === currentTrack.src)) {
      currentTier = 3;
    }

    if (currentTier === 0) return;

    const tierTracks = getTierTracks(currentTier);
    if (!tierTracks) return;

    // Get tracks that haven't been played in this tier
    const playedSet = playedTracksRef.current[currentTier as 1 | 2 | 3];
    const availableTracks = tierTracks.filter(
      (track) => !playedSet.has(track) && track.src !== currentTrack.src,
    );

    // If no available tracks, reset the tier and try again
    let newTrack: Track | null = null;
    if (availableTracks.length === 0) {
      // Reset the tier
      playedSet.clear();
      // Get all tracks except current
      const allExceptCurrent = tierTracks.filter(
        (track) => track.src !== currentTrack.src,
      );
      if (allExceptCurrent.length > 0) {
        newTrack =
          allExceptCurrent[Math.floor(Math.random() * allExceptCurrent.length)];
      }
    } else {
      newTrack =
        availableTracks[Math.floor(Math.random() * availableTracks.length)];
    }

    if (!newTrack) return;

    // Mark as played
    playedSet.add(newTrack);

    // Store as next track and trigger the end handler
    nextTrackRef.current = newTrack;
    preloadNextTrack(newTrack);

    // End current track to trigger transition
    handleTrackEnd();
  }, [currentTrack, handleTrackEnd, preloadNextTrack]);

  const playEasterAudio = () => {
    const track = EASTER_TRACKS[0];
    if (!track) {
      console.error("Easter egg track not found!");
      return null;
    }

    currentTierRef.current = 1;
    nextTrackRef.current = null;
    setQueueEaster(false);
    setHasInteracted(true);
    return track;
  };

  const toggle = useCallback(() => {
    if (!hasInteracted) {
      // First interaction: create audio and start playing
      const audio = new Audio();
      audio.preload = "auto";
      audioRef.current = audio;

      let initialTrack: Track;

      // Check if there's a specific track queued (Easter egg)
      if (easterEggTriggeredRef.current) {
        easterEggTriggeredRef.current = false; // Reset the flag
        initialTrack = playEasterAudio();
      } else {
        // Get initial track from tier 1
        initialTrack = getRandomTrack(
          TIER_1_TRACKS,
          playedTracksRef.current[1],
        );
        playedTracksRef.current[1].add(initialTrack);
        currentTierRef.current = 1;
      }

      // After getting initialTrack:
      if (!initialTrack || !initialTrack.src) {
        console.error("Invalid initial track:", initialTrack);
        setIsPlaying(false);
        return;
      }

      // console.log("Playing:", initialTrack.name);

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
          const nextTier =
            currentTierRef.current + 1 > 3 ? 1 : currentTierRef.current + 1;
          const nextTierTracks = getTierTracks(nextTier);
          if (nextTierTracks) {
            setTimeout(() => {
              const nextTrack = getRandomTrack(
                nextTierTracks,
                playedTracksRef.current[nextTier as 1 | 2 | 3],
              );
              if (nextTrack) {
                playedTracksRef.current[nextTier as 1 | 2 | 3].add(nextTrack);
                nextTrackRef.current = nextTrack;
                currentTierRef.current = nextTier;
                preloadNextTrack(nextTrack);
              }
            }, 2000);
          }
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

  // Play a specific track (like the Easter egg track)
  const playEasterTrack = useCallback(() => {
    setQueueEaster(true); // Indicate that the Easter egg track should be played
    easterEggTriggeredRef.current = true; // Use a ref instead of state to avoid toggle from using stale state

    toggle();
  }, [toggle]);

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
    skipToNext,
    swapTrack,
    hasInteracted,
    playEasterTrack,
  };
};

export { TIER_1_TRACKS, TIER_2_TRACKS, TIER_3_TRACKS };
