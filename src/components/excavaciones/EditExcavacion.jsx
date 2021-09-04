import React from "react";
import { Form, Button, Tabs, Tab, Table, Modal, Alert } from "react-bootstrap";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faReply, faCompass, faTrash, faPlus, faShare, faEdit, faTimesCircle, faUpload } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';
import Select from 'react-select';
import ModificarExcavacion from '../../areaGeospatial/ModificarExcavacion';
import Moment from 'moment';
import Menu from "./../Menu"
import $ from 'jquery';
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

//Variables Globales
const urlApi = process.env.REACT_APP_API_HOST;
const urlArchivo = process.env.REACT_APP_URL_EXCAVACIONES;
const rutaExcavaciones = process.env.REACT_APP_RUTA_EXCAVACIONES;

const optHallazgo = [{ "value": "Fortuito", "label": "Fortuito" },
{ "value": "Denuncia", "label": "Denuncia" },
{ "value": "Exploración", "label": "Exploración" }]


class EditExcavacion extends React.Component {

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
      geologicos: '',
      taxonomicos: '',
      tabfotos: false,
      validatedfotos: false,
      tabvideos: false,
      validatedvideos: false,
      tabbochon: false,
      validatedbochon: false,
      nombrePieza: '',
      identificador: '',
      nroBochon: '',
      infoAdicional: '',
      piezasAsociadas: [],
      piezas: [],
      codigoCampoB: '',
      identificadorPieza: '',
      nombrePieza: '',
      descripcionPieza: '',
      modalActualizarPieza: false,
      selectedPieza: null,
      piezasId: [],
      bochones: [],
      piezas: [],
      piezasNames: [],
      modalActualizarBochon: false,
      selectedPiezaM: null,
      key: 'dbasicos',
      selectedHallazgo: null,
      archivoDenuncia: null,
      excavacionId: '',
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
      ejemplares: [],
      selectedEjemplar: null,
      selectedEjemplarM: null,
      piezas: [],
      listBochones: [],
      selectedPiezaM: null,
      piezasMId: [],
      piezasM: [],
      piezasMNames: [],
      bochonMId: '',
      validatedMBochon: false,
      idExploracionModificar:"",
      puntoGps:{},
      tablaBochones:[]
    };

  }
  setPuntoGpsExcavacion = puntoGps => this.setState({ puntoGpsExcavacion: puntoGps })
  setIdAreaExcavacion = idArea => this.setState({ idAreaExcavacion: idArea });

  //antes de cargar el DOM      
  componentWillMount() {

    fetch(urlApi + '/personas', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + cookies.get('token')
      }
    })
      .then((response) => {
        return response.json()
      })
      .then((empleados) => {
        this.setState({
          directores: empleados.personas,
          profesionales: empleados.personas,
          auxiliares: empleados.personas
        })
      }).catch(function (error) {
        console.log('Ha ocurrido un error:', error)
      });

    fetch(urlApi + '/bochonExca/'+this.props.match.params.id, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + cookies.get('token')
      }
    })
      .then((response) => {
        return response.json()
      })
      .then((bochons) => {
        this.setState({ bochones: bochons.bochones })
      }).catch(function (error) {
        console.log('Ha ocurrido un error:', error)
      });

    fetch(urlApi + '/exploracion', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + cookies.get('token')
      }
    })
      .then((response) => {
        return response.json()
      })
      .then((explorations) => {

        this.setState({ exploraciones: explorations.exploraciones })
      }).catch(function (error) {
        console.log('Ha ocurrido un error:', error)
      });

    fetch(urlApi + '/ejemplares', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + cookies.get('token')
      }
    })
      .then((response) => {
        return response.json()
      })
      .then((result) => {
        this.setState({
          ejemplares: result.ejemplares
        });

      }).catch(function (error) {
        toast.error("Error al consultar Ejemplares. Intente nuevamente.");
        console.log(
          "Hubo un problema con la petición Fetch:",
          error.message
        );
      });


  }

  //una vez cargado en el DOM
  componentDidMount() {



    if (!cookies.get('user') && !cookies.get('password')) {
      window.location.href = '/';
    }
    else {


      fetch(urlApi + '/excavacionId/' + this.props.match.params.id, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + cookies.get('token')
        }
      })
        .then((response) => {
          return response.json()
        })
        .then((excavacions) => {


          var fb = excavacions.excavacionId.fechaTermino;
          if (fb !== null) {
            fb = (Moment(excavacions.excavacionId.fechaTermino).add(1, 'days')).format('YYYY-MM-DD')
          }

          setTimeout(() => {
            var directorSelect = []
            var directorS = null
            if (excavacions.excavacionId.directorId !== null && excavacions.excavacionId.directorId !== '') {

              directorSelect = this.state.directores.filter(option => option._id === excavacions.excavacionId.directorId)

              if (directorSelect !== []) {
                directorS = {
                  label: directorSelect[0].nombres + " " + directorSelect[0].apellidos,
                  value: directorSelect[0]._id
                }
              }
            }

            var profesionalesSelect = []
            if (excavacions.excavacionId.profesionales !== []) {
              profesionalesSelect = this.state.profesionales.filter(({ _id }) => excavacions.excavacionId.profesionales.includes(_id))
              profesionalesSelect = profesionalesSelect.map((opt) => ({ label: opt.nombres + ' ' + opt.apellidos, value: opt._id }));
            }

            var auxiliaresSelect = []
            if (excavacions.excavacionId.auxiliares !== []) {
              auxiliaresSelect = this.state.auxiliares.filter(({ _id }) => excavacions.excavacionId.auxiliares.includes(_id))
              auxiliaresSelect = auxiliaresSelect.map((opt) => ({ label: opt.nombres + ' ' + opt.apellidos, value: opt._id }));
            }

            var tipoHallazgo = null
            if (excavacions.excavacionId.tipoHallazgo !== null) {
              tipoHallazgo = optHallazgo.filter(option => option.value === excavacions.excavacionId.tipoHallazgo)
            }

            var exploracionSelect = []
            var exploracionS = null
           
            if (excavacions.excavacionId.idExploracion !== null && excavacions.excavacionId.idExploracion !== '') {
              exploracionSelect = this.state.exploraciones.filter(option => option._id === excavacions.excavacionId.idExploracion)
              if (exploracionSelect !== []) {
                exploracionS = {
                  label: exploracionSelect[0].nombreArea,
                  value: exploracionSelect[0]._id
                }
              }


            }

            this.setState({
              nombreArea: excavacions.excavacionId.nombreArea,
              codigoCampo: excavacions.excavacionId.codigoCampo,
              fechaInicio: (Moment(excavacions.excavacionId.fechaInicio).add(1, 'days')).format('YYYY-MM-DD'),
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
              puntoGpsExcavacion:excavacions.excavacionId.puntoGPS,
              idAreaExcavacion: excavacions.excavacionId.idArea,
            })

            this.setState({
              tableArchivosDen: this.renderTableArchivosDen(),
              tableArchivosFotos: this.renderTableArchivosFotos(),
              tableArchivosVideos: this.renderTableArchivosVideos()
            })

          }, 1500);


        });
    }
  }




  //**Manejadores**

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
    console.log(selectedDirector)
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
    this.setState({ selectedExploracionAnt: this.state.selectedExploracion });
    this.setState({ selectedExploracion });
    this.setState({ idExploracionModificar:selectedExploracion.value });
  };

  handleEjemplarChange = (selectedEjemplar) => {
    this.setState({ selectedEjemplar });
    if (selectedEjemplar !== null) {
      fetch(urlApi + '/piezasEjemplar/' + selectedEjemplar.value, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + cookies.get('token')
        }
      })
        .then((response) => {
          return response.json()
        })
        .then((result) => {
          this.setState({
            piezas: result.piezas, selectedPieza: null
          });

        }).catch(function (error) {
          toast.error("Error al consultar Piezas. Intente nuevamente.");
          console.log(
            "Hubo un problema con la petición Fetch:",
            error.message
          );
        });


    }
    else {
      this.setState({
        piezas: [], selectedPieza: null
      });

    }
  };

  handleEjemplarMChange = (selectedEjemplarM) => {
    this.setState({ selectedEjemplarM });
    if (selectedEjemplarM !== null) {
      fetch(urlApi + '/piezasEjemplar/' + selectedEjemplarM.value, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + cookies.get('token')
        }
      })
        .then((response) => {
          return response.json()
        })
        .then((result) => {
          this.setState({
            piezasM: result.piezas, selectedPiezaM: null
          });

        }).catch(function (error) {
          toast.error("Error al consultar Piezas. Intente nuevamente.");
          console.log(
            "Hubo un problema con la petición Fetch:",
            error.message
          );
        });


    }
    else {
      this.setState({
        piezasM: [], selectedPiezaM: null
      });

    }
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

  handleCodCampoBChange = (evt) => {
    this.setState({ codigoCampoB: evt.target.value });
  };

  handleCodCampoMChange = (evt) => {
    this.setState({ codigoCampoM: evt.target.value });
  };

  handleInfoAdicionalChange = (evt) => {
    this.setState({ infoAdicional: evt.target.value });
  };

  handleInfoAdicionalMChange = (evt) => {
    this.setState({ infoAdicionalM: evt.target.value });
  };


  handleNroBochonChange = (evt) => {
    this.setState({ nroBochon: evt.target.value });
  };

  handleNroBochonMChange = (evt) => {
    this.setState({ nroBochonM: evt.target.value });
  };

  filehandleChange = (event) => {

    const file = event.target.files;
    const name = file[0].name;
    this.setState({ archivoDenuncia: file });

  }


  handleForm1 = (event) => {

    const form = document.getElementById("form1");
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {


      $(".loader").removeAttr("style");
      var directorName = "";
      var directorId = "";
      if (this.state.selectedDirector !== null) {
        directorName = this.state.selectedDirector.label;
        directorId = this.state.selectedDirector.value
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
      fetch(urlApi + '/excavacion/' + this.props.match.params.id, {
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
            $(".loader").fadeOut("slow");

          }

          return response.json();
        })
        .then(function (data) { this.setState({ key: 'dhallazgo' }); }.bind(this))
        .catch(function (error) {
          $(".loader").fadeOut("slow");
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
    this.setState({ validatedgeo: true, tabbochon: false, tabfotos: false, tabvideos: false });
  }

  handleAntForm3 = (event) => {

    this.setState({ tabh: false, key: 'dhallazgo' });

  }




  handlePiezasChange = (selectedPieza) => {
    let piezas = Array.from(selectedPieza, option => option.value);
    let names = Array.from(selectedPieza, option => option.label);

    this.setState({ selectedPieza });
    this.setState({ piezasId: piezas, piezasNames: names });
  };

  handlePiezasMChange = (selectedPiezaM) => {
    let piezas = Array.from(selectedPiezaM, option => option.value);
    let names = Array.from(selectedPiezaM, option => option.label);

    this.setState({ selectedPiezaM });
    this.setState({ piezasMId: piezas, piezasMNames: names });
  };

  insertarBochon = (event) => {

    const form = document.getElementById("form6");
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      if (this.state.selectedEjemplar !== null) {

        if (this.state.selectedPieza !== null) {
          $(".loader").removeAttr("style");
          var data = {
            "nombre": "",
            "codigoCampo": this.state.codigoCampoB,
            "nroBochon": this.state.nroBochon,
            "preparador": "",
            "preparadorID": "",
            "tipoPreparacion": "",
            "acidosAplicados": [],
            "ejemplarAsociado": this.state.selectedEjemplar.value,
            "excavacionId": this.props.match.params.id,
            "piezasId": this.state.piezasId,
            "piezasNames": this.state.piezasNames,
            "infoAdicional": this.state.infoAdicional
          }

          fetch(urlApi + "/bochon", {
            method: "post",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
              'Authorization': 'Bearer ' + cookies.get('token')
            },
          })
            .then(function (response) {
              if (response.ok) {
                toast.success("¡Se guardó el Bochón con Éxito!");
                $(".loader").fadeOut("slow");
                return response.json();

              }
            })
            .then(function (data) {
              var listB = this.state.listBochones;
              listB.push(data.bochon._id);
              this.setState({
                listBochones: listB
              });

              fetch(urlApi + '/bochonExca/' + this.props.match.params.id, {
                method: 'GET',
                headers: {
                  'Authorization': 'Bearer ' + cookies.get('token')
                }
              })
                .then((response) => {
                  return response.json()
                })
                .then(result => {

                  this.setState({
                    bochones: result.bochones
                  });
                  this.setState({ codigoCampoB: "", nroBochon: "", selectedEjemplar: null, piezasId: [], piezasNames: [], selectedPieza: null, infoAdicional: "" });
                  return result;


                })
                .then(function (data) {
                  this.setState({ tablaBochones: this.renderTableBochones() })
                }.bind(this))
                .then(function () {
                  //Actualizo lista de bochones encontrados
                  var datos = {
                    "bochonesEncontrados": this.state.listBochones
                  }
                  fetch(urlApi + '/excavacion/' + this.props.match.params.id, {
                    method: 'put',
                    body: JSON.stringify(datos),
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + cookies.get('token')
                    }
                  })
                    .then(function (response) {
                      if (response.ok) {
                        console.log("¡Se actualizaron los datos de la Excavación con Éxito!");

                      }
                    }.bind(this))
                    .catch(function (error) {
                      console.log(
                        "Hubo un problema con la petición Fetch:",
                        error.message
                      );
                    })


                }.bind(this))
                .catch(function (error) {
                  toast.error("Error al consultar Bochones. Intente nuevamente.");
                  console.log(
                    "Hubo un problema con la petición Fetch:",
                    error.message
                  );
                });


            }.bind(this))
            .catch(function (error) {
              $(".loader").fadeOut("slow");
              toast.error("Error al guardar. Intente nuevamente.");
              console.log(
                "Hubo un problema con la petición Fetch:",
                error.message
              );
            });

        }
        else {
          toast.error("¡Debe Seleccionar al menos una pieza!");
        }


      }
      else {
        toast.error("¡Debe Seleccionar un Ejemplar!");
      }

    }
    this.setState({ validatedbochon: true });


  }

  renderTableBochones() {


    return this.state.bochones.map((bochon, index) => {

      return (
        <tr key={index}>
          <td><Button variant="secondary" type="button" id="editar" onClick={() => this.mostrarModalActualizarBochon(bochon)}>
            <FontAwesomeIcon icon={faEdit} />
          </Button>
            &nbsp;
            <Button variant="danger" type="button" id="eliminar" onClick={() => this.eliminarBochon(bochon._id)}>
              <FontAwesomeIcon icon={faTrash} />
            </Button></td>
          <td>{bochon.codigoCampo}</td>
          <td>{bochon.nroBochon}</td>
          <td>{bochon.ejemplarAsociado[0].sigla}</td>
          <td>{bochon.piezasNames.toString()}</td>
          <td>{bochon.infoAdicional}</td>

        </tr>
      )
    })

  }

  mostrarModalActualizarBochon = (dato) => {

    if (dato.ejemplarAsociado[0]._id !== null && dato.ejemplarAsociado[0]._id !== '') {
      //busco las piezas del ejemplar
      fetch(urlApi + '/piezasEjemplar/' + dato.ejemplarAsociado[0]._id, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + cookies.get('token')
        }
      })
        .then((response) => {
          return response.json()
        })
        .then(function (result) {
          this.setState({ piezasM: result.piezas })
        }.bind(this))
        .then(function () {
          var ejemplarSelect = [];
          if (dato.ejemplarAsociado[0]._id !== null && dato.ejemplarAsociado[0]._id !== '') {
            ejemplarSelect = this.state.ejemplares.filter(option => option._id === dato.ejemplarAsociado[0]._id)
            ejemplarSelect = ejemplarSelect.map((opt) => ({ label: opt.sigla, value: opt._id }));
          }


          var piezasSelect = [];
          if (dato.piezasId !== []) {
            piezasSelect = this.state.piezasM.filter(({ _id }) => dato.piezasId.includes(_id))
            piezasSelect = piezasSelect.map((opt) => ({ label: opt.identificador, value: opt._id }));
          }

          this.setState({
            codigoCampoM: dato.codigoCampo,
            nroBochonM: dato.nroBochon,
            infoAdicionalM: dato.infoAdicional,
            selectedEjemplarM: ejemplarSelect,
            selectedPiezaM: piezasSelect,
            modalActualizarBochon: true,
            piezasMId: dato.piezasId,
            piezasMNames: dato.piezasNames,
            bochonMId: dato._id
          });

        }.bind(this))
        .catch(function (error) {
          console.log('Hubo un problema con la petición Fetch (2):' + error.message);
        })

    }




  }

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




  editarBochon = (e) => {

    const formx = document.getElementById("form9");
    e.preventDefault();
    if (formx.checkValidity() === false) {
      toast.error("¡Verique datos obligatorios!");
      e.stopPropagation();

    } else {

      if (this.state.selectedEjemplarM !== null) {

        if (this.state.selectedPiezaM !== null) {
          $(".loader").removeAttr("style");
          var data = {
            "nombre": "",
            "codigoCampo": this.state.codigoCampoM,
            "nroBochon": this.state.nroBochonM,
            "preparador": "",
            "preparadorID": "",
            "tipoPreparacion": "",
            "acidosAplicados": [],
            "ejemplarAsociado": this.state.selectedEjemplarM.value,
            "excavacionId": this.props.match.params.id,
            "piezasId": this.state.piezasMId,
            "piezasNames": this.state.piezasMNames,
            "infoAdicional": this.state.infoAdicionalM
          }

          fetch(urlApi + "/bochon/" + this.state.bochonMId, {
            method: "put",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
              'Authorization': 'Bearer ' + cookies.get('token')
            },
          })
            .then(function (response) {
              if (response.ok) {
                toast.success("¡Se actualizó el Bochón con Éxito!");
                $(".loader").fadeOut("slow");
                return response.json();

              }
            })
            .then(function (data) {
              var listB = this.state.listBochones;
              listB.push(data.bochon._id);
              this.setState({
                listBochones: listB
              });

              fetch(urlApi + '/bochonExca/' + this.props.match.params.id, {
                method: 'GET',
                headers: {
                  'Authorization': 'Bearer ' + cookies.get('token')
                }
              })
                .then((response) => {
                  return response.json()
                })
                .then(result => {

                  this.setState({
                    bochones: result.bochones
                  });
                  this.setState({ codigoCampoM: "", nroBochonM: "", selectedEjemplarM: null, piezasMId: [], piezasMNames: [], selectedPiezaM: null, infoAdicionalM: "", modalActualizarBochon: false });
                  return result;


                })
                .then(function (data) {
                  this.setState({ tablaBochones: this.renderTableBochones() })
                }.bind(this))
                .then(function () {
                  //Actualizo lista de bochones encontrados
                  var datos = {
                    "bochonesEncontrados": this.state.listBochones
                  }
                  fetch(urlApi + '/excavacion/' + this.props.match.params.id, {
                    method: 'put',
                    body: JSON.stringify(datos),
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + cookies.get('token')
                    }
                  })
                    .then(function (response) {
                      if (response.ok) {
                        console.log("¡Se actualizaron los datos de la Excavación con Éxito!");

                      }
                    }.bind(this))
                    .catch(function (error) {
                      console.log(
                        "Hubo un problema con la petición Fetch:",
                        error.message
                      );
                    })


                }.bind(this))
                .catch(function (error) {
                  toast.error("Error al consultar Bochones. Intente nuevamente.");
                  console.log(
                    "Hubo un problema con la petición Fetch:",
                    error.message
                  );
                });


            }.bind(this))
            .catch(function (error) {
              $(".loader").fadeOut("slow");
              toast.error("Error al guardar. Intente nuevamente.");
              console.log(
                "Hubo un problema con la petición Fetch:",
                error.message
              );
            });

        }
        else {
          toast.error("¡Debe Seleccionar al menos una pieza!");
        }


      }
      else {
        toast.error("¡Debe Seleccionar un Ejemplar!");
      }





    }

    this.setState({ validatedMbochon: true });


  }


  eliminarBochon = (idBochon) => {
    var opcion = window.confirm("¿Está seguro que deseas eliminar el Bochón?");
    if (opcion == true) {
      //Primero busco la excavación, para luego actualizo
      fetch(urlApi + '/excavacionId/' + this.props.match.params.id, {
        method: 'get',
        headers: {
          'Authorization': 'Bearer ' + cookies.get('token')
        }
      })
        .then(response => {
          return response.json();
        })
        .then(function (response) {
          //aca ya tengo la excavacion, tengo que obtener los bochones encontrados y quitar el candidato a eliminar
          $(".loader").removeAttr("style");
          //elimino bochon del array
          var listaB = response.excavacionId.bochonesEncontrados;
          var contador = 0;
          listaB.map((registro) => {
            if (idBochon == registro) {
              listaB.splice(contador, 1);
            }
            contador++;
          });
          var dataB = {
            "bochonesEncontrados": listaB
          }

          //Actualizo la Excavacion
          fetch(urlApi + '/excavacion/' + this.props.match.params.id, {
            method: 'put',
            body: JSON.stringify(dataB),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + cookies.get('token')
            }
          }).then(function (response) {
            if (response.ok) {
              console.log("¡Se actualizaron los datos de la Excavación con Éxito!");
              this.setState({ listBochones: listaB });

            }
          }.bind(this))
            .then(function (response) {
              //Elimino Bochon 
              fetch(urlApi + '/bochon/' + idBochon, {
                method: 'DELETE',
                headers: {
                  'Authorization': 'Bearer ' + cookies.get('token')
                }
              })
                .then(function (response) {
                  //console.log('PASA CON ', response);
                  if (response.ok) {
                    toast.success("¡Se eliminó al Bochon con Éxito!");
                  }
                  $(".loader").fadeOut("slow");
                })
                .catch(function (error) {
                  $(".loader").fadeOut("slow");
                  toast.error("Error al Eliminar Bochon. Intente nuevamente.");
                  console.log('Hubo un problema con la petición Fetch (2):' + error.message);
                });

            }.bind(this))
            .then(function () {
              //Actualizo la lista de bochones

              fetch(urlApi + '/bochonExca/' + this.props.match.params.id, {
                method: 'GET',
                headers: {
                  'Authorization': 'Bearer ' + cookies.get('token')
                }
              })
                .then((response) => {
                  return response.json()
                })
                .then(result => {
                  this.setState({
                    bochones: result.bochones
                  });
                  return result;

                })
                .then(function () {

                  setTimeout(function () { this.setState({ tablaBochones: this.renderTableBochones() }) }.bind(this), 1500);
                }.bind(this))
                .catch(function (error) {
                  console.log('Hubo un problema con la petición Fetch (2):' + error.message);
                })


            }.bind(this))
            .catch(function (error) {
              $(".loader").fadeOut("slow");
              toast.error("Error al Actualizar Excavacion. Intente nuevamente.");
              console.log('Hubo un problema con la petición Fetch (2):' + error.message);
            });

        }.bind(this))
        .catch(function (error) {
          $(".loader").fadeOut("slow");
          toast.error("Error al consultar. Intente nuevamente.");
          console.log('Hubo un problema con la petición Fetch (1):' + error.message);
        });

    }
  }



  eliminarArchivoDenuncia = (dato) => {
    var destino = rutaExcavaciones + 'Denuncias/' + this.props.match.params.id + "/" + dato;
    var opcion = window.confirm("¿Está seguro que deseas eliminar el Archivo?");
    if (opcion == true) {

      fetch(urlApi + '/excavacionId/' + this.props.match.params.id, {
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
          fetch(urlApi + '/excavacion/' + this.props.match.params.id, {
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
          fetch(urlApi + '/excavacionId/' + this.props.match.params.id, {
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
              fetch(urlApi + '/excavacion/' + this.props.match.params.id, {
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

                  const destino = rutaExcavaciones + 'Denuncias/' + this.props.match.params.id;
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
                        this.setState({ archivoDenuncia: null, showSuccess: true, showError: false, urlArchivo: urlArchivo + 'Denuncias/' + this.props.match.params.id + '/' + nameFile });
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
            <a href={urlArchivo + 'Denuncias/' + this.props.match.params.id + '/' + file} disabled target="_blank">{file}</a>
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
            <a href={urlArchivo + 'Fotos/' + this.props.match.params.id + '/' + file.nombre} disabled target="_blank">{file.nombre}</a>
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
            <a href={urlArchivo + 'Videos/' + this.props.match.params.id + '/' + file} disabled target="_blank">{file}</a>
          </td>
        </tr>
      )
    })



  }


  handleForm4 = (event) => {
    $(".loader").removeAttr("style");

    var exploracionId = "";
    if (this.state.selectedExploracion !== null && this.state.selectedExploracion !== "") {
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
      "puntoGps": this.state.puntoGpsExcavacion,
    }

    fetch(urlApi + "/excavacion/" + this.props.match.params.id, {
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
          console.log("¡Se guardó la Excavación con Éxito!");
        }
      }).then(function () {
        if (this.state.selectedExploracion !== null) {
          fetch(urlApi + "/exploracionId/" + this.state.selectedExploracion.value, {
            method: 'get',
            headers: {
              'Authorization': 'Bearer ' + cookies.get('token')
            }
          })
            .then(response => response.json())
            .then(data => {
              var excavaciones = data.exploracionId.idExcavaciones
              if (!excavaciones.includes(this.props.match.params.id)) {
                //si no existe en el arreglo lo agrego
                excavaciones.push(this.props.match.params.id)

                var data = {
                  "idExcavaciones": excavaciones
                }
                fetch(urlApi + "/exploracion/" + this.state.selectedExploracion.value, {
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
                      console.log("¡Se guardó la Exploracion con Éxito!");
                      toast.success("¡Se guardó la Excavación con Éxito!");
                    }
                  }.bind(this))
                  .catch(function (error) {
                    $(".loader").fadeOut("slow");
                    toast.error("Error al guardar. Intente nuevamente.");
                    console.log(
                      "Hubo un problema con la petición Fetch:" + error.message
                    );
                  });

              }
              else {
                $(".loader").fadeOut("slow");
              }


            })
            .catch(function (error) {
              console.log('Error:', Error)
            })

        }

      }.bind(this))
      .then(function () {
        if (this.state.selectedExploracionAnt !== null) {
          fetch(urlApi + "/exploracionId/" + this.state.selectedExploracionAnt.value, {
            method: 'get',
            headers: {
              'Authorization': 'Bearer ' + cookies.get('token')
            }
          })
            .then(response => response.json())
            .then(data => {
              var excavaciones = data.exploracionId.idExcavaciones
              if (excavaciones.includes(this.props.match.params.id)) {

                //borro de la exploracion anterior la excavacion
                var contador = 0;
                excavaciones.map((registro) => {
                  if (registro === this.props.match.params.id) {
                    excavaciones.splice(contador, 1);
                  }
                  contador++;
                });

                var data = {
                  "idExcavaciones": excavaciones
                }
                fetch(urlApi + "/exploracion/" + this.state.selectedExploracionAnt.value, {
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
                      console.log("¡Se guardó la Exploracion con Éxito!");
                      toast.success("¡Se guardó la Excavación con Éxito!");
                    }
                  }.bind(this))
                  .catch(function (error) {
                    $(".loader").fadeOut("slow");
                    toast.error("Error al guardar. Intente nuevamente.");
                    console.log(
                      "Hubo un problema con la petición Fetch:" + error.message
                    );
                  });

              }
              else {
                $(".loader").fadeOut("slow");
              }


            })
            .catch(function (error) {
              console.log('Error:', Error)
            })

        }


      }.bind(this))
      .catch(function (error) {
        $(".loader").fadeOut("slow");
        toast.error("Error al guardar. Intente nuevamente.");
        console.log(
          "Hubo un problema con la petición Fetch:" + error.message
        );
      });


  }

  filesImagehandleChange = (event) => {
    const file = event.target.files;
    const name = file[0].name;
    this.setState({ archivoFoto: file });

  }

  filesVideohandleChange = (event) => {
    const file = event.target.files;
    const name = file[0].name;
    this.setState({ archivoVideo: file });
  }

  subirFoto = () => {

    const MAXIMO_TAMANIO_BYTES = 5000000;
    const types = ['image/gif', 'image/png', 'image/jpg', 'image/jpeg', 'image/bmp', 'image/webp'];
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
          fetch(urlApi + '/excavacionId/' + this.props.match.params.id, {
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
              var fotoSubir = {
                "nombre": nameFile,
                "descripcion": this.state.descripcionFoto
              }

              listArchivosFotos.push(fotoSubir);



              var dataFoto = {
                "fotosExcavacion": listArchivosFotos,
              };

              //Primero Actualizo la Excavacion
              fetch(urlApi + '/excavacion/' + this.props.match.params.id, {
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

                  const destino = rutaExcavaciones + 'Fotos/' + this.props.match.params.id;
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
                        this.setState({ archivoFoto: null, descripcionFoto: "", showSuccessFoto: true, showErrorFoto: false, urlArchivo: urlArchivo + 'Fotos/' + this.props.match.params.id + '/' + nameFile });
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


  eliminarArchivoFoto = (dato) => {
    var destino = rutaExcavaciones + 'Fotos/' + this.props.match.params.id + "/" + dato;
    var opcion = window.confirm("¿Está seguro que deseas eliminar el Archivo?");
    if (opcion == true) {

      fetch(urlApi + '/excavacionId/' + this.props.match.params.id, {
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
          fetch(urlApi + '/excavacion/' + this.props.match.params.id, {
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

    const MAXIMO_TAMANIO_BYTES = 50000000;
    const types = ['video/x-msvideo', 'video/mpeg', 'video/ogg', 'video/x-flv', 'video/mp4', 'video/x-ms-wmv', 'video/quicktime', 'video/3gpp', 'video/MP2T'];
    var file = this.state.archivoVideo

    if (file !== null && file.length !== 0) {
      var nameFile = (file[0].name).replace(/\s+/g, "_");
      nameFile = this.reemplazar(nameFile);
      var size = file[0].size;
      var type = file[0].type;

      if (size > MAXIMO_TAMANIO_BYTES) {
        var tamanio = MAXIMO_TAMANIO_BYTES / 1000000;
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
          fetch(urlApi + '/excavacionId/' + this.props.match.params.id, {
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
              fetch(urlApi + '/excavacion/' + this.props.match.params.id, {
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

                  const destino = rutaExcavaciones + 'Videos/' + this.props.match.params.id;
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
                        this.setState({ archivoVideo: null, showSuccessVideo: true, showErrorVideo: false, urlArchivo: urlArchivo + 'Videos/' + this.props.match.params.id + '/' + nameFile });
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

  eliminarArchivoVideo = (dato) => {
    var destino = rutaExcavaciones + 'Videos/' + this.props.match.params.id + "/" + dato;
    var opcion = window.confirm("¿Está seguro que deseas eliminar el Archivo?");
    if (opcion == true) {

      fetch(urlApi + '/excavacionId/' + this.props.match.params.id, {
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
          fetch(urlApi + '/excavacion/' + this.props.match.params.id, {
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

    const { selectedPieza } = this.state;
    let optPiezas = this.state.piezas.map((opt) => ({
      label: opt.identificador,
      value: opt._id,
    }));

    const { selectedPiezaM } = this.state;
    let optPiezasM = this.state.piezasM.map((opt) => ({
      label: opt.identificador,
      value: opt._id,
    }));

    const { selectedHallazgo } = this.state;

    const { selectedEjemplar } = this.state;
    const { selectedEjemplarM } = this.state;
    let optEjemplares = this.state.ejemplares.map((opt) => ({
      label: opt.sigla + ' (' + opt.tipoColeccion + ')',
      value: opt._id,
    }));

    const {idExploracionModificar}=this.state;



    return (
      <>
        <Menu />
        <div className="row">
          <div className="col-md-12">
            <div id="contenido" align="left" className="container">
              <div className="loader" style={{ display: 'none' }}></div>
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
                            value={this.state.nombreArea}
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

                        <ModificarExcavacion
                      idExploracion={idExploracionModificar}
                      excavacionId={this.props.match.params.id}
                      setPuntoGpsExcavacion={this.setPuntoGpsExcavacion}
                      setIdAreaExcavacion={this.setIdAreaExcavacion}
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
                      <Form.Group className="col-sm-6" controlId="codigoCampo">
                        <Form.Label>Código Campo:</Form.Label>
                        <Form.Control
                          type="text"
                          value={this.state.codigoCampoB}
                          onChange={this.handleCodCampoBChange}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Por favor, ingrese Cód. Campo.
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="col-sm-6" controlId="nroBochon">
                        <Form.Label>Nro. Bochón:</Form.Label>
                        <Form.Control
                          type="text"
                          value={this.state.nroBochon}
                          onChange={this.handleNroBochonChange}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Por favor, ingrese Nro. Bochón.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Form.Row>



                    <Form.Row>
                      <Form.Group className="col-sm-12" controlId="ejemplarAsociado">
                        <Form.Label>Ejemplar:</Form.Label>
                        <Select
                          placeholder={"Seleccione Ejemplar"}
                          options={optEjemplares}
                          onChange={this.handleEjemplarChange}
                          value={selectedEjemplar}
                          required
                          isClearable
                        />
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      <Form.Group className="col-sm-12" controlId="piezasAsociadas">
                        <Form.Label>Piezas Asociadas:</Form.Label>
                        <Select
                          placeholder={"Seleccione Piezas"}
                          options={optPiezas}
                          onChange={this.handlePiezasChange}
                          value={selectedPieza}
                          isMulti
                          isClearable
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
                        <Button variant="primary" type="button" id="guardarBochon" onClick={this.insertarBochon}>
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
                          {this.state.tablaBochones}
                        </tbody>
                      </Table>
                    </Form.Row>

                  </Form>
                </Tab>

                <Tab eventKey="dfotos" title="Fotos" disabled={this.state.tabfotos}>
                  <Form id="form7" noValidate validated={validatedfotos}>
                    <legend>Fotos</legend>
                    <hr />

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
                    <hr />

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
                  <Form id="form9" noValidate validated={this.state.validatedMBochon}>


                    <Form.Row>
                      <Form.Group className="col-sm-6" controlId="codigoCampoM">
                        <Form.Label>Código Campo (*):</Form.Label>
                        <Form.Control
                          type="text"
                          name='codigoCampoM'
                          value={this.state.codigoCampoM}
                          onChange={this.handleCodCampoMChange}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Por favor, ingrese Nro. Bochón.
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="col-sm-6" controlId="nroBochonM">
                        <Form.Label>Nro. Bochón (*):</Form.Label>
                        <Form.Control
                          type="text"
                          name='nroBochonM'
                          value={this.state.nroBochonM}
                          onChange={this.handleNroBochonMChange}
                          required
                        />
                      </Form.Group>
                      <Form.Control.Feedback type="invalid">
                        Por favor, ingrese Nro. Bochón.
                      </Form.Control.Feedback>

                    </Form.Row>

                    <Form.Row>
                      <Form.Group className="col-sm-12" controlId="ejemplarAsociadoM" >
                        <Form.Label>Ejemplar (*):</Form.Label>
                        <Select
                          placeholder={"Seleccione Ejemplar"}
                          options={optEjemplares}
                          onChange={this.handleEjemplarMChange}
                          value={selectedEjemplarM}
                          required
                          isClearable
                          isDisabled
                        />
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      <Form.Group className="col-sm-12" controlId="piezasAsociadasM">
                        <Form.Label>Piezas Asociadas (*):</Form.Label>
                        <Select
                          placeholder={"Seleccione Piezas"}
                          options={optPiezasM}
                          onChange={this.handlePiezasMChange}
                          value={selectedPiezaM}
                          isMulti
                          isClearable
                        />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group className="col-sm-12" controlId="infoAdicionalM">
                        <Form.Label>Información Adicional:</Form.Label>
                        <Form.Control
                          as='textarea'
                          name='infoAdicionalM'
                          onChange={this.handleInfoAdicionalMChange}
                          value={this.state.infoAdicionalM}
                        />
                      </Form.Group>
                    </Form.Row>
                    <small>(*) Campos Obligatorios</small>

                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => this.cerrarModalActualizarBochon()}>
                    Cerrar
                  </Button>
                  <Button variant="primary" id="guardarAct" onClick={this.editarBochon}> <FontAwesomeIcon icon={faSave} /> Guardar</Button>
                </Modal.Footer>
              </Modal>





              <br />
              <br />


            </div>
          </div>
        </div>

      </>
    )

  }

}

export default EditExcavacion;

