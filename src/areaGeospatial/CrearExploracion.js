import React, { Component } from "react";
import L from "leaflet";
import { ToastContainer, toast, Slide } from "react-toastify";

import "./AreaGeoespacial.css";
import "leaflet/dist/leaflet.css";
import "react-toastify/dist/ReactToastify.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

export default class CrearExploracion extends Component {
  constructor() {
    super();
    this.state = {
      points: [],
      markers: [],
      areaExploracion: null,
      areaDisabled: true
    };
  }

  componentDidMount() {
    const mapOptions = {
      center: [-38.9517, -68.0592],
      zoom: 13
    };
    const map = new L.map("map", mapOptions);
    L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png").addTo(map);
    this.setState({ map });
    map.on("click", this.onClickMap);
  }

  onClickMap = event => {
    const { lat, lng } = event.latlng;
    const marker = new L.Marker([event.latlng.lat, event.latlng.lng], {
      draggable: "true"
    }).addTo(this.state.map);

    this.setState({
      points: [...this.state.points, { lat, lng }],
      markers: [...this.state.markers, marker],
      areaDisabled: false
    });
  };

  crearArea = () => {
    const polygon = L.polygon(this.state.points);
    this.state.map.addLayer(polygon);
    this.state.markers.forEach(marker => this.state.map.removeLayer(marker));

    return polygon;
  };

  setearAreaExploracion = () => {
    const areaExploracion = this.crearArea();

    this.setState({
      areaExploracion,
      points: [],
      markers: []
    });
    return areaExploracion;
  };

  altaExploracion = async () => {
    const poligonoExploracion = this.setearAreaExploracion();

    const body = {
      areaExploracion: poligonoExploracion.getLatLngs()[0]
    };

    const response = await fetch("http://museo.fi.uncoma.edu.ar:3006/api/areaExploracion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (response.status !== 200) {
      toast.error("Error al crear el Area de Exploracion");
    } else {
      toast.success("Area de Exploracion creada con exito");
    }
    const resultado = await response.json();
    this.props.setAreaId(resultado.exploracion.areaId);
  };

  render() {
    return (
      <div className="container">
      <div style={{ position: "relative" }}>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          transition={Slide}
          hideProgressBar={true}
          newestOnTop={true}
          closeOnClick
          pauseOnHover
        />
        <div id="map" className="contenedorMapa" />

        <div className="contenedorMenu">
          Hacer click en el mapa para setear los puntos limites del nuevo Area
          de Exploracion
          <div className="button-container">
            <input
              style={{ width: "200px", height: "50px" }}
              type="button"
              disabled={this.state.areaDisabled}
              className="btn btn-outline-primary"
              onClick={this.altaExploracion}
              value="Alta Area Exploracion"
            />
          </div>
        </div>
      </div>
      </div>    
    );
  }
}
