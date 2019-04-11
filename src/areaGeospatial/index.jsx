import React, { Component } from 'react';
import './AreaGeoespacial.css';

import CrearExploracion from './CrearExploracion';
import CrearExcavacion from './CrearExcavacion';
import ModificarExcavacion from './ModificarExcavacion';
import ModificarExploracion from './ModificarExploracion';
import ObtenerExploraciones from  './ObtenerExploraciones';


export default class AreaGeoespacial extends Component {
  constructor() {
    super();
    this.state = {
      obtenerExploraciones: false,
      modificarExcavacion: false,
      modificarExploracion: false,
      crearExploracion: false,
      crearExcavacion: false,
    };
  };

  setearEstadoInicial = () => {
    this.setState({
      crearExploracion: false,
      crearExcavacion: false,
      modificarExcavacion: false,
      obtenerExploraciones: false,
    })
  };

  obtenerExploraciones = () => {
    this.setearEstadoInicial();
    this.setState({ obtenerExploraciones: true });
  };

  modificarExcavacion = () => {
    this.setearEstadoInicial();
    this.setState({ modificarExcavacion: true });
  };

  modificarExploracion = () => {
    this.setearEstadoInicial();
    this.setState({ modificarExploracion: true });
  };

  crearExcavacion = () => {
    this.setearEstadoInicial();
    this.setState({ crearExcavacion: true });
  };
  
  crearExploracion = () => {
    this.setearEstadoInicial();
    this.setState({ crearExploracion: true });
  };

  render() {
    return (
      <React.Fragment>
        <div className="row" style={{ marginTop: 25 }}>
          <div className="col-md-2">
            <button className="btn btn-outline-primary" onClick={this.obtenerExploraciones}>
              VISUALIZAR EXPLORACIONES
            </button>
          </div>
          <div className="col-md-2">
            <button className="btn btn-outline-primary" onClick={this.modificarExcavacion}>
              MODIFICAR AREA EXCAVACION
            </button>
          </div>
          <div className="col-md-2">
            <button className="btn btn-outline-primary" onClick={this.modificarExploracion}>
              MODIFICAR AREA EXPLORACION
            </button>
          </div>
          <div className="col-md-2">
            <button className="btn btn-outline-primary" onClick={this.crearExploracion}>
              ALTA AREA EXPLORACION
            </button>
          </div>
          <div className="col-md-2">
            <button className="btn btn-outline-primary" onClick={this.crearExcavacion}>
              ALTA AREA EXCAVACION
            </button>
          </div>
       </div> 
      <div style={{ marginTop: 25 }}>
        {this.state.crearExploracion && <CrearExploracion />}
        {this.state.crearExcavacion && <CrearExcavacion />}
        {this.state.modificarExcavacion && <ModificarExcavacion />}
        {this.state.modificarExploracion && <ModificarExploracion />}
        {this.state.obtenerExploraciones && <ObtenerExploraciones />}
      </div>

      </React.Fragment>
    );
  };
};
