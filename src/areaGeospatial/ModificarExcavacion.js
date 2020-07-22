import React, { Component } from "react";
import L from "leaflet";
import "./AreaGeoespacial.css";
import "leaflet/dist/leaflet.css";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  puntoDentroDeArea,
  dibujarPoligono,
  dibujarPuntosArea,
  verificarInclusionAreas
} from "./helpers";
import Descripcion from "./Descripcion";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

export default class ModificarExcavacion extends Component {
  constructor() {
    super();
    this.state = {
      marcadoresPoligonoExcavacion: [],
      areaDisabled: true,
      puntoDisabled: true
    };
  }

  componentDidMount() {
    const mapOptions = {
      center: [-38.9517, -68.0592],
      zoom: 14
    };

    const map = new L.map("map", mapOptions);
    L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png").addTo(map);
    this.setState({ map });

    this.obtenerExcavacion();
  }

  obtenerExcavacion = async () => {
    const idExcavacion = this.props.excavacionId;
    const response = await fetch(`/api/areaExcavacion/${idExcavacion}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (response.status !== 200) {
      return toast.error("La excavacion buscada no existe");
    }
    const excavacion = await response.json();
    const excavacionCompleta = excavacion.excavacion;

    let coordenadasExcavacion =
      excavacionCompleta.areaExcavacion.locacion.coordinates[0];
    coordenadasExcavacion = coordenadasExcavacion.map(c => ({
      lat: c[0],
      lng: c[1]
    }));
    let coordenadasExploracion =
      excavacionCompleta.areaExploracion.locacion.coordinates[0];
    coordenadasExploracion = coordenadasExploracion.map(c => ({
      lat: c[0],
      lng: c[1]
    }));
    const coordenadasPuntoGps = this.dibujarPuntoGPS(
      excavacionCompleta.puntoGps.coordinates
    );

    const poligonoExcavacion = this.dibujarPoligonoArea(
      coordenadasExcavacion,
      "green"
    );
    this.dibujarPoligonoArea(coordenadasExploracion);

    this.setState({
      idExploracion: excavacionCompleta.idExploracion,
      coordenadasExploracion,

      idExcavacion,
      poligonoExcavacion,
      coordenadasExcavacion,

      areaExcavacion: coordenadasExcavacion,
      coordenadasPuntoGps,
      puntoGps: excavacionCompleta.puntoGps.coordinates
    });
  };

  dibujarPoligonoArea = (coordenadasArea, color) =>
    dibujarPoligono(coordenadasArea, color, this.state.map);

  dibujarPuntoGPS = puntoGPS => {
    new L.popup({ elevation: 260.0 })
      .setLatLng([puntoGPS[0] + 0.002, puntoGPS[1] + 0.001])
      .setContent("Punto GPS Excavacion")
      .addTo(this.state.map);
    const nuevoMarcador = new L.Marker([puntoGPS[0], puntoGPS[1]], {
      draggable: "true"
    });

    nuevoMarcador.on("dragend", () => {
      this.setState({
        coordenadasPuntoGps: nuevoMarcador.getLatLng()
      });
    });

    this.state.map.addLayer(nuevoMarcador);
    this.setState({
      coordenadasPuntoGps: nuevoMarcador.getLatLng()
    });
    return nuevoMarcador;
  };

  setearCoordenadas = coordenadas =>
    this.setState({ coordenadasExcavacion: coordenadas });

  setearMarcadores = marcadores =>
    this.setState({ marcadoresPoligonoExcavacion: marcadores });

  habilitarBoton = () => this.setState({ areaDisabled: false });

  dibujarPuntos = (coordenadasState, marcadores) => {
    const coordenadasArea = this.state[coordenadasState];
    let marcadoresPoligono = this.state[marcadores];

    dibujarPuntosArea(
      coordenadasArea,
      marcadoresPoligono,
      this.state.map,
      this.setearCoordenadas,
      this.setearMarcadores,
      this.habilitarBoton
    );
  };

  modificarAreaExcavacion = () => {
    const { poligonoExcavacion } = this.state;
    this.state.map.removeLayer(poligonoExcavacion);
    this.dibujarPuntos("coordenadasExcavacion", "marcadoresPoligonoExcavacion");
    this.setState({
      modificarAreaExcavacion: true,
      areaDisabled: true
    });
  };

  verificarInclusionAreas = () => {
    return verificarInclusionAreas(
      this.state.coordenadasExcavacion,
      this.state.coordenadasExploracion
    );
  };

  guardarAreaExcavacion = async () => {
    const perteneceAExploracion = this.verificarInclusionAreas();

    if (perteneceAExploracion) {
      const contienePuntoGps = puntoDentroDeArea(
        this.state.coordenadasPuntoGps,
        this.state.coordenadasExcavacion
      );

      if (contienePuntoGps) {
        const body = {
          areaExcavacion: this.state.coordenadasExcavacion
        };

        this.hacerRequest(
          "modificarAreaExcavacion",
          "poligonoExcavacion",
          body,
          "Error al modificar el Area de Excavacion",
          "coordenadasExcavacion",
          "marcadoresPoligonoExcavacion"
        );
      } else {
        toast.error(
          "El area de Excavacion debe contenr al punto GPS de la excavacion"
        );
        this.restaurarAreaOriginal();
      }
    } else {
      toast.error(
        "El area de Excavacion debe estar contenida dentro del area de Exploracion"
      );
      this.restaurarAreaOriginal();
    }
  };

  restaurarAreaOriginal = () => {
    const poligonoActual = this.dibujarPoligonoArea(
      this.state.coordenadasExcavacion
    );
    this.state.map.removeLayer(poligonoActual);

    this.state.marcadoresPoligonoExcavacion.forEach(marcador =>
      this.state.map.removeLayer(marcador)
    );
    const poligono = this.dibujarPoligonoArea(
      this.state.areaExcavacion,
      "green"
    );

    this.setState({
      coordenadasExcavacion: this.state.areaExcavacion,
      marcadoresPoligono: [],
      modificarAreaExcavacion: false,
      poligonoExcavacion: poligono
    });
  };

  guardarPuntoGPSExcavacion = async () => {
    const pertenece = puntoDentroDeArea(
      this.state.coordenadasPuntoGps,
      this.state.coordenadasExcavacion
    );
    if (pertenece) {
      const body = {
        puntoGPSExcavacion: this.state.coordenadasPuntoGps
      };
      this.hacerRequest(
        null,
        null,
        body,
        "Error al modificar el punto GPS del Area de Excavacion"
      );
    } else {
      toast.error(
        "El punto GPS debe estar contenido dentro del area de Excavacion"
      );
      this.setState({
        coordenadasPuntoGps: this.state.puntoGps
      });
    }
  };

  hacerRequest = async (
    area,
    poligono,
    body,
    msjError,
    coordenadasArea,
    marcadoresPoligono
  ) => {
    const response = await fetch(
      `/api/areaExcavacion/${this.state.idExcavacion}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      }
    );

    if (response.status !== 200) {
      toast.error(msjError);
    } else {
      toast.success("Area de Excavacion modificada con exito");

      const resultado = await response.json();
      // console.log()

      this.props.setPuntoGpsExcavacion(resultado.puntoGps);
      this.props.setIdAreaExcavacion(resultado.idArea);

      if (coordenadasArea) {
        this.state[marcadoresPoligono].forEach(marcador =>
          this.state.map.removeLayer(marcador)
        );
        const poligonoArea = this.dibujarPoligonoArea(
          this.state[coordenadasArea],
          "green"
        );

        this.setState({
          [area]: false,
          areaExcavacion: poligonoArea.getLatLngs()[0],
          [poligono]: poligonoArea
        });
      }
    }
  };

  render() {
    return (
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
          <div className="button-container">
            {!this.state.modificarAreaExcavacion ? (
              <input
                type="button"
                style={{ width: "250px", height: "50px" }}
                value="Modificar Area Excavacion"
                className="btn btn-outline-primary"
                onClick={this.modificarAreaExcavacion}
              />
            ) : (
              <input
                type="button"
                style={{ width: "250px", height: "50px" }}
                value="Guardar Area Excavacion"
                disabled={this.state.areaDisabled}
                className="btn btn-outline-primary"
                onClick={this.guardarAreaExcavacion}
              />
            )}
          </div>
          <div className="button-container">
            <input
              type="button"
              style={{ width: "250px", height: "50px" }}
              value="Modificar Punto GPS Excavacion"
              className="btn btn-outline-primary"
              onClick={this.guardarPuntoGPSExcavacion}
            />
          </div>
          <Descripcion />
        </div>
      </div>
    );
  }
}
