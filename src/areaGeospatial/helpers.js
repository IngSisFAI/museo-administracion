import L from "leaflet";

export const puntoDentroDeArea = (punto, puntosArea) => {
  let inside = false,
    i,
    j,
    xi,
    yi,
    xj,
    yj,
    intersect;
  const x = punto.lat ? punto.lat : punto.getLatLng() && punto.getLatLng().lat;
  const y = punto.lng ? punto.lng : punto.getLatLng() && punto.getLatLng().lng;

  for (i = 0, j = puntosArea.length - 1; i < puntosArea.length; j = i++) {
    xi = puntosArea[i].lat || puntosArea[i][0];
    yi = puntosArea[i].lng || puntosArea[i][1];
    xj = puntosArea[j].lat || puntosArea[j][0];
    yj = puntosArea[j].lng || puntosArea[j][1];

    intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) {
      inside = !inside;
    }
  }
  return inside;
};

export const dibujarPoligono = (coordenadasArea, color, mapa) => {
  const coordinates = coordenadasArea.map(c => ({
    lat: c.lat || c[0],
    lng: c.lng || c[1]
  }));
  const nuevoPoligono = L.polygon(coordinates, {
    color: color ? color : "#3388FF"
  });
  mapa.addLayer(nuevoPoligono);

  return nuevoPoligono;
};

export const dibujarPuntosArea = (
  coordenadasArea,
  marcadoresPoligono,
  mapa,
  setearCoordenadas,
  setearMarcadores,
  habilitarBoton
) => {
  let coordenadas = [...coordenadasArea];
  let marcadorModificado;

  coordenadasArea.forEach(c => {
    const marcador = new L.Marker([c.lat, c.lng], { draggable: "true" });
    marcadoresPoligono = [...marcadoresPoligono, marcador];

    marcador.on("dragstart", () => {
      const posicion = marcador.getLatLng();
      marcadorModificado = coordenadas.find(
        m => m.lat === posicion.lat && m.lng === posicion.lng
      );
    });

    marcador.on("dragend", () => {
      const posicion = marcador.getLatLng();
      const i = coordenadas.indexOf(marcadorModificado);
      const nuevoMarcador = {
        lat: posicion.lat,
        lng: posicion.lng
      };
      coordenadas.splice(i, 0, nuevoMarcador);
      coordenadas.splice(i + 1, 1);

      setearCoordenadas(coordenadas);
      setearMarcadores(marcadoresPoligono);
      habilitarBoton();
    });

    mapa.addLayer(marcador);
  });
};

export const verificarInclusionAreas = (coorInternas, coorContenedoras) => {
  let pertenece = true;
  for (var i = 0; i < coorInternas.length && pertenece; i++) {
    pertenece = puntoDentroDeArea(coorInternas[i], coorContenedoras);
  }
  return pertenece;
};
