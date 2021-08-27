import React from "react";
import { Form, Button, Tabs, Tab, Table, Modal, Alert } from "react-bootstrap";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faReply, faCompass, faTrash, faPlus, faShare, faEdit, faTimesCircle, faUpload, faPuzzlePiece } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Select from "react-select";
import CrearExcavacion from "../../areaGeospatial/CrearExcavacion";
import Menu from "./../Menu";
import Cookies from "universal-cookie";
import $ from 'jquery';
import axios from "axios";

const cookies = new Cookies();

//Variables Globales
const urlApi = process.env.REACT_APP_API_HOST;
const urlArchivo = process.env.REACT_APP_URL_EXCAVACIONES;
const rutaExcavaciones = process.env.REACT_APP_RUTA_EXCAVACIONES;


const optHallazgo = [{ "value": "Fortuito", "label": "Fortuito" },
{ "value": "Denuncia", "label": "Denuncia" },
{ "value": "Exploración", "label": "Exploración" }]


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
      nombreArea: "",
      descripcion: "",
      codigoCampo: "",
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
      tabpiezas: false,
      validatedpiezas: false,
      tabfotos: true,
      validatedfotos: false,
      tabvideos: true,
      validatedvideos: false,
      tabbochon: false,
      validatedbochon: false,
      nombrePieza: '',
      identificador: '',
      codigoCampoB: '',
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
      selectedHallazgo: null,
      archivoDenuncia: null,
      excavacionId: '',
      op: 'I',
      listArchivosDen: [],
      urlArchivo: '',
      showSuccess: false,
      showError: false,
      tableArchivosDen: null,
      showSuccessFoto: false,
      showErrorFoto: false,
      showSuccessVideo: false,
      showErrorVideo: false,
      archivoVideo: null, 
      archivoFoto: null,
      descripcionFoto: '',
      listArchivosFotos: [],
      listArchivosVideo: [],
      tableArchivosFotos: null,
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

  handleNombreAreaChange = (evt) => {
    this.setState({ nombreArea: evt.target.value });
  };


  handleCodigoCampoChange = (evt) => {
    this.setState({ codigoCampo: evt.target.value });
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

  handleHallazgoChange = (selectedHallazgo) => {
    this.setState({ selectedHallazgo });
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
    this.setState({ codigoCampoB: evt.target.value });
  };

  handleInfoAdicionalChange = (evt) => {
    this.setState({ infoAdicional: evt.target.value });
  };

  handleNroBochonChange = (evt) => {
    this.setState({ nroBochon: evt.target.value });
  };

  /* handleSubmit = (event) => {
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
   };*/

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

    const file = event.target.files;
    const name = file[0].name;
    this.setState({ archivoDenuncia: file });

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
    var op = this.state.op;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {


      if (op === "I") {
        var directorName="";
        var directorId="";
        if(this.state.selectedDirector!==null){
          directorName=this.state.selectedDirector.label;
          directorId=this.state.selectedDirector.value        
        }

        var data = {
          "nombreArea": this.state.nombreArea,
          "codigoCampo": this.state.codigoCampo,
          "fechaInicio": this.state.fechaInicio,
          "fechaTermino": this.state.fechaTermino,
          "director": directorName,
          "directorId": directorId,
          "auxiliares": this.state.auxiliaresId,
          "profesionales": this.state.profesionalesId,
          "muestraHome": this.state.muestraHome,
          "tipoHallazgo": "",
          "archivoDenuncia": "",
          "idExploracion": "",
          "datosGeologicos": "",
          "datosTaxonomicos": "",
          "idArea": this.state.idAreaExcavacion,
          "puntoGps": this.state.puntoGpsExcavacion,
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
              return response.json();
            }
          })
          .then(function (data) {
            this.setState({ tabh: false, key: 'dhallazgo', op: 'U', excavacionId: data.excavacion._id });
          }.bind(this))
          .catch(function (error) {
            toast.error("Error al guardar. Intente nuevamente.");
            console.log(
              "Hubo un problema con la petición Fetch:",
              error.message
            );
          });

      }
      else {

        var directorName="";
        var directorId="";
        if(this.state.selectedDirector!==null){
          directorName=this.state.selectedDirector.label;
          directorId=this.state.selectedDirector.value        
        }

        var data = {
          "nombreArea": this.state.nombreArea,
          "codigoCampo": this.state.codigoCampo,
          "fechaInicio": this.state.fechaInicio,
          "fechaTermino": this.state.fechaTermino,
          "director": directorName,
          "directorId": directorId,
          "auxiliares": this.state.auxiliaresId,
          "profesionales": this.state.profesionalesId,
          "muestraHome": this.state.muestraHome
        }
        fetch(urlApi + '/excavacion/' + this.state.excavacionId, {
          method: 'put',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookies.get('token')
          }
        })
          .then(function (response) {
            if (response.ok) {
              console.log("¡Se actualizaron los datos de la Excavación con Éxito!");

            }
          }).catch(function (error) {
            toast.error("Error al guardar. Intente nuevamente.");
            console.log(
              "Hubo un problema con la petición Fetch:",
              error.message
            );
          });

      }
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
    this.setState({ validatedgeo: true, tabpiezas: false, tabbochon: false, tabfotos: false, tabvideos:false });
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
    var destino = rutaExcavaciones +'Denuncias/'+ this.state.excavacionId + "/" + dato;
    var opcion = window.confirm("¿Está seguro que deseas eliminar el Archivo?");
    if (opcion == true) {

      fetch(urlApi + '/excavacionId/' + this.state.excavacionId, {
        method: 'get',
        headers: {
          'Authorization': 'Bearer ' + cookies.get('token')
        }
      })
        .then(response => {
          return response.json();
        })
        .then(function (response) {
          //aca ya tengo la excavacion, tengo que obtener los archivos de autorizacion y quitar el candidato a eliminar
          $(".loader").removeAttr("style");
          //elimino archivo del array
          var archivos = response.excavacionId.archivosDenuncia;
          var contador = 0;
          archivos.map((registro) => {
            if (dato == registro) {
              archivos.splice(contador, 1);
            }
            contador++;
          });

          var dataDen = {
            "archivosDenuncia": archivos

          }

          //Actualizo la Exploracion
          fetch(urlApi + '/excavacion/' + this.state.excavacionId, {
            method: 'put',
            body: JSON.stringify(dataDen),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + cookies.get('token')
            }
          })
            .then(function (response) {
              if (response.ok) {
                console.log("¡Se actualizaron los datos de la Excavación con Éxito!");
                this.setState({ listArchivosDen: archivos });

              }
            }.bind(this))
            .then(function (response) {
              //Elimino Archivo del Server
              fetch(urlApi + '/deleteArchivo', {
                method: 'get',
                headers: {
                  'Content-Type': undefined,
                  'path': destino,
                  'Authorization': 'Bearer ' + cookies.get('token')
                }
              })
                .then(response => {
                  return response.json();
                })
                .then(function (response) {
                  $(".loader").fadeOut("slow");
                  if ((response.msg).trim() === 'OK') {
                    console.log('ok');
                    toast.success("¡Se eliminó el Archivo con Éxito!");
                    this.setState({ archivoDen: null, tableArchivosDen: this.renderTableArchivosDen() })

                  } else {
                    console.log('error');
                    toast.error("¡Se produjo un error al eliminar archivo!");
                  }
                }.bind(this)).catch(function (error) {
                  $(".loader").fadeOut("slow");
                  toast.error("Error al eliminar. Intente nuevamente.");
                  console.log('Hubo un problema con la petición Fetch (3):' + error.message);
                });


            }.bind(this))
            .catch(function (error) {
              $(".loader").fadeOut("slow");
              toast.error("Error al Actualizar Exploracion. Intente nuevamente.");
              console.log('Hubo un problema con la petición Fetch (2):' + error.message);
            });

        }.bind(this))
        .catch(function (error) {
          $(".loader").fadeOut("slow");
          toast.error("Error al consultar. Intente nuevamente.");
          console.log('Hubo un problema con la petición Fetch (1):' + error.message);
        });



    }

  };

  subirDenuncia = () => {

    const MAXIMO_TAMANIO_BYTES = 5000000;
    const types = ['application/pdf'];
    var file = this.state.archivoDenuncia

    if (file !== null && file.length !== 0) {
      var nameFile = (file[0].name).replace(/\s+/g, "_");
      nameFile = this.reemplazar(nameFile);
      var size = file[0].size;
      var type = file[0].type;

      if (size > MAXIMO_TAMANIO_BYTES) {
        var tamanio = 5000000 / 1000000;
        toast.error("El archivo seleccionado supera los " + tamanio + 'Mb. permitidos.');
        document.getElementById('filesAut').value = '';
      }
      else {
        if (!types.includes(type)) {
          toast.error("El archivo seleccionado tiene una extensión inválida.");
          document.getElementById('filesAut').value = '';

        }
        else {
          $(".loader").removeAttr("style");
          document.getElementById('subirArch').setAttribute('disabled', 'disabled');
          fetch(urlApi + '/excavacionId/' + this.state.excavacionId, {
            method: 'get',
            headers: {
              'Authorization': 'Bearer ' + cookies.get('token')
            }
          })
            .then(response => {
              return response.json();
            })
            .then(function (response) {

              var listArchivosDen = response.excavacionId.archivosDenuncia;
              listArchivosDen.push(nameFile);

              var dataDen = {
                "archivosDenuncia": listArchivosDen,
              };

              //Primero Actualizo la Exploracion
              fetch(urlApi + '/excavacion/' + this.state.excavacionId, {
                method: 'put',
                body: JSON.stringify(dataDen),
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + cookies.get('token')
                }
              })
                .then(function (response) {
                  if (response.ok) {
                    console.log("¡Se actualizaron los datos de la Excavación con Éxito!");
                    this.setState({ listArchivosDen: listArchivosDen });

                  }
                }.bind(this))
                .then(function (response) {
                  //segundo subo archivo al server

                  const destino = rutaExcavaciones +'Denuncias/'+ this.state.excavacionId;
                  const data = new FormData();
                  data.append("file", file[0]);


                  axios.post(urlApi + "/uploadArchivo", data, {
                    headers: {
                      "Content-Type": undefined,
                      path: destino,
                      "newfilename": '',
                      'Authorization': 'Bearer ' + cookies.get('token')
                    }
                  })
                    .then(response => {
                      $(".loader").fadeOut("slow");
                      if (response.statusText === "OK") {
                        this.setState({ archivoDenuncia: null, showSuccess: true, showError: false, urlArchivo: urlArchivo + 'Denuncias/'+this.state.excavacionId + '/' + nameFile });
                        this.setState({ tableArchivosDen: this.renderTableArchivosDen() })
                        document.getElementById('filesAut').value = '';
                      }
                      else {
                        this.setState({ showSuccess: false, showError: true });
                      }
                      document.getElementById('subirArch').removeAttribute('disabled');

                      setTimeout(() => {
                        this.setState({ showSuccess: false, showError: false });
                      }, 5000);


                    })
                    .catch(error => {
                      $(".loader").fadeOut("slow");
                      this.setState({ showSuccess: false, showError: true });
                      console.log(error);
                    });




                }.bind(this))
                .catch(function (error) {
                  $(".loader").fadeOut("slow");
                  toast.error("Error al Actualizar Exploracion. Intente nuevamente.");
                  console.log('Hubo un problema con la petición Fetch (1):' + error.message);
                });


            }.bind(this))
            .catch(function (error) {
              $(".loader").fadeOut("slow");
              toast.error("Error al consultar. Intente nuevamente.");
              console.log('Hubo un problema con la petición Fetch (2):' + error.message);
            });

        }

      }

    } else {
      toast.error("Seleccione un Archivo.");
    }
  }

  reemplazar(cadena) {

    var chars = {

      "á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u",

      "à": "a", "è": "e", "ì": "i", "ò": "o", "ù": "u", "ñ": "n",

      "Á": "A", "É": "E", "Í": "I", "Ó": "O", "Ú": "U",

      "À": "A", "È": "E", "Ì": "I", "Ò": "O", "Ù": "U", "Ñ": "N",

      "ä": "a", "ë": "e", "ï": "i", "ö": "o", "ü": "u",

      "Ä": "A", "Ä": "A", "Ë": "E", "Ï": "I", "Ö": "O", "Ü": "U"
    }

    var expr = /[áàéèíìóòúùñäëïöü]/ig;

    var res = cadena.replace(expr, function (e) { return chars[e] });

    return res;

  }

  renderTableArchivosDen() {


    return this.state.listArchivosDen.map((file, index) => {

      return (
        <tr key={index}>
          <td>
            <Button variant="danger" type="button" id="eliminarArch" onClick={() => this.eliminarArchivoDenuncia(file)}>
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </td>
          <td>
            <a href={urlArchivo + 'Denuncias/'+this.state.excavacionId + '/' + file} disabled target="_blank">{file}</a>
          </td>

        </tr>
      )
    })



  }

  renderTableArchivosFotos() {


    return this.state.listArchivosFotos.map((file, index) => {

      return (
        <tr key={index}>
          <td>
            <Button variant="danger" type="button" id="eliminarArch" onClick={() => this.eliminarArchivoFoto(file.nombre)}>
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </td>
          <td>
            <a href={urlArchivo +'Fotos/'+ this.state.excavacionId + '/' + file.nombre} disabled target="_blank">{file.nombre}</a>
          </td>
          <td>
            {file.descripcion}
          </td>

        </tr>
      )
    })



  }

  renderTableArchivosVideos() {


    return this.state.listArchivosVideo.map((file, index) => {

      return (
        <tr key={index}>
          <td>
            <Button variant="danger" type="button" id="eliminarArch" onClick={() => this.eliminarArchivoVideo(file)}>
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </td>
          <td>
            <a href={urlArchivo +'Videos/'+ this.state.excavacionId + '/' + file} disabled target="_blank">{file}</a>
          </td>
        </tr>
      )
    })



  }


  handleForm4 = (event) => {
    $(".loader").removeAttr("style");

    var exploracionId = "";
    if (this.state.selectedExploracion !== "") {
      var exploracionId = this.state.selectedExploracion.value;
    }

    var hallazgo = "";
    if (this.state.selectedHallazgo !== null) {
      var hallazgo = this.state.selectedHallazgo.value;
    }


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
      "tipoHallazgo": hallazgo,
      "idExploracion": exploracionId,
      "datosGeologicos": this.state.geologicos,
      "datosTaxonomicos": this.state.taxonomicos,
      "idArea": this.state.idAreaExcavacion,
      "puntoGPS": this.state.puntoGpsExcavacion,
    }

    fetch(urlApi + "/excavacion/" + this.state.excavacionId, {
      method: "put",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + cookies.get('token')
      },
    })
      .then(function (response) {
        $(".loader").fadeOut("slow");
        if (response.ok) {
          toast.success("¡Se guardó la Excavación con Éxito!");
        }
      })
      .catch(function (error) {
        $(".loader").fadeOut("slow");
        toast.error("Error al guardar. Intente nuevamente.");
        console.log(
          "Hubo un problema con la petición Fetch:" + error.message
        );
      });


  }

  filesImagehandleChange= (event) => {
    const file = event.target.files;
    const name = file[0].name;
    this.setState({ archivoFoto: file });

  }

  filesVideohandleChange= (event) => {
    const file = event.target.files;
    const name = file[0].name;
    this.setState({ archivoVideo: file });
  }

  subirFoto = () => {

    const MAXIMO_TAMANIO_BYTES = 5000000;
    const types = ['image/gif', 'image/png', 'image/jpg', 'image/jpeg','image/bmp', 'image/webp'];
    var file = this.state.archivoFoto

    if (file !== null && file.length !== 0) {
      var nameFile = (file[0].name).replace(/\s+/g, "_");
      nameFile = this.reemplazar(nameFile);
      var size = file[0].size;
      var type = file[0].type;

      if (size > MAXIMO_TAMANIO_BYTES) {
        var tamanio = 5000000 / 1000000;
        toast.error("El archivo seleccionado supera los " + tamanio + 'Mb. permitidos.');
        document.getElementById('fileFoto').value = '';
      }
      else {
        if (!types.includes(type)) {
          toast.error("El archivo seleccionado tiene una extensión inválida.");
          document.getElementById('fileFoto').value = '';

        }
        else {
          $(".loader").removeAttr("style");
          document.getElementById('subirFoto').setAttribute('disabled', 'disabled');
          fetch(urlApi + '/excavacionId/' + this.state.excavacionId, {
            method: 'get',
            headers: {
              'Authorization': 'Bearer ' + cookies.get('token')
            }
          })
            .then(response => {
              return response.json();
            })
            .then(function (response) {

              var listArchivosFotos = response.excavacionId.fotosExcavacion;
              var fotoSubir={
                              "nombre":nameFile, 
                              "descripcion": this.state.descripcionFoto
                            }
              
              listArchivosFotos.push(fotoSubir);

              console.log('LAS FOTOS::', listArchivosFotos);

              var dataFoto = {
                "fotosExcavacion": listArchivosFotos,
              };

              //Primero Actualizo la Excavacion
              fetch(urlApi + '/excavacion/' + this.state.excavacionId, {
                method: 'put',
                body: JSON.stringify(dataFoto),
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + cookies.get('token')
                }
              })
                .then(function (response) {
                  if (response.ok) {
                    console.log("¡Se actualizaron los datos de la Excavación con Éxito!");
                    this.setState({ listArchivosFotos: listArchivosFotos });

                  }
                }.bind(this))
                .then(function (response) {
                  //segundo subo archivo al server

                  const destino = rutaExcavaciones+'Fotos/' + this.state.excavacionId;
                  const data = new FormData();
                  data.append("file", file[0]);


                  axios.post(urlApi + "/uploadArchivo", data, {
                    headers: {
                      "Content-Type": undefined,
                      path: destino,
                      "newfilename": '',
                      'Authorization': 'Bearer ' + cookies.get('token')
                    }
                  })
                    .then(response => {
                      $(".loader").fadeOut("slow");
                      if (response.statusText === "OK") {
                        this.setState({ archivoFoto: null, descripcionFoto:"", showSuccessFoto: true, showErrorFoto: false, urlArchivo: urlArchivo+'Fotos/' + this.state.excavacionId + '/' + nameFile });
                        this.setState({ tableArchivosFotos: this.renderTableArchivosFotos() })
                        document.getElementById('fileFoto').value = '';
                      }
                      else {
                        this.setState({ showSuccessFoto: false, showErrorFoto: true });
                      }
                      document.getElementById('subirFoto').removeAttribute('disabled');

                      setTimeout(() => {
                        this.setState({ showSuccessFoto: false, showErrorFoto: false });
                      }, 5000);


                    })
                    .catch(error => {
                      $(".loader").fadeOut("slow");
                      this.setState({ showSuccessFoto: false, showErrorFoto: true });
                      console.log(error);
                    });




                }.bind(this))
                .catch(function (error) {
                  $(".loader").fadeOut("slow");
                  toast.error("Error al Actualizar Exploracion. Intente nuevamente.");
                  console.log('Hubo un problema con la petición Fetch (1):' + error.message);
                });


            }.bind(this))
            .catch(function (error) {
              $(".loader").fadeOut("slow");
              toast.error("Error al consultar. Intente nuevamente.");
              console.log('Hubo un problema con la petición Fetch (2):' + error.message);
            });

        }

      }

    } else {
      toast.error("Seleccione un Archivo.");
    }
  }


  eliminarArchivoFoto= (dato) => {
    var destino = rutaExcavaciones +'Fotos/'+ this.state.excavacionId + "/" + dato;
    var opcion = window.confirm("¿Está seguro que deseas eliminar el Archivo?");
    if (opcion == true) {

      fetch(urlApi + '/excavacionId/' + this.state.excavacionId, {
        method: 'get',
        headers: {
          'Authorization': 'Bearer ' + cookies.get('token')
        }
      })
        .then(response => {
          return response.json();
        })
        .then(function (response) {
          //aca ya tengo la excavacion, tengo que obtener los archivos de autorizacion y quitar el candidato a eliminar
          $(".loader").removeAttr("style");
          //elimino archivo del array
          var archivos = response.excavacionId.fotosExcavacion;
          var contador = 0;
          archivos.map((registro) => {
            if (dato == registro.nombre) {
              archivos.splice(contador, 1);
            }
            contador++;
          });

          var dataFoto = {
            "fotosExcavacion": archivos

          }

          //Actualizo la Exploracion
          fetch(urlApi + '/excavacion/' + this.state.excavacionId, {
            method: 'put',
            body: JSON.stringify(dataFoto),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + cookies.get('token')
            }
          })
            .then(function (response) {
              if (response.ok) {
                console.log("¡Se actualizaron los datos de la Excavación con Éxito!");
                this.setState({ listArchivosFotos: archivos });

              }
            }.bind(this))
            .then(function (response) {
              //Elimino Archivo del Server
              fetch(urlApi + '/deleteArchivo', {
                method: 'get',
                headers: {
                  'Content-Type': undefined,
                  'path': destino,
                  'Authorization': 'Bearer ' + cookies.get('token')
                }
              })
                .then(response => {
                  return response.json();
                })
                .then(function (response) {
                  $(".loader").fadeOut("slow");
                  if ((response.msg).trim() === 'OK') {
                    console.log('ok');
                    toast.success("¡Se eliminó el Archivo con Éxito!");
                    this.setState({ archivoFoto: null, tableArchivosFotos: this.renderTableArchivosFotos() })

                  } else {
                    console.log('error');
                    toast.error("¡Se produjo un error al eliminar archivo!");
                  }
                }.bind(this)).catch(function (error) {
                  $(".loader").fadeOut("slow");
                  toast.error("Error al eliminar. Intente nuevamente.");
                  console.log('Hubo un problema con la petición Fetch (3):' + error.message);
                });


            }.bind(this))
            .catch(function (error) {
              $(".loader").fadeOut("slow");
              toast.error("Error al Actualizar Exploracion. Intente nuevamente.");
              console.log('Hubo un problema con la petición Fetch (2):' + error.message);
            });

        }.bind(this))
        .catch(function (error) {
          $(".loader").fadeOut("slow");
          toast.error("Error al consultar. Intente nuevamente.");
          console.log('Hubo un problema con la petición Fetch (1):' + error.message);
        });

    }

  };


  subirVideo = () => {

    const MAXIMO_TAMANIO_BYTES = 10000000;
    const types = ['video/x-msvideo','video/mpeg','video/ogg','video/x-flv','video/mp4','video/x-ms-wmv','video/quicktime','video/3gpp','video/MP2T'];
    var file = this.state.archivoVideo

    if (file !== null && file.length !== 0) {
      var nameFile = (file[0].name).replace(/\s+/g, "_");
      nameFile = this.reemplazar(nameFile);
      var size = file[0].size;
      var type = file[0].type;

      if (size > MAXIMO_TAMANIO_BYTES) {
        var tamanio = 10000000 / 1000000;
        toast.error("El archivo seleccionado supera los " + tamanio + 'Mb. permitidos.');
        document.getElementById('filesVideo').value = '';
      }
      else {
        if (!types.includes(type)) {
          toast.error("El archivo seleccionado tiene una extensión inválida.");
          document.getElementById('filesVideo').value = '';

        }
        else {
          $(".loader").removeAttr("style");
          document.getElementById('subirVideo').setAttribute('disabled', 'disabled');
          fetch(urlApi + '/excavacionId/' + this.state.excavacionId, {
            method: 'get',
            headers: {
              'Authorization': 'Bearer ' + cookies.get('token')
            }
          })
            .then(response => {
              return response.json();
            })
            .then(function (response) {

              var listArchivosVideo = response.excavacionId.videosExcavacion;
              listArchivosVideo.push(nameFile);

              var dataVideo = {
                "videosExcavacion": listArchivosVideo,
              };

              //Primero Actualizo la Exploracion
              fetch(urlApi + '/excavacion/' + this.state.excavacionId, {
                method: 'put',
                body: JSON.stringify(dataVideo),
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + cookies.get('token')
                }
              })
                .then(function (response) {
                  if (response.ok) {
                    console.log("¡Se actualizaron los datos de la Excavación con Éxito!");
                    this.setState({ listArchivosVideo: listArchivosVideo });

                  }
                }.bind(this))
                .then(function (response) {
                  //segundo subo archivo al server

                  const destino = rutaExcavaciones+'Videos/'+ this.state.excavacionId;
                  const data = new FormData();
                  data.append("file", file[0]);


                  axios.post(urlApi + "/uploadArchivo", data, {
                    headers: {
                      "Content-Type": undefined,
                      path: destino,
                      "newfilename": '',
                      'Authorization': 'Bearer ' + cookies.get('token')
                    }
                  })
                    .then(response => {
                      $(".loader").fadeOut("slow");
                      if (response.statusText === "OK") {
                        this.setState({ archivoVideo: null, showSuccessVideo: true, showErrorVideo: false, urlArchivo: urlArchivo +'Videos/'+this.state.excavacionId + '/' + nameFile });
                        this.setState({ tableArchivosVideos: this.renderTableArchivosVideos() })
                        document.getElementById('filesVideo').value = '';
                      }
                      else {
                        this.setState({ showSuccessVideo: false, showErrorVideo: true });
                      }
                      document.getElementById('subirVideo').removeAttribute('disabled');

                      setTimeout(() => {
                        this.setState({ showSuccessVideo: false, showErrorVideo: false });
                      }, 5000);


                    })
                    .catch(error => {
                      $(".loader").fadeOut("slow");
                      this.setState({ showSuccessVideo: false, showErrorVideo: true });
                      console.log(error);
                    });




                }.bind(this))
                .catch(function (error) {
                  $(".loader").fadeOut("slow");
                  toast.error("Error al Actualizar Exploracion. Intente nuevamente.");
                  console.log('Hubo un problema con la petición Fetch (1):' + error.message);
                });


            }.bind(this))
            .catch(function (error) {
              $(".loader").fadeOut("slow");
              toast.error("Error al consultar. Intente nuevamente.");
              console.log('Hubo un problema con la petición Fetch (2):' + error.message);
            });

        }

      }

    } else {
      toast.error("Seleccione un Archivo.");
    }
  }

  eliminarArchivoVideo= (dato) => {
    var destino = rutaExcavaciones +'Videos/'+ this.state.excavacionId + "/" + dato;
    var opcion = window.confirm("¿Está seguro que deseas eliminar el Archivo?");
    if (opcion == true) {

      fetch(urlApi + '/excavacionId/' + this.state.excavacionId, {
        method: 'get',
        headers: {
          'Authorization': 'Bearer ' + cookies.get('token')
        }
      })
        .then(response => {
          return response.json();
        })
        .then(function (response) {
          //aca ya tengo la excavacion, tengo que obtener los archivos de autorizacion y quitar el candidato a eliminar
          $(".loader").removeAttr("style");
          //elimino archivo del array
          var archivos = response.excavacionId.videosExcavacion;
          var contador = 0;
          archivos.map((registro) => {
            if (dato == registro) {
              archivos.splice(contador, 1);
            }
            contador++;
          });

          var dataVideo = {
            "videosExcavacion": archivos

          }

          //Actualizo la Exploracion
          fetch(urlApi + '/excavacion/' + this.state.excavacionId, {
            method: 'put',
            body: JSON.stringify(dataVideo),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + cookies.get('token')
            }
          })
            .then(function (response) {
              if (response.ok) {
                console.log("¡Se actualizaron los datos de la Excavación con Éxito!");
                this.setState({ listArchivosVideo: archivos });

              }
            }.bind(this))
            .then(function (response) {
              //Elimino Archivo del Server
              fetch(urlApi + '/deleteArchivo', {
                method: 'get',
                headers: {
                  'Content-Type': undefined,
                  'path': destino,
                  'Authorization': 'Bearer ' + cookies.get('token')
                }
              })
                .then(response => {
                  return response.json();
                })
                .then(function (response) {
                  $(".loader").fadeOut("slow");
                  if ((response.msg).trim() === 'OK') {
                    console.log('ok');
                    toast.success("¡Se eliminó el Archivo con Éxito!");
                    this.setState({ archivoVideo: null, tableArchivosVideos: this.renderTableArchivosVideos() })

                  } else {
                    console.log('error');
                    toast.error("¡Se produjo un error al eliminar archivo!");
                  }
                }.bind(this)).catch(function (error) {
                  $(".loader").fadeOut("slow");
                  toast.error("Error al eliminar. Intente nuevamente.");
                  console.log('Hubo un problema con la petición Fetch (3):' + error.message);
                });


            }.bind(this))
            .catch(function (error) {
              $(".loader").fadeOut("slow");
              toast.error("Error al Actualizar Exploracion. Intente nuevamente.");
              console.log('Hubo un problema con la petición Fetch (2):' + error.message);
            });

        }.bind(this))
        .catch(function (error) {
          $(".loader").fadeOut("slow");
          toast.error("Error al consultar. Intente nuevamente.");
          console.log('Hubo un problema con la petición Fetch (1):' + error.message);
        });

    }

  };


  handleDescripcionFotoChange = (evt) => {
    this.setState({ descripcionFoto: evt.target.value });
  };





  render() {
    const { validateddb } = this.state;
    const { validatedh } = this.state;
    const { validatedgeo } = this.state;
    const { validatedtax } = this.state;
    const { validatedpiezas } = this.state;
    const { validatedbochon } = this.state;
    const { validatedfotos} = this.state;
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

    const { selectedPieza } = this.state;
    const { selectedPiezaM } = this.state;
    let optPiezas = this.state.piezas.map((opt) => ({
      label: '(' + opt.identificadorPieza + ') ' + opt.nombrePieza,
      value: opt.idPieza,
    }));

    const { selectedHallazgo } = this.state;
 




    return (
      <>
        <Menu />
        <div className="row">
          <div className="col-md-12">
            <div id="contenido" align="left" className="container">
              <div className="loader" style={{ display: 'none' }}></div>
              <br />
              <h3 className="page-header" align="left">
                <FontAwesomeIcon icon={faCompass} /> Nueva Excavación
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
                            placeholder="Ingrese Nombre Area"
                            required
                            onChange={this.handleNombreAreaChange}
                            value={this.state.nombre}
                          />
                          <Form.Control.Feedback type="invalid">
                            Por favor, ingrese Nombre.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Form.Row>


                      <Form.Row>
                        <Form.Group className="col-sm-6" controlId="codigo">
                          <Form.Label>Código de Campo:</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Ingrese Código"
                            required
                            onChange={this.handleCodigoCampoChange}
                            value={this.state.codigoCampo}
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
                        &nbsp;&nbsp;
                        <Link to="/excavaciones">
                          <Button variant="outline-danger" type="button" id="cancela">
                            <FontAwesomeIcon icon={faTimesCircle} /> Cancelar
                          </Button>
                        </Link>
                      </Form.Row>
                      <br />

                    </fieldset>

                  </Form>
                </Tab>

                <Tab eventKey="dhallazgo" title="Hallazgo" disabled={this.state.tabh}>
                  <Form id="form2" noValidate validated={validatedh}>
                    <Form.Row >

                      <Form.Group className="col-sm-8" controlId="tipoHallazgo">
                        <br />
                        <Form.Label>Tipo Hallazgo:</Form.Label>



                        <Select
                          placeholder={"Seleccione..."}
                          options={optHallazgo}
                          onChange={this.handleHallazgoChange}
                          value={selectedHallazgo}
                          isClearable
                        />


                      </Form.Group>

                    </Form.Row>
                    <Form.Label>Si seleccionó Denuncia, adjunte archivo(s) a continuación de la misma:</Form.Label>
                    <Form.Row>
                      <Form.Group className="col-sm-8">
                        <label>Archivo:</label>
                        <input type="file" className="form-control" id="filesAut" onChange={this.filehandleChange.bind(this)} />
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      <Form.Group className="col-sm-2" >
                        <Button variant="primary" type="button" id="subirArch" onClick={() => this.subirDenuncia()} >
                          <FontAwesomeIcon icon={faUpload} /> Subir
                        </Button>
                      </Form.Group>
                      <Form.Group className="col-sm-6">
                        <Alert show={this.state.showSuccess} variant="success">
                          <p>
                            Se subió el archivo con Éxito!!
                          </p>
                        </Alert>

                        <Alert show={this.state.showError} variant="danger">
                          <p>
                            El archivo no se pudo subir. Intente nuevamente.
                          </p>
                        </Alert>
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      <Form.Group className="col-sm-8" controlId="filesAut">
                        <Table border="0">
                          <tbody>
                            {this.state.tableArchivosDen}
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
                        <Button variant="primary" type="button" id="guardar" onClick={this.handleForm4}>
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

           

                <Tab eventKey="dbochones" title="Bochones" disabled={this.state.tabbochon}>
                  <Form id="form6" noValidate validated={validatedbochon}>

                    <Form.Row>
                      <Form.Group className="col-sm-6" controlId="codigoCampoB">
                        <Form.Label>Código Campo:</Form.Label>
                        <Form.Control
                          type="text"
                          value={this.state.codigoCampoB}
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
                      <Form.Group className="col-sm-12" controlId="ejemplarAsociado">
                        <Form.Label>Ejemplar:</Form.Label>
                        <Select
                          placeholder={"Seleccione Ejemplar"}
                          options={optExploraciones}
                          onChange={this.handleExploracionesChange}
                          value={selectedExploracion}
                          required
                        />
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      <Form.Group className="col-sm-12" controlId="piezasAsociadas">
                        <Form.Label>Piezas Asociadas:</Form.Label>
                        <Select
                          placeholder={"Seleccione Piezas"}
                          options={optExploraciones}
                          onChange={this.handleExploracionesChange}
                          value={selectedExploracion}
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
                            <th>Ejemplar</th>
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

                <Tab eventKey="dfotos" title="Fotos" disabled={this.state.tabfotos}>
                  <Form id="form7" noValidate validated={validatedfotos}>
                      <legend>Fotos</legend>
                      <hr/>

                      <Form.Row>
                      <Form.Group className="col-sm-12">
                        <label>Archivos:</label>
                        <input type="file" className="form-control" id="fileFoto" accept="image/*" onChange={this.filesImagehandleChange.bind(this)} />
                      </Form.Group>
                    </Form.Row>
                    
                    <Form.Row>
                    <Form.Group className="col-sm-12" controlId="descripcionFoto">
                        <Form.Label>Descripción Breve:</Form.Label>
                        <small>(Para accesibilidad de la Web)</small>
                        <Form.Control
                          type="text"
                          value={this.state.descripcionFoto}
                          onChange={this.handleDescripcionFotoChange}
                        />
                      </Form.Group>
                    </Form.Row>

                      <Form.Row>
                      <Form.Group className="col-sm-2" >
                        <Button variant="primary" type="button" id="subirFoto" onClick={() => this.subirFoto()} >
                          <FontAwesomeIcon icon={faUpload} /> Subir
                        </Button>
                      </Form.Group>
                      <Form.Group className="col-sm-6">
                        <Alert show={this.state.showSuccessFoto} variant="success">
                          <p>
                            Se subió el archivo con Éxito!!
                          </p>
                        </Alert>

                        <Alert show={this.state.showErrorFoto} variant="danger">
                          <p>
                            El archivo no se pudo subir. Intente nuevamente.
                          </p>
                        </Alert>
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      <Form.Group className="col-sm-8" controlId="archivospdf">

                        <Table striped bordered hover responsive>
                          <thead className="thead-dark">
                            <tr>
                              <th>Acción</th>
                              <th>Nombre</th>
                              <th>Descripción</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.tableArchivosFotos}
                          </tbody>
                        </Table>


                      </Form.Group>
                    </Form.Row>

                  </Form>
                </Tab>

                <Tab eventKey="dvideos" title="Videos" disabled={this.state.tabvideos}>
                  <Form id="form8" noValidate validated={validatedvideos}>
                  <legend>Videos</legend>
                      <hr/>

                      <Form.Row>
                      <Form.Group className="col-sm-8">
                        <label>Archivos:</label>
                        <input type="file" className="form-control" id="filesVideo" accept="video/*" onChange={this.filesVideohandleChange.bind(this)} />
                      </Form.Group>
                    </Form.Row>

                      <Form.Row>
                      <Form.Group className="col-sm-2" >
                        <Button variant="primary" type="button" id="subirVideo" onClick={() => this.subirVideo()} >
                          <FontAwesomeIcon icon={faUpload} /> Subir
                        </Button>
                      </Form.Group>
                      <Form.Group className="col-sm-6">
                        <Alert show={this.state.showSuccessVideo} variant="success">
                          <p>
                            Se subió el archivo con Éxito!!
                          </p>
                        </Alert>

                        <Alert show={this.state.showErrorVideo} variant="danger">
                          <p>
                            El archivo no se pudo subir. Intente nuevamente.
                          </p>
                        </Alert>
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      <Form.Group className="col-sm-8" controlId="archivospdf">

                        <Table striped bordered hover responsive>
                          <thead className="thead-dark">
                            <tr>
                              <th>Acción</th>
                              <th>Nombre</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.tableArchivosVideos}
                          </tbody>
                        </Table>


                      </Form.Group>
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
