import React from "react";
import Select from "react-select";
import axios from "axios";

const opciones = [
  { value: "Geologo", label: "Geologo" },
  { value: "Paleontologo", label: "Paleontologo" },
  { value: "Ing. en Petroleo", label: "Ing. en Petroleo" }
];

function validate(nombre, apellido, nroDoc) {
  // true means invalid, so our conditions got reversed
  return {
    nombre: nombre.length === 0,
    apellido: apellido.length === 0,
    nroDoc: nroDoc.length === 0
  };
}

class addPersona extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nombre: "",
      apellido: "",
      nroDoc: "",
      finicio: "",
      fbaja: "",
      motivo: "",
      selectedOption: null,
      titulos: "",
      foto: "",
      everFocusedNombre: false,
      everFocusedApellido: false,
      everFocusedNroDoc: false,
      inFocus: "",
      selectedFile: null,
      id: ""
    };
    this.cambioNumero = this.cambioNumero.bind(this);
  }

  onClickHandler = () => {
    console.log(this.state.selectedFile);
    const data = new FormData();
    data.append("file", this.state.selectedFile);

    axios.post("http://localhost:8000/upload", data, {
      // '/api/uploadArchivo....'
      onUploadProgress: ProgressEvent => {
        this.setState({
          loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100
        });
      }
    });
  };

  handleNombreChange = evt => {
    this.setState({ nombre: evt.target.value });
  };

  handleApellidoChange = evt => {
    this.setState({ apellido: evt.target.value });
  };

  handleNroDocChange = evt => {
    this.cambioNumero(evt.target.value);
  };

  handleFinicioChange = evt => {
    this.setState({ finicio: evt.target.value });
  };

  handleFbajaChange = evt => {
    this.setState({ fbaja: evt.target.value });
  };

  handleMotivoChange = evt => {
    this.setState({ motivo: evt.target.value });
  };

  handleFotoChange = event => {
    console.log(event.target.files[0]);
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0,
      foto: event.target.value
    });
  };

  /*  handleChange = (selectedOption) => {
            let titulos = Array.from(selectedOption, option => option.value);
            this.setState({selectedOption});
            this.setState({titulos});
            console.log(`Option selected:`, titulos );
           
          }*/

  handleTituloChange = evt => {
    this.setState({ titulos: evt.target.value });
  };

  handleSubmit = evt => {
    if (this.canBeSubmitted()) {
      evt.preventDefault();

      var data = {
        nombres: this.state.nombre,
        apellidos: this.state.apellido,
        dni: this.state.nroDoc,
        fechaInicio: this.state.finicio,
        titulos: this.state.titulos,
        foto: this.state.foto.replace("C:\\fakepath\\", "\\"),
        fechaBaja: this.state.fbaja,
        motivoBaja: this.state.motivo
      };

      //-----------------------------------------------------------------

      fetch("api/persona", {
        method: "post",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(function(response) {
          if (response.ok) {
            console.log("¡Se guardó la Persona con Éxito!");
          }
        })
        .catch(function(error) {
          alert("Error al guardar. Intente nuevamente.");
          console.log(
            "Hubo un problema con la petición Fetch:" + error.message
          );
        });

      const archivo = this.state.selectedFile;
      var destino = "";
      //------------------------------------------------------------------
      //Busco el id de la persona recientemente cargada
      //   console.log('API: ', 'api/personaDni/'+this.state.nroDoc)
      var id = "";
      axios
        .get("api/personaDni/" + this.state.nroDoc)
        .then(function(response) {
          console.log("ID Persona:", response.data.persona._id);
          id = response.data.persona._id;

          destino = "public/images/personas/" + id;
          console.log("DESTINO:" + destino);

          const data1 = new FormData();
          data1.append("file", archivo);

          axios
            .post("http://localhost:8000/upload", data1, {
              headers: {
                "Content-Type": undefined,
                path: destino
              }
            })
            .then(response => {
              alert("¡Se guardó la Persona con Éxito!");
              window.location.href = "/personas";
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(function(error) {
          console.log(error);
        });

      return;
    }
  };

  canBeSubmitted() {
    const errors = validate(
      this.state.nombre,
      this.state.apellido,
      this.state.nroDoc
    );
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    return !isDisabled;
  }

  handleBlur = evt => {
    fetch("api/personaNroDoc/" + evt.target.value)
      .then(response => {
        return response.json();
      })
      .then(persons => {
        if (persons.personas.length > 0) {
          alert("Existe Persona con ese DNI. Ingrese uno correcto.");
          this.setState({ nroDoc: "" });
          document.getElementById("nroDoc").focus();
        }
      });
  };

  result(params) {
    console.log(params);
  }

  render() {
    const errors = validate(
      this.state.nombre,
      this.state.apellido,
      this.state.nroDoc
    );
    const isDisabled = Object.keys(errors).some(x => errors[x]);

    const { selectedOption } = this.state;

    return (
      <div>
        <div className="row">
          <div className="col-md-12">
            <div id="contenido" align="left" className="container">
              <h3 className="page-header" align="left">
                <i class="fa fa-users" aria-hidden="true"></i> Agregar Persona
              </h3>
              <hr />

              <form className="form-horizontal" onSubmit={this.handleSubmit}>
                <div className="input-group">
                  <div className="col-sm-4">
                    <label htmlFor="apellido">Apellidos:</label>
                    <input
                      name="apellido"
                      type="text"
                      className={errors.apellido ? "error" : ""}
                      className="form-control"
                      value={this.state.apellido}
                      onChange={this.handleApellidoChange}
                    />
                  </div>

                  <div className="col-sm-4">
                    <label htmlFor="nombre">Nombres:</label>
                    <input
                      name="nombre"
                      className={errors.nombre ? "error" : ""}
                      className="form-control"
                      value={this.state.email}
                      onChange={this.handleNombreChange}
                      type="text"
                    />
                  </div>

                  <div className="col-sm-4">
                    <label htmlFor="nroDoc">Nro. Doc.:</label>
                    <input
                      name="nroDoc"
                      className={errors.nroDoc ? "error" : ""}
                      className="form-control"
                      value={this.state.nroDoc}
                      onChange={this.handleNroDocChange}
                      type="text"
                      id="nroDoc"
                      onBlur={this.handleBlur}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <div className="col-sm-4">
                    <label htmlFor="finicio">Fecha Inicio:</label>
                    <input
                      name="finicio"
                      type="date"
                      className="form-control"
                      value={this.state.finicio}
                      onChange={this.handleFinicioChange}
                    />
                  </div>

                  <div className="col-sm-4">
                    <label htmlFor="fbaja">Fecha Baja:</label>
                    <input
                      name="fbaja"
                      type="date"
                      className="form-control"
                      value={this.state.fbaja}
                      onChange={this.handleFbajaChange}
                    />
                  </div>

                  <div className="col-sm-4">
                    <label htmlFor="motivo">Motivo Baja:</label>
                    <textarea
                      name="motivo"
                      className="form-control"
                      value={this.state.motivo}
                      onChange={this.handleMotivoChange}
                    ></textarea>
                  </div>
                </div>

                <div className="form-group">
                  <div className="col-sm-12">
                    <label htmlFor="titulo">Títulos:</label>

                    <input
                      name="titulo"
                      type="text"
                      className="form-control"
                      value={this.state.titulos}
                      onChange={this.handleTituloChange}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <div className="col-sm-6">
                    <label htmlFor="foto">Foto:</label>
                    <input
                      name="foto"
                      type="file"
                      className="form-control-file"
                      accept="image/*"
                      value={this.state.foto}
                      onChange={this.handleFotoChange}
                    />
                  </div>
                </div>

                <br />

                <div className="form-group">
                  <div className="col-sm-6">
                    <button
                      disabled={isDisabled}
                      className="btn btn-outline-primary my-2 my-sm-0"
                      type="submit"
                    >
                      <span className="fa fa-floppy-o"></span> Registrar
                    </button>
                    &nbsp;&nbsp;
                    <a
                      className="btn btn-outline-secondary my-2 my-sm-0"
                      href="/personas"
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

  cambioNumero(event) {
    const entrada = event;
    let cant = 0;
    for (let x = 0; x < entrada.length; x++)
      if (
        entrada[x] === "0" ||
        entrada[x] === "1" ||
        entrada[x] === "2" ||
        entrada[x] === "3" ||
        entrada[x] === "4" ||
        entrada[x] === "5" ||
        entrada[x] === "6" ||
        entrada[x] === "7" ||
        entrada[x] === "8" ||
        entrada[x] === "9"
      )
        cant++;
    if (cant === entrada.length)
      this.setState({
        nroDoc: entrada
      });
  }
}

export default addPersona;
