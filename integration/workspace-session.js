const KEY = 'chatmaply.active-workspace-v1';

export function createWorkspaceSession({ workspaceId = 'default-workspace', datasetId = 'default-dataset' } = {}) {
  return { workspace_id: workspaceId, dataset_id: datasetId, updated_at: new Date().toISOString() };
}

export function loadWorkspaceSession() {
  try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; }
}

export function saveWorkspaceSession(session) {
  const value = { ...session, updated_at: new Date().toISOString() };
  localStorage.setItem(KEY, JSON.stringify(value));
  return value;
}
