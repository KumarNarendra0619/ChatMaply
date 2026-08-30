// BUILD-46: isolated project/workspace and dataset registry.
const workspaces=new Map();
const datasets=new Map();
const clean=v=>typeof v==='string'?v.trim():v;
const id=p=>`${p}-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
export function createWorkspace({name,description='',owner_id=null,privacy='PRIVATE'}={}){if(!clean(name))throw new Error('Workspace name is required.');const workspace={workspace_id:id('ws'),name:clean(name),description:clean(description),owner_id,privacy:String(privacy).toUpperCase(),created_at:new Date().toISOString(),status:'ACTIVE',dataset_ids:[]};workspaces.set(workspace.workspace_id,workspace);return {...workspace,dataset_ids:[]};}
export function createDataset({workspace_id,name,source_platform=null,version='1.0.0',record_count=0}={}){const ws=workspaces.get(workspace_id);if(!ws)throw new Error('Workspace not found.');if(!clean(name))throw new Error('Dataset name is required.');const dataset={dataset_id:id('ds'),workspace_id,name:clean(name),source_platform,version,record_count:Number.isFinite(Number(record_count))?Number(record_count):0,created_at:new Date().toISOString(),status:'ACTIVE'};datasets.set(dataset.dataset_id,dataset);ws.dataset_ids.push(dataset.dataset_id);return {...dataset};}
export function getWorkspace(workspace_id){const ws=workspaces.get(workspace_id);return ws?{...ws,dataset_ids:[...ws.dataset_ids]}:null;}
export function getDataset(dataset_id){const d=datasets.get(dataset_id);return d?{...d}:null;}
export function listWorkspaceDatasets(workspace_id){if(!workspaces.has(workspace_id))throw new Error('Workspace not found.');return [...datasets.values()].filter(d=>d.workspace_id===workspace_id).map(d=>({...d}));}
export function archiveWorkspace(workspace_id){const ws=workspaces.get(workspace_id);if(!ws)throw new Error('Workspace not found.');ws.status='ARCHIVED';for(const d of datasets.values())if(d.workspace_id===workspace_id)d.status='ARCHIVED';return getWorkspace(workspace_id);}
export function resetWorkspaceManager(){workspaces.clear();datasets.clear();}
