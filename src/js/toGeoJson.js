function toGeoJson(data) {
  const outGeoJson = {
    type: 'FeatureCollection',
    features: [],
  };
  for (let i =0; i < data.length; i++) {
    const coordA = parseFloat(data[i]['coordA']);
    const coordB = parseFloat(data[i]['coordB']);
    const tempObj = {};
    tempObj['properties'] = data[i];
    tempObj['type']= 'Feature';
    tempObj['geometry']= {'type': 'Point', 'coordinates': [coordA, coordB]};
    outGeoJson['features'].push(tempObj);
  }
  return outGeoJson;
}
