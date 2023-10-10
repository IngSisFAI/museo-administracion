import React, { Component } from "react";
import L from "leaflet";
import { ToastContainer, toast, Slide } from "react-toastify";

import "./AreaGeoespacial.css";
import "leaflet/dist/leaflet.css";
import "react-toastify/dist/ReactToastify.css";

import Locate from "leaflet.locatecontrol";
import { puntoDentroDeArea } from "./helpers";
import { agregarGrilla } from "./GrillaMapa";


const urlApi = procress.env.REACT_APP_API_HOST
// ver si se [uede reusar el metodo dibujar area del helper]


export default class ObtenerExcavacion extends Component {
    constructor() {
        super();
        this.state = {
            excavaciones: [],
            exploraciones: [],
            puntosGpsExcavaciones: [],
            capasExploracion: true,
            capasExcavacion: true,
            capasPuntosGps: true,
            datosPuntoGps: false,
            miUbicacion: false,
            grilla: false,
        };
    }

    componentDidMount() {
        const mapOptions = {
            center: [-38.9517, -68.0592],
            zoom: 13,
        };
        const map = new L.map("map", mapOptions);
        L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png").addTo(map);
        this.setState({ map });

        map.on("click", this.onClickMap);

        const opcionesLocacion = {
            strings: {
                title: "Mostrar mi ubicacion en el Mapa",
                popup: "Tu punto de ubicacion",
            },
            flyTo: true,
            keepCurrentZoomLevel: true,
            returnToPrevBounds: true,
            onActivate: () => {},
        };
        const controlLocacion = L.control
            .locate(opcionesLocacion)
            .addTo(this.props.map);
        this.setState({
            controlLocacion,
            map: this.props.map,
        });

        this.obtenerTodasExcavaciones();
    }

    // get excavacion y get exploraciondebe buscar los nombres correspondientes a los ids ciudad, provincia y pais

    onClickMap = (event) => {
        const datosAreaExcavacion = this.perteneceAlgunArea(
            "excavaciones",
            event.latlng
        );

        if (datosAreaExcavacion) {
            const datosExcavacion = `<p>Area Excavacion:
      <br />${datosAreaExcavacion.nombre}
      <br />EjemplaresLista: nombre - tipo</p>`;

            const nuevoPopUpExcavacion = new L.popup({ elevation: 260.0 })
                .setLatLng([event.latlng.lat, event.latlng.lng])
                .setContent(datosExcavacion);
            this.state.map.addLayer(nuevoPopUpExcavacion);
        } else {
            const datosAreaExploracion = this.perteneceAlgunArea(
                "exploraciones",
                event.latlng
            );

            if (datosAreaExploracion) {
                const datosExploracion = `<p>Area Exploración:
        <br />${datosAreaExploracion.nombre}¡¡¡</p>`;

                const nuevoPopUpExploracion = new L.popup({ elevation: 260.0 })
                    .setLatLng([event.latlng.lat, event.latlng.lng])
                    .setContent(datosExploracion);
                this.state.map.addLayer(nuevoPopUpExploracion);
            }
        }
    };

    perteneceAlgunArea = (datosAreas, punto) => {
        let datosAreaContenedora;

        this.state[datosAreas].forEach((area) => {
            const pertenece = puntoDentroDeArea(punto, area.coordenadas);
            if (pertenece) {
                datosAreaContenedora = area;
            }
        });
        return datosAreaContenedora;
    };

    obtenerTodasExcavaciones = async() => {
        const response = await fetch(
            //`http://museo.fi.uncoma.edu.ar:3006/api/areasExcavaciones`,
            `${urlApi}/areasExcavaciones`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (response.status !== 200) {
            return toast.error("No existen excavaciones cargadas");
        }

        const resultado = await response.json();
        const excavacionesCompletas = resultado.excavacionesCompletas;

        if (excavacionesCompletas.length) {
            excavacionesCompletas.forEach((excavacionCompleta) => {
                let coordenadasExcavacion =
                    excavacionCompleta.areaExcavacion.locacion.coordinates[0];
                coordenadasExcavacion = coordenadasExcavacion.map((c) => ({
                    lat: c[0],
                    lng: c[1],
                }));

                let coordenadasExploracion =
                    excavacionCompleta.areaExploracion.locacion.coordinates[0];
                coordenadasExploracion = coordenadasExploracion.map((c) => ({
                    lat: c[0],
                    lng: c[1],
                }));

                const poligonoExploracion = this.dibujarArea(coordenadasExploracion);
                const poligonoExcavacion = this.dibujarArea(
                    coordenadasExcavacion,
                    "green"
                );
                const marcador = this.dibujarPuntosGPS(
                    excavacionCompleta.puntoGps.coordinates
                );

                const datosExcavacion = {
                    nombre: excavacionCompleta.areaExcavacion.nombre,
                    ciudad: "Neuquen",
                    provincia: "Neuquen",
                    pais: "Argentina",
                    coordenadas: coordenadasExcavacion,
                    poligonoArea: poligonoExcavacion,
                };

                const datosExploracion = {
                    nombre: excavacionCompleta.areaExploracion.nombre,
                    ciudad: "Neuquen",
                    provincia: "Neuquen",
                    pais: "Argentina",
                    coordenadas: coordenadasExploracion,
                    poligonoArea: poligonoExploracion,
                };

                const datosPuntoGps = {
                    ciudad: "Neuquen",
                    provincia: "Neuquen",
                    pais: "Argentina",
                    coordenadas: marcador.getLatLng(),
                    marcador,
                };

                this.setState({
                    excavaciones: [...this.state.excavaciones, datosExcavacion],
                    exploraciones: [...this.state.exploraciones, datosExploracion],
                    puntosGpsExcavaciones: [
                        ...this.state.puntosGpsExcavaciones,
                        datosPuntoGps,
                    ],
                });
            });
        }
    };

    dibujarArea = (coordenadasArea, color, datosArea) => {
        if (!datosArea) {
            const coordinates = coordenadasArea.map((c) => ({
                lat: c.lat,
                lng: c.lng,
            }));
            const nuevoPoligono = L.polygon(coordinates, {
                color: color ? color : "#3388FF",
            });
            this.state.map.addLayer(nuevoPoligono);

            return nuevoPoligono;
        }
        this.state.map.addLayer(datosArea.poligonoArea);
    };

    dibujarPuntosGPS = (puntoGPS) => {
        if (!puntoGPS.marcador) {
            const nuevoMarcador = new L.Marker(
                [puntoGPS[0] || puntoGPS.lat, puntoGPS[1] || puntoGPS.lng], { draggable: "true" }
            );
            this.state.map.addLayer(nuevoMarcador);

            return nuevoMarcador;
        } else {
            this.state.map.addLayer(puntoGPS.marcador);
        }
    };

    handleInputChange = (campo, cbAgregarCapa, cbRemoverCapa) => {
        if (this.state[campo]) {
            cbRemoverCapa();
        } else {
            cbAgregarCapa();
        }
        this.setState({
            [campo]: !this.state[campo],
        });
    };

    handleInputArea = (campo, datosArea, color) => {
        if (this.state[campo]) {
            this.removerCapa(datosArea, "poligonoArea");
        } else {
            this.state[datosArea].forEach((area) => {
                this.dibujarArea(area.coordenadas, color, area);
            });
        }
        this.setState({
            [campo]: !this.state[campo],
        });
    };

    handleInputGps = (campo, datosArea) => {
        if (this.state[campo]) {
            this.removerCapa("puntosGpsExcavaciones", "marcador");
        } else {
            this.state[datosArea].forEach((area) => {
                this.dibujarPuntosGPS(area);
            });
        }
        this.setState({
            [campo]: !this.state[campo],
        });
    };

    handleInputDatosGps = (campo, datosPuntoGps) => {
        if (this.state[campo]) {
            this.removerCapa(datosPuntoGps, "popUpGps");
        } else {
            this.state[datosPuntoGps].forEach((puntoGps) => {
                this.agregarDatosPuntoGps(puntoGps);
            });
        }
        this.setState({
            [campo]: !this.state[campo],
        });
    };

    agregarDatosPuntoGps = (puntoGps) => {
        if (!puntoGps.popUpGps) {
            const datosPuntoGps = `<p>Punto GPS Excavacion:
      <br />${puntoGps.ciudad}
      <br />${puntoGps.provincia}
      <br />${puntoGps.pais}</p>`;

            const nuevoPopUpGps = new L.popup({ elevation: 260.0 })
                .setLatLng([puntoGps.coordenadas.lat + 0.001, puntoGps.coordenadas.lng])
                .setContent(datosPuntoGps);
            this.state.map.addLayer(nuevoPopUpGps);

            puntoGps.popUpGps = nuevoPopUpGps;
        } else {
            this.state.map.addLayer(puntoGps.popUpGps);
        }
    };

    removerCapa = (removerCapa, datosGeo) => {
        const capa = this.state[removerCapa];

        if (capa) {
            capa.forEach((c) => {
                this.state.map.removeLayer(c[datosGeo]);
            });
        }
    };

    agregarGrilla = () => {
        let { grilla } = this.state;

        if (!grilla) {
            grilla = agregarGrilla();
            this.setState({ grilla });
        }

        grilla.addTo(this.state.map);
    };

    removerGrilla = () => {
        this.state.map.removeLayer(this.state.grilla);
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
              <div style={{ marginBottom: 20 }}>
                Filtrar capas y Datos Geograficos:
              </div>{" "}
              <form>
                <label>
                  <input
                    name="capasExploracion"
                    type="checkbox"
                    checked={this.state.capasExploracion}
                    onChange={() =>
                      this.handleInputArea(
                        "capasExploracion",
                        "exploraciones",
                        ""
                      )
                    }
                  />
                  Capas de Exploracion{" "}
                </label>
                <label>
                  <input
                    name="capasExcavacion"
                    type="checkbox"
                    checked={this.state.capasExcavacion}
                    onChange={() =>
                      this.handleInputArea(
                        "capasExcavacion",
                        "excavaciones",
                        "green"
                      )
                    }
                  />
                  Capas de Excavacion{" "}
                </label>
                <label>
                  <input
                    name="capasPuntosGps"
                    type="checkbox"
                    checked={this.state.capasPuntosGps}
                    onChange={() =>
                      this.handleInputGps(
                        "capasPuntosGps",
                        "puntosGpsExcavaciones"
                      )
                    }
                  />
                  Puntos GPS de Excavaciones{" "}
                </label>
                <label>
                  <input
                    name="datosPuntoGps"
                    type="checkbox"
                    checked={this.state.datosPuntoGps}
                    onChange={() =>
                      this.handleInputDatosGps(
                        "datosPuntoGps",
                        "puntosGpsExcavaciones"
                      )
                    }
                  />
                  Mostrar Datos Punto GPS{" "}
                </label>
                <label>
                  <input
                    name="grillaVisible"
                    type="checkbox"
                    checked={this.state.grilla}
                    onChange={() =>
                      this.handleInputChange(
                        "grillaVisible",
                        () => this.agregarGrilla(),
                        () => this.removerGrilla()
                      )
                    }
                  />
                  Agregar Grilla{" "}
                </label>{" "}
              </form>{" "}
            </div>{" "}
          </div>
        );
    }
}