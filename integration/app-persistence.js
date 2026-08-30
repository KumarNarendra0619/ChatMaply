// ChatMaply runtime persistence hotfix.
// Keeps the active workspace/dataset state in IndexedDB and survives reloads.
const DB_NAME='chatmaply';
const DB_VERSION=2;
const STORE='app_state';
const KEY='active';

function openDb(){
  return new Promise((resolve,reject)=>{
    if(typeof indexedDB==='undefined') return reject(new Error('IndexedDB is unavailable.'));
    const req=indexedDB.open(DB_NAME,DB_VERSION);
    req.onupgradeneeded=()=>{
      const db=req.result;
      if(!db.objectStoreNames.contains('workspaces'))db.createObjectStore('workspaces');
      if(!db.objectStoreNames.contains('datasets'))db.createObjectStore('datasets');
      if(!db.objectStoreNames.contains('evidence'))db.createObjectStore('evidence');
      if(!db.objectStoreNames.contains('revisions'))db.createObjectStore('revisions');
      if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE);
    };
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error||new Error('Could not open ChatMaply storage.'));
  });
}

export async function loadAppState(){
  try{
    const db=await openDb();
    return await new Promise((resolve,reject)=>{
      const tx=db.transaction(STORE,'readonly');
      const req=tx.objectStore(STORE).get(KEY);
      req.onsuccess=()=>resolve(req.result||null);
      req.onerror=()=>reject(req.error);
    });
  }catch(err){
    console.warn('ChatMaply persistence unavailable:',err);
    return null;
  }
}

export async function saveAppState(state){
  const db=await openDb();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(STORE,'readwrite');
    tx.objectStore(STORE).put(structuredClone(state),KEY);
    tx.oncomplete=()=>resolve(true);
    tx.onerror=()=>reject(tx.error||new Error('Could not save ChatMaply state.'));
  });
}

export async function clearAppState(){
  const db=await openDb();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(STORE,'readwrite');
    tx.objectStore(STORE).delete(KEY);
    tx.oncomplete=()=>resolve(true);
    tx.onerror=()=>reject(tx.error);
  });
}
