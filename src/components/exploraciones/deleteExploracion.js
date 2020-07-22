import React from "react";
import Select from "react-select";
import axios from "axios";
import Moment from "moment";

function validate(nombre, fecha) {
  // true means invalid, so our conditions got reversed
  return {
    nombre: nombre.length === 0,
    fecha: fecha.length === 0
  };
}

class DeleteExploracion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nombre: "",
      fecha: ""
    };
  }

  componentDidMount() {
    axios
      .get(
        "/api/exploracionId/" + this.props.match.params.id
      )
      .then(response => {
        this.setState({
          nombre: response.data.exploracionId.nombre,
          fecha: Moment(response.data.exploracionId.fecha)
            .add(1, "days")
            .format("YYYY-MM-DD")
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  canBeSubmitted() {
    const errors = validate(this.state.nombre, this.state.fecha);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    return !isDisabled;
  }

  handleNombreChange = evt => {
    this.setState({ nombre: evt.target.value });
  };

  handleFechaChange = evt => {
    this.setState({ fecha: evt.target.value });
  };

  handleSubmit = evt => {
    if (
      window.confirm("Confirma la Eliminación de la Exploración Seleccionada?")
    ) {
      if (this.canBeSubmitted()) {
        evt.preventDefault();

        var data = {
          nombre: this.state.nombre,
          fecha: this.state.fecha
        };

        fetch(
          "/api/exploracion/" + this.props.match.params.id,
          {
            method: "delete",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
          .then(function(response) {
            if (response.ok) {
              alert("¡Se eliminó la Exploración con Éxito!");
              window.location.href = "/exploraciones";
            }
          })
          .catch(function(error) {
            alert("Error al guardar. Intente nuevamente.");
            console.log(
              "Hubo un problema con la petición Fetch:" + error.message
            );
          });

        return;
      }
    }
  };

  render() {
    const errors = validate(this.state.nombre, this.state.fecha);
    const isDisabled = Object.keys(errors).some(x => errors[x]);

    return (
      <div>
        <div className="row">
          <div className="col-md-12">
            <div id="contenido" align="left" className="container">
              <h3 className="page-header" align="left">
                {" "}
                <i class="fa fa-map-marker" aria-hidden="true"></i> Eliminar
                Exploración
              </h3>
              <hr />

              <form className="form-horizontal" onSubmit={this.handleSubmit}>
                <div className="input-group">
                  <div className="col-sm-12">
                    <label htmlFor="nombre">Nombre:</label>
                    <input
                      name="nombre"
                      type="text"
                      disabled="disabled"
                      className={errors.nombre ? "error" : ""}
                      className="form-control"
                      value={this.state.nombre}
                      onChange={this.handleNombreChange}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <div className="col-sm-4">
                    <label htmlFor="fecha">Fecha:</label>
                    <input
                      name="fecha"
                      type="date"
                      disabled="disabled"
                      className={errors.fecha ? "error" : ""}
                      className="form-control"
                      value={this.state.fecha}
                      onChange={this.handleFechaChange}
                    />
                  </div>
                </div>
                <br />
                <div className="form-group">
                  <div className="col-sm-6">
                    <button
                      disabled={isDisabled}
                      className="btn btn-outline-danger my-2 my-sm-0"
                      type="submit"
                    >
                      <span className="fa fa-trash-o"></span> Eliminar
                    </button>
                    &nbsp;&nbsp;
                    <a
                      className="btn btn-outline-secondary my-2 my-sm-0"
                      href="/exploraciones"
                    >
                      <span className="fa fa-level-up"></span> Cancelar
                    </a>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default DeleteExploracion;
