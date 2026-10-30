'use strict';
const list = document.getElementById('place-list');
const map = L.map('map', {scrollWheelZoom: false}).setView([51.0543,3.7210], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom:19,
  attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
}).addTo(map);
const markers = new Map();
function escapeHTML(str){return String(str).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
function showOnMap(id){
  const marker=markers.get(id);
  const place=places.find(p=>p.id===id);
  if(!marker || !place)return;
  if(!map.hasLayer(marker))marker.addTo(map);
  document.getElementById('map-section').scrollIntoView({behavior:'smooth'});
  window.setTimeout(()=>{map.invalidateSize();map.flyTo([place.lat,place.lng],16,{duration:.75});marker.openPopup();},450);
}
places.forEach(place=>{
  const article=document.createElement('article');article.className='place';
  const trigger=document.createElement('button');trigger.className='place-trigger';trigger.type='button';trigger.setAttribute('aria-expanded','false');
  const detailsId=`details-${place.id}`;trigger.setAttribute('aria-controls',detailsId);
  const title=document.createElement('span');title.textContent=`${place.name} (${place.area})`;
  const plus=document.createElement('span');plus.className='plus';plus.textContent='+';plus.setAttribute('aria-hidden','true');
  trigger.append(title,plus);
  const details=document.createElement('div');details.id=detailsId;details.className='place-details';
  const desc=document.createElement('p');desc.textContent=place.description;
  const btn=document.createElement('button');btn.type='button';btn.textContent='BEKIJK OP DE KAART ↗';btn.addEventListener('click',()=>showOnMap(place.id));
  details.append(desc,btn);article.append(trigger,details);list.appendChild(article);
  trigger.addEventListener('click',()=>{const open=article.classList.toggle('is-open');trigger.setAttribute('aria-expanded',String(open));plus.textContent=open?'−':'+';});
  const color=place.type==='gem'?'#d4ff00':'#b90000';
  const marker=L.circleMarker([place.lat,place.lng],{radius:12,weight:2,color:'#fff',fillColor:color,fillOpacity:1});
  marker.bindPopup(`<div class="popup-label">${place.type==='gem'?'HIDDEN GEM / LOKALE PLEK':'KETEN / DEMO'}</div><div class="popup-title">${escapeHTML(place.name)}</div><b>${escapeHTML(place.area)}</b><p>${escapeHTML(place.description)}</p>`);
  marker.addTo(map);markers.set(place.id,marker);
});
document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{
 const active=button.dataset.filter;
 document.querySelectorAll('.filter').forEach(b=>{const on=b===button;b.classList.toggle('is-active',on);b.setAttribute('aria-pressed',String(on));});
 places.forEach(place=>{const marker=markers.get(place.id);if(active==='all'||active===place.type)marker.addTo(map);else map.removeLayer(marker);});
}));
window.addEventListener('hashchange',()=>window.setTimeout(()=>map.invalidateSize(),250));
