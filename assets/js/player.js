(function() {
  'use strict';

  let playlist = [];
  let current = 0;
  let audio = null;
  let list = null;
  let isPlaying = false;

  // Add track to playlist
  async function addTrack(title, url, art) {
    if (!title || !url) {
      console.error('Title and URL are required');
      return;
    }

    const track = { title, url, art };
    playlist.push(track);
    savePlaylist();
    
    try {
      const response = await fetch('/api/tracks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(track)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      renderPlaylist();
      showNotification('Track added successfully!', 'success');
    } catch (error) {
      console.error('Error adding track:', error);
      showNotification('Failed to add track', 'error');
    }
  }

  // Remove track from playlist
  function removeTrack(index) {
    if (index < 0 || index >= playlist.length) return;
    
    playlist.splice(index, 1);
    savePlaylist();
    
    // Adjust current track index if necessary
    if (current >= index && current > 0) {
      current--;
    }
    
    renderPlaylist();
    showNotification('Track removed', 'info');
  }

  // Play specific track
  function playTrack(index) {
    if (index < 0 || index >= playlist.length) return;
    
    current = index;
    const track = playlist[index];
    
    if (audio && track) {
      audio.src = track.url;
      audio.play().catch(error => {
        console.error('Error playing track:', error);
        showNotification('Failed to play track', 'error');
      });
      
      isPlaying = true;
      updatePlaylistUI();
      updatePlayerControls();
    }
  }

  // Update playlist UI
  function updatePlaylistUI() {
    if (!list) return;
    
    Array.from(list.children).forEach((li, i) => {
      li.classList.toggle('active', i === current);
    });
  }

  // Update player controls
  function updatePlayerControls() {
    const playBtn = document.getElementById('playBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (playBtn) {
      playBtn.textContent = isPlaying ? 'Pause' : 'Play';
    }
    
    if (prevBtn) {
      prevBtn.disabled = playlist.length === 0;
    }
    
    if (nextBtn) {
      nextBtn.disabled = playlist.length === 0;
    }
  }

  // Render playlist
  function renderPlaylist() {
    if (!list) return;
    
    list.textContent = '';
    
    if (playlist.length === 0) {
      const emptyMessage = document.createElement('li');
      emptyMessage.textContent = 'No tracks in playlist';
      emptyMessage.className = 'empty-message';
      list.appendChild(emptyMessage);
      return;
    }
    
    playlist.forEach((track, i) => {
      const li = document.createElement('li');
      li.className = 'playlist-item';
      
      // Album art
      const img = document.createElement('img');
      img.src = track.art || 'assets/images/placeholder/dj-profile.jpg';
      img.alt = track.title;
      img.className = 'album-art';
      img.onerror = () => {
        img.src = 'assets/images/placeholder/dj-profile.jpg';
      };
      li.appendChild(img);
      
      // Track info
      const trackInfo = document.createElement('div');
      trackInfo.className = 'track-info';
      
      const title = document.createElement('span');
      title.textContent = track.title;
      title.className = 'track-title';
      trackInfo.appendChild(title);
      
      const url = document.createElement('span');
      url.textContent = track.url;
      url.className = 'track-url';
      trackInfo.appendChild(url);
      
      li.appendChild(trackInfo);
      
      // Play button
      const playBtn = document.createElement('button');
      playBtn.textContent = '▶';
      playBtn.className = 'play-btn';
      playBtn.onclick = (e) => {
        e.stopPropagation();
        playTrack(i);
      };
      li.appendChild(playBtn);
      
      // Remove button
      const removeBtn = document.createElement('button');
      removeBtn.textContent = '✕';
      removeBtn.className = 'remove-btn';
      removeBtn.onclick = (e) => {
        e.stopPropagation();
        if (confirm('Remove this track from playlist?')) {
          removeTrack(i);
        }
      };
      li.appendChild(removeBtn);
      
      list.appendChild(li);
    });
    
    updatePlaylistUI();
  }

  // Save playlist to localStorage
  function savePlaylist() {
    try {
      localStorage.setItem('dj-playlist', JSON.stringify(playlist));
    } catch (error) {
      console.error('Error saving playlist:', error);
    }
  }

  // Load playlist from localStorage or default tracks
  async function loadPlaylist() {
    try {
      // Try to load from localStorage first
      const saved = localStorage.getItem('dj-playlist');
      if (saved) {
        return JSON.parse(saved);
      }
      
      // Try to fetch from data/tracks.json
      try {
        const response = await fetch('data/tracks.json');
        if (response.ok) {
          const data = await response.json();
          return data.tracks || [];
        }
      } catch (fetchError) {
        console.log('Could not fetch tracks.json, using default tracks');
      }
      
      // Fallback to default tracks if JSON file is not accessible
      return getDefaultTracks();
    } catch (error) {
      console.error('Error loading playlist:', error);
    }
    
    return getDefaultTracks();
  }

  // Default tracks data (fallback)
  function getDefaultTracks() {
    return [
      {
        "title": "Vintage Culture, Roddy Lima - Analog Ascent",
        "url": "assets/audio/2. Vintage Culture Roddy Lima - Analog Ascent.mp3"
      },
      {
        "title": "Victor Ruiz, Mila Journée - Stars (Original Mix)",
        "url": "assets/audio/3. Victor Ruiz Mila Journée - Stars (Original Mix).mp3"
      },
      {
        "title": "KREAM & RUBACK - Se Que Quiere",
        "url": "assets/audio/4. KREAM & RUBACK - Se Que Quiere.mp3"
      },
      {
        "title": "Hardwell & Blasterjaxx - Beat Of The Drum",
        "url": "assets/audio/5. Hardwell & Blasterjaxx - Beat Of The Drum.mp3"
      },
      {
        "title": "Rebūke & deadmau5 - Endless feat. Ed Graves",
        "url": "assets/audio/6. Rebūke & deadmau5 - Endless feat. Ed Graves [Official Visualizer].mp3"
      },
      {
        "title": "skaviński - unreal",
        "url": "assets/audio/7. skaviński - unreal.mp3"
      },
      {
        "title": "ZHU - Good Life (Tabu Afro House Remix)",
        "url": "assets/audio/8. ZHU - Good Life (Tabu Afro House Remix).mp3"
      },
      {
        "title": "OTIOT - Sands of the Unknown (feat. KELILA)",
        "url": "assets/audio/9. OTIOT - Sands of the Unknown (feat. KELILA).mp3"
      },
      {
        "title": "Symphonix - Mess in the Head - Official",
        "url": "assets/audio/10. Symphonix - Mess in the Head - Official.mp3"
      },
      {
        "title": "Tiësto & Mathame - Everlight (Official Audio)",
        "url": "assets/audio/11. Tiësto & Mathame - Everlight (Official Audio).mp3"
      },
      {
        "title": "GroundBass, Tijah, Perception - We Are Thoughts (Sonic Massala Remix)",
        "url": "assets/audio/13. GroundBass Tijah Perception - We Are Thoughts (Sonic Massala Remix) - Official.mp3"
      },
      {
        "title": "Omiki x Sighter - Sofia (Extended Official Video)",
        "url": "assets/audio/14. Omiki x Sighter - Sofia (Extended Official Video).mp3"
      },
      {
        "title": "Dimitri Vegas & Like Mike & Timmy Trumpet & Sub Zero Project - Move Your Body",
        "url": "assets/audio/15. Dimitri Vegas & Like Mike & Timmy Trumpet & Sub Zero Project - Move Your Body (Official Music Video).mp3"
      },
      {
        "title": "Eurythmics - Sweet Dreams (Ersin AVCI Remix)",
        "url": "assets/audio/16. Eurythmics - Sweet Dreams (Ersin AVCI Remix).mp3"
      },
      {
        "title": "Boris Brejcha - Bells Of Eternity",
        "url": "assets/audio/17. Boris Brejcha - Bells Of Eternity.mp3"
      },
      {
        "title": "Lynnic, ItsArius & Dinia - Maze Of Memories (Extended Mix)",
        "url": "assets/audio/18. Lynnic ItsArius & Dinia - Maze Of Memories (Extended Mix).mp3"
      },
      {
        "title": "TiM TASTE - Repeat (Original Mix)",
        "url": "assets/audio/19. [SUBIOS166] TiM TASTE - Repeat (Original Mix).mp3"
      },
      {
        "title": "Vini Vici & Liquid Soul - Universe Inside Me",
        "url": "assets/audio/19. Vini Vici & Liquid Soul - Universe Inside Me [Visuals   HD].mp3"
      },
      {
        "title": "KREAM - Arrival",
        "url": "assets/audio/20. KREAM - Arrival.mp3"
      },
      {
        "title": "Schameleon, Hidden Secret - Just A Dream (Official Audio)",
        "url": "assets/audio/20. Schameleon Hidden Secret - Just A Dream (Official Audio).mp3"
      },
      {
        "title": "Boris Brejcha - Python",
        "url": "assets/audio/21. Boris Brejcha - Python.mp3"
      },
      {
        "title": "Glitch (Monococ Remix) - JNTN",
        "url": "assets/audio/21. Glitch (Monococ Remix) -  JNTN.mp3"
      },
      {
        "title": "Faith (Maksim Dark Remix) - Gaga, Mateo!",
        "url": "assets/audio/22. Faith (Maksim Dark Remix) - Gaga Mateo!.mp3"
      },
      {
        "title": "Sabura - Who are you (Roman Adam Remix)",
        "url": "assets/audio/22. Sabura - Who are you (Roman Adam Remix)[Official audio].mp3"
      },
      {
        "title": "Boris Brejcha - Reflections",
        "url": "assets/audio/23. Boris Brejcha - Reflections.mp3"
      },
      {
        "title": "Bruce Wayne - Feels So Good (Official Video Clip)",
        "url": "assets/audio/23. Bruce Wayne - Feels So Good (Official Video Clip).mp3"
      },
      {
        "title": "Faders & Blazy - Chimera",
        "url": "assets/audio/24. Faders & Blazy - Chimera.mp3"
      },
      {
        "title": "WhoMadeWho & Adriatique - Miracle (Official Album Video)",
        "url": "assets/audio/24. WhoMadeWho & Adriatique - Miracle (Official Album Video).mp3"
      },
      {
        "title": "Aion & Agmon - Cosmic Void",
        "url": "assets/audio/25. Aion & Agmon - Cosmic Void.mp3"
      },
      {
        "title": "Bedouin - Petra (TWO LANES Remix)",
        "url": "assets/audio/25. Bedouin - Petra (TWO LANES Remix).mp3"
      },
      {
        "title": "Bedouin - Petra (TWO LANES Remix) [Alt]",
        "url": "assets/audio/26. Bedouin - Petra (TWO LANES Remix).mp3"
      },
      {
        "title": "ZARO - Stereo Love (Visualizer) (Official)",
        "url": "assets/audio/27. ZARO - Stereo Love (Visualizer) (Official).mp3"
      },
      {
        "title": "Waves (Remix)",
        "url": "assets/audio/28. Waves (Remix).mp3"
      },
      {
        "title": "MANNA - Shreem [Official Audio]",
        "url": "assets/audio/29. MANNA - Shreem [Official Audio].mp3"
      },
      {
        "title": "Nightlapse - Love Shy (Extended Mix)",
        "url": "assets/audio/30. Nightlapse - Love Shy (Extended Mix).mp3"
      },
      {
        "title": "Growling (Lampé Remix) - Aio HNGT",
        "url": "assets/audio/31. Growling (Lampé Remix)  -  Aio HNGT.mp3"
      },
      {
        "title": "TIMESHIFT (2025 REMASTER)",
        "url": "assets/audio/32. TIMESHIFT (2025 REMASTER).mp3"
      },
      {
        "title": "Tenet (Original Mix) - Va O.N.E.",
        "url": "assets/audio/33. Tenet (Original Mix) - Va O.N.E..mp3"
      },
      {
        "title": "Josh Baker & Omar+ - Back It Up (James Poole Remix)",
        "url": "assets/audio/34. Josh Baker & Omar+ - Back It Up (James Poole Remix).mp3"
      },
      {
        "title": "Tiësto - Una Velita Extended Remix",
        "url": "assets/audio/35. Tiësto - Una Velita   Extended Remix.mp3"
      },
      {
        "title": "CASSIMM, Dark Dhalia - If You Want [House]",
        "url": "assets/audio/36. CASSIMM Dark Dhalia - If You Want [House].mp3"
      },
      {
        "title": "Matroda, Ciszak - License To Be Bad (Feat. Lovlee)",
        "url": "assets/audio/37. Matroda Ciszak - License To Be Bad (Feat. Lovlee).mp3"
      },
      {
        "title": "Kyle Watson - At Ya",
        "url": "assets/audio/38. Kyle Watson - At Ya.mp3"
      },
      {
        "title": "Time Is an Illusion (Original Mix) - Krypta",
        "url": "assets/audio/39. Time Is an Illusion (Original Mix) - Krypta.mp3"
      },
      {
        "title": "Eyes on You (Monococ Remix) - Inline NeWest",
        "url": "assets/audio/40. Eyes on You (Monococ Remix) - Inline NeWest.mp3"
      },
      {
        "title": "Portal",
        "url": "assets/audio/41. Portal.mp3"
      },
      {
        "title": "Layton Giordani & Bart Skils - Deadly Valentine Drumcode",
        "url": "assets/audio/42. Layton Giordani & Bart Skils - Deadly Valentine   Drumcode.mp3"
      },
      {
        "title": "Brain Crackin (Original Mix)",
        "url": "assets/audio/43. Brain Crackin (Original Mix).mp3"
      },
      {
        "title": "Matroda - Good Girl (Juntaro Remix)",
        "url": "assets/audio/44. Matroda - Good Girl (Juntaro Remix).mp3"
      },
      {
        "title": "Maddix & Space 92 - Rolling",
        "url": "assets/audio/45. Maddix & Space 92 - Rolling.mp3"
      },
      {
        "title": "Walker & Royce - Death By Love",
        "url": "assets/audio/46. Walker & Royce - Death By Love.mp3"
      },
      {
        "title": "Symphonix - Restless Soul - Official",
        "url": "assets/audio/47. Symphonix - Restless Soul - Official.mp3"
      },
      {
        "title": "Kupidox - CroakWave",
        "url": "assets/audio/48. Kupidox - CroakWave.mp3"
      },
      {
        "title": "Aqualize - Land of 2 Suns (Liquid Soul Remix)",
        "url": "assets/audio/50. Aqualize - Land of 2 Suns (Liquid Soul Remix).mp3"
      },
      {
        "title": "Cyberpunk DJ Party (Video)",
        "url": "assets/20250711_1328_Cyberpunk DJ Party_simple_compose_01jzwkx9w1femv3rnqmfb268et.mp4"
      }
    ];
  }

  // Show notification
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  }

  // Create player controls
  function createPlayer(tracks) {
    playlist = tracks;
    
    // Next button
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
      nextBtn.onclick = () => {
        const nextIndex = (current + 1) % playlist.length;
        playTrack(nextIndex);
      };
    }

    // Previous button
    const prevBtn = document.getElementById('prevBtn');
    if (prevBtn) {
      prevBtn.onclick = () => {
        const prevIndex = (current - 1 + playlist.length) % playlist.length;
        playTrack(prevIndex);
      };
    }

    // Play/Pause button
    const playBtn = document.getElementById('playBtn');
    if (playBtn) {
      playBtn.onclick = () => {
        if (audio) {
          if (isPlaying) {
            audio.pause();
          } else {
            if (playlist.length > 0) {
              playTrack(current);
            }
          }
        }
      };
    }

    // Audio event listeners
    if (audio) {
      audio.addEventListener('play', () => {
        isPlaying = true;
        updatePlayerControls();
      });
      
      audio.addEventListener('pause', () => {
        isPlaying = false;
        updatePlayerControls();
      });
      
      audio.addEventListener('ended', () => {
        const nextIndex = (current + 1) % playlist.length;
        if (nextIndex !== current) {
          playTrack(nextIndex);
        } else {
          isPlaying = false;
          updatePlayerControls();
        }
      });
      
      audio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        showNotification('Error playing audio', 'error');
        isPlaying = false;
        updatePlayerControls();
      });
    }

    renderPlaylist();
    updatePlayerControls();
    
    if (playlist.length > 0) {
      // Don't auto-play, just load the first track
      if (audio) {
        audio.src = playlist[0].url;
      }
    }
  }

  // Initialize player
  async function initPlayer() {
    audio = document.getElementById('audioPlayer');
    list = document.getElementById('playlist');
    
    if (!audio || !list) {
      console.warn('Player elements not found');
      return;
    }
    
    try {
      const tracks = await loadPlaylist();
      createPlayer(tracks);
    } catch (error) {
      console.error('Error initializing player:', error);
      showNotification('Failed to initialize player', 'error');
    }
  }

  // Export functions to global scope
  window.addTrack = addTrack;
  window.removeTrack = removeTrack;
  window.savePlaylist = savePlaylist;
  window.loadPlaylist = loadPlaylist;

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', initPlayer);

})();
