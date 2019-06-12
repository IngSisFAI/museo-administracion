import React, { Component } from 'react';
import L from 'leaflet';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AreaGeoespacial.css';
import 'leaflet/dist/leaflet.css';

import { dibujarPoligono, dibujarPuntosArea, verificarInclusionAreas } from './helpers';
import Descripcion from './Descripcion';


delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

export default class ModificarExploracion extends Component {
  constructor() {
    super();
    this.state = {
      marcadoresPoligonoExploracion: [],
      marcadoresPoligonoExcavacion: [],
      areaDisabled: true,
    };
  };

  componentDidMount() {
    const mapOptions = {
      center: [-38.9517, -68.0592],
      zoom: 14,
    };
    const map = new L.map('map', mapOptions);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);
    this.setState({ map });
    
    map.on('click',this.onClickMap);
    this.setState({ map });

    this.obtenerExploracion();
  };

  obtenerExploracion = async () => {
    const idExploracion = this.props.exploracionId;

    const response = await fetch(`/api/areaExploracion/${idExploracion}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 200) {
      return toast.error('La exploracion buscada no existe');
    }
    const resultado = await response.json();
    const exploracionCompleta = resultado.exploracion;
    
    let coordenadasExploracion = exploracionCompleta.areaExploracion.locacion.coordinates[0];
    coordenadasExploracion = coordenadasExploracion.map(c => ({ lat: c[0], lng: c[1] }));
    const poligonoExploracion = this.dibujarPoligonoArea(coordenadasExploracion);
    
    let poligonosExcavaciones = [], coordenadasExcavaciones = [], coordenadas;
    exploracionCompleta.excavaciones.forEach(excavacion => {
      coordenadas = excavacion.areaExcavacion.locacion.coordinates[0];
      coordenadas = coordenadas.map(c => ({ lat: c[0], lng: c[1] }));
      let poligono = this.dibujarPoligonoArea(coordenadas, 'green');
      poligonosExcavaciones = [...poligonosExcavaciones, poligono];
      coordenadasExcavaciones = [...coordenadasExcavaciones, coordenadas];
    });

    this.setState({
      idExploracion,
      poligonoExploracion,
      coordenadasExploracion,
      areaExploracion: coordenadasExploracion,

      poligonosExcavaciones,
      coordenadasExcavaciones,

      areasExcavaciones: coordenadasExcavaciones,
     });
  };
  
  dibujarPoligonoArea = (coordenadasArea, color) => dibujarPoligono(coordenadasArea, color, this.state.map);

  setearCoordenadas = coordenadas => this.setState({ coordenadasExploracion: coordenadas });

  setearMarcadores = marcadores => this.setState({ marcadoresPoligonoExploracion: marcadores });

  habilitarBoton = () => this.setState({ areaDisabled: false });

  dibujarPuntos = (coordenadasState, marcadores) => {
    const coordenadasArea = this.state[coordenadasState];
    let marcadoresPoligono = this.state[marcadores];

    dibujarPuntosArea(coordenadasArea, marcadoresPoligono, this.state.map, this.setearCoordenadas, this.setearMarcadores, this.habilitarBoton);
  };

  modificarAreaExploracion = () => {
    const { poligonoExploracion } = this.state;
    this.state.map.removeLayer(poligonoExploracion);
    this.dibujarPuntos('coordenadasExploracion', 'marcadoresPoligonoExploracion');
    this.setState({
      modificarAreaExploracion: true,
      areaDisabled: true,
    });
  };

  verificarInclusionAreas = () => {
    let pertenece = true;
    this.state.coordenadasExcavaciones.forEach(coordenadas => {
      pertenece = verificarInclusionAreas(coordenadas, this.state.coordenadasExploracion);
    });
    return pertenece;
  };

  guardarAreaExploracion = async() => {
    const pertenece = this.verificarInclusionAreas();

    if (pertenece) {
      const body = {
        areaExploracion: this.state.coordenadasExploracion,
        idExploracion: this.state.idExploracion,
      };
      this.hacerRequest(body);
    } else {
      toast.info('El area de Excavacion debe quedar contenida dentro del area de Exploracion');
      this.restaurarAreaOriginal();
    }
  };

  restaurarAreaOriginal = () => {
    const poligonoActual = this.dibujarPoligonoArea(this.state.coordenadasExploracion);
    this.state.map.removeLayer(poligonoActual);
    
    this.state.marcadoresPoligonoExploracion.forEach(marcador => this.state.map.removeLayer(marcador));
    const poligono = this.dibujarPoligonoArea(this.state.areaExploracion);

    this.setState({
      coordenadasExploracion: this.state.areaExploracion,
      marcadoresPoligono: [],
      modificarAreaExploracion: false,
      poligonoExploracion: poligono,
    });
  };

  hacerRequest = async (body) => {
    const response = await fetch(`/api/areaExploracion/${this.state.idExploracion}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (response.status !== 200) {
      toast.error('Error al modificar el Area de Exploracion');
    } else {
      toast.success('Area de Exploracion modificada con exito');
      const poligonoArea = this.dibujarPoligonoArea(this.state.coordenadasExploracion);

      this.state.marcadoresPoligonoExploracion.forEach(marcador => this.state.map.removeLayer(marcador));

      this.setState({
        modificarAreaExploracion: false,
        areaExploracion: poligonoArea.getLatLngs()[0],
        poligonoExploracion: poligonoArea,
      });
    }
  };

  render() {
    return (
      <div style={{ position: 'relative' }}>
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
            { !this.state.modificarAreaExploracion ?
              <button className="btn btn-outline-primary" onClick={this.modificarAreaExploracion}>
                Modificar Area Exploracion
              </button>
              :
              <button disabled={this.state.areaDisabled} className="btn btn-outline-primary" onClick={this.guardarAreaExploracion}>
                Guardar Area Exploracion
              </button>
            }
            <Descripcion />
          </div>
        </div>
      </div>
    );
  };
};
