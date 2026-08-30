// BUILD-53: durable browser persistence adapter for ChatMaply.
// Implements the same logical contract used by PersistentStore without coupling
// domain code to IndexedDB APIs.

export class IndexedDBPersistenceAdapter {
  constructor({ dbName='chatmaply', version=1 } = {}) {
    this.dbName = dbName;
    this.version = version;
    this.stores = ['workspaces','datasets','evidence','revisions'];
    this.dbPromise = null;
  }

  open() {
    if (this.dbPromise) return this.dbPromise;
    if (typeof indexedDB === 'undefined') {
      return Promise.reject(new Error('IndexedDB is unavailable in this environment.'));
    }
    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      request.onupgradeneeded = () => {
        const db = request.result;
        for (const name of this.stores) {
          if (!db.objectStoreNames.contains(name)) db.createObjectStore(name);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    return this.dbPromise;
  }

  async put(table, id, value) {
    if (!id) throw new Error('Record id is required.');
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(table, 'readwrite');
      tx.objectStore(table).put(structuredClone(value), id);
      tx.oncomplete = () => resolve(structuredClone(value));
      tx.onerror = () => reject(tx.error);
    });
  }

  async get(table, id) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(table, 'readonly');
      const request = tx.objectStore(table).get(id);
      request.onsuccess = () => resolve(request.result === undefined ? null : structuredClone(request.result));
      request.onerror = () => reject(request.error);
    });
  }

  async list(table) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(table, 'readonly');
      const request = tx.objectStore(table).getAll();
      request.onsuccess = () => resolve(request.result.map(v => structuredClone(v)));
      request.onerror = () => reject(request.error);
    });
  }

  async delete(table, id) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(table, 'readwrite');
      tx.objectStore(table).delete(id);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }

  async clear() {
    const db = await this.open();
    return Promise.all(this.stores.map(name => new Promise((resolve, reject) => {
      const tx = db.transaction(name, 'readwrite');
      tx.objectStore(name).clear();
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    })));
  }
}
