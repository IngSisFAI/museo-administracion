import React, { Component } from "react";
import L from "leaflet";
import { ToastContainer, toast, Slide } from "react-toastify";

import Menu from "../components/Menu";
import "./AreaGeoespacial.css";
import "leaflet/dist/leaflet.css";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "universal-cookie";
import Locate from "leaflet.locatecontrol";
import { puntoDentroDeArea, dibujarPoligono } from "./helpers";
import { agregarGrilla } from "./GrillaMapa";

const urlApi = process.env.REACT_APP_API_HOST;
const cookies = new Cookies();
export default class ObtenerExcavacion extends Component {
  constructor() {
    super();
    this.state = {
      exploraciones: [],
      puntosGpsExcavaciones: [],
      denuncias: [],
      capasExploracion: true,
      capasExcavacion: true,
      capasPuntosGps: true,
      datosPuntoGps: false,
      datosDenuncias: true,
      miUbicacion: false,
      grilla: false,
    };
  }

  componentDidMount() {
    //var calles = L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png");
    var calles = L.tileLayer(
      "https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
      {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
      }
    );

    var satelite = L.tileLayer(
      "https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}",
      {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
      }
    );

    const mapOptions = {
      center: [-38.9517, -68.0592],
      zoom: 13,
      layers: [satelite, calles],
    };
    const map = new L.map("map", mapOptions);
    L.control
      .layers({ Satelite: satelite, Ciudad: calles })
      .addTo(map)
      .setPosition("topleft");

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
    const controlLocacion = L.control.locate(opcionesLocacion).addTo(map);
    this.setState({
      controlLocacion,
      map,
    });

    this.obtenerTodasExploraciones();
    this.obtenerTodasDenuncias();
  }

  onClickMap = (event) => {
    const datosAreaExcavacion = this.perteneceAlgunArea(
      "excavaciones",
      event.latlng
    );

    if (datosAreaExcavacion) {
      const datosExcavacion = `<p><b>Area Excavación</b>
      <br />Nombre Area: ${datosAreaExcavacion.nombre}
      <br />Ejemplares: nombre - tipo
      </p>`;

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
        const fechaExploracion = new Date(datosAreaExploracion.fecha);
        const dia = fechaExploracion.getDate();
        const mes = fechaExploracion.getMonth() + 1; // Sumamos 1 para ajustar el índice de los meses
        const anio = fechaExploracion.getFullYear();
        const datosExploracion = `<p><b>Area Exploración</b>
        <br />Nombre Area: ${datosAreaExploracion.nombre}
        <br />Fecha: ${dia}/${mes}/${anio}
        </p>`;

        const nuevoPopUpExploracion = new L.popup({ elevation: 260.0 })
          .setLatLng([event.latlng.lat, event.latlng.lng])
          .setContent(datosExploracion);
        this.state.map.addLayer(nuevoPopUpExploracion);
      } else {
        const datosAreaDenuncia = this.perteneceAlgunArea(
          "denuncias",
          event.latlng
        );

        if (datosAreaDenuncia) {
          const fechaDenuncia = new Date(datosAreaDenuncia.fecha);
          const dia = fechaDenuncia.getDate();
          const mes = fechaDenuncia.getMonth() + 1; // Sumamos 1 para ajustar el índice de los meses
          const anio = fechaDenuncia.getFullYear();
          const datosDenuncia = `<p><b>Area Denuncia</b>
        <br />Denunciante: ${datosAreaDenuncia.denunciante}
        <br />Fecha Denuncia: ${dia}/${mes}/${anio}
        <br />Paleontologo: ${datosAreaDenuncia.paleontologo}
        </p>`;

          const nuevoPopUpDenuncia = new L.popup({ elevation: 260.0 })
            .setLatLng([event.latlng.lat, event.latlng.lng])
            .setContent(datosDenuncia);
          this.state.map.addLayer(nuevoPopUpDenuncia);
        }
      }
    }
  };

  perteneceAlgunArea = (datosAreas, punto) => {
    let datosAreaContenedora;
    console.log(this.state[datosAreas]);
    this.state[datosAreas].forEach((area) => {
      const pertenece = puntoDentroDeArea(punto, area.coordenadas);
      if (pertenece) {
        datosAreaContenedora = area;
      }
    });
    console.log(datosAreaContenedora);
    return datosAreaContenedora;
  };

  obtenerTodasDenuncias = async () => {
    const response = await fetch(`${urlApi}/denuncias`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + cookies.get("token"),
      },
    });
    if (response.status !== 200) {
      return toast.error("No existen denuncias cargadas en el sistema");
    }

    const resultado = await response.json();
    const denuncias = resultado.denuncias;
    let denunciasResultado = [];
    denuncias.forEach(async (denuncia) => {
      console.log(denuncia);

      const response2 = await fetch(`${urlApi}/area/${denuncia.idArea}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + cookies.get("token"),
        },
      });
      if (response2.status !== 200) {
        return toast.error("Error la cargar denuncia");
      } else {
        const resultado2 = await response2.json();
        const area = resultado2.area;

        let coodenadasDenuncia = area.locacion.coordinates[0];
        coodenadasDenuncia = coodenadasDenuncia.map((c) => ({
          lat: c[0],
          lng: c[1],
        }));
        const poligonoDenuncia = this.dibujarPoligonoArea(
          coodenadasDenuncia,
          "yellow"
        );

        const datosDenuncia = {
          denunciante: denuncia.denunciante,
          fecha: denuncia.fechaIngreso,
          paleontologo: denuncia.paleontologo,
          poligonoArea: poligonoDenuncia,
          coordenadas: coodenadasDenuncia,
        };

        denunciasResultado = [...denunciasResultado, datosDenuncia];

        //console.log(area)
      }
      this.setState({
        denuncias: denunciasResultado,
      });
    });
  };

  obtenerTodasExploraciones = async () => {
    const response = await fetch(
      //"http://museo.fi.uncoma.edu.ar:3006/api/areaExploracion",
      // `${urlApi}/areasExcavaciones`, {
      `${urlApi}/areaExploracion`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status !== 200) {
      return toast.error(
        "No existen areas de exploracion cargadas en el sistema"
      );
    }

    const resultado = await response.json();
    const exploracionesCompletas = resultado.exploraciones;

    if (exploracionesCompletas.length) {
      let poligonosExcavaciones = [],
        coordenadasExcavaciones = [],
        excavaciones = [],
        exploraciones = [],
        puntosGpsExcavaciones = [];

      exploracionesCompletas.forEach((exploracionCompleta) => {
        let coordenadasExploracion =
          exploracionCompleta.areaExploracion != {}
            ? exploracionCompleta.areaExploracion.locacion.coordinates[0]
            : [];
        // if (coordenadasExploracion != [])
        coordenadasExploracion = coordenadasExploracion.map((c) => ({
          lat: c[0],
          lng: c[1],
        }));
        const poligonoExploracion = this.dibujarPoligonoArea(
          coordenadasExploracion
        );

        let coordenadas;
        exploracionCompleta.excavaciones.forEach((excavacion) => {
          if (excavacion.idArea != "") {
            coordenadas = excavacion.areaExcavacion.locacion.coordinates[0];
            coordenadas = coordenadas.map((c) => ({ lat: c[0], lng: c[1] }));

            let poligono = this.dibujarPoligonoArea(coordenadas, "green");
            poligonosExcavaciones = [...poligonosExcavaciones, poligono];
            coordenadasExcavaciones = [...coordenadasExcavaciones, coordenadas];

            const datosExcavacion = {
              nombre: excavacion.nombreArea,
              ciudad: "Neuquen", //excavacion.localidad
              provincia: "Neuquen", //excavacion.provincia
              pais: "Argentina", //excavacion.pais
              coordenadas,
              poligonoArea: poligono,
            };
            excavaciones = [...excavaciones, datosExcavacion];

            const marcador = this.dibujarPuntosGPS(
              excavacion.puntoGps.coordinates
            );
            const datosPuntoGps = {
              ciudad: "Neuquen",
              provincia: "Neuquen",
              pais: "Argentina",
              coordenadas: marcador.getLatLng(),
              marcador,
            };
            puntosGpsExcavaciones = [...puntosGpsExcavaciones, datosPuntoGps];
          }
        });

        const datosExploracion = {
          nombre: exploracionCompleta.areaExploracion.nombre,
          ciudad: exploracionCompleta.areaExploracion
            ? exploracionCompleta.areaExploracion.ciudad
            : "Neuquen",
          provincia: exploracionCompleta.areaExploracion
            ? exploracionCompleta.areaExploracion.provincia
            : "Neuquen",
          pais: exploracionCompleta.areaExploracion
            ? exploracionCompleta.areaExploracion.pais
            : "Argentina",
          fecha: exploracionCompleta.areaExploracion.fecha,
          coordenadas: coordenadasExploracion,
          poligonoArea: poligonoExploracion,
        };
        exploraciones = [...exploraciones, datosExploracion];
        this.setState({
          excavaciones,
          exploraciones,
          puntosGpsExcavaciones,
        });
      });
    }
  };

  dibujarPoligonoArea = (coordenadasArea, color, datosArea) => {
    if (!datosArea) {
      return dibujarPoligono(coordenadasArea, color, this.state.map);
    }
    this.state.map.addLayer(datosArea.poligonoArea);
  };

  dibujarPuntosGPS = (puntoGPS) => {
    if (!puntoGPS.marcador) {
      const nuevoMarcador = new L.Marker(
        [puntoGPS[0] || puntoGPS.lat, puntoGPS[1] || puntoGPS.lng],
        { draggable: "true" }
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
        this.dibujarPoligonoArea(area.coordenadas, color, area);
      });
    }
    this.setState({
      [campo]: !this.state[campo],
    });
  };

  handleInputDatosDenuncias = (campo, datosArea, color) => {
    if (this.state[campo]) {
      this.removerCapa(datosArea, "poligonoArea");
    } else {
      this.state[datosArea].forEach((area) => {
        this.dibujarPoligonoArea(area.coordenadas, color, area);
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
      const datosPuntoGps = `<p><b>Punto GPS Excavacion</b>
      <br />Ciudad: ${puntoGps.ciudad}
      <br />Provincia: ${puntoGps.provincia}
      <br />Pais: ${puntoGps.pais}</p>`;

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

    this.setState({ grilla: false });
  };

  render() {
    return (
      <>
        <Menu />
        <div className="datos-geograficos-contenedor">
          <h1> Datos Geográficos </h1>
          <div className="principal">
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
              </div>
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
                  Capas de Excavacion
                </label>

                <label>
                  <input
                    name="datosDenuncias"
                    type="checkbox"
                    checked={this.state.datosDenuncias}
                    onChange={() =>
                      this.handleInputDatosDenuncias(
                        "datosDenuncias",
                        "denuncias",
                        "yellow"
                      )
                    }
                  />
                  Capas de Denuncias
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
                  Puntos GPS de Excavaciones
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
                  Mostrar Datos Punto GPS
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
                </label>
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }
}
