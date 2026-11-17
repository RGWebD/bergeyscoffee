/* ------------------------------------------------------------------
   LIVE GOOGLE REVIEWS HOOK (optional)
   The reviews on this page are real Google reviews copied by hand.
   To swap in a live feed straight from Google:
   1. In Google Cloud, enable "Maps JavaScript API" + "Places API (New)"
      and create an API key restricted to this site's domain (HTTP referrer).
   2. Paste the key below. The Place ID is already filled in.
   Google returns up to 5 "most relevant" reviews + the live rating/count.
------------------------------------------------------------------- */
window.BERGEYS_REVIEWS={
  apiKey:'',                                   // <-- add a referrer-restricted Google Maps API key
  placeId:'ChIJv5s5R1Gmha4RB5hW4ZKPujY'        // Bergeys Coffee Co., 1600 Banyan Dr, Venice FL
};
(function(){
  const cfg=window.BERGEYS_REVIEWS;if(!cfg.apiKey)return; // static reviews stay in place
  window.__bergeysReviewsInit=async function(){
    try{
      const {Place}=await google.maps.importLibrary('places');
      const place=new Place({id:cfg.placeId});
      await place.fetchFields({fields:['rating','userRatingCount','reviews']});
      const esc=s=>String(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
      const r=document.querySelector('[data-rating]'),c=document.querySelector('[data-count]');
      if(r&&place.rating)r.textContent=place.rating.toFixed(1);
      if(c&&place.userRatingCount)c.textContent=place.userRatingCount;
      const box=document.querySelector('.slides');
      if(box&&place.reviews&&place.reviews.length){
        box.innerHTML=place.reviews.map(v=>{const n=(v.authorAttribution&&v.authorAttribution.displayName)||'Google user';
          return `<article class="review"><div class="stars" aria-label="${v.rating} out of 5 stars">${'★'.repeat(v.rating||5)}</div><blockquote>${esc(v.text)}</blockquote><div class="who"><span class="avatar">${esc(n[0])}</span><div><b>${esc(n.split(' ')[0])} ${esc((n.split(' ')[1]||'').charAt(0))}${n.split(' ')[1]?'.':''}</b><small>${esc(v.relativePublishTimeDescription)} · Google</small></div></div></article>`}).join('');
        const f=document.querySelector('.live-flag');if(f)f.textContent='● Live from Google';
      }
    }catch(e){console.warn('Live reviews unavailable',e)}
  };
  const s=document.createElement('script');
  s.src=`https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(cfg.apiKey)}&v=weekly&loading=async&callback=__bergeysReviewsInit`;
  s.async=true;document.head.appendChild(s);
})();
