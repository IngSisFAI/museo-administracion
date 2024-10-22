import React from "react";
import { Form, Button, Tabs, Tab, Table, Modal, Alert } from "react-bootstrap";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faReply,
  faPlus,
  faTrash,
  faEdit,
  faShare,
  faTimesCircle,
  faUpload,
  faIdCard,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Select from "react-select";
import Moment from "moment";
import Menu from "../Menu";
import Cookies from "universal-cookie";
import $ from "jquery";
import axios from "axios";

const cookies = new Cookies();

//Variables Globales
const urlApi = process.env.REACT_APP_API_HOST;
const urlArchivo = process.env.REACT_APP_URL_EJEMPLARES;
const rutaEjemplares = process.env.REACT_APP_RUTA_EJEMPLARES;

const optMaterial = [
  { value: "Donación", label: "Donación" },
  { value: "Excavación realizada MUC", label: "Excavación realizada MUC" },
  { value: "Otros", label: "Otros" },
];

class ShowEjemplar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sigla: "",
      fechaIngreso: "",
      dimensionAlto: "",
      dimensionLargo: "",
      dimensionAncho: "",
      ubicacion: "",
      formacion: "",
      grupo: "",
      subgrupo: "",
      edad: "",
      periodo: "",
      era: "",
      reino: "",
      filo: "",
      clase: "",
      orden: "",
      familia: "",
      genero: "",
      especie: "",
      muestraHome: false,
      fechaBaja: "",
      motivoBaja: "",
      fotos: [],
      videos: [],
      colecciones: [],
      selectedColeccion: null,
      validated: false,
      paisesArray: [],
      preparadores: [],
      show: false,
      tabdim: false,
      key: "dbasicos",
      op: "I",
      validateddim: false,
      tabbas: false,
      validatedgeo: false,
      tabgeo: false,
      tabtax: false,
      validatedtax: false,
      tabarea: false,
      validatedarea: false,
      tabotros: false,
      validatedotros: false,
      tabfotos: false,
      validatedfotos: false,
      tabvideos: false,
      validatedvideos: false,
      prestamos: [],
      fprestamo: "",
      fdevolucion: "",
      investigador: "",
      institucion: "",
      archivos: [],
      archivosOD: [],
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
      op: "I",
      ejemplarId: "",
      modalActualizarPieza: false,
      tablaPiezas: [],
      nombre: "",
      dimensionAltoM: "",
      dimensionLargoM: "",
      dimensionAnchoM: "",
      nombreM: "",
      validateddimM: false,
      piezaMId: "",
      areaHallazgo: "",
      selectedMaterial: null,
      tipoIntervencion: "",
      autores: "",
      publicaciones: "",
      archivoCurriculum: null,
      listArchivosCV: [],
      tableArchivosCV: [],
      showSuccess: false,
      showError: false,
      tableBochones: [],
      excavaciones: [],
      selectedExcavacion: null,
      bochones: [],
      selectedBochon: null,
      selectedExcavacionM: null,
      selectedBochonM: null,
    };
  }

  //Antes de cargar el DOM
  //***********************
  componentWillMount() {
    fetch(urlApi + "/coleccion", {
      method: "get",
      headers: {
        Authorization: "Bearer " + cookies.get("token"),
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((collection) => {
        this.setState({ colecciones: collection.colecciones });
      })
      .catch(function (error) {
        console.log("Error:", error);
      });

    fetch(urlApi + "/personas", {
      method: "get",
      headers: {
        Authorization: "Bearer " + cookies.get("token"),
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.setState({
          preparadores: data.personas,
        });
      })
      .catch(function (error) {
        toast.error("Error al guardar. Intente nuevamente.");
        console.log("Hubo un problema con la petición Fetch:", error.message);
      });

    fetch(urlApi + "/piezasEjemplar/" + this.props.match.params.id, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + cookies.get("token"),
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        this.setState({
          piezas: result.piezas,
        });
        return result;
      })
      .catch(function (error) {
        toast.error("Error al guardar. Intente nuevamente.");
        console.log("Hubo un problema con la petición Fetch:", error.message);
      });

    fetch(urlApi + "/excavacion", {
      method: "get",
      headers: {
        Authorization: "Bearer " + cookies.get("token"),
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.setState({
          excavaciones: data.excavaciones,
        });
      })
      .catch(function (error) {
        toast.error("Error al conusltar. Intente nuevamente.");
        console.log("Hubo un problema con la petición Fetch:", error.message);
      });
  }

  //una vez cargado en el DOM
  //*************************
  componentDidMount() {
    if (!cookies.get("user") && !cookies.get("password")) {
      window.location.href = "/";
    } else {
      fetch(urlApi + "/ejemplarId/" + this.props.match.params.id, {
        method: "get",
        headers: {
          Authorization: "Bearer " + cookies.get("token"),
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((ejemplars) => {
          // console.log(ejemplars.ejemplarId.tipoEjemplar);
          var fb = ejemplars.ejemplarId.fechaBaja;
          if (fb !== null) {
            fb = Moment(ejemplars.ejemplarId.fechaBaja)
              .add(1, "days")
              .format("YYYY-MM-DD");
          }

          var fi = ejemplars.ejemplarId.fechaIngreso;
          if (fi !== null) {
            fi = Moment(ejemplars.ejemplarId.fechaIngreso)
              .add(1, "days")
              .format("YYYY-MM-DD");
          }

          var materialSelect = null;
          if (
            ejemplars.ejemplarId.materialIngresadoPor !== null &&
            ejemplars.ejemplarId.materialIngresadoPor !== ""
          ) {
            materialSelect = optMaterial.filter(
              (option) =>
                option.value === ejemplars.ejemplarId.materialIngresadoPor
            );
            if (materialSelect !== []) {
              materialSelect = materialSelect[0];
            } else {
              materialSelect = null;
            }
          }

          setTimeout(() => {
            var coleccionSelect = [];
            var coleccionS = null;

            if (
              ejemplars.ejemplarId.tipoColeccionId !== null &&
              ejemplars.ejemplarId.tipoColeccionId !== ""
            ) {
              coleccionSelect = this.state.colecciones.filter(
                (option) => option._id === ejemplars.ejemplarId.tipoColeccionId
              );
              if (coleccionSelect !== []) {
                coleccionS = {
                  label: coleccionSelect[0].nombre,
                  value: coleccionSelect[0]._id,
                };
              }
            }

            var preparadorSelect = [];
            var preparadorS = null;
            if (
              ejemplars.ejemplarId.preparador !== null &&
              ejemplars.ejemplarId.preparador !== ""
            ) {
              preparadorSelect = this.state.preparadores.filter(
                (option) => option._id === ejemplars.ejemplarId.preparador
              );
              if (preparadorSelect !== []) {
                preparadorS = {
                  label:
                    preparadorSelect[0].nombres +
                    " " +
                    preparadorSelect[0].apellidos,
                  value: preparadorSelect[0]._id,
                };
              }
            }

            this.setState({
              sigla: ejemplars.ejemplarId.sigla,
              selectedColeccion: coleccionS,
              fechaIngreso: fi,
              fechaBaja: fb,
              motivoBaja: ejemplars.ejemplarId.motivoBaja,
              reino: ejemplars.ejemplarId.taxonReino,
              filo: ejemplars.ejemplarId.taxonFilo,
              clase: ejemplars.ejemplarId.taxonClase,
              orden: ejemplars.ejemplarId.taxonOrden,
              familia: ejemplars.ejemplarId.taxonFamilia,
              genero: ejemplars.ejemplarId.taxonGenero,
              especie: ejemplars.ejemplarId.taxonEspecie,
              formacion: ejemplars.ejemplarId.eraGeologica.formacion,
              grupo: ejemplars.ejemplarId.eraGeologica.grupo,
              subgrupo: ejemplars.ejemplarId.eraGeologica.subgrupo,
              edad: ejemplars.ejemplarId.eraGeologica.edad,
              periodo: ejemplars.ejemplarId.eraGeologica.periodo,
              era: ejemplars.ejemplarId.eraGeologica.era,
              listArchivosFotos: ejemplars.ejemplarId.fotosEjemplar,
              listArchivosVideo: ejemplars.ejemplarId.videosEjemplar,
              ubicacion: ejemplars.ejemplarId.ubicacionMuseo,
              selectedPreparador: preparadorS,
              tipoIntervencion: ejemplars.ejemplarId.tipoIntervencion,
              autores: ejemplars.ejemplarId.autores,
              publicaciones: ejemplars.ejemplarId.publicaciones,
              selectedMaterial: materialSelect,
              listArchivosCV: ejemplars.ejemplarId.archivosCurriculum,
              observacionesAdic: ejemplars.ejemplarId.observacionesAdic,
              muestraHome: ejemplars.ejemplarId.home,
              areaHallazgo: ejemplars.ejemplarId.areaHallazgo.nombreArea,
            });

            this.setState({
              tableArchivosCV: this.renderTableArchivosCV(),
              tableArchivosFotos: this.renderTableArchivosFotos(),
              tableArchivosVideos: this.renderTableArchivosVideos(),
              tablaPiezas: this.renderTablePiezas(),
            });
          }, 1500);
        });
    }
  }

  //Manejadores de cada campo

  handleShow = (evt) => {
    this.setState({ show: true });
  };

  handleClose = (evt) => {
    this.setState({ show: false });
  };

  handleTipoChange = (selectedTipo) => {
    this.setState({ selectedTipo });
    //  console.log(`Option selected:`, selectedTipo);
  };

  handleFPrestamoChange = (evt) => {
    this.setState({ fprestamo: evt.target.value });
  };

  handleFDevolucionChange = (evt) => {
    this.setState({ fdevolucion: evt.target.value });
  };

  handleInvestigadorChange = (evt) => {
    this.setState({ investigador: evt.target.value });
  };

  handleInstitucionChange = (evt) => {
    this.setState({ institucion: evt.target.value });
  };

  handleForm1 = (event) => {
    this.setState({ tabdim: false, key: "ddimensiones" });
  };

  handleSelect = (key) => {
    this.setState({ key: key });
  };

  handleForm2 = (event) => {
    this.setState({ tabgeo: false, key: "dgeologicos" });
  };

  handleAntForm2 = (event) => {
    this.setState({ tabbas: false, key: "dbasicos" });
  };

  handleForm3 = (event) => {
    this.setState({ tabtax: false, key: "dtaxonomicos" });
  };

  handleAntForm3 = (event) => {
    this.setState({ tabdim: false, key: "ddimensiones" });
  };

  handleForm4 = (event) => {
    this.setState({ tabarea: false, key: "darea" });
  };

  handleAntForm4 = (event) => {
    this.setState({ tabgeo: false, key: "dgeologicos" });
  };

  handleForm5 = (event) => {
    this.setState({ tabotros: false, key: "dotros" });
  };

  handleAntForm5 = (event) => {
    this.setState({ tabtax: false, key: "dtaxonomicos" });
  };

  handleForm6 = (event) => {
    this.setState({ tabotros: false, key: "dotros"});
  };

  handleAntForm6 = (event) => {
    this.setState({ tabarea: false, key: "darea" });
  };

  handleForm7 = (event) => {
    this.setState({ tabfotos: false, key: "dfotos"});
  };

  handleAntForm7 = (event) => {
    this.setState({ tabarea: false, key: "darea" });
  };

  handleForm8 = (event) => {
    this.setState({ tabvideos: false, key: "dvideos" });
  };

  handleAntForm8 = (event) => {
    this.setState({ tabotros: false, key: "dotros"});
  };

  handleAntForm9 = (event) => {
    this.setState({ tabfotos: false, key: "dfotos"});
  };
  renderTablePiezas() {
    return this.state.piezas.map((pieza, index) => {
      return (
        <tr key={index}>
          <td>{pieza.identificador}</td>
          <td>{pieza.medidasPieza.alto}</td>
          <td>{pieza.medidasPieza.largo}</td>
          <td>{pieza.medidasPieza.ancho}</td>
          <td>{pieza.excavacionDesc}</td>
          <td>{pieza.bochonDesc}</td>
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

  renderTableArchivosCV() {
    return this.state.listArchivosCV.map((file, index) => {
      return (
        <tr key={index}>
          <td>
            <a
              href={
                urlArchivo +
                "Curriculum/" +
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

  renderTableBochones() {
    return this.state.bochones.map((bochon, index) => {
      return (
        <tr key={index}>
          <td>{bochon.codigoCampo}</td>
          <td>{bochon.nroBochon}</td>
          <td>
            {" "}
            <Link to={"/editExcavacion/" + bochon.excavacionId[0]._id}>
              {bochon.excavacionId[0].nombreArea}
            </Link>
          </td>
        </tr>
      );
    });
  }

  render() {
    const { validated } = this.state;
    const { validateddim } = this.state;
    const { validateddimM } = this.state;
    const { validatedgeo } = this.state;
    const { validatedtax } = this.state;
    const { validatedarea } = this.state;

    const { validatedotros } = this.state;
    const { validatedfotos } = this.state;
    const { validatedvideos } = this.state;

    const { selectedPreparador } = this.state;
    let optPreparador = this.state.preparadores.map((opt) => ({
      label: opt.nombres + " " + opt.apellidos,
      value: opt._id,
    }));

    const { selectedColeccion } = this.state;
    let optColecciones = this.state.colecciones.map((opt) => ({
      label: opt.nombre,
      value: opt._id,
    }));

    const { selectedMaterial } = this.state;

    const { selectedExcavacion } = this.state;
    const { selectedExcavacionM } = this.state;
    let optExcavaciones = this.state.excavaciones.map((opt) => ({
      label: opt.nombreArea + " (Cód. Campo: " + opt.codigoCampo + ")",
      value: opt._id,
    }));

    const { selectedBochon } = this.state;
    const { selectedBochonM } = this.state;
    let optBochones = this.state.bochones.map((opt) => ({
      label:
        "Cód. Campo: " + opt.codigoCampo + " - Nro. Bochón:" + opt.nroBochon,
      value: opt._id,
    }));

    return (
      <>
        <Menu />
        <div className="row">
          <div className="col-md-12">
            <div id="contenido" align="left" className="container">
              <div className="loader" style={{ display: "none" }}></div>
              <br />
              <h3 className="page-header" align="left">
                <FontAwesomeIcon icon={faIdCard} /> Editar Ficha de Ingreso
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
                  <Form id="form1" noValidate validated={validated}>
                    <Form.Row>
                      <Form.Group className="col-sm-12" controlId="sigla">
                        <Form.Label>Sigla:</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Obligatorio"
                          autoComplete="off"
                          disabled
                          value={this.state.sigla}
                        />
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      <Form.Group className="col-sm-4" controlId="fechaIngreso">
                        <Form.Label>Fecha Ingreso:</Form.Label>
                        <Form.Control
                          type="date"
                          value={this.state.fechaIngreso}
                          disabled
                        />
                      </Form.Group>

                      <Form.Group className="col-sm-8" controlId="coleccion">
                        <Form.Label>Tipo Colección:</Form.Label>

                        <Select
                          placeholder={"Seleccione Tipo Colección"}
                          disabled
                          value={selectedColeccion}
                          isClearable
                        />
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      <Form.Group className="col-sm-4" controlId="fechaBaja">
                        <Form.Label>Fecha Baja:</Form.Label>
                        <Form.Control
                          type="date"
                          value={this.state.fechaBaja}
                          disabled
                        />
                      </Form.Group>

                      <Form.Group className="col-sm-8" controlId="motivoBaja">
                        <Form.Label>Motivo Baja:</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={this.state.motivoBaja}
                          disabled
                        />
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      <Button
                        variant="outline-secondary"
                        type="button"
                        id="siguiente"
                        onClick={this.handleForm1}
                      >
                        Siguiente <FontAwesomeIcon icon={faShare} />
                      </Button>
                      &nbsp;&nbsp;
                      <Link to="/ejemplares">
                        <Button
                          variant="outline-danger"
                          type="button"
                          id="cancela"
                        >
                          <FontAwesomeIcon icon={faTimesCircle} /> Cancelar
                        </Button>
                      </Link>
                    </Form.Row>
                  </Form>
                </Tab>

                <Tab
                  eventKey="ddimensiones"
                  title="Piezas"
                  disabled={this.state.tabdim}
                >
                  <hr></hr>
                  <Form id="form2" noValidate validated={validateddim}>
                    <Form.Row>
                      <Table striped bordered hover responsive>
                        <thead className="thead-dark">
                          <tr>
                            <th>Nombre</th>
                            <th>Alto</th>
                            <th>Largo</th>
                            <th>Ancho</th>
                            <th>Excavación</th>
                            <th>Bochón</th>
                          </tr>
                        </thead>
                        <tbody>{this.state.tablaPiezas}</tbody>
                      </Table>
                    </Form.Row>

                    <Form.Row>
                      <Button
                        variant="outline-secondary"
                        type="button"
                        id="anterior1"
                        onClick={this.handleAntForm2}
                      >
                        <FontAwesomeIcon icon={faReply} /> Anterior
                      </Button>
                      &nbsp;
                      <Button
                        variant="outline-secondary"
                        type="button"
                        id="siguiente1"
                        onClick={this.handleForm2}
                      >
                        Siguiente <FontAwesomeIcon icon={faShare} />
                      </Button>
                    </Form.Row>
                  </Form>
                </Tab>
                <Tab
                  eventKey="dgeologicos"
                  title="Datos Geológicos"
                  disabled={this.state.tabgeo}
                >
                  <Form id="form3" noValidate validated={validatedgeo}>
                    <Form.Row>
                      <Form.Group className="col-sm-4" controlId="formacion">
                        <Form.Label>Formación:</Form.Label>
                        <Form.Control
                          type="text"
                          autoComplete="off"
                          disabled
                          value={this.state.formacion}
                        />
                      </Form.Group>

                      <Form.Group className="col-sm-4" controlId="grupo">
                        <Form.Label>Grupo:</Form.Label>
                        <Form.Control
                          type="text"
                          autoComplete="off"
                          disabled
                          value={this.state.grupo}
                        />
                      </Form.Group>

                      <Form.Group className="col-sm-4" controlId="subgrupo">
                        <Form.Label>Subgrupo:</Form.Label>
                        <Form.Control
                          type="text"
                          autoComplete="off"
                          disabled
                          value={this.state.subgrupo}
                        />
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      <Form.Group className="col-sm-4" controlId="edad">
                        <Form.Label>Edad:</Form.Label>
                        <Form.Control
                          type="text"
                          autoComplete="off"
                          disabled
                          value={this.state.edad}
                        />
                      </Form.Group>

                      <Form.Group className="col-sm-4" controlId="perido">
                        <Form.Label>Período:</Form.Label>
                        <Form.Control
                          type="text"
                          autoComplete="off"
                          disabled
                          value={this.state.periodo}
                        />
                      </Form.Group>

                      <Form.Group className="col-sm-4" controlId="era">
                        <Form.Label>Era:</Form.Label>
                        <Form.Control
                          type="text"
                          autoComplete="off"
                          disabled
                          value={this.state.era}
                        />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Button
                        variant="outline-secondary"
                        type="button"
                        id="anterior2"
                        onClick={this.handleAntForm3}
                      >
                        <FontAwesomeIcon icon={faReply} /> Anterior
                      </Button>
                      &nbsp;
                      <Button
                        variant="outline-secondary"
                        type="button"
                        id="siguiente2"
                        onClick={this.handleForm3}
                      >
                        Siguiente <FontAwesomeIcon icon={faShare} />
                      </Button>
                    </Form.Row>
                  </Form>
                </Tab>
                <Tab
                  eventKey="dtaxonomicos"
                  title="Datos Taxonómicos"
                  disabled={this.state.tabtax}
                >
                  <Form id="form4" noValidate validated={validatedtax}>
                    <Form.Row>
                      <Form.Group className="col-sm-4" controlId="reino">
                        <Form.Label>Reino:</Form.Label>
                        <Form.Control
                          type="text"
                          autoComplete="off"
                          disabled
                          value={this.state.reino}
                        />
                      </Form.Group>

                      <Form.Group className="col-sm-4" controlId="filo">
                        <Form.Label>Filo:</Form.Label>
                        <Form.Control
                          type="text"
                          autoComplete="off"
                          disabled
                          value={this.state.filo}
                        />
                      </Form.Group>

                      <Form.Group className="col-sm-4" controlId="clase">
                        <Form.Label>Clase:</Form.Label>
                        <Form.Control
                          type="text"
                          autoComplete="off"
                          disabled
                          value={this.state.clase}
                        />
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      <Form.Group className="col-sm-4" controlId="orden">
                        <Form.Label>Orden:</Form.Label>
                        <Form.Control
                          type="text"
                          autoComplete="off"
                          disabled
                          value={this.state.orden}
                        />
                      </Form.Group>

                      <Form.Group className="col-sm-4" controlId="familia">
                        <Form.Label>Familia:</Form.Label>
                        <Form.Control
                          type="text"
                          autoComplete="off"
                          disabled
                          value={this.state.familia}
                        />
                      </Form.Group>

                      <Form.Group className="col-sm-4" controlId="genero">
                        <Form.Label>Género:</Form.Label>
                        <Form.Control
                          type="text"
                          autoComplete="off"
                          disabled
                          value={this.state.genero}
                        />
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      <Form.Group className="col-sm-12" controlId="especie">
                        <Form.Label>Especie:</Form.Label>
                        <Form.Control
                          type="text"
                          autoComplete="off"
                          disabled
                          value={this.state.especie}
                        />
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      <Button
                        variant="outline-secondary"
                        type="button"
                        id="anterior3"
                        onClick={this.handleAntForm4}
                      >
                        <FontAwesomeIcon icon={faReply} /> Anterior
                      </Button>
                      &nbsp;
                      <Button
                        variant="outline-secondary"
                        type="button"
                        id="siguiente3"
                        onClick={this.handleForm4}
                      >
                        Siguiente <FontAwesomeIcon icon={faShare} />
                      </Button>
                    </Form.Row>
                  </Form>
                </Tab>
                <Tab
                  eventKey="darea"
                  title="Área de Hallazgo"
                  disabled={this.state.tabarea}
                >
                  <Form id="form5" noValidate validated={validatedarea}>
                    <Form.Row>
                      <Form.Group
                        className="col-sm-12"
                        controlId="areaHallazgo"
                      >
                        <Form.Label>Nombre Área:</Form.Label>
                        <Form.Control
                          as="textarea"
                          disabled
                          value={this.state.areaHallazgo}
                        />
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      <Button
                        variant="outline-secondary"
                        type="button"
                        id="anterior4"
                        onClick={this.handleAntForm5}
                      >
                        <FontAwesomeIcon icon={faReply} /> Anterior
                      </Button>
                      &nbsp;
                      <Button
                        variant="outline-secondary"
                        type="button"
                        id="siguiente4"
                        onClick={this.handleForm5}
                      >
                        Siguiente <FontAwesomeIcon icon={faShare} />
                      </Button>
                    </Form.Row>
                  </Form>
                </Tab>

                <Tab
                  eventKey="dotros"
                  title="Otros Datos"
                  disabled={this.state.tabotros}
                >
                  <Form id="form7" noValidate validated={validatedotros}>
                    <Form.Row>
                      <Form.Group className="col-sm-12" controlId="ubicacion">
                        <Form.Label>Ubicación:</Form.Label>
                        <Form.Control
                          type="text"
                          autoComplete="off"
                          disabled
                          value={this.state.ubicacion}
                        />
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      <Form.Group className="col-sm-6" controlId="ingresadoPor">
                        <Form.Label>Material Ingresado Por:</Form.Label>

                        <Select
                          placeholder={"Seleccione Opción"}
                          disabled
                          value={selectedMaterial}
                          isClearable
                        />
                      </Form.Group>

                      <Form.Group className="col-sm-6" controlId="preparador">
                        <Form.Label>Preparador:</Form.Label>
                        <Select
                          placeholder={"Seleccione Opción"}
                          disabled
                          value={selectedPreparador}
                          isClearable
                        />
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      <Form.Group
                        className="col-sm-12"
                        controlId="tipoIntervencion"
                      >
                        <Form.Label>Tipo de Intervención:</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={this.state.tipoIntervencion}
                          disabled
                        />
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      <Form.Group className="col-sm-12" controlId="autores">
                        <Form.Label>Autores:</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={this.state.autores}
                          disabled
                        />
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      <Form.Group
                        className="col-sm-12"
                        controlId="publicaciones"
                      >
                        <Form.Label>Publicaciones:</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={this.state.publicaciones}
                          disabled
                        />
                      </Form.Group>
                    </Form.Row>

                  <hr></hr>

                    <Form.Row>
                      <Form.Group className="col-sm-6" controlId="archivopdf">
                        <Table striped bordered hover responsive>
                          <thead className="thead-dark">
                            <tr>
                              <th>Nombre</th>
                            </tr>
                          </thead>
                          <tbody>{this.state.tableArchivosCV}</tbody>
                        </Table>
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      <Form.Group
                        className="col-sm-12"
                        controlId="observacionesAdic"
                      >
                        <Form.Label>Observaciones Adicionales:</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={this.state.observacionesAdic}
                          disabled
                        />
                      </Form.Group>
                    </Form.Row>

                    <hr />
                    <Form.Row>
                    <Form.Row>
                      <Button
                        variant="outline-secondary"
                        type="button"
                        id="anterior4"
                        onClick={this.handleAntForm7}
                      >
                        <FontAwesomeIcon icon={faReply} /> Anterior
                      </Button>
                      &nbsp;
                      <Button
                        variant="outline-secondary"
                        type="button"
                        id="siguiente4"
                        onClick={this.handleForm7}
                      >
                        Siguiente <FontAwesomeIcon icon={faShare} />
                      </Button>
                    </Form.Row>
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
                  <Form.Row>
                      <Button
                        variant="outline-secondary"
                        type="button"
                        id="anterior4"
                        onClick={this.handleAntForm8}
                      >
                        <FontAwesomeIcon icon={faReply} /> Anterior
                      </Button>
                      &nbsp;
                      <Button
                        variant="outline-secondary"
                        type="button"
                        id="siguiente4"
                        onClick={this.handleForm8}
                      >
                        Siguiente <FontAwesomeIcon icon={faShare} />
                      </Button>
                    </Form.Row>
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
                    <Form.Row>
                      <Button
                        variant="outline-secondary"
                        type="button"
                        id="anterior4"
                        onClick={this.handleAntForm9}
                      >
                        <FontAwesomeIcon icon={faReply} /> Anterior
                      </Button>
                      </Form.Row>
                  </Form>
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default ShowEjemplar;
