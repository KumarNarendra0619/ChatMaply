// BUILD-13: lightweight Cesium globe view. Uses stored/verified elevation only.
// No terrain token is required for the base globe. A production DEM can be wired through terrain-provider.js.

let viewer = null;
let dataSource = null;

export async function initGlobe(containerId = 'globe') {
  if (!window.Cesium) throw new Error('Cesium library is not loaded.');
  viewer = new Cesium.Viewer(containerId, {
    animation: false,
    timeline: false,
    baseLayerPicker: false,
    geocoder: false,
    homeButton: true,
    sceneModePicker: false,
    navigationHelpButton: false,
    fullscreenButton: false
  });
  viewer.scene.globe.enableLighting = false;
  viewer.scene.globe.depthTestAgainstTerrain = false;
  dataSource = new Cesium.CustomDataSource('chatmaply-observations');
  viewer.dataSources.add(dataSource);
  return viewer;
}

function pointColor(observation) {
  if (observation.condition === 'Severe') return Cesium.Color.RED;
  if (observation.condition === 'Poor') return Cesium.Color.ORANGE;
  if (observation.confidence === 'Estimated') return Cesium.Color.YELLOW;
  return Cesium.Color.CYAN;
}

export function renderGlobeObservations(observations = []) {
  if (!viewer || !dataSource) throw new Error('Globe is not initialized.');
  dataSource.entities.removeAll();
  observations.forEach(o => {
    const lat = Number(o.latitude ?? o.lat);
    const lon = Number(o.longitude ?? o.lng);
    const height = Number(o.terrain?.elevation_m ?? o.elevation_m ?? o.elevation);
    if (![lat, lon, height].every(Number.isFinite)) return;
    dataSource.entities.add({
      id: `obs-${o.id}`,
      position: Cesium.Cartesian3.fromDegrees(lon, lat, height),
      point: { pixelSize: 10, color: pointColor(o), outlineColor: Cesium.Color.WHITE, outlineWidth: 2 },
      properties: {
        title: o.type || 'Observation',
        time: o.timestamp || o.time || '',
        elevation_m: height,
        accuracy_m: o.accuracy ?? o.accuracy_m ?? null,
        condition: o.condition || 'Unknown',
        confidence: o.confidence || 'Unknown'
      },
      description: `<strong>${o.type || 'Observation'}</strong><br>Elevation: ${height} m<br>Accuracy: ±${o.accuracy ?? o.accuracy_m ?? 'unknown'} m<br>Condition: ${o.condition || 'Unknown'}<br>Confidence: ${o.confidence || 'Unknown'}<br>${o.time || o.timestamp || ''}`
    });
  });
  if (dataSource.entities.values.length) viewer.flyTo(dataSource.entities);
}

export function destroyGlobe() {
  if (viewer) { viewer.destroy(); viewer = null; dataSource = null; }
}
