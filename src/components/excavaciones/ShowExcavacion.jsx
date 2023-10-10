import React from "react";
import { Form, Button, Tabs, Tab, Table, Modal, Alert } from "react-bootstrap";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faReply,
  faCompass,
  faTrash,
  faPlus,
  faShare,
  faEdit,
  faTimesCircle,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Select from "react-select";
import ModificarExcavacion from "../../areaGeospatial/ModificarExcavacion";
import Moment from "moment";
import Menu from "../Menu";
import $ from "jquery";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

//Variables Globales
const urlApi = process.env.REACT_APP_API_HOST;
const urlArchivo = process.env.REACT_APP_URL_EXCAVACIONES;
const rutaExcavaciones = process.env.REACT_APP_RUTA_EXCAVACIONES;

const optHallazgo = [
  { value: "Fortuito", label: "Fortuito" },
  { value: "Denuncia", label: "Denuncia" },
  { value: "Exploración", label: "Exploración" },
];

class ShowExcavacion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      auxiliares: [],
      auxiliaresId: [],
      directores: [],
      profesionales: [],
      profesionalesId: [],
      exploraciones: [],
      nombreArea: "",
      descripcion: "",
      codigoCampo: "",
      fechaInicio: "",
      fechaTermino: "",
      motivoBaja: "",
      muestraHome: false,
      selectedExploracion: null,
      selectedExploracionAnt: null,
      selectedAuxiliar: null,
      selectedDirector: null,
      selectedProfesional: null,
      idAreaExcavacion: "",
      puntoGpsExcavacion: {},
      validateddb: false,
      tabbas: false,
      tabh: false,
      validatedh: false,
      tabgeo: false,
      validatedgeo: false,
      tabtax: false,
      validatedtax: false,
      geologicos: "",
      taxonomicos: "",
      tabfotos: false,
      validatedfotos: false,
      tabvideos: false,
      validatedvideos: false,
      tabbochon: false,
      validatedbochon: false,
      nombrePieza: "",
      identificador: "",
      nroBochon: "",
      infoAdicional: "",
      piezasAsociadas: [],
      piezas: [],
      codigoCampoB: "",
      identificadorPieza: "",
      nombrePieza: "",
      descripcionPieza: "",
      modalActualizarPieza: false,
      selectedPieza: null,
      piezasId: [],
      bochones: [],
      piezas: [],
      piezasNames: [],
      modalActualizarBochon: false,
      selectedPiezaM: null,
      key: "dbasicos",
      selectedHallazgo: null,
      archivoDenuncia: null,
      excavacionId: "",
      listArchivosDen: [],
      urlArchivo: "",
      showSuccess: false,
      showError: false,
      tableArchivosDen: null,
      showSuccessFoto: false,
      showErrorFoto: false,
      showSuccessVideo: false,
      showErrorVideo: false,
      archivoVideo: null,
      archivoFoto: null,
      descripcionFoto: "",
      listArchivosFotos: [],
      listArchivosVideo: [],
      tableArchivosFotos: null,
      ejemplares: [],
      selectedEjemplar: null,
      selectedEjemplarM: null,
      piezas: [],
      listBochones: [],
      selectedPiezaM: null,
      piezasMId: [],
      piezasM: [],
      piezasMNames: [],
      bochonMId: "",
      validatedMBochon: false,
      idExploracionModificar: "",
      puntoGps: {},
      tablaBochones: [],
      ejemplar: "",
      piezasAsoc: "",
      ejemplarM: "",
      piezasAsocM: "",
    };
  }
  setPuntoGpsExcavacion = (puntoGps) =>
    this.setState({ puntoGpsExcavacion: puntoGps });
  setIdAreaExcavacion = (idArea) => this.setState({ idAreaExcavacion: idArea });

  //antes de cargar el DOM
  componentWillMount() {
    fetch(urlApi + "/personas", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + cookies.get("token"),
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((empleados) => {
        this.setState({
          directores: empleados.personas,
          profesionales: empleados.personas,
          auxiliares: empleados.personas,
        });
      })
      .catch(function (error) {
        console.log("Ha ocurrido un error:", error);
      });

    fetch(urlApi + "/bochonExca/" + this.props.match.params.id, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + cookies.get("token"),
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((bochons) => {
        this.setState({ bochones: bochons.bochones });
      })
      .catch(function (error) {
        console.log("Ha ocurrido un error:", error);
      });

    fetch(urlApi + "/exploracion", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + cookies.get("token"),
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((explorations) => {
        this.setState({ exploraciones: explorations.exploraciones });
      })
      .catch(function (error) {
        console.log("Ha ocurrido un error:", error);
      });
  }

  //una vez cargado en el DOM
  componentDidMount() {
    if (!cookies.get("user") && !cookies.get("password")) {
      window.location.href = "/";
    } else {
      fetch(urlApi + "/excavacionId/" + this.props.match.params.id, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + cookies.get("token"),
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((excavacions) => {
          var fb = excavacions.excavacionId.fechaTermino;
          if (fb !== null) {
            fb = Moment(excavacions.excavacionId.fechaTermino)
              .add(1, "days")
              .format("YYYY-MM-DD");
          }

          setTimeout(() => {
            var directorSelect = [];
            var directorS = null;
            if (
              excavacions.excavacionId.directorId !== null &&
              excavacions.excavacionId.directorId !== ""
            ) {
              directorSelect = this.state.directores.filter(
                (option) => option._id === excavacions.excavacionId.directorId
              );

              if (directorSelect !== []) {
                directorS = {
                  label:
                    directorSelect[0].nombres +
                    " " +
                    directorSelect[0].apellidos,
                  value: directorSelect[0]._id,
                };
              }
            }

            var profesionalesSelect = [];
            if (excavacions.excavacionId.profesionales !== []) {
              profesionalesSelect = this.state.profesionales.filter(({ _id }) =>
                excavacions.excavacionId.profesionales.includes(_id)
              );
              profesionalesSelect = profesionalesSelect.map((opt) => ({
                label: opt.nombres + " " + opt.apellidos,
                value: opt._id,
              }));
            }

            var auxiliaresSelect = [];
            if (excavacions.excavacionId.auxiliares !== []) {
              auxiliaresSelect = this.state.auxiliares.filter(({ _id }) =>
                excavacions.excavacionId.auxiliares.includes(_id)
              );
              auxiliaresSelect = auxiliaresSelect.map((opt) => ({
                label: opt.nombres + " " + opt.apellidos,
                value: opt._id,
              }));
            }

            var tipoHallazgo = null;
            if (excavacions.excavacionId.tipoHallazgo !== null) {
              tipoHallazgo = optHallazgo.filter(
                (option) =>
                  option.value === excavacions.excavacionId.tipoHallazgo
              );
            }

            var exploracionSelect = [];
            var exploracionS = null;

            if (
              excavacions.excavacionId.idExploracion !== null &&
              excavacions.excavacionId.idExploracion !== ""
            ) {
              exploracionSelect = this.state.exploraciones.filter(
                (option) =>
                  option._id === excavacions.excavacionId.idExploracion
              );
              if (exploracionSelect !== []) {
                exploracionS = {
                  label: exploracionSelect[0].nombreArea,
                  value: exploracionSelect[0]._id,
                };
              }
            }

            this.setState({
              nombreArea: excavacions.excavacionId.nombreArea,
              codigoCampo: excavacions.excavacionId.codigoCampo,
              fechaInicio: Moment(excavacions.excavacionId.fechaInicio)
                .add(1, "days")
                .format("YYYY-MM-DD"),
              fechaTermino: fb,
              geologicos: excavacions.excavacionId.datosGeologicos,
              taxonomicos: excavacions.excavacionId.datosTaxonomicos,
              selectedDirector: directorS,
              selectedProfesional: profesionalesSelect,
              selectedAuxiliar: auxiliaresSelect,
              muestraHome: excavacions.excavacionId.muestraHome,
              selectedHallazgo: tipoHallazgo,
              selectedExploracion: exploracionS,
              listArchivosDen: excavacions.excavacionId.archivosDenuncia,
              tablaBochones: this.renderTableBochones(),
              listArchivosFotos: excavacions.excavacionId.fotosExcavacion,
              listArchivosVideo: excavacions.excavacionId.videosExcavacion,
              profesionalesId: excavacions.excavacionId.profesionales,
              auxiliaresId: excavacions.excavacionId.auxiliares,
              puntoGpsExcavacion: excavacions.excavacionId.puntoGPS,
              idAreaExcavacion: excavacions.excavacionId.idArea,
            });

            this.setState({
              tableArchivosDen: this.renderTableArchivosDen(),
              tableArchivosFotos: this.renderTableArchivosFotos(),
              tableArchivosVideos: this.renderTableArchivosVideos(),
            });
          }, 1500);
        });
    }
  }

  //**Manejadores**

  handleMotivoChange = (evt) => {
    this.setState({ motivoBaja: evt.target.value });
  };

  handleIdentificadorPiezaChange = (evt) => {
    this.setState({ identificadorPieza: evt.target.value });
  };

  handleNombrePiezaChange = (evt) => {
    this.setState({ nombrePieza: evt.target.value });
  };

  handleForm1 = (event) => {
    this.setState({ tabh: false, key: "dhallazgo" });
  };

  handleSelect = (key) => {
    this.setState({ key: key });
  };

  handleForm2 = (event) => {
    this.setState({ tabgeo: false, key: "dgeo" });
  };

  handleAntForm2 = (event) => {
    this.setState({ tabbas: false, key: "dbasicos" });
  };

  handleForm3 = (event) => {
    this.setState({ tabtax: false, key: "dtax" });
  };

  handleAntForm3 = (event) => {
    this.setState({ tabh: false, key: "dhallazgo" });
  };

  handlePiezasChange = (selectedPieza) => {
    let piezas = Array.from(selectedPieza, (option) => option.value);
    let names = Array.from(selectedPieza, (option) => option.label);

    this.setState({ selectedPieza });
    this.setState({ piezasId: piezas, piezasNames: names });
  };

  renderTableBochones() {
    return this.state.bochones.map((bochon, index) => {
      return (
        <tr key={index}>
          <td>{bochon.codigoCampo}</td>
          <td>{bochon.nroBochon}</td>
          <td>{bochon.ejemplarDescripcion}</td>
          <td>{bochon.piezasDescripcion}</td>
          <td>{bochon.infoAdicional}</td>
        </tr>
      );
    });
  }

  handlePiezasModalChange = (selectedPiezaM) => {
    let piezas = Array.from(selectedPiezaM, (option) => option.value);
    let names = Array.from(selectedPiezaM, (option) => option.label);

    console.log(selectedPiezaM);
    this.setState({ selectedPiezaM });
    this.setState({ piezasId: piezas, piezasNames: names });
  };

  reemplazar(cadena) {
    var chars = {
      á: "a",
      é: "e",
      í: "i",
      ó: "o",
      ú: "u",

      à: "a",
      è: "e",
      ì: "i",
      ò: "o",
      ù: "u",
      ñ: "n",

      Á: "A",
      É: "E",
      Í: "I",
      Ó: "O",
      Ú: "U",

      À: "A",
      È: "E",
      Ì: "I",
      Ò: "O",
      Ù: "U",
      Ñ: "N",

      ä: "a",
      ë: "e",
      ï: "i",
      ö: "o",
      ü: "u",

      Ä: "A",
      Ä: "A",
      Ë: "E",
      Ï: "I",
      Ö: "O",
      Ü: "U",
    };

    var expr = /[áàéèíìóòúùñäëïöü]/gi;

    var res = cadena.replace(expr, function (e) {
      return chars[e];
    });

    return res;
  }

  renderTableArchivosDen() {
    return this.state.listArchivosDen.map((file, index) => {
      return (
        <tr key={index}>
          <td>
            <a
              href={
                urlArchivo +
                "Denuncias/" +
                this.props.match.params.id +
                "/" +
                file
              }
              disabled
              target="_blank"
            >
              {file}
            </a>
          </td>
        </tr>
      );
    });
  }

  renderTableArchivosFotos() {
    return this.state.listArchivosFotos.map((file, index) => {
      return (
        <tr key={index}>
          <td>
            <a
              href={
                urlArchivo +
                "Fotos/" +
                this.props.match.params.id +
                "/" +
                file.nombre
              }
              disabled
              target="_blank"
            >
              {file.nombre}
            </a>
          </td>
          <td>{file.descripcion}</td>
        </tr>
      );
    });
  }

  renderTableArchivosVideos() {
    return this.state.listArchivosVideo.map((file, index) => {
      return (
        <tr key={index}>
          <td>
            <a
              href={
                urlArchivo + "Videos/" + this.props.match.params.id + "/" + file
              }
              disabled
              target="_blank"
            >
              {file}
            </a>
          </td>
        </tr>
      );
    });
  }

  handleAntForm4 = (event) => {
    this.setState({ tabgeo: false, key: "dgeo" });
  };
  handleForm4 = (event) => {
    this.setState({ tabbochon: false, key: "dbochones" });
  };

  render() {
    const { validateddb } = this.state;
    const { validatedh } = this.state;
    const { validatedgeo } = this.state;
    const { validatedtax } = this.state;
    const { validatedbochon } = this.state;
    const { validatedfotos } = this.state;
    const { validatedvideos } = this.state;

    const { selectedAuxiliar } = this.state;
    let optAuxiliares = this.state.auxiliares.map((opt) => ({
      label: opt.nombres + " " + opt.apellidos,
      value: opt._id,
    }));

    const { selectedDirector } = this.state;
    let optDirectores = this.state.directores.map((opt) => ({
      label: opt.nombres + " " + opt.apellidos,
      value: opt._id,
    }));

    const { selectedProfesional } = this.state;
    let optProfesionales = this.state.profesionales.map((opt) => ({
      label: opt.nombres + " " + opt.apellidos,
      value: opt._id,
    }));

    const { selectedExploracion } = this.state;
    let optExploraciones = this.state.exploraciones.map((opt) => ({
      label: opt.nombreArea,
      value: opt._id,
    }));

    const { selectedHallazgo } = this.state;

    const { idExploracionModificar } = this.state;

    return (
      <>
        <Menu />
        <div className="row">
          <div className="col-md-12">
            <div id="contenido" align="left" className="container">
              <div className="loader" style={{ display: "none" }}></div>
              <br />
              <h3 className="page-header" align="left">
                <FontAwesomeIcon icon={faCompass} /> Editar Excavación
              </h3>
              <hr />
              <ToastContainer
                position="top-right"
                autoClose={5000}
                transition={Slide}
                hideProgressBar={true}
                newestOnTop={true}
                closeOnClick
                pauseOnHover
              />

              <Tabs
                id="tabEjemplar"
                activeKey={this.state.key}
                onSelect={this.handleSelect}
              >
                <Tab
                  eventKey="dbasicos"
                  title="Datos Básicos"
                  disabled={this.state.tabbas}
                >
                  <Form id="form1" noValidate validated={validateddb}>
                    <fieldset>
                      <legend>Datos Básicos</legend>
                      <hr />
                      <Form.Row>
                        <Form.Group className="col-sm-12" controlId="nombre">
                          <Form.Label>Nombre del Área:</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Ingrese Nombre Area"
                            required
                            disabled
                            value={this.state.nombreArea}
                          />
                        </Form.Group>
                      </Form.Row>

                      <Form.Row>
                        <Form.Group className="col-sm-6" controlId="codigo">
                          <Form.Label>Código de Campo:</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Ingrese Código"
                            disabled
                            required
                            value={this.state.codigoCampo}
                          />
                        </Form.Group>

                        <Form.Group className="col-sm-6" controlId="director">
                          <Form.Label>Director:</Form.Label>
                          <Select
                            placeholder={"Seleccione Director"}
                            options={optDirectores}
                            disabled
                            value={selectedDirector}
                            isClearable
                          />
                        </Form.Group>
                      </Form.Row>

                      <Form.Row>
                        <Form.Group className="col-sm-6" controlId="auxiliares">
                          <Form.Label>Equipo de Auxiliares:</Form.Label>
                          <Select
                            placeholder={"Seleccione..."}
                            options={optAuxiliares}
                            disabled
                            value={selectedAuxiliar}
                            isClearable
                            isMulti
                          />
                        </Form.Group>

                        <Form.Group
                          className="col-sm-6"
                          controlId="profesionales"
                        >
                          <Form.Label>Equipo de Profesionales:</Form.Label>
                          <Select
                            placeholder={"Seleccione..."}
                            options={optProfesionales}
                            disabled
                            value={selectedProfesional}
                            isClearable
                            isMulti
                          />
                        </Form.Group>
                      </Form.Row>

                      <Form.Row>
                        <Form.Group
                          className="col-sm-6"
                          controlId="fechaInicio"
                        >
                          <Form.Label>Fecha Inicio:</Form.Label>
                          <Form.Control
                            type="date"
                            value={this.state.fechaInicio}
                            disabled
                          />
                        </Form.Group>

                        <Form.Group className="col-sm-6" controlId="fbaja">
                          <Form.Label>Fecha de Término:</Form.Label>
                          <Form.Control
                            type="date"
                            value={this.state.fechaTermino}
                            disabled
                          />
                        </Form.Group>
                      </Form.Row>
                      <br />
                      <Form.Row>
                        <Button
                          variant="outline-secondary"
                          type="button"
                          id="siguiente1"
                          onClick={this.handleForm1}
                        >
                          Siguiente <FontAwesomeIcon icon={faShare} />
                        </Button>
                        &nbsp;&nbsp;
                        <Link to="/excavaciones">
                          <Button
                            variant="outline-danger"
                            type="button"
                            id="cancela"
                          >
                            <FontAwesomeIcon icon={faTimesCircle} /> Cancelar
                          </Button>
                        </Link>
                      </Form.Row>
                      <br />
                    </fieldset>
                  </Form>
                </Tab>

                <Tab
                  eventKey="dhallazgo"
                  title="Hallazgo"
                  disabled={this.state.tabh}
                >
                  <Form id="form2" noValidate validated={validatedh}>
                    <Form.Row>
                      <Form.Group className="col-sm-8" controlId="tipoHallazgo">
                        <br />
                        <Form.Label>Tipo Hallazgo:</Form.Label>

                        <Select
                          placeholder={"Seleccione..."}
                          disabled
                          value={selectedHallazgo}
                          isClearable
                        />
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      <Form.Group className="col-sm-8" controlId="filesAut">
                        <Table border="0">
                          <tbody>{this.state.tableArchivosDen}</tbody>
                        </Table>
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      <Button
                        variant="outline-secondary"
                        type="button"
                        id="anterior2"
                        onClick={this.handleAntForm2}
                      >
                        <FontAwesomeIcon icon={faReply} /> Anterior
                      </Button>
                      &nbsp;
                      <Button
                        variant="outline-secondary"
                        type="button"
                        id="siguiente2"
                        onClick={this.handleForm2}
                      >
                        Siguiente <FontAwesomeIcon icon={faShare} />
                      </Button>
                    </Form.Row>
                  </Form>
                </Tab>

                <Tab
                  eventKey="dgeo"
                  title="Datos Geográficos"
                  disabled={this.state.tabgeo}
                >
                  <Form id="form3" noValidate validated={validatedgeo}>
                    <legend>Datos Geográficos</legend>
                    <hr />
                    <Form.Row>
                      <Form.Group className="col-sm-12" controlId="exploracion">
                        <Form.Label>Exploración Asociada:</Form.Label>
                        <Select
                          placeholder={"Seleccione Exploración"}
                          disabled
                          value={selectedExploracion}
                          required
                        />
                      </Form.Group>
                    </Form.Row>
                    <br />
                    <ModificarExcavacion
                      idExploracion={idExploracionModificar}
                      excavacionId={this.props.match.params.id}
                      setPuntoGpsExcavacion={this.setPuntoGpsExcavacion}
                      setIdAreaExcavacion={this.setIdAreaExcavacion}
                      show={true}
                    />

                    <br />

                    <Form.Row>
                      <Button
                        variant="outline-secondary"
                        type="button"
                        id="anterior3"
                        onClick={this.handleAntForm3}
                      >
                        <FontAwesomeIcon icon={faReply} /> Anterior
                      </Button>
                      &nbsp;
                      <Button
                        variant="outline-secondary"
                        type="button"
                        id="siguiente3"
                        onClick={this.handleForm3}
                      >
                        Siguiente <FontAwesomeIcon icon={faShare} />
                      </Button>
                    </Form.Row>
                  </Form>
                </Tab>

                <Tab
                  eventKey="dtax"
                  title="Datos Geológicos/Taxonómicos"
                  disabled={this.state.tabtax}
                >
                  <Form id="form4" noValidate validated={validatedtax}>
                    <Form.Row>
                      <Form.Group className="col-sm-12" controlId="geologicos">
                        <Form.Label>Geológicos:</Form.Label>
                        <Form.Control
                          as="textarea"
                          disabled
                          value={this.state.geologicos}
                        />
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      <Form.Group className="col-sm-12" controlId="taxonomicos">
                        <Form.Label>Taxonómicos:</Form.Label>
                        <Form.Control
                          as="textarea"
                          disabled
                          value={this.state.taxonomicos}
                        />
                      </Form.Group>
                    </Form.Row>

                    <hr />
                    <Form.Row>
                      <Form.Group className="mx-sm-3 mb-2">
                        <Button
                          variant="outline-secondary"
                          type="button"
                          id="guardar"
                          onClick={this.handleAntForm4}
                        >
                          <FontAwesomeIcon icon={faReply} /> Anterior
                        </Button>
                        &nbsp;&nbsp;
                        <Button
                          variant="outline-secondary"
                          type="button"
                          id="volver"
                          onClick={this.handleForm4}
                        >
                          <FontAwesomeIcon icon={faShare} /> Siguiente
                        </Button>
                      </Form.Group>
                    </Form.Row>
                  </Form>
                </Tab>

                <Tab
                  eventKey="dbochones"
                  title="Bochones"
                  disabled={this.state.tabbochon}
                >
                  <Form id="form6" noValidate validated={validatedbochon}>
                    <hr />
                    <Form.Row>
                      <Table striped bordered hover responsive>
                        <thead className="thead-dark">
                          <tr>
                            <th>Cód. Campo</th>
                            <th>Nro. Bochon</th>
                            <th>Ejemplar</th>
                            <th>Piezas Asociadas</th>
                            <th>Información Adicional</th>
                          </tr>
                        </thead>
                        <tbody>{this.state.tablaBochones}</tbody>
                      </Table>
                    </Form.Row>
                  </Form>
                </Tab>

                <Tab
                  eventKey="dfotos"
                  title="Fotos"
                  disabled={this.state.tabfotos}
                >
                  <Form id="form7" noValidate validated={validatedfotos}>
                    <legend>Fotos</legend>
                    <hr />

                    <Form.Row>
                      <Form.Group className="col-sm-8" controlId="archivospdf">
                        <Table striped bordered hover responsive>
                          <thead className="thead-dark">
                            <tr>
                              <th>Nombre</th>
                              <th>Descripción</th>
                            </tr>
                          </thead>
                          <tbody>{this.state.tableArchivosFotos}</tbody>
                        </Table>
                      </Form.Group>
                    </Form.Row>
                  </Form>
                </Tab>

                <Tab
                  eventKey="dvideos"
                  title="Videos"
                  disabled={this.state.tabvideos}
                >
                  <Form id="form8" noValidate validated={validatedvideos}>
                    <legend>Videos</legend>
                    <hr />
                    <Form.Row>
                      <Form.Group className="col-sm-8" controlId="archivospdf">
                        <Table striped bordered hover responsive>
                          <thead className="thead-dark">
                            <tr>
                              <th>Nombre</th>
                            </tr>
                          </thead>
                          <tbody>{this.state.tableArchivosVideos}</tbody>
                        </Table>
                      </Form.Group>
                    </Form.Row>
                  </Form>
                </Tab>
              </Tabs>
              <br />
              <br />
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default ShowExcavacion;
