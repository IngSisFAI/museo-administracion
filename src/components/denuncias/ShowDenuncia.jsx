import React from "react";
import { Form, Button, Tabs, Tab, Table} from "react-bootstrap";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ModificarDenuncia from '../../areaGeospatial/ModificarDenuncia';
import Moment from 'moment';
import {
  faPlus,
  faTrash,
  faTimesCircle,
  faHandshake,
} from "@fortawesome/free-solid-svg-icons";
import { withRouter, Link, Redirect } from "react-router-dom";
import Menu from "../Menu";
import Cookies from "universal-cookie";
import $ from "jquery";
import axios from "axios";

const cookies = new Cookies();

//Variables Globales
//const urlApi = process.env.REACT_APP_API_HOST;


const urlApi = process.env.REACT_APP_API_HOST;
const urlImage = process.env.REACT_APP_IMAGEN_PERSONA;
const rutaImg = process.env.REACT_APP_RUTA_IMG_PERSONA;

class ShowDenuncia extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      denunciante: "",
      fechaIngreso: "",
      paleontologo: "",
      tecnicoNombre: "",
      tecnicos: [],
      documenacion: [],
      idArea: "",
      tableTecnicos: null,
      
      tabsolic: true,
      key: "dbasicos",
      op: "I",

      denunciaId: "",
    };
  }

  componentDidMount() {
    if (!cookies.get('user') && !cookies.get('password')) {
      window.location.href = '/';
    }
    else {
    
    fetch(urlApi + '/denuncia/' + this.props.match.params.id, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + cookies.get('token')
      }
    }).then(res => res.json())
    .then(response => {
      console.log(response.denuncia)
      this.setState({
        denunciante: response.denuncia.denunciante,
        paleontologo: response.denuncia.paleontologo,
        fechaIngreso: (Moment(response.denuncia.fechaIngreso).add(1, 'days')).format('YYYY-MM-DD'),
        tecnicos: response.denuncia.tecnicos,
               
      })
      this.setState({tableTecnicos: this.renderTableTecnicos()})
      setTimeout(() => {this.setState({idArea: response.denuncia.idArea })},2000); // le doy tiempo para que cargue el idArea para que el mapa no se rompa
    })
  }
  }

  filehandleChange = (event) => {
    const file = event.target.files;
    const name = file[0].name;
    const lastDot = name.lastIndexOf(".");
    const ext = name.substring(lastDot + 1);
    this.setState({ archivoFoto: file, extFoto: ext });
  };

  subirFoto = () => {
    //console.log(this.state.archivoFoto);
    const MAXIMO_TAMANIO_BYTES = 5000000;
    const types = [
      "image/jpg",
      "image/jpeg",
      "image/jpe",
      "image/png",
      "image/gif",
      "image/bpm",
      "image/tif",
      "image/tiff",
    ];
    var foto = this.state.archivoFoto;
    if (foto !== null && foto.length !== 0) {
      var namePhoto = "/" + this.state.nroDoc + "." + this.state.extFoto;
      var size = foto[0].size;
      var type = foto[0].type;

      if (size > MAXIMO_TAMANIO_BYTES) {
        var tamanio = 5000000 / 1000000;
        toast.error(
          "El archivo seleccionado supera los " + tamanio + "Mb. permitidos."
        );
        document.getElementById("foto").value = "";
      } else {
        if (!types.includes(type)) {
          toast.error("El archivo seleccionado tiene una extensión inválida.");
          document.getElementById("foto").value = "";
        } else {
          $(".loader").removeAttr("style");
          var data1 = {
            foto: namePhoto,
          };
          document.getElementById("subir").setAttribute("disabled", "disabled");
          fetch(urlApi + "/persona/" + this.state.idPersona, {
            method: "put",
            body: JSON.stringify(data1),
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + cookies.get("token"),
            },
          })
            .then(
              function (response) {
                if (response.ok) {
                  console.log(
                    "¡Se actualizaron los datos de la Persona con Éxito!"
                  );
                  //const destino = rutaImg;
                  const data = new FormData();
                  data.append("file", foto[0]);
                  // console.log(foto);

                  axios
                    .post(urlApi + "/uploadArchivo", data, {
                      headers: {
                        "Content-Type": undefined,
                        path: rutaImg,
                        newfilename: this.state.nroDoc,
                        Authorization: "Bearer " + cookies.get("token"),
                      },
                    })
                    .then((response) => {
                      $(".loader").fadeOut("slow");
                      if (response.statusText === "OK") {
                        this.setState({
                          showSuccess: true,
                          showError: false,
                          urlImage:
                            urlImage +
                            this.state.nroDoc +
                            "." +
                            this.state.extFoto,
                        });
                        this.setState({
                          tableImage: this.renderTableDataFoto(),
                        });
                        document.getElementById("foto").value = "";
                      } else {
                        this.setState({ showSuccess: false, showError: true });
                      }
                      document
                        .getElementById("subir")
                        .removeAttribute("disabled");

                      setTimeout(() => {
                        this.setState({ showSuccess: false, showError: false });
                      }, 2500);
                    })
                    .catch((error) => {
                      $(".loader").fadeOut("slow");
                      this.setState({ showSuccess: false, showError: true });
                      console.log(error);
                    });
                }
              }.bind(this)
            )
            .catch(function (error) {
              $(".loader").fadeOut("slow");
              toast.error("Error al guardar. Intente nuevamente.");
              document.getElementById("subir").removeAttribute("disabled");
              console.log(
                "Hubo un problema con la petición Fetch:" + error.message
              );
            });
        }
      }
    } else {
      toast.error("Seleccione una foto.");
    }
  };

  renderTableTecnicos() {
    return this.state.tecnicos.map((tecnico, index) => {
      // console.log(index, tecnico);
      return (
        <tr key={index} onChange={this.handletecnicotableTecnicosChange}>
          <td>{tecnico}</td>
        </tr>
      );
    });
  }

    render() {
    const { validated } = this.state;
    if (!this.state.idArea) {
      return <div>Cargando...</div>;
    }
    return (
      <>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          transition={Slide}
          hideProgressBar={true}
          newestOnTop={true}
          closeOnClick
          pauseOnHover
        />
        <Menu />
        <div className="row">
          <div className="col-md-12">
            <div id="contenido" align="left" className="container">
              <h3 className="page-header" align="left">
                <FontAwesomeIcon icon={faHandshake} /> Detalle Denuncia
              </h3>
              <hr></hr>
              <Tabs
                id="tabDonacion"
                activeKey={this.state.key}
                onSelect={this.handleSelect}
              >
                <Tab
                  eventKey="dbasicos"
                  title="Datos Básicos"
                  //disabled={this.state.tabbas}
                >
                  <Form
                    id="form"
                    noValidate
                    validated={validated}
                    onSubmit={this.handleSubmit}
                  >
                    <Form.Row>
                      <Form.Group className="col-sm-4" controlId="Denunciante">
                        <Form.Label>Denunciante:</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Ingrese datos del denunciante"
                          disabled
                          value={this.state.denunciante}
                        />
                      </Form.Group>

                      <Form.Group className="col-sm-4" controlId="fDenuncia">
                        <Form.Label>Fecha Denuncia:</Form.Label>
                        <Form.Control
                          type="date"
                          value={this.state.fechaIngreso}
                          disabled
                        />
                      </Form.Group>

                      <Form.Group className="col-sm-4" controlId="Paleontologo">
                        <Form.Label>Nombre Paleontologo:</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Paleontologo"
                          required
                          disabled
                          value={this.state.paleontologo}
                        />
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      <Form.Group
                        className="col-sm-8"
                        controlId="tableTecnicos"
                      >
                        <Table
                          striped
                          bordered
                          hover
                          responsive
                          className="table-sm"
                        >
                          <thead className="thead-dark">
                            <tr>
                              <th>Técnicos</th>
                            </tr>
                          </thead>
                          <tbody>{this.state.tableTecnicos}</tbody>
                        </Table>
                      </Form.Group>
                    </Form.Row>
                    <legend>Datos Geográficos</legend>
                    <hr />

                    <Form.Row>
                      <Form.Group className="col-sm-12">
                        <ModificarDenuncia AreaDenunciaId={this.state.idArea} show={true} />
                      </Form.Group>
                    </Form.Row>
                  </Form>

                  <Form.Row>
                    <Form.Group className="mx-sm-3 mb-2">
                      <Link className="ml-1" to='/Denuncias'>
                          <Button variant="danger" type="button" id="volver">
                            <FontAwesomeIcon icon={faTimesCircle} /> Volver
                          </Button>
                        </Link>
                    </Form.Group>
                  </Form.Row>
                </Tab>

                {/* <Tab
                  eventKey="fotos"
                  title="Fotos"
                  //disabled={this.state.tabbas}
                >
                  <Form.Group className="col-sm-12">
                    <Form.Label>Foto:</Form.Label>
                    <input
                      type="file"
                      id="foto"
                      className="form-control"
                      accept="image/*"
                      onChange={this.filehandleChange.bind(this)}
                    />
                  </Form.Group>

                  <Form.Row>
                    <Form.Group className="col-sm-8" controlId="listFoto">
                      <Table border="0">
                        <tbody id="tbodyimage">{this.state.tableImage}</tbody>
                      </Table>
                    </Form.Group>
                  </Form.Row>

                  <Form.Row>
                    <Form.Group className="mx-sm-3 mb-2">
                      <Button
                        variant="primary"
                        type="button"
                        id="subir"
                        onClick={() => this.subirFoto()}
                      >
                        <FontAwesomeIcon icon={faUpload} /> Subir
                      </Button>
                    </Form.Group>

                    <Form.Group className="col-sm-6">
                      <Alert show={this.state.showSuccess} variant="success">
                        <p>Se subió el archivo con Éxito!!</p>
                      </Alert>

                      <Alert show={this.state.showError} variant="danger">
                        <p>El archivo no se pudo subir. Intente nuevamente.</p>
                      </Alert>
                    </Form.Group>
                  </Form.Row>
                </Tab> */}
              </Tabs>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(ShowDenuncia);
