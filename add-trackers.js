(async () => {
  const trackerCible = 'https://Tracker.actuel/announce/';
  const nouveauTracker = 'https://Nouveau.tracker/announce/';
  
  const torrentsResp = await fetch('/api/v2/torrents/info', {credentials: 'include'});
  const torrents = await torrentsResp.json();
  
  let count = 0;
  for (const torrent of torrents) {
    const trackersResp = await fetch(`/api/v2/torrents/trackers?hash=${torrent.hash}`, {credentials: 'include'});
    const trackers = await trackersResp.json();
    
    // Filtre : exactement 1 tracker ET il match le cible
    const trackersActifs = trackers.filter(t => t.status === 2);  // 2 = Working
    if (trackersActifs.length === 1 && trackersActifs[0].url === trackerCible) {
      const body = `hash=${encodeURIComponent(torrent.hash)}&urls=${encodeURIComponent(nouveauTracker)}`;
      const addResp = await fetch('/api/v2/torrents/addTrackers', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        credentials: 'include',
        body: body
      });
      
      if (addResp.ok) {
        console.log(`✅ ${torrent.name} : tracker ajouté`);
        count++;
      } else {
        console.log(`❌ ${torrent.name} : ${addResp.status} - ${await addResp.text()}`);
      }
    }
  }
  console.log(`\n🎉 Total: ${count} torrents modifiés`);
})();
