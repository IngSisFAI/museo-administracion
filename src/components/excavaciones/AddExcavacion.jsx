import React from "react";
import { Form, Button, Tabs, Tab, Table, Modal } from "react-bootstrap";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faReply, faCompass, faTrash, faPlus, faShare, faEdit, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Select from "react-select";
import CrearExcavacion from "../../areaGeospatial/CrearExcavacion";
import Menu from "./../Menu";
import Cookies from "universal-cookie";

const cookies = new Cookies();

//Variables Globales
const urlApi = process.env.REACT_APP_API_HOST;
const urlArchivo = process.env.REACT_APP_URL_EXCAVACIONES;
const rutaExcavaciones = process.env.REACT_APP_RUTA_EXCAVACIONES;


class AddExcavacion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      auxiliares: [],
      auxiliaresId: [],
      directores: [],
      profesionales: [],
      profesionalesId: [],
      exploraciones: [],
      paises: [],
      selectedPais: null,
      provincias: [],
      selectedProvincia: null,
      ciudades: [],
      selectedCiudad: null,
      nombre: "",
      descripcion: "",
      codigo: "",
      fechaInicio: "",
      fechaTermino: "",
      motivoBaja: "",
      muestraHome: false,
      selectedExploracion: "",
      selectedAuxiliar: null,
      selectedDirector: null,
      selectedProfesional: null,
      muestra: false,
      idAreaExcavacion: "",
      puntoGpsExcavacion: {},
      validateddb: false,
      tabbas: false,
      tabh: true,
      validatedh: false,
      archivosD: [],
      tabgeo: true,
      validatedgeo: false,
      tabtax: true,
      validatedtax: false,
      geologicos: '',
      taxonomicos: '',
      tabpiezas: true,
      validatedpiezas: false,
      tabbochon: true,
      validatedbochon: false,
      nombrePieza: '',
      identificador: '',
      codigoCampo: '',
      nroBochon: '',
      infoAdicional: '',
      piezasAsociadas: [],
      piezas: [],
      formPiezas: {
        idPieza: "",
        identificadorPieza: "",
        nombrePieza: "",
        descripcionPieza: ""
      },
      identificadorPieza: '',
      nombrePieza: '',
      descripcionPieza: '',
      modalActualizarPieza: false,
      selectedPieza: null,
      piezasId: [],
      bochones: [],
      piezas: [],
      formBochones: {
        idBochon: "",
        codigoCampoM: "",
        nroBochonM: "",
        piezasAsociadasM: [],
        infoAdicionalM: "",
        piezasAsociadasNamesM: []
      },
      piezasNames: [],
      modalActualizarBochon: false,
      piezasIdModal: [],
      selectedPiezaM: null,
      key: 'dbasicos',
    };
  }

  componentDidMount() {
    if (!cookies.get("user") && !cookies.get("password")) {
      window.location.href = "/";
    } else {
      fetch(urlApi + '/personas', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + cookies.get('token')
        }
      })
        .then((response) => {
          return response.json();
        })
        .then((empleados) => {
          this.setState({
            auxiliares: empleados.personas,
            directores: empleados.personas,
            profesionales: empleados.personas,
          });

          fetch(urlApi + "/exploracion", {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + cookies.get('token')
            }
          })
            .then((response) => {
              return response.json();
            })
            .then((explorations) => {
              //console.log(explorations.exploraciones)
              this.setState({ exploraciones: explorations.exploraciones });
            }).catch(function (error) {
              toast.error("Error al consultar. Intente nuevamente.");
              console.log(
                "Hubo un problema con la petición Fetch:",
                error.message
              );
            });

        }).catch(function (error) {
          toast.error("Error al consultar. Intente nuevamente.");
          console.log(
            "Hubo un problema con la petición Fetch:",
            error.message
          );
        });


    }
  }

  setIdAreaExcavacion = (idArea) => this.setState({ idAreaExcavacion: idArea });

  setPuntoGpsExcavacion = (puntoGps) =>
    this.setState({ puntoGpsExcavacion: puntoGps });

  handleMuestraChange(evt) {
    this.setState({ muestraHome: evt.target.checked });
  }

  handleNombreChange = (evt) => {
    this.setState({ nombre: evt.target.value });
  };


  handleCodigoChange = (evt) => {
    this.setState({ codigo: evt.target.value });
  };

  handleFinicioChange = (evt) => {
    this.setState({ fechaInicio: evt.target.value });
  };

  handleFTerminoChange = (evt) => {
    this.setState({ fechaTermino: evt.target.value });
  };

  handleMotivoChange = (evt) => {
    this.setState({ motivoBaja: evt.target.value });
  };

  handleAuxiliaresChange = (selectedAuxiliar) => {
    let auxiliares = Array.from(selectedAuxiliar, option => option.value);
    this.setState({ selectedAuxiliar });
    this.setState({ auxiliaresId: auxiliares });
  };

  handleDirectorChange = (selectedDirector) => {
    this.setState({ selectedDirector });
  };

  handleProfesionalesChange = (selectedProfesional) => {
    let profesionales = Array.from(selectedProfesional, option => option.value);
    this.setState({ selectedProfesional });
    this.setState({ profesionalesId: profesionales });
  };

  handleExploracionesChange = (selectedExploracion) => {
    this.setState({ selectedExploracion });
  };

  handleGeologicosChange = (evt) => {
    this.setState({ geologicos: evt.target.value });
  };

  handleTaxonomicosChange = (evt) => {
    this.setState({ taxonomicos: evt.target.value });
  };

  handleIdentificadorPiezaChange = (evt) => {
    this.setState({ identificadorPieza: evt.target.value });
  };

  handleNombrePiezaChange = (evt) => {
    this.setState({ nombrePieza: evt.target.value });
  };

  handleCodCampoChange = (evt) => {
    this.setState({ codigoCampo: evt.target.value });
  };

  handleInfoAdicionalChange = (evt) => {
    this.setState({ infoAdicional: evt.target.value });
  };

  handleNroBochonChange = (evt) => {
    this.setState({ nroBochon: evt.target.value });
  };

  handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
      if (
        this.state.selectedExploracion == "" ||
        this.state.selectedExploracion == null
      ) {
        toast.error("Ingrese datos obligatorios. Seleccione una Exploración!");
      } else {
        toast.error("Ingrese datos obligatorios.");
      }
    } else {
      if (
        this.state.selectedExploracion == "" ||
        this.state.selectedExploracion == null
      ) {
        toast.error("Seleccione una Exploración!");
      } else {
        var idDirector = "";
        var nameDirector = "";
        if (this.state.selectedDirector !== null) {
          idDirector = this.state.selectedDirector.value;
          nameDirector = this.state.selectedDirector.label;
        }

        var idColector = "";
        if (this.state.selectedColector !== null) {
          idColector = this.state.selectedColector.value;
        }

        var idPaleontologo = "";
        if (this.state.selectedPaleontologo !== null) {
          idPaleontologo = this.state.selectedPaleontologo.value;
        }

        var idExploracion = "";
        if (this.state.selectedExploracion !== null) {
          idExploracion = this.state.selectedExploracion.value;
        }

        var idCountry = "";

        if (this.state.selectedPais !== null) {
          idCountry = this.state.selectedPais.value;
        }

        var idProv = "";
        if (this.state.selectedProvincia !== null) {
          idProv = this.state.selectedProvincia.value;
        }

        var idCity = "";
        if (this.state.selectedCiudad !== null) {
          idCity = this.state.selectedCiudad.value;
        }

        var data = {
          nombre: this.state.nombre,
          descripcion: this.state.descripcion,
          codigo: this.state.codigo,
          fechaInicio: this.state.fechaInicio,
          fechaBaja: this.state.fbaja,
          motivoBaja: this.state.motivoBaja,
          directorId: idDirector,
          director: nameDirector,
          colector: idColector,
          paleontologo: idPaleontologo,
          idArea: this.state.idAreaExcavacion,
          puntoGPS: this.state.puntoGpsExcavacion,
          muestraHome: this.state.muestra,
          idExploracion: idExploracion,
          idPais: idCountry,
          idProvincia: idProv,
          idCiudad: idCity,
          muestraHome: this.state.muestraHome,
          bochonesEncontrados: []
        };

        fetch("http://museo.fi.uncoma.edu.ar:3006/api/excavacion", {
          method: "post",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then(function (response) {
            if (response.ok) {
              toast.success("¡Se guardó la Excavacion con Éxito!");
              setTimeout(() => {
                window.location.replace("/excavaciones");
              }, 1500);
            }
          })
          .catch(function (error) {
            toast.error("Error al guardar. Intente nuevamente.");
            console.log(
              "Hubo un problema con la petición Fetch:",
              error.message
            );
          });
      }
    }

    this.setState({ validated: true });
  };

  handleBlur = (evt) => {
    fetch(
      "http://museo.fi.uncoma.edu.ar:3006/api/excavacionFiltroCode/" +
      evt.target.value
    )
      .then((response) => {
        return response.json();
      })
      .then((excavacions) => {
        console.log(excavacions.excavaciones.length);
        if (excavacions.excavaciones.length > 0) {
          toast.error("Existe Excavación con ese Código. Ingrese uno nuevo.");
          this.setState({ codigo: "" });
          document.getElementById("codigo").focus();
        }
      });
  };

  filehandleChange = (event) => {

    const files = event.target.files;
    var arrayFiles = this.state.archivosD;


    Array.from(files).forEach(file => {
      var key = Math.floor(Math.random() * 1000);
      file.id = key;
      arrayFiles.push(file)
    })
    this.setState({ archivosD: arrayFiles });

    console.log('SALIDA::', arrayFiles)
    //aca deberiamos mover el archivo a la carpeta 

  }

  renderTableDataDenuncia() {

    return this.state.archivosD.map((file, index) => {

      return (
        <tr key={index}>
          <td>
            <Button variant="danger" type="button" id="eliminarOD" onClick={() => this.eliminarArchivoDenuncia(file)}>
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </td>
          <td>{file.name}</td>

        </tr>
      )
    })

  }

  handleForm1 = (event) => {

    const form = document.getElementById("form1");
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {

      /*var data={
        "nombreArea": this.state.nombreArea,
        "codigoCampo": this.state.codigoCampo,
        "fechaInicio": this.state.fechaInicio,
        "fechaTermino": this.state.fechaTermino,
        "director": this.state.director,
        "directorId": this.state.directorId, 
        "auxiliares": this.state.auxiliaresId,
        "profesionales": this.state.profesionalesId,
        "muestraHome": this.state.muestraHome,
        "tipoHallazgo": this.state.tipoHallazgo,
        "archivoDenuncia": this.state.archivoDenuncia, 
        "idExploracion": this.state.exploracionId,
        "datosGeologicos": this.state.datosGeologicos,
        "datosTaxonomicos": this.state.datosTaxonomicos,
        "idArea": "",
        "puntoGps": {},
        "idCiudad":"",
        "idProvincia": "",
        "idPais": "",
        "bochonesEncontrados": [],
        "fotosExcavacion": [],
        "videosExcavacion": []

      }*/

      var data = {
        "nombreArea": this.state.nombreArea,
        "codigoCampo": this.state.codigoCampo,
        "fechaInicio": this.state.fechaInicio,
        "fechaTermino": this.state.fechaTermino,
        "director": this.state.director,
        "directorId": this.state.directorId,
        "auxiliares": this.state.auxiliaresId,
        "profesionales": this.state.profesionalesId,
        "muestraHome": this.state.muestraHome,
        "tipoHallazgo": "",
        "archivoDenuncia": "",
        "idExploracion": "",
        "datosGeologicos": "",
        "datosTaxonomicos": "",
        "idArea": "",
        "puntoGps": {},
        "idCiudad": "",
        "idProvincia": "",
        "idPais": "",
        "bochonesEncontrados": [],
        "fotosExcavacion": [],
        "videosExcavacion": []

      }

      fetch(urlApi + "/excavacion", {
        method: "post",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + cookies.get('token')
        },
      })
        .then(function (response) {
          if (response.ok) {
            console.log("¡Se guardó la Excavacion con Éxito!");
            this.setState({ tabh: false, key: 'dhallazgo' });
          }
        })
        .catch(function (error) {
          toast.error("Error al guardar. Intente nuevamente.");
          console.log(
            "Hubo un problema con la petición Fetch:",
            error.message
          );
        });

    }
    this.setState({ validateddb: true });
  }

  handleSelect = (key) => {
    this.setState({ key: key });

  }

  handleForm2 = (event) => {
    const form = document.getElementById("form2");
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      this.setState({ tabgeo: false, key: 'dgeo' });

    }
    this.setState({ validatedh: true });
  }

  handleAntForm2 = (event) => {

    this.setState({ tabbas: false, key: 'dbasicos' });

  }

  handleForm3 = (event) => {
    const form = document.getElementById("form3");
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      this.setState({ tabtax: false, key: 'dtax' });

    }
    this.setState({ validatedgeo: true, tabpiezas: false, tabbochon: false });
  }

  handleAntForm3 = (event) => {

    this.setState({ tabh: false, key: 'dhallazgo' });

  }


  insertarPieza = () => {

    //aca guardaria en BD y haria un select luego de los prestamos asociados al ejemplar y lo cargamos en el array prestamos
    var piezas = this.state.piezas
    var pieza = {
      "idPieza": Math.floor(Math.random() * 100),
      "identificadorPieza": this.state.identificadorPieza,
      "nombrePieza": this.state.nombrePieza,
      "descripcionPieza": this.state.descripcionPieza,
    }
    piezas.push(pieza)
    this.setState({ piezas: piezas, identificadorPieza: '', nombrePieza: '', descripcionPieza: '' })

  }

  renderTableDataPiezas() {

    return this.state.piezas.map((pieza) => {

      return (
        <tr key={pieza.idPieza}>
          <td><Button variant="secondary" type="button" id="editar" onClick={() => this.mostrarModalActualizarPieza(pieza)}>
            <FontAwesomeIcon icon={faEdit} />
          </Button>
            &nbsp;
            <Button variant="danger" type="button" id="eliminar" onClick={() => this.eliminarPieza(pieza)}>
              <FontAwesomeIcon icon={faTrash} />
            </Button></td>
          <td>{pieza.identificadorPieza}</td>
          <td>{pieza.nombrePieza}</td>
          <td>{pieza.descripcionPieza}</td>

        </tr>
      )
    })



  }

  handleDescPiezaChange = (evt) => {
    this.setState({ descripcionPieza: evt.target.value });
  };

  eliminarPieza = (dato) => {
    //aca tambien hay que eliminar en la BD y traer los prestamos
    var opcion = window.confirm("¿Está seguro que deseas eliminar la Pieza?");
    if (opcion == true) {
      var contador = 0;
      var arreglo = this.state.piezas;
      arreglo.map((registro) => {
        if (dato.id == registro.id) {
          arreglo.splice(contador, 1);
        }
        contador++;
      });
      this.setState({ piezas: arreglo });
    }
  };

  mostrarModalActualizarPieza = (dato) => {
    console.log(dato);
    this.setState({
      formPiezas: dato,
      modalActualizarPieza: true,
    });
  };

  cerrarModalActualizarPieza = () => {
    this.setState({ modalActualizarPieza: false });
  };

  handleChange = (e) => {
    console.log(e.target.name)
    this.setState({
      formPiezas: {
        ...this.state.formPiezas,
        [e.target.name]: e.target.value,
      },
    });
  };

  editarPieza = (dato) => {
    //update en la BD
    var contador = 0;
    var arreglo = this.state.piezas;
    arreglo.map((registro) => {
      if (dato.idPieza == registro.idPieza) {
        arreglo[contador].identificadorPieza = dato.identificadorPieza;
        arreglo[contador].nombrePieza = dato.nombrePieza;
        arreglo[contador].descripcionPieza = dato.descripcionPieza;
      }
      contador++;
    });
    this.setState({ piezas: arreglo, modalActualizarPieza: false });
  };

  handlePiezasChange = (selectedPieza) => {
    let piezas = Array.from(selectedPieza, option => option.value);
    let names = Array.from(selectedPieza, option => option.label);

    this.setState({ selectedPieza });
    this.setState({ piezasId: piezas, piezasNames: names });
  };

  insertarBochon = () => {

    //aca guardaria en BD y haria un select luego de los prestamos asociados al ejemplar y lo cargamos en el array prestamos
    var bochones = this.state.bochones
    var bochon = {
      "idBochon": Math.floor(Math.random() * 100),
      "codigoCampoM": this.state.codigoCampo,
      "nroBochonM": this.state.nroBochon,
      "infoAdicionalM": this.state.infoAdicional,
      "piezasAsociadasM": this.state.piezasId,
      "piezasAsociadasNamesM": this.state.piezasNames
    }
    bochones.push(bochon)
    this.setState({ bochones: bochones, codigoCampo: '', nroBochon: '', infoAdicional: '', piezasId: [], selectedPieza: null, piezasNames: [] })

  }

  renderTableDataBochones() {

    return this.state.bochones.map((bochon) => {

      return (
        <tr key={bochon.idBochon}>
          <td><Button variant="secondary" type="button" id="editar" onClick={() => this.mostrarModalActualizarBochon(bochon)}>
            <FontAwesomeIcon icon={faEdit} />
          </Button>
            &nbsp;
            <Button variant="danger" type="button" id="eliminar" onClick={() => this.eliminarBochon(bochon)}>
              <FontAwesomeIcon icon={faTrash} />
            </Button></td>
          <td>{bochon.codigoCampoM}</td>
          <td>{bochon.nroBochonM}</td>
          <td>{(bochon.piezasAsociadasNamesM).toString()}</td>
          <td>{bochon.infoAdicionalM}</td>

        </tr>
      )
    })



  }

  mostrarModalActualizarBochon = (dato) => {
    let optPiezasM = this.state.piezas.map((opt) => ({
      label: '(' + opt.identificadorPieza + ') ' + opt.nombrePieza,
      value: opt.idPieza,
    }));
    var piezasSelect = []
    piezasSelect = optPiezasM.filter(({ value }) => dato.piezasAsociadasM.includes(value))


    this.setState({
      formBochones: dato,
      modalActualizarBochon: true,
      selectedPiezaM: piezasSelect,
      piezasId: dato.piezasAsociadasM,
      piezasNames: dato.piezasAsociadasNamesM
    });
  };

  cerrarModalActualizarBochon = () => {
    this.setState({ modalActualizarBochon: false });
  };

  handlePiezasModalChange = (selectedPiezaM) => {
    let piezas = Array.from(selectedPiezaM, option => option.value);
    let names = Array.from(selectedPiezaM, option => option.label);

    console.log(selectedPiezaM)
    this.setState({ selectedPiezaM });
    this.setState({ piezasId: piezas, piezasNames: names });
  };

  handleChangeB = (e) => {
    console.log('TARGET:. ', e.target.name)
    this.setState({
      formBochones: {
        ...this.state.formBochones,
        [e.target.name]: e.target.value,
      },
    });
  };


  editarBochon = (dato) => {

    console.log(dato)
    //update en la BD
    var contador = 0;
    var arreglo = this.state.bochones;
    arreglo.map((registro) => {
      if (dato.idBochon == registro.idBochon) {
        arreglo[contador].codigoCampoM = dato.codigoCampoM;
        arreglo[contador].nroBochonM = dato.nroBochonM;
        arreglo[contador].piezasAsociadasM = this.state.piezasId;
        arreglo[contador].infoAdicionalM = dato.infoAdicionalM;
        arreglo[contador].piezasAsociadasNamesM = this.state.piezasNames;
      }
      contador++;
    });
    console.log(arreglo);
    this.setState({ bochones: arreglo, modalActualizarBochon: false, piezasId: [] });
  };


  eliminarBochon = (dato) => {
    //aca tambien hay que eliminar en la BD y traer los prestamos
    var opcion = window.confirm("¿Está seguro que deseas eliminar el Bochón?");
    if (opcion == true) {
      var contador = 0;
      var arreglo = this.state.bochones;
      arreglo.map((registro) => {
        if (dato.idBochon == registro.idBochon) {
          arreglo.splice(contador, 1);
        }
        contador++;
      });
      this.setState({ bochones: arreglo });
    }
  };


  eliminarArchivoDenuncia = (dato) => {
    //aca tambien hay que eliminar en la BD y traer los prestamos
    var opcion = window.confirm("¿Está seguro que deseas eliminar el Archivo?");
    if (opcion == true) {
      var contador = 0;
      var arreglo = this.state.archivosD;
      arreglo.map((registro) => {
        if (dato.id == registro.id) {
          arreglo.splice(contador, 1);
        }
        contador++;
      });

      this.setState({ archivosD: arreglo });
    }
  };






  render() {
    const { validateddb } = this.state;
    const { validatedh } = this.state;
    const { validatedgeo } = this.state;
    const { validatedtax } = this.state;
    const { validatedpiezas } = this.state;
    const { validatedbochon } = this.state;

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

    const { selectedPieza } = this.state;
    const { selectedPiezaM } = this.state;
    let optPiezas = this.state.piezas.map((opt) => ({
      label: '(' + opt.identificadorPieza + ') ' + opt.nombrePieza,
      value: opt.idPieza,
    }));




    return (
      <>
        <Menu />
        <div className="row">
          <div className="col-md-12">
            <div id="contenido" align="left" className="container">
              <br />
              <h3 className="page-header" align="left">
                <FontAwesomeIcon icon={faCompass} /> Nueva Excavación
              </h3>
              <hr />


              <Tabs id="tabEjemplar" activeKey={this.state.key} onSelect={this.handleSelect}>
                <Tab eventKey="dbasicos" title="Datos Básicos" disabled={this.state.tabbas}>
                  <Form id="form1" noValidate validated={validateddb}>

                    <fieldset>
                      <legend>Datos Básicos</legend>
                      <hr />
                      <Form.Row>
                        <Form.Group className="col-sm-12" controlId="nombre">
                          <Form.Label>Nombre del Área:</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Ingrese Nombre"
                            required
                            onChange={this.handleNombreChange}
                            value={this.state.nombre}
                          />
                          <Form.Control.Feedback type="invalid">
                            Por favor, ingrese Nombre.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Form.Row>
                      {/*
                  <Form.Row>
                    <Form.Group className="col-sm-12" controlId="descripcion">
                      <Form.Label>Descripción:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ingrese Descripción"
                        onChange={this.handleDescChange}
                        value={this.state.descripcion}
                      />
                    </Form.Group>
                  </Form.Row>
   */}

                      <Form.Row>
                        <Form.Group className="col-sm-6" controlId="codigo">
                          <Form.Label>Código de Campo:</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Ingrese Código"
                            required
                            onChange={this.handleCodigoChange}
                            value={this.state.codigo}
                            onBlur={this.handleBlur}
                          />
                          <Form.Control.Feedback type="invalid">
                            Por favor, ingrese Código.
                          </Form.Control.Feedback>
                        </Form.Group>


                        <Form.Group className="col-sm-6" controlId="director">
                          <Form.Label>Director:</Form.Label>
                          <Select
                            placeholder={"Seleccione Director"}
                            options={optDirectores}
                            onChange={this.handleDirectorChange}
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
                            onChange={this.handleAuxiliaresChange}
                            value={selectedAuxiliar}
                            isClearable
                            isMulti
                          />
                        </Form.Group>


                        <Form.Group className="col-sm-6" controlId="profesionales">
                          <Form.Label>Equipo de Profesionales:</Form.Label>
                          <Select
                            placeholder={"Seleccione..."}
                            options={optProfesionales}
                            onChange={this.handleProfesionalesChange}
                            value={selectedProfesional}
                            isClearable
                            isMulti
                          />
                        </Form.Group>
                      </Form.Row>

                      <Form.Row>
                        <Form.Group className="col-sm-6" controlId="fechaInicio">
                          <Form.Label>Fecha Inicio:</Form.Label>
                          <Form.Control
                            type="date"
                            value={this.state.fechaInicio}
                            onChange={this.handleFinicioChange}
                          />
                        </Form.Group>

                        <Form.Group className="col-sm-6" controlId="fbaja">
                          <Form.Label>Fecha de Término:</Form.Label>
                          <Form.Control
                            type="date"
                            value={this.state.fechaTermino}
                            onChange={this.handleFTerminoChange}
                          />
                        </Form.Group>

                        {/*      <Form.Group className="col-sm-4" controlId="motivoBaja">
                      <Form.Label>Motivo Baja:</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={this.state.motivoBaja}
                        onChange={this.handleMotivoChange}
                      />
                     </Form.Group> */}

                      </Form.Row>
                      <Form.Group controlId="muestra">
                        <Form.Check
                          inline
                          type="checkbox"
                          label="Muestra en Página Web?"
                          checked={this.state.muestraHome}
                          onChange={this.handleMuestraChange.bind(this)}
                        />
                      </Form.Group>
                      <br />
                      <Form.Row >

                        <Button variant="outline-secondary" type="button" id="siguiente1" onClick={this.handleForm1}>
                          Siguiente <FontAwesomeIcon icon={faShare} />
                        </Button>
                      </Form.Row>
                      <br />

                    </fieldset>

                  </Form>
                </Tab>

                <Tab eventKey="dhallazgo" title="Hallazgo" disabled={this.state.tabh}>
                  <Form id="form2" noValidate validated={validatedh}>
                    <Form.Row >

                      <Form.Group className="col-sm-12" controlId="tipoHallazgo">
                        <br />
                        <Form.Label>Tipo Hallazgo:</Form.Label>

                        <Form.Control
                          as="select"
                          onChange={this.handleColeccionesChange}
                          required
                        >
                          <option value="">Seleccione Opción</option>
                          <option value="1">Fortuito</option>
                          <option value="2">Denuncia</option>
                          <option value="3">Exploración</option>


                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          Por favor, ingrese Tipo.
                        </Form.Control.Feedback>

                      </Form.Group>

                    </Form.Row>
                    <Form.Label>Si seleccionó Denuncia, adjunte archivo(s) a continuación de la misma:</Form.Label>
                    <Form.Row>
                      <Form.Group className="col-sm-8" controlId="filesAut">
                        <label>Archivo:</label>
                        <input type="file" className="form-control" onChange={this.filehandleChange.bind(this)} />
                      </Form.Group>

                      <Form.Group className="col-sm-8" controlId="filesAut">
                        <Table border="0">
                          <tbody>

                            {this.renderTableDataDenuncia()}

                          </tbody>

                        </Table>
                      </Form.Group>
                    </Form.Row>

                    <Form.Row >
                      <Button variant="outline-secondary" type="button" id="anterior2" onClick={this.handleAntForm2}>
                        <FontAwesomeIcon icon={faReply} /> Anterior
                      </Button>
                      &nbsp;
                      <Button variant="outline-secondary" type="button" id="siguiente2" onClick={this.handleForm2}>
                        Siguiente <FontAwesomeIcon icon={faShare} />
                      </Button>
                    </Form.Row>

                  </Form>
                </Tab>

                <Tab eventKey="dgeo" title="Datos Geográficos" disabled={this.state.tabgeo}>
                  <Form id="form3" noValidate validated={validatedgeo}>

                    <legend>Datos Geográficos</legend>
                    <hr />
                    <Form.Row>
                      <Form.Group className="col-sm-12" controlId="exploracion">
                        <Form.Label>Exploración Asociada:</Form.Label>
                        <Select
                          placeholder={"Seleccione Exploración"}
                          options={optExploraciones}
                          onChange={this.handleExploracionesChange}
                          value={selectedExploracion}
                          required
                        />
                      </Form.Group>
                    </Form.Row>

                    <br />

                    <CrearExcavacion
                      idExploracion={this.state.selectedExploracion.value}
                      setIdAreaExcavacion={this.setIdAreaExcavacion}
                      setPuntoGpsExcavacion={this.setPuntoGpsExcavacion}
                    />
                    <br />

                    <Form.Row >
                      <Button variant="outline-secondary" type="button" id="anterior3" onClick={this.handleAntForm3}>
                        <FontAwesomeIcon icon={faReply} /> Anterior
                      </Button>
                      &nbsp;
                      <Button variant="outline-secondary" type="button" id="siguiente3" onClick={this.handleForm3}>
                        Siguiente <FontAwesomeIcon icon={faShare} />
                      </Button>
                    </Form.Row>


                  </Form>
                </Tab>

                <Tab eventKey="dtax" title="Datos Geológicos/Taxonómicos" disabled={this.state.tabtax}>
                  <Form id="form4" noValidate validated={validatedtax}>

                    <Form.Row>
                      <Form.Group className="col-sm-12" controlId="geologicos">
                        <Form.Label>Geológicos:</Form.Label>
                        <Form.Control
                          as='textarea'
                          onChange={this.handleGeologicosChange}
                          value={this.state.geologicos}
                        />
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      <Form.Group className="col-sm-12" controlId="taxonomicos">
                        <Form.Label>Taxonómicos:</Form.Label>
                        <Form.Control
                          as='textarea'
                          onChange={this.handleTaxonomicosChange}
                          value={this.state.taxonomicos}
                        />
                      </Form.Group>
                    </Form.Row>

                    <hr />
                    <Form.Row>
                      <Form.Group className="mx-sm-3 mb-2">
                        <Button variant="primary" type="submit" id="guardar">
                          <FontAwesomeIcon icon={faSave} /> Guardar
                        </Button>
                        &nbsp;&nbsp;
                        <Link to="/excavaciones">
                          <Button variant="danger" type="button" id="volver">
                            <FontAwesomeIcon icon={faTimesCircle} /> Cancelar
                          </Button>
                        </Link>
                      </Form.Group>
                    </Form.Row>




                  </Form>
                </Tab>

                <Tab eventKey="dpiezas" title="Piezas" disabled={this.state.tabpiezas}>
                  <Form id="form5" noValidate validated={validatedpiezas}>

                    <Form.Row>
                      <Form.Group className="col-sm-6" controlId="identificadorPieza">
                        <Form.Label>Identificador:</Form.Label>
                        <Form.Control
                          type="text"
                          value={this.state.identificadorPieza}
                          onChange={this.handleIdentificadorPiezaChange}
                        />
                      </Form.Group>

                      <Form.Group className="col-sm-6" controlId="nombrePieza">
                        <Form.Label>Nombre:</Form.Label>
                        <Form.Control
                          type="text"
                          value={this.state.nombrePieza}
                          onChange={this.handleNombrePiezaChange}
                        />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group className="col-sm-12" controlId="descripcionPieza">
                        <Form.Label>Descripción:</Form.Label>
                        <Form.Control
                          as='textarea'
                          onChange={this.handleDescPiezaChange}
                          value={this.state.descripcionPieza}
                        />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group className="mx-sm-3 mb-2">
                        <Button variant="primary" type="button" id="guardarPieza" onClick={() => this.insertarPieza()}>
                          <FontAwesomeIcon icon={faPlus} /> Agregar
                        </Button>
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      <Table striped bordered hover responsive>
                        <thead className="thead-dark">
                          <tr>
                            <th>Acción</th>
                            <th>Identificador</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.renderTableDataPiezas()}
                        </tbody>
                      </Table>
                    </Form.Row>

                  </Form>
                </Tab>

                <Tab eventKey="dbochones" title="Bochones" disabled={this.state.tabbochon}>
                  <Form id="form6" noValidate validated={validatedbochon}>

                    <Form.Row>
                      <Form.Group className="col-sm-6" controlId="codigoCampo">
                        <Form.Label>Código Campo:</Form.Label>
                        <Form.Control
                          type="text"
                          value={this.state.codigoCampo}
                          onChange={this.handleCodCampoChange}
                        />
                      </Form.Group>

                      <Form.Group className="col-sm-6" controlId="nroBochon">
                        <Form.Label>Nro. Bochón:</Form.Label>
                        <Form.Control
                          type="text"
                          value={this.state.nroBochon}
                          onChange={this.handleNroBochonChange}
                        />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>

                      <Form.Group className="col-sm-12" controlId="piezasAsoc">
                        <Form.Label>Piezas Asociadas:</Form.Label>
                        <Select
                          placeholder={"Seleccione..."}
                          options={optPiezas}
                          onChange={this.handlePiezasChange}
                          value={selectedPieza}
                          isClearable
                          isMulti
                        />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group className="col-sm-12" controlId="infoAdicional">
                        <Form.Label>Información Adicional:</Form.Label>
                        <Form.Control
                          as='textarea'
                          onChange={this.handleInfoAdicionalChange}
                          value={this.state.infoAdicional}
                        />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group className="mx-sm-3 mb-2">
                        <Button variant="primary" type="button" id="guardarBochon" onClick={() => this.insertarBochon()}>
                          <FontAwesomeIcon icon={faPlus} /> Agregar
                        </Button>
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      <Table striped bordered hover responsive>
                        <thead className="thead-dark">
                          <tr>
                            <th>Acción</th>
                            <th>Cód. Campo</th>
                            <th>Nro. Bochon</th>
                            <th>Piezas Asociadas</th>
                            <th>Información Adicional</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.renderTableDataBochones()}
                        </tbody>
                      </Table>
                    </Form.Row>

                  </Form>
                </Tab>


              </Tabs>

              <Modal
                show={this.state.modalActualizarPieza}
                onHide={() => this.cerrarModalActualizarPieza()}
                backdrop="static"
                keyboard={false}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Editar Pieza</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form.Row>
                    <Form.Group className="col-sm-12" controlId="idPieza">
                      <Form.Control as="input" type="hidden" value={this.state.formPiezas.idPieza} />
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group className="col-sm-12" controlId="identificadorPieza">
                      <Form.Label>Identificador:</Form.Label>
                      <Form.Control type="text" autoComplete="off" name="identificadorPieza" onChange={this.handleChange} value={this.state.formPiezas.identificadorPieza} />
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>

                    <Form.Group className="col-sm-12" controlId="nombrePieza">
                      <Form.Label>Nombre:</Form.Label>
                      <Form.Control type="text" autoComplete="off" name="nombrePieza" onChange={this.handleChange} value={this.state.formPiezas.nombrePieza} />
                    </Form.Group>
                  </Form.Row>

                  <Form.Row>

                    <Form.Group className="col-sm-12" controlId="nombrePieza">
                      <Form.Label>Descripción:</Form.Label>
                      <Form.Control as='textarea' name="descripcionPieza" onChange={this.handleChange} value={this.state.formPiezas.descripcionPieza} />
                    </Form.Group>
                  </Form.Row>



                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => this.cerrarModalActualizarPieza()}>
                    Cerrar
                  </Button>
                  <Button variant="primary" id="guardarAct" onClick={() => this.editarPieza(this.state.formPiezas)}> <FontAwesomeIcon icon={faSave} /> Guardar</Button>
                </Modal.Footer>
              </Modal>

              <Modal
                show={this.state.modalActualizarBochon}
                onHide={() => this.cerrarModalActualizarBochon()}
                backdrop="static"
                keyboard={false}
                size="lg"
              >
                <Modal.Header closeButton>
                  <Modal.Title>Editar Bochón</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form.Row>
                    <Form.Group className="col-sm-6" controlId="codigoCampoM">
                      <Form.Label>Código Campo:</Form.Label>
                      <Form.Control
                        type="text"
                        name='codigoCampoM'
                        value={this.state.formBochones.codigoCampoM}
                        onChange={this.handleChangeB}
                      />
                    </Form.Group>

                    <Form.Group className="col-sm-6" controlId="nroBochonM">
                      <Form.Label>Nro. Bochón:</Form.Label>
                      <Form.Control
                        type="text"
                        name='nroBochonM'
                        value={this.state.formBochones.nroBochonM}
                        onChange={this.handleChangeB}
                      />
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>

                    <Form.Group className="col-sm-12" controlId="piezasAsocM">
                      <Form.Label>Piezas Asociadas:</Form.Label>
                      <Select
                        placeholder={"Seleccione..."}
                        options={optPiezas}
                        onChange={this.handlePiezasModalChange}
                        value={selectedPiezaM}
                        isClearable
                        isMulti
                      />
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group className="col-sm-12" controlId="infoAdicionalM">
                      <Form.Label>Información Adicional:</Form.Label>
                      <Form.Control
                        as='textarea'
                        name='infoAdicionalM'
                        onChange={this.handleChangeB}
                        value={this.state.formBochones.infoAdicionalM}
                      />
                    </Form.Group>
                  </Form.Row>



                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => this.cerrarModalActualizarBochon()}>
                    Cerrar
                  </Button>
                  <Button variant="primary" id="guardarAct" onClick={() => this.editarBochon(this.state.formBochones)}> <FontAwesomeIcon icon={faSave} /> Guardar</Button>
                </Modal.Footer>
              </Modal>





              <br />
              <br />

            </div>
          </div>
        </div>
      </>
    );
  }
}
export default AddExcavacion;
