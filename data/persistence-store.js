// BUILD-52: deterministic persistence abstraction for ChatMaply.
// Uses an injectable adapter so the domain layer is not coupled to a browser or database.
export class PersistenceError extends Error {
  constructor(message, code='PERSISTENCE_ERROR') { super(message); this.name='PersistenceError'; this.code=code; }
}

export class MemoryPersistenceAdapter {
  constructor() { this.tables = new Map(); }
  _table(name) { if (!this.tables.has(name)) this.tables.set(name, new Map()); return this.tables.get(name); }
  put(table, id, value) { if (!id) throw new PersistenceError('Record id is required.','INVALID_ID'); this._table(table).set(id, structuredClone(value)); return structuredClone(value); }
  get(table, id) { const v=this._table(table).get(id); return v===undefined?null:structuredClone(v); }
  list(table) { return [...this._table(table).values()].map(v=>structuredClone(v)); }
  delete(table, id) { return this._table(table).delete(id); }
  clear() { this.tables.clear(); }
}

export class PersistentStore {
  constructor(adapter=new MemoryPersistenceAdapter()) { this.adapter=adapter; }
  saveWorkspace(workspace) { return this.adapter.put('workspaces',workspace.workspace_id,workspace); }
  saveDataset(dataset) { return this.adapter.put('datasets',dataset.dataset_id,dataset); }
  saveEvidence(evidence) {
    if (!evidence?.workspace_id || !evidence?.dataset_id) throw new PersistenceError('Evidence requires workspace_id and dataset_id.','MISSING_SCOPE');
    return this.adapter.put('evidence',evidence.evidence_id,evidence);
  }
  saveRevision(revision) { return this.adapter.put('revisions',revision.revision_id,revision); }
  getEvidence(id) { return this.adapter.get('evidence',id); }
  listEvidence(workspace_id,dataset_id=null) {
    if (!workspace_id) throw new PersistenceError('workspace_id is required.','MISSING_WORKSPACE');
    return this.adapter.list('evidence').filter(e=>e.workspace_id===workspace_id && (dataset_id===null || e.dataset_id===dataset_id));
  }
  snapshot() {
    return {
      workspaces:this.adapter.list('workspaces'),
      datasets:this.adapter.list('datasets'),
      evidence:this.adapter.list('evidence'),
      revisions:this.adapter.list('revisions')
    };
  }
  clear() { this.adapter.clear(); }
}
