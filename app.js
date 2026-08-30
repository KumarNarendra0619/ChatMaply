import { inspectChatZip } from './parsers/zip-import.js';
import { requestObserverLocation, createObserverLocation } from './location/location-engine.js';
import { initGlobe, renderGlobeObservations } from './terrain/globe-view.js';

const demo = {
  observers: [
    {id:'u1',name:'Ramesh',lat:30.0869,lng:78.2676,accuracy:12,time:'2026-08-30 08:42'},
    {id:'u2',name:'Sita',lat:30.0892,lng:78.2741,accuracy:18,time:'2026-08-30 09:10'},
    {id:'u3',name:'Mohan',lat:30.0825,lng:78.2715,accuracy:9,time:'2026-08-30 10:05'}
  ],
  observations: [
    {id:'W-001',type:'Waste dumping',lat:30.0881,lng:78.2714,accuracy:35,confidence:'High',time:'2026-08-30 08:45',distance:'480 m',elevation:1120,slope:'18°',evidence:'2 images + 1 video',condition:'Poor'},
    {id:'W-002',type:'Roadside waste',lat:30.091,lng:78.278,accuracy:65,confidence:'Estimated',time:'2026-08-30 09:15',distance:'620 m',elevation:1095,slope:'11°',evidence:'1 image',condition:'Moderate'},
    {id:'W-003',type:'Water pollution',lat:30.084,lng:78.269,accuracy:25,confidence:'High',time:'2026-08-30 10:08',distance:'310 m',elevation:1105,slope:'7°',evidence:'1 image + 2 messages',condition:'Poor'}
  ]
};

const map = L.map('map', {zoomControl:true}).setView([30.0875,78.272], 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:19, attribution:'© OpenStreetMap contributors'}).addTo(map);
const observerLayer = L.layerGroup().addTo(map);
const objectLayer = L.layerGroup().addTo(map);
const allMarkers = [];
let globeReady = false;

function observerIcon(){return L.divIcon({className:'custom-marker',html:'<div style="width:16px;height:16px;border-radius:50%;background:#2878c8;border:3px solid white;box-shadow:0 1px 5px #555"></div>',iconSize:[16,16],iconAnchor:[8,8]});}
function objectIcon(estimated=false){const c=estimated?'#d6a52b':'#d74c4c';return L.divIcon({className:'custom-marker',html:`<div style="width:17px;height:17px;border-radius:50%;background:${c};border:3px solid white;box-shadow:0 1px 5px #555"></div>`,iconSize:[17,17],iconAnchor:[8,8]});}
function showObservation(o){document.getElementById('observationCard').innerHTML=`<h3>Selected report</h3><div class="obs-title">${o.type}</div><p><strong>${o.id}</strong> • ${o.time}</p><p>📍 ${Number(o.lat).toFixed(5)}, ${Number(o.lng).toFixed(5)}</p><p>📏 Location accuracy: ±${o.accuracy ?? 'unknown'} m</p><p>⛰️ Elevation: ${o.elevation ?? 'Not available'}${o.slope ? ` • Slope: ${o.slope}` : ''}</p><p>↔ Distance from observer: ${o.distance || 'Not available'}</p><p>Evidence: ${o.evidence || 'Chat report'}</p><div class="chips"><span class="chip">${o.confidence || 'Unverified'}</span><span class="chip">Object / event</span></div>`;}
function clearLayers(){observerLayer.clearLayers();objectLayer.clearLayers();allMarkers.length=0;}
function renderData(data){
  clearLayers();
  (data.observers || []).forEach(u=>{const marker=L.marker([u.lat,u.lng],{icon:observerIcon()}).bindPopup(`<strong>Observer</strong><br>${u.name}<br>Accuracy: ±${u.accuracy ?? 'unknown'} m<br>${u.time || ''}`);marker.addTo(observerLayer);allMarkers.push(marker);});
  (data.observations || []).forEach(o=>{const marker=L.marker([o.lat,o.lng],{icon:objectIcon(o.confidence==='Estimated')}).on('click',()=>showObservation(o)).bindPopup(`<strong>${o.type}</strong><br>${o.time || ''}<br>Accuracy: ±${o.accuracy ?? 'unknown'} m`);marker.addTo(objectLayer);allMarkers.push(marker);});
  document.getElementById('observerCount').textContent=(data.observers||[]).length;
  document.getElementById('obsCount').textContent=(data.observations||[]).length;
  document.getElementById('messageCount').textContent=(data.messages||[]).length;
  document.getElementById('mediaCount').textContent=(data.media||[]).length;
  window.chatMaplyObservations = data.observations || [];
  fit();
  if (globeReady) renderGlobeObservations(window.chatMaplyObservations);
}
function fit(){if(allMarkers.length) map.fitBounds(L.featureGroup(allMarkers).getBounds().pad(0.18));}

renderData({ ...demo, messages:[1,2,3,4,5,6], media:[1,2,3,4] });
document.getElementById('fitMap').addEventListener('click',fit);

const toggleGlobe = document.getElementById('toggleGlobe');
if (toggleGlobe) toggleGlobe.addEventListener('click', async () => {
  const mapEl = document.getElementById('map');
  const globeEl = document.getElementById('globe');
  const showing = !globeEl.hidden;
  if (showing) { globeEl.hidden = true; mapEl.hidden = false; toggleGlobe.textContent = '3D Globe'; map.invalidateSize(); return; }
  globeEl.hidden = false; mapEl.hidden = true; toggleGlobe.textContent = '2D Map';
  if (!globeReady) { await initGlobe('globe'); globeReady = true; }
  renderGlobeObservations(window.chatMaplyObservations || []);
});

// BUILD-04: explicit observer-location consent and browser/OS positioning.
const locationBtn = document.getElementById('shareLocation');
if (locationBtn) {
  locationBtn.addEventListener('click', () => {
    const status = document.getElementById('locationStatus');
    status.textContent = 'Requesting location permission…';
    requestObserverLocation(location => {
      const observer = createObserverLocation({ userId: 'current-user', groupId: 'current-group', location });
      renderObserverLocation(observer);
      status.textContent = `Location shared • ±${observer.accuracy_m ?? 'unknown'} m accuracy`;
    }, error => {
      status.textContent = error.code === 1 ? 'Location permission was not granted.' : `Location unavailable: ${error.message}`;
    });
  });
}

function renderObserverLocation(location) {
  const marker = L.marker([location.latitude, location.longitude], {icon: observerIcon()})
    .bindPopup(`<strong>My Observer Location</strong><br>Accuracy: ±${location.accuracy_m ?? 'unknown'} m<br>${new Date(location.timestamp).toLocaleString()}`)
    .addTo(observerLayer);
  allMarkers.push(marker);
  map.setView([location.latitude, location.longitude], Math.max(map.getZoom(), 15));
}

const fileInput=document.getElementById('chatFile');
const dropzone=document.getElementById('dropzone');
const processBtn=document.getElementById('processBtn');
const fileRow=document.getElementById('fileRow');
const fileName=document.getElementById('fileName');
let selectedFile=null;
function selectFile(file){selectedFile=file||null;if(!selectedFile){fileRow.hidden=true;processBtn.disabled=true;return;}fileName.textContent=`${selectedFile.name} (${Math.max(1,Math.round(selectedFile.size/1024))} KB)`;fileRow.hidden=false;processBtn.disabled=false;}
fileInput.addEventListener('change',e=>selectFile(e.target.files[0]));
dropzone.addEventListener('dragover',e=>{e.preventDefault();dropzone.style.borderColor='var(--accent)'});
dropzone.addEventListener('dragleave',()=>dropzone.style.borderColor='');
dropzone.addEventListener('drop',e=>{e.preventDefault();dropzone.style.borderColor='';selectFile(e.dataTransfer.files[0]);});
document.getElementById('clearFile').addEventListener('click',()=>{fileInput.value='';selectFile(null)});

processBtn.addEventListener('click',async()=>{
  if(!selectedFile)return;
  processBtn.disabled=true;processBtn.textContent='Processing…';
  const status=document.getElementById('statusText');status.textContent='Reading chat export locally…';
  try {
    const result=selectedFile.name.toLowerCase().endsWith('.zip') ? await inspectChatZip(selectedFile) : {fileName:selectedFile.name,totalFiles:1,media:[],images:[],videos:[],messages:[]};
    renderData({observers:[],observations:[],messages:result.messages,media:result.media});
    status.textContent=`Imported ${result.messages.length} messages and ${result.media.length} media files from ${result.fileName}. No locations were invented.`;
    processBtn.textContent='Processed';
  } catch (error) {
    console.error(error);status.textContent=`Could not process this export: ${error.message}`;processBtn.textContent='Try again';processBtn.disabled=false;
  }
});
document.getElementById('timeRange').addEventListener('input',e=>{document.getElementById('timeValue').textContent=e.target.value==='100'?'All':`${e.target.value}% of time range`;});
