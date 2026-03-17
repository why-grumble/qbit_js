(async () => {
  const origUrl = 'https://tracker.com/announce/';
  const newUrl = 'https://tracker.net/announce/';
  
  const torrentsResp = await fetch('/api/v2/torrents/info', {credentials: 'include'});
  const torrents = await torrentsResp.json();
  
  let count = 0;
  for (const torrent of torrents) {
    const trackersResp = await fetch(`/api/v2/torrents/trackers?hash=${torrent.hash}`, {credentials: 'include'});
    const trackers = await trackersResp.json();
    
    // Si contient exactement origUrl
    if (trackers.some(t => t.url === origUrl)) {
      const body = new URLSearchParams({
        hash: torrent.hash,
        origUrl: origUrl,
        newUrl: newUrl
      }).toString();
      
      const editResp = await fetch('/api/v2/torrents/editTracker', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        credentials: 'include',
        body: body
      });
      
      if (editResp.ok) {
        console.log(`✅ ${torrent.name} : remplacé`);
        count++;
      } else {
        console.log(`❌ ${torrent.name} (${editResp.status}):`, await editResp.text());
      }
    }
  }
  console.log(`\n🎉 Total: ${count} torrents modifiés`);
})();
