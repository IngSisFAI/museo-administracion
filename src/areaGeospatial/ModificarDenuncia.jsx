import React, { Component } from "react";
import L from "leaflet";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AreaGeoespacial.css";
import "leaflet/dist/leaflet.css";

import {
  dibujarPoligono,
  dibujarPuntosArea,
  verificarInclusionAreas,
} from "./helpers";
import Descripcion from "./Descripcion";

delete L.Icon.Default.prototype._getIconUrl;

const urlApi = process.env.REACT_APP_API_HOST;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default class ModificarDenuncia extends Component {
  constructor() {
    super();
    this.state = {
      marcadoresPoligonoArea: [],
      marcadoresPoligonoExcavacion: [],
      areaDisabled: true,
      latInicio: -38.9517,
      lngInicio: -68.0592,
      mostrarBotonera: true
    };
  }

  componentDidMount() {
    //console.log(this.state.latInicio, this.state.lngInicio)
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
       zoom: 13,
       layers: [satelite,calles]
   };
   const map = new L.map("map", mapOptions);
   L.control.layers({"Satelite": satelite,"Ciudad": calles}).addTo(map).setPosition('topleft');
    this.setState({ map });

    map.on("click", this.onClickMap);
    this.setState({ map });

    this.obtenerAreaDenuncia();

    if(this.props.show){
      this.setState({mostrarBotonera:false})
  }
  }

  obtenerAreaDenuncia = async () => {
    const idArea = this.props.AreaDenunciaId;
    console.log(idArea);
    //const response = await fetch(`http://museo.fi.uncoma.edu.ar:3006/api/areaExploracion/${idExploracion}`, {
    const response = await fetch(`${urlApi}/area/${idArea}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response);
    if (response.status !== 200) {
      return toast.error("El Area buscada no existe");
    }
    const resultado = await response.json();
    const area = resultado.area;

    let coordenadasArea = area.locacion.coordinates[0];
    
    const newCoordinates = [coordenadasArea[0][0], coordenadasArea[0][1]];
    this.state.map.setView(newCoordinates, 14);

    coordenadasArea = coordenadasArea.map((c) => ({
      lat: c[0],
      lng: c[1],
    }));
    const poligonoArea = this.dibujarPoligonoArea(coordenadasArea);

    // let poligonosExcavaciones = [],
    //     coordenadasExcavaciones = [],
    //     coordenadas;
    // exploracionCompleta.excavaciones.forEach(excavacion => {
    //     coordenadas = excavacion.areaExcavacion.locacion.coordinates[0];
    //     coordenadas = coordenadas.map(c => ({ lat: c[0], lng: c[1] }));
    //     let poligono = this.dibujarPoligonoArea(coordenadas, "green");
    //     poligonosExcavaciones = [...poligonosExcavaciones, poligono];
    //     coordenadasExcavaciones = [...coordenadasExcavaciones, coordenadas];
    // });

    this.setState({
      idArea,
      poligonoArea,
      coordenadasArea,
      area: coordenadasArea, //,
      // poligonosExcavaciones,
      // coordenadasExcavaciones,
      // areasExcavaciones: coordenadasExcavaciones
    });
  };

  dibujarPoligonoArea = (coordenadasArea, color) =>
    dibujarPoligono(coordenadasArea, color, this.state.map);

  setearCoordenadas = (coordenadas) =>
    this.setState({ coordenadasArea: coordenadas });

  setearMarcadores = (marcadores) =>
    this.setState({ marcadoresPoligonoArea: marcadores });

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

  modificarArea = () => {
    const { poligonoArea } = this.state;
    this.state.map.removeLayer(poligonoArea);
    this.dibujarPuntos("coordenadasArea", "marcadoresPoligonoArea");
    this.setState({
      modificarArea: true,
      areaDisabled: true,
    });
  };

  verificarInclusionAreas = () => {
    let pertenece = true;
    this.state.coordenadasExcavaciones.forEach((coordenadas) => {
      pertenece = verificarInclusionAreas(
        coordenadas,
        this.state.coordenadasExploracion
      );
    });
    return pertenece;
  };

  guardarArea = async () => {
    // const pertenece = this.verificarInclusionAreas();

    //if (pertenece) {
    const body = {
      area: this.state.coordenadasArea,
      idArea: this.state.idArea,
    };
    this.hacerRequest(body);
    // } else {
    //     toast.info(
    //         "El area de Excavacion debe quedar contenida dentro del area de Exploracion"
    //     );
    //     this.restaurarAreaOriginal();
    // }
  };

  restaurarAreaOriginal = () => {
    const poligonoActual = this.dibujarPoligonoArea(
      this.state.coordenadasExploracion
    );
    this.state.map.removeLayer(poligonoActual);

    this.state.marcadoresPoligonoArea.forEach((marcador) =>
      this.state.map.removeLayer(marcador)
    );
    const poligono = this.dibujarPoligonoArea(this.state.areaExploracion);

    this.setState({
      coordenadasExploracion: this.state.areaExploracion,
      marcadoresPoligono: [],
      modificarAreaExploracion: false,
      poligonoExploracion: poligono,
    });
  };

  hacerRequest = async (body) => {
    const response = await fetch(`${urlApi}/area/${this.state.idArea}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.status !== 200) {
      toast.error("Error al modificar el Area");
    } else {
      toast.success("Area de Denuncia modificada con exito");
      const poligonoArea = this.dibujarPoligonoArea(this.state.coordenadasArea);

      this.state.marcadoresPoligonoArea.forEach((marcador) =>
        this.state.map.removeLayer(marcador)
      );

      this.setState({
        modificarArea: false,
        area: poligonoArea.getLatLngs()[0],
        poligonoArea: poligonoArea,
      });
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
        {this.state.mostrarBotonera? (
        <div className="contenedorMenu">
          <div className="button-container">
            {" "}
            {!this.state.modificarArea ? (
              <button
                className="btn btn-outline-primary"
                onClick={this.modificarArea}
              >
                Modificar Area{" "}
              </button>
            ) : (
              <input
                type="button"
                disabled={this.state.areaDisabled}
                className="btn btn-outline-primary"
                onClick={this.guardarArea}
                value="Guardar Area"
                style={{ width: "250px", height: "50px" }}
              />
            )}{" "}
            <div className="descripciones">
              <div>
                <span className="circulo verde"></span>
                Area Denuncia
              </div>
            </div>
          </div>{" "}
        </div>
         ):(<div></div>)} 
      </div>
    );
  }
}
