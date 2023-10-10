import React, { Component } from "react";
import L from "leaflet";
import { ToastContainer, toast, Slide } from "react-toastify";

import "./AreaGeoespacial.css";
import "leaflet/dist/leaflet.css";
import "react-toastify/dist/ReactToastify.css";

import { dibujarPoligono, puntoDentroDeArea } from "./helpers";
import Descripcion from "./Descripcion";

delete L.Icon.Default.prototype._getIconUrl;

const urlApi = process.env.REACT_APP_API_HOST


L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

export default class CrearExcavacion extends Component {
  constructor() {
    super();
    this.state = {
      points: [],
      markers: [],
      areaExcavacion: null,
      areaExploracion: null,
      puntoGPSExcavacion: null,
      setAreaDisabled: true,
      setPuntoGpsDisabled: true,
      poligonoExploracion: null,
      idExploracion: ""
    };
  }

  componentDidMount() {
    var calles = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
       subdomains:['mt0','mt1','mt2','mt3']
   })
   
   var satelite = L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
       maxZoom: 20,
       subdomains:['mt0','mt1','mt2','mt3']
   })

   const mapOptions = {
       center: [-38.9517, -68.0592],
       zoom: 14,
       layers: [satelite,calles]
   };
   const map = new L.map("map", mapOptions);
   L.control.layers({"Satelite": satelite,"Ciudad": calles}).addTo(map).setPosition('topleft');
  this.setState({ map });

  map.on("click", this.onClickMap);

  
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.idExploracion !== this.props.idExploracion) {
      if (this.state.poligonoExploracion) {
        this.state.map.removeLayer(this.state.poligonoExploracion);
      }
      this.obtenerExploracion(nextProps.idExploracion);
    }
  }

  onClickMap = event => {
    const { lat, lng } = event.latlng;
    const marker = new L.Marker([event.latlng.lat, event.latlng.lng], {
      draggable: "true"
    }).addTo(this.state.map);

    this.setState({
      points: [...this.state.points, { lat, lng }],
      markers: [...this.state.markers, marker],
      setAreaDisabled: !!this.state.areaExcavacion,
      setPuntoGpsDisabled:
        !this.state.areaExcavacion && !this.state.puntoGPSExcavacion
    });
  };

  obtenerExploracion = async idExploracion => {
    const exploracionId = idExploracion;

    const response = await fetch(`${urlApi}/areaExploracion/${exploracionId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (response.status !== 200) {
      return toast.error("No existe la exploracion buscada");
    }

    const resultado = await response.json();
    const exploracion = resultado.exploracion;
    this.setState({
      areaExploracion: exploracion.areaExploracion.locacion.coordinates[0],
      areasExcavaciones: exploracion.excavaciones,
      idExploracion:  exploracionId
    });

    const poligonoExploracion = dibujarPoligono(
      exploracion.areaExploracion.locacion.coordinates[0],
      "",
      this.state.map
    );

    this.setState({ poligonoExploracion });
 /*   exploracion.excavaciones.forEach(excavacion => {
      dibujarPoligono(
        excavacion.areaExcavacion.locacion.coordinates[0],
        "green",
        this.state.map
      );
    });*/
  };

  setearPuntoExcavacion = () => {
    console.log('testing')
    if (
      this.state.areaExcavacion &&
      !this.state.puntoGPSExcavacion &&
      this.state.points[0]
    ) {
      const puntosArea = this.state.areaExcavacion.getLatLngs()[0];
      const pertenece = puntoDentroDeArea(this.state.points[0], puntosArea);

      if (pertenece) {
        this.setState({
          puntoGPSExcavacion: this.state.points[0],
          points: [],
          setPuntoGpsDisabled: true
        });
      } else {
        toast.error(
          "Error: El punto GPS de la Excavacion debe estar contenido dentro del area"
        );
        this.setState({
          points: []
        });

        this.state.markers.forEach(marker =>
          this.state.map.removeLayer(marker)
        );
      }
    } else if (!this.state.puntoGPSExcavacion) {
      this.setState({
        puntoGPSExcavacion: this.state.points[0],
        points: []
      });
    } else {
      this.setState({
        points: []
      });
    }
  };

  setearAreaExcavacion = () => {
    const puntosExcavacion = L.polygon(this.state.points, { color: "green" });
    const areaExcavacion = puntosExcavacion.getLatLngs()[0];
    let pertenece = true;

    if (this.state.areaExploracion) {
      for (var i = 0; i < areaExcavacion.length && pertenece; i++) {
        pertenece = puntoDentroDeArea(
          areaExcavacion[i],
          this.state.areaExploracion
        );
      }
    }

    if (pertenece) {
      if (this.state.puntoGPSExcavacion) {
        pertenece = puntoDentroDeArea(
          this.state.puntoGPSExcavacion,
          areaExcavacion
        );

        if (!pertenece) {
          toast.error(
            "Error: El area de la Excavacion debe contener al punto GPS de excavacion"
          );
          this.setState({
            points: []
          });
          this.state.markers.forEach(marker =>
            this.state.map.removeLayer(marker)
          );

          return;
        }
      }
      this.state.map.addLayer(puntosExcavacion);
      this.state.markers.forEach(marker => this.state.map.removeLayer(marker));

      this.setState({
        areaExcavacion: puntosExcavacion,
        points: [],
        markers: [],
        setAreaDisabled: true
      });
    } else {
      toast.error(
        "Error: El area de la Excavacion debe estar contenida dentro del area de la Exploracion"
      );
      this.setState({
        points: []
      });
      this.state.markers.forEach(marker => this.state.map.removeLayer(marker));
    }
  };

  altaExcavacion = async () => {
    if (!this.state.areaExcavacion) {
      return toast.error(
        "El area de Excavacion debe estar seteada para su creacion"
      );
    }
    const body = {
      puntoGPSExcavacion: this.state.puntoGPSExcavacion,
      areaExcavacion: this.state.areaExcavacion.getLatLngs()[0],
      exploracionId: this.state.idExploracion // -----
    };

    console.log(body)
    const response = await fetch(`${urlApi}/areaExcavacion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (response.status !== 200) {
      toast.error("Error al crear la excavacion");
    } else {
      toast.success("Area de Excavacion creada con exito");

      const resultado = await response.json();
      console.log("Resultado: ", resultado)
      this.props.setIdAreaExcavacion(resultado.areaId);
      this.props.setPuntoGpsExcavacion(resultado.puntoGps);
    }
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
          de Excavacion y su nuevo Punto GPS
          <div className="button-container">
            <input
              type="button"
              value="Setear nueva Area"
              style={{ width: "200px", height: "50px" }}
              disabled={this.state.setAreaDisabled}
              className="btn btn-outline-primary"
              onClick={this.setearAreaExcavacion}
            />
          </div>
          <div className="button-container">
            <input
              type="button"
              value="Setear nuevo Punto GPS"
              style={{ width: "200px", height: "50px" }}
              disabled={this.state.setPuntoGpsDisabled}
              className="btn btn-outline-primary"
              onClick={this.setearPuntoExcavacion}
            />
          </div>
          <div className="button-container">
            <input
              type="button"
              disabled={
                !(this.state.puntoGPSExcavacion && this.state.areaExcavacion)
              }
              style={{ width: "200px", height: "50px" }}
              className="btn btn-outline-primary"
              onClick={this.altaExcavacion}
              value="Alta Area de Excavacion"
            />
          </div>
          <Descripcion />
        </div>
      </div>
      </div>
    );
  }
}
