import React from "react";
import { Form, Button, Tabs, Tab, Table, Modal, Alert } from 'react-bootstrap';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faReply, faPlus, faTrash, faEdit, faShare, faTimesCircle, faUpload, faIdCard } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import Select from 'react-select';
import Menu from "./../Menu"
import Cookies from 'universal-cookie';
import $ from 'jquery';
import axios from "axios";
import { ObjViewer } from 'react-obj-viewer'

const cookies = new Cookies();

//Variables Globales
const urlApi = process.env.REACT_APP_API_HOST;
const urlArchivo = process.env.REACT_APP_URL_EJEMPLARES;
const rutaEjemplares = process.env.REACT_APP_RUTA_EJEMPLARES;


const optMaterial = [{ "value": "Donación", "label": "Donación" },
{ "value": "Excavación realizada MUC", "label": "Excavación realizada MUC" },
{ "value": "Otros", "label": "Otros" }]



class AddEjemplar extends React.Component {

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
      tabdim: true,
      key: 'dbasicos',
      op: 'I',
      validateddim: false,
      tabbas: false,
      validatedgeo: false,
      tabgeo: true,
      tabtax: true,
      validatedtax: false,
      tabarea: true,
      validatedarea: false,
      tabotros: true,
      validatedotros: false,
      tabfotos: true,
      validatedfotos: false,
      tabvideos: true,
      validatedvideos: false,
      tabvideos3D: true,
      validated3Dvideos: false,
      prestamos: [],
      fprestamo: '',
      fdevolucion: '',
      investigador: '',
      institucion: '',
      archivos: [],
      archivosOD: [],
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
      op: 'I',
      ejemplarId: '',
      modalActualizarPieza: false,
      tablaPiezas: [],
      nombre: '',
      dimensionAltoM: "",
      dimensionLargoM: "",
      dimensionAnchoM: "",
      nombreM: '',
      validateddimM: false,
      piezaMId: '',
      areaHallazgo: '',
      selectedMaterial: null,
      tipoIntervencion: '',
      autores: '',
      publicaciones: '',
      archivoCurriculum: null,
      listArchivosCV: [],
      tableArchivosCV: [],
      showSuccess: false,
      showError: false,
      excavaciones: [],
      selectedExcavacion: null,
      bochones: [],
      selectedBochon: null,
      selectedExcavacionM: null,
      selectedBochonM: null,
    }

  }



  componentDidMount() {

    if (!cookies.get('user') && !cookies.get('password')) {
      window.location.href = '/';
    }
  }

  componentWillMount() {

    fetch(urlApi + '/coleccion', {
      method: 'get',
      headers: {
        'Authorization': 'Bearer ' + cookies.get('token')
      }
    })
      .then((response) => {
        return response.json()
      })
      .then((collection) => {
        this.setState({ colecciones: collection.colecciones })
      })
      .catch(function (error) {
        console.log('Error:', error);
      })


    fetch(urlApi + "/personas", {
      method: 'get',
      headers: {
        'Authorization': 'Bearer ' + cookies.get('token')
      }
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.setState({
          preparadores: data.personas,
        });
      }).catch(function (error) {
        toast.error("Error al guardar. Intente nuevamente.");
        console.log(
          "Hubo un problema con la petición Fetch:",
          error.message
        );
      });

    fetch(urlApi + "/excavacion", {
      method: 'get',
      headers: {
        'Authorization': 'Bearer ' + cookies.get('token')
      }
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.setState({
          excavaciones: data.excavaciones,
        });
      }).catch(function (error) {
        toast.error("Error al conusltar. Intente nuevamente.");
        console.log(
          "Hubo un problema con la petición Fetch:",
          error.message
        );
      });

  }



  //Manejadores de cada campo 

  handleShow = evt => {
    this.setState({ show: true });
  };

  handleClose = evt => {
    this.setState({ show: false });
  };

  handleSiglaChange = evt => {
    this.setState({ sigla: evt.target.value });
  };

  handlePreparadorChange = (selectedPreparador) => {
    this.setState({ selectedPreparador });
  };


  handleTipoChange = (selectedTipo) => {
    this.setState({ selectedTipo });
    //  console.log(`Option selected:`, selectedTipo);

  }


  handleColeccionesChange = (selectedColeccion) => {
    this.setState({ selectedColeccion });
  }

  handleIngresadoPorChange = (selectedMaterial) => {
    this.setState({ selectedMaterial });
    // console.log(`Option selected:`, selectedMaterial);

  }

  handleFechaIngresoChange = evt => {
    this.setState({ fechaIngreso: evt.target.value });
  };

  handleNombrePiezaChange = evt => {
    this.setState({ nombre: evt.target.value });
  };

  handleDimensionLargoChange = evt => {
    this.setState({ dimensionLargo: evt.target.value });
  };

  handleDimensionAnchoChange = evt => {

    this.setState({ dimensionAncho: evt.target.value });
  };

  handleDimensionAltoChange = evt => {
    this.setState({ dimensionAlto: evt.target.value });
  };


  handleNombrePiezaMChange = evt => {
    this.setState({ nombreM: evt.target.value });
  };

  handleDimensionLargoMChange = evt => {
    this.setState({ dimensionLargoM: evt.target.value });
  };

  handleDimensionAnchoMChange = evt => {

    this.setState({ dimensionAnchoM: evt.target.value });
  };

  handleDimensionAltoMChange = evt => {
    this.setState({ dimensionAltoM: evt.target.value });
  };


  handleUbicacionChange = evt => {
    this.setState({ ubicacion: evt.target.value });
  };

  handleTipoIntervencionChange = evt => {
    this.setState({ tipoIntervencion: evt.target.value });
  };

  handleAutoresChange = evt => {
    this.setState({ autores: evt.target.value });
  };

  handlePublicacionesChange = evt => {
    this.setState({ publicaciones: evt.target.value });
  };

  handleObservacionesAdicChange = evt => {
    this.setState({ observacionesAdic: evt.target.value });
  };

  handleFormacionChange = evt => {
    this.setState({ formacion: evt.target.value });
  };

  handleGrupoChange = evt => {
    this.setState({ grupo: evt.target.value });
  };

  handleSubgrupoChange = evt => {
    this.setState({ subgrupo: evt.target.value });
  };

  handleEdadChange = evt => {
    this.setState({ edad: evt.target.value });
  };

  handlePeriodoChange = evt => {
    this.setState({ periodo: evt.target.value });
  };

  handleEraChange = evt => {
    this.setState({ era: evt.target.value });
  };


  handleReinoChange = evt => {
    this.setState({ reino: evt.target.value });
  };

  handleFiloChange = evt => {
    this.setState({ filo: evt.target.value });
  };

  handleClaseChange = evt => {
    this.setState({ clase: evt.target.value });
  };

  handleOrdenChange = evt => {
    this.setState({ orden: evt.target.value });
  };

  handleFamiliaChange = evt => {
    this.setState({ familia: evt.target.value });
  };

  handleGeneroChange = evt => {
    this.setState({ genero: evt.target.value });
  };

  handleEspecieChange = evt => {
    this.setState({ especie: evt.target.value });
  };

  handleFPrestamoChange = evt => {
    this.setState({ fprestamo: evt.target.value });
  };

  handleFDevolucionChange = evt => {
    this.setState({ fdevolucion: evt.target.value });
  };

  handleInvestigadorChange = evt => {
    this.setState({ investigador: evt.target.value });
  };

  handleInstitucionChange = evt => {
    this.setState({ institucion: evt.target.value });
  };

  handleAreaHChange = evt => {
    this.setState({ areaHallazgo: evt.target.value });
  };



  handleExcavacionesChange = (selectedExcavacion) => {

    this.setState({ selectedExcavacion });
    if (selectedExcavacion !== null) {
      //busco los bochones asociadas a la excavacion
      fetch(urlApi + '/bochonExca/' + selectedExcavacion.value, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + cookies.get('token')
        }
      })
        .then((response) => {
          return response.json()
        })
        .then(function (data) {
          this.setState({ bochones: data.bochones, selectedBochon: null })
        }.bind(this))
        .catch(function (error) {
          console.log('Error:', error)
        })
    }
    else{
      this.setState({selectedBochon: null, bochones:[] })
    }
  }

  handleBochonChange = (selectedBochon) => {
    this.setState({ selectedBochon })
  }

  handleExcavacionesMChange = (selectedExcavacionM) => {

    this.setState({ selectedExcavacionM });
    if (selectedExcavacionM !== null) {
      //busco los bochones asociadas a la excavacion
      fetch(urlApi + '/bochonExca/' + selectedExcavacionM.value, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + cookies.get('token')
        }
      })
        .then((response) => {
          return response.json()
        })
        .then(function (data) {
          this.setState({ bochones: data.bochones, selectedBochonM: null })
        }.bind(this))
        .catch(function (error) {
          console.log('Error:', error)
        })
    }
    else{
      this.setState({selectedBochonM: null, bochones:[] })
    }
  }

  handleBochonMChange = (selectedBochonM) => {
    this.setState({ selectedBochonM })
  }

  handleMuestraChange(evt) {
    this.setState({ muestraHome: evt.target.checked });
  }

  handleFbajaChange = evt => {
    this.setState({ fechaBaja: evt.target.value });
  };

  handleMotivoChange = evt => {
    this.setState({ motivoBaja: evt.target.value });
  };


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


  actualizarEjemplar = (event) => {
    const form = document.getElementById("form7");
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {

      $(".loader").removeAttr("style");
      var coleccionName = "";
      var coleccionId = "";
      if (this.state.selectedColeccion !== null) {
        coleccionName = this.state.selectedColeccion.label;
        coleccionId = this.state.selectedColeccion.value
      }

      var idPreparador = "";
      if (this.state.selectedPreparador !== null) {
        idPreparador = this.state.selectedPreparador.value
      }

      var idMaterial = "";
      if (this.state.selectedMaterial !== null) {
        idMaterial = this.state.selectedMaterial.value
      }

      var eraGeo = {
        "formacion": this.state.formacion,
        "grupo": this.state.grupo,
        "subgrupo": this.state.subgrupo,
        "edad": this.state.edad,
        "periodo": this.state.periodo,
        "era": this.state.era
      };

      var areaH = {
        "nombreArea": this.state.areaHallazgo,
        "pais": '',
        "ciudad": '',
        "provincia": ''
      };



      var data = {
        sigla: this.state.sigla,
        tipoColeccion: coleccionName,
        tipoColeccionId: coleccionId,
        fechaIngreso: this.state.fechaIngreso,
        fechaBaja: this.state.fechaBaja,
        motivoBaja: this.state.motivoBaja,
        taxonReino: this.state.reino,
        taxonFilo: this.state.filo,
        taxonClase: this.state.clase,
        taxonOrden: this.state.orden,
        taxonFamilia: this.state.familia,
        taxonGenero: this.state.genero,
        taxonEspecie: this.state.especie,
        eraGeologica: eraGeo,
        ubicacionMuseo: this.state.ubicacion,
        preparador: idPreparador,
        materialIngresadoPor: idMaterial,
        tipoIntervencion: this.state.tipoIntervencion,
        autores: this.state.autores,
        publicaciones: this.state.publicaciones,
        observacionesAdic: this.state.observacionesAdic,
        home: this.state.muestraHome,
        areaHallazgo: areaH
      }

      fetch(urlApi + '/ejemplar/' + this.state.ejemplarId, {
        method: 'put',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + cookies.get('token')
        }
      })
        .then(function (response) {
          if (response.ok) {
            toast.success("¡Se actualizaron los datos del Ejemplar con Éxito!");
            $(".loader").fadeOut("slow");
            return response.json();

          }
        })
        .catch(function (error) {
          $(".loader").fadeOut("slow");
          toast.error("Error al guardar. Intente nuevamente.");
          console.log(
            "Hubo un problema con la petición Fetch:",
            error.message
          );
        });


    }

    this.setState({ validatedotros: true });


  }


  handleForm1 = (event) => {
    const form = document.getElementById("form1");
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      if (this.state.op === "I") {

        $(".loader").removeAttr("style");
        var coleccionName = "";
        var coleccionId = "";
        if (this.state.selectedColeccion !== null) {
          coleccionName = this.state.selectedColeccion.label;
          coleccionId = this.state.selectedColeccion.value
        }

        var data = {
          sigla: this.state.sigla,
          tipoColeccion: coleccionName,
          tipoColeccionId: coleccionId,
          fechaIngreso: this.state.fechaIngreso,
          fechaBaja: this.state.fechaBaja,
          motivoBaja: this.state.motivoBaja,
          taxonReino: '',
          taxonFilo: '',
          taxonClase: '',
          taxonOrden: '',
          taxonFamilia: '',
          taxonGenero: '',
          taxonEspecie: '',
          eraGeologica: {
            formacion: '',
            grupo: '',
            subgrupo: '',
            edad: '',
            periodo: '',
            era: ''
          },
          fotosEjemplar: [],
          videosEjemplar: [],
          ubicacionMuseo: '',
          preparador: '',
          tipoIntervencion: '',
          autores: '',
          publicaciones: '',
          materialIngresadoPor: '',
          archivosCurriculum: [],
          observacionesAdic: '',
          home: this.state.muestraHome,
          areaHallazgo: {
            nombreArea: '',
            pais: '',
            ciudad: '',
            provincia: ''

          },
          perteneceExca: ''
        }

        fetch(urlApi + "/ejemplar", {
          method: "post",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + cookies.get('token')
          },
        })
          .then(function (response) {
            if (response.ok) {
              console.log("¡Se guardó el Ejemplar con Éxito!");
              $(".loader").fadeOut("slow");
              return response.json();
            }
          })
          .then(function (data) {
            this.setState({ tabdim: false, key: 'ddimensiones', op: 'U', ejemplarId: data.ejemplar._id });
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
      else { //op=U
        $(".loader").removeAttr("style");
        var coleccionName = "";
        var coleccionId = "";
        if (this.state.selectedColeccion !== null) {
          coleccionName = this.state.selectedColeccion.label;
          coleccionId = this.state.selectedColeccion.value
        }

        var data = {
          sigla: this.state.sigla,
          tipoColeccion: coleccionName,
          tipoColeccionId: coleccionId,
          fechaIngreso: this.state.fechaIngreso,
          fechaBaja: this.state.fechaBaja,
          motivoBaja: this.state.motivoBaja
        }

        fetch(urlApi + '/ejemplar/' + this.state.ejemplarId, {
          method: 'put',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookies.get('token')
          }
        })
          .then(function (response) {
            if (response.ok) {
              console.log("¡Se actualizaron los datos del Ejemplar con Éxito!");
              $(".loader").fadeOut("slow");
              return response.json();

            }
          })
          .then(function (data) { this.setState({ key: 'ddimensiones' }); }.bind(this))
          .catch(function (error) {
            $(".loader").fadeOut("slow");
            toast.error("Error al guardar. Intente nuevamente.");
            console.log(
              "Hubo un problema con la petición Fetch:",
              error.message
            );
          });

      }

    }
    this.setState({ validated: true });
  }

  handleSelect = (key) => {
    this.setState({ key: key });
  }

  handleForm2 = (event) => {
    this.setState({ tabgeo: false, key: 'dgeologicos' });
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
      this.setState({ tabtax: false, key: 'dtaxonomicos' });
    }
    this.setState({ validatedgeo: true });
  }

  handleAntForm3 = (event) => {

    this.setState({ tabdim: false, key: 'ddimensiones' });

  }

  handleForm4 = (event) => {
    const form = document.getElementById("form4");
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      this.setState({ tabarea: false, key: 'darea' });
    }
    this.setState({ validatedtax: true });
  }

  handleAntForm4 = (event) => {

    this.setState({ tabgeo: false, key: 'dgeologicos' });

  }

  handleForm5 = (event) => {
    const form = document.getElementById("form5");
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();


    } else {

      this.setState({ tabotros: false, key: 'dotros', tabfotos: false, tabvideos: false });

    }
    this.setState({ validatedarea: true });
  }

  handleAntForm5 = (event) => {

    this.setState({ tabtax: false, key: 'dtaxonomicos' });

  }

  handleForm6 = (event) => {

    this.setState({ tabotros: false, key: 'dotros', validatedpres: true });

  }

  handleAntForm6 = (event) => {

    this.setState({ tabarea: false, key: 'dotros' });

  }



  insertarPieza = (event) => {

    const form = document.getElementById("form2");
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {

      var excavacionSelect = "";
      var excavacionDesc = ""
      if (this.state.selectedExcavacion !== null) {
        excavacionSelect = this.state.selectedExcavacion.value
        excavacionDesc = this.state.selectedExcavacion.label
      }

      var bochonSelect = "";
      var bochonDesc = ""
      if (this.state.selectedBochon !== null) {
        bochonSelect = this.state.selectedBochon.value
        bochonDesc = this.state.selectedBochon.label
      }

      $(".loader").removeAttr("style");
      var data = {
        identificador: this.state.nombre,
        tipoPieza: '',
        medidasPieza: {
          ancho: this.state.dimensionAncho,
          largo: this.state.dimensionLargo,
          alto: this.state.dimensionAlto,
          diametro: '',
          circunferencia: ''
        },
        imagenesPieza: [],
        fechaIngreso: null,
        fechaBaja: null,
        motivoBaja: '',
        perteneceEjemplar: this.state.ejemplarId,
        origen: '',
        excavacionId: excavacionSelect,
        excavacionDesc: excavacionDesc,
        bochonId: bochonSelect,
        bochonDesc: bochonDesc


      }

      fetch(urlApi + "/pieza", {
        method: "post",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + cookies.get('token')
        },
      })
        .then(function (response) {
          if (response.ok) {
            toast.success("¡Se guardó la Pieza con Éxito!");
            $(".loader").fadeOut("slow");
            return response.json();

          }
        })
        .then(function (data) {
          fetch(urlApi + '/piezasEjemplar/' + this.state.ejemplarId, {
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
                piezas: result.piezas
              });
              this.setState({ nombre: "", dimensionAncho: "", dimensionLargo: "", dimensionAlto: "", selectedExcavacion: null, selectedBochon: null, bochones: [] });
              return result;


            })

            .then(function (data) {
              this.setState({ tablaPiezas: this.renderTablePiezas() })
            }.bind(this))
            .catch(function (error) {
              toast.error("Error al consultar Piezas. Intente nuevamente.");
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
    this.setState({ validateddim: true });


  }


  renderTablePiezas() {


    return this.state.piezas.map((pieza, index) => {

      return (
        <tr key={index}>
          <td><Button variant="secondary" type="button" id="editar" onClick={() => this.mostrarModalActualizarPieza(pieza)}>
            <FontAwesomeIcon icon={faEdit} />
          </Button>
            &nbsp;
            <Button variant="danger" type="button" id="eliminar" onClick={() => this.eliminarPieza(pieza._id)}>
              <FontAwesomeIcon icon={faTrash} />
            </Button></td>
          <td>{pieza.identificador}</td>
          <td>{pieza.medidasPieza.alto}</td>
          <td>{pieza.medidasPieza.largo}</td>
          <td>{pieza.medidasPieza.ancho}</td>
          <td>{pieza.excavacionDesc}</td>
          <td>{pieza.bochonDesc}</td>

        </tr>
      )
    })

  }

  mostrarModalActualizarPieza = (dato) => {
    
    //Buscar bochones de la excavacion y seleccionar bochon
    //selecciono la excavacion seleccionada
    var selectExc=null;
    if(dato.excavacionId!==""){
        selectExc={"value":dato.excavacionId, "label": dato.excavacionDesc}
        var selectB=null;
        if(dato.bochonId!==""){
          selectB={"value":dato.bochonId, "label": dato.bochonDesc}
        }

        fetch(urlApi + '/bochonExca/' + dato.excavacionId, {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + cookies.get('token')
          }
        })
          .then((response) => {
            return response.json()
          })
          .then(function (data) {
            this.setState({ bochones: data.bochones })
            
            this.setState({
              nombreM: dato.identificador,
              modalActualizarPieza: true,
              dimensionAltoM: dato.medidasPieza.alto,
              dimensionAnchoM: dato.medidasPieza.ancho,
              dimensionLargoM: dato.medidasPieza.largo,
              piezaMId: dato._id,
              selectedExcavacionM: selectExc,
              selectedBochonM: selectB
            });
      
          }.bind(this))
          .catch(function (error) {
            console.log('Error:', error)
          })

     
    }else{
      this.setState({
        nombreM: dato.identificador,
        modalActualizarPieza: true,
        dimensionAltoM: dato.medidasPieza.alto,
        dimensionAnchoM: dato.medidasPieza.ancho,
        dimensionLargoM: dato.medidasPieza.largo,
        piezaMId: dato._id,
      });

    }

  

  }

  cerrarModalActualizarPieza = () => {
    this.setState({ modalActualizarPieza: false });
  };

  eliminarPieza = (idPieza) => {
    var opcion = window.confirm("¿Está seguro que deseas eliminar la Pieza seleccionada?");
    if (opcion == true) {
      $(".loader").removeAttr("style");
      fetch(urlApi + '/pieza/' + idPieza, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + cookies.get('token')
        }
      })
        .then(function (response) {

          if (response.ok) {
            toast.success("¡Se eliminó la Pieza con Éxito!");
          }
          $(".loader").fadeOut("slow");
        })
        .then(function () {

          fetch(urlApi + '/piezasEjemplar/' + this.state.ejemplarId, {
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
                piezas: result.piezas
              });
              return result;

            })
            .then(function () {

              setTimeout(function () { this.setState({ tablaPiezas: this.renderTablePiezas() }) }.bind(this), 1500);
            }.bind(this))
            .catch(function (error) {
              console.log('Hubo un problema con la petición Fetch (2):' + error.message);
            })
        }.bind(this))
        .catch(function (error) {
          $(".loader").fadeOut("slow");
          toast.error("Error al Eliminar Bochon. Intente nuevamente.");
          console.log('Hubo un problema con la petición Fetch (2):' + error.message);
        });


    }
  }


  editarPieza = (e) => {

    const form = document.getElementById("form22");
    e.preventDefault();
    if (form.checkValidity() === false) {
      toast.error("¡Verique datos obligatorios!");
      e.stopPropagation();

    } else {
      $(".loader").removeAttr("style");

      var excavacionSelect = "";
      var excavacionDesc = ""
      if (this.state.selectedExcavacionM !== null) {
        excavacionSelect = this.state.selectedExcavacionM.value
        excavacionDesc = this.state.selectedExcavacionM.label
      }

      var bochonSelect = "";
      var bochonDesc = ""
      if (this.state.selectedBochonM !== null) {
        bochonSelect = this.state.selectedBochonM.value
        bochonDesc = this.state.selectedBochonM.label
      }
      var data = {
        identificador: this.state.nombreM,
        medidasPieza: {
          ancho: this.state.dimensionAnchoM,
          largo: this.state.dimensionLargoM,
          alto: this.state.dimensionAltoM,
          diametro: '',
          circunferencia: ''
        },
        excavacionId: excavacionSelect,
        excavacionDesc: excavacionDesc,
        bochonId: bochonSelect,
        bochonDesc: bochonDesc
      }




      fetch(urlApi + "/pieza/" + this.state.piezaMId, {
        method: "put",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + cookies.get('token')
        },
      })
        .then(function (response) {
          if (response.ok) {
            toast.success("¡Se guardó la Pieza con Éxito!");
            $(".loader").fadeOut("slow");
            return response.json();

          }
        })
        .then(function (data) {
          fetch(urlApi + '/piezasEjemplar/' + this.state.ejemplarId, {
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
                piezas: result.piezas
              });
              this.setState({ nombreM: "", dimensionAnchoM: "", dimensionLargoM: "", dimensionAltoM: "", modalActualizarPieza: false, selectedExcavacionM: null, selectedBochonM: null, bochones: [] });
              return result;

            })
            .then(function (data) {
              this.setState({ tablaPiezas: this.renderTablePiezas() })
            }.bind(this))
            .catch(function (error) {
              toast.error("Error al consultar Piezas. Intente nuevamente.");
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

    this.setState({ validateddimM: true });

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
          fetch(urlApi + '/ejemplarId/' + this.state.ejemplarId, {
            method: 'get',
            headers: {
              'Authorization': 'Bearer ' + cookies.get('token')
            }
          })
            .then(response => {
              return response.json();
            })
            .then(function (response) {

              var listArchivosFotos = response.ejemplarId.fotosEjemplar;
              var fotoSubir = {
                "nombre": nameFile,
                "descripcion": this.state.descripcionFoto
              }

              listArchivosFotos.push(fotoSubir);

              //  console.log('LAS FOTOS::', listArchivosFotos);

              var dataFoto = {
                "fotosEjemplar": listArchivosFotos,
              };

              //Primero Actualizo la Excavacion
              fetch(urlApi + '/ejemplar/' + this.state.ejemplarId, {
                method: 'put',
                body: JSON.stringify(dataFoto),
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + cookies.get('token')
                }
              })
                .then(function (response) {
                  if (response.ok) {
                    console.log("¡Se actualizaron los datos del Ejemplar con Éxito!");
                    this.setState({ listArchivosFotos: listArchivosFotos });

                  }
                }.bind(this))
                .then(function (response) {
                  //segundo subo archivo al server

                  const destino = rutaEjemplares + 'Fotos/' + this.state.ejemplarId;
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
                        this.setState({ archivoFoto: null, descripcionFoto: "", showSuccessFoto: true, showErrorFoto: false, urlArchivo: urlArchivo + 'Fotos/' + this.state.ejemplarId + '/' + nameFile });
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
            <a href={urlArchivo + 'Fotos/' + this.state.ejemplarId + '/' + file.nombre} disabled target="_blank">{file.nombre}</a>
          </td>
          <td>
            {file.descripcion}
          </td>

        </tr>
      )
    })



  }


  eliminarArchivoFoto = (dato) => {
    var destino = rutaEjemplares + 'Fotos/' + this.state.ejemplarId + "/" + dato;
    var opcion = window.confirm("¿Está seguro que deseas eliminar el Archivo?");
    if (opcion == true) {

      fetch(urlApi + '/ejemplarId/' + this.state.ejemplarId, {
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
          var archivos = response.ejemplarId.fotosEjemplar;
          var contador = 0;
          archivos.map((registro) => {
            if (dato == registro.nombre) {
              archivos.splice(contador, 1);
            }
            contador++;
          });

          var dataFoto = {
            "fotosEjemplar": archivos

          }

          //Actualizo la Exploracion
          fetch(urlApi + '/ejemplar/' + this.state.ejemplarId, {
            method: 'put',
            body: JSON.stringify(dataFoto),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + cookies.get('token')
            }
          })
            .then(function (response) {
              if (response.ok) {
                console.log("¡Se actualizaron los datos del Ejemplar con Éxito!");
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


  handleDescripcionFotoChange = (evt) => {
    this.setState({ descripcionFoto: evt.target.value });
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
          fetch(urlApi + '/ejemplarId/' + this.state.ejemplarId, {
            method: 'get',
            headers: {
              'Authorization': 'Bearer ' + cookies.get('token')
            }
          })
            .then(response => {
              return response.json();
            })
            .then(function (response) {

              var listArchivosVideo = response.ejemplarId.videosEjemplar;
              listArchivosVideo.push(nameFile);

              var dataVideo = {
                "videosEjemplar": listArchivosVideo,
              };

              //Primero Actualizo la Exploracion
              fetch(urlApi + '/ejemplar/' + this.state.ejemplarId, {
                method: 'put',
                body: JSON.stringify(dataVideo),
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + cookies.get('token')
                }
              })
                .then(function (response) {
                  if (response.ok) {
                    console.log("¡Se actualizaron los datos del Ejemplar con Éxito!");
                    this.setState({ listArchivosVideo: listArchivosVideo });

                  }
                }.bind(this))
                .then(function (response) {
                  //segundo subo archivo al server

                  const destino = rutaEjemplares + 'Videos/' + this.state.ejemplarId;
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
                        this.setState({ archivoVideo: null, showSuccessVideo: true, showErrorVideo: false, urlArchivo: urlArchivo + 'Videos/' + this.state.ejemplarId + '/' + nameFile });
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
                  toast.error("Error al Actualizar Ejemplar. Intente nuevamente.");
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
    var destino = rutaEjemplares + 'Videos/' + this.state.ejemplarId + "/" + dato;
    var opcion = window.confirm("¿Está seguro que deseas eliminar el Archivo?");
    if (opcion == true) {

      fetch(urlApi + '/ejemplarId/' + this.state.ejemplarId, {
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
          var archivos = response.ejemplarId.videosEjemplar;
          var contador = 0;
          archivos.map((registro) => {
            if (dato == registro) {
              archivos.splice(contador, 1);
            }
            contador++;
          });

          var dataVideo = {
            "videosEjemplar": archivos

          }

          //Actualizo la Exploracion
          fetch(urlApi + '/ejemplar/' + this.state.ejemplarId, {
            method: 'put',
            body: JSON.stringify(dataVideo),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + cookies.get('token')
            }
          })
            .then(function (response) {
              if (response.ok) {
                console.log("¡Se actualizaron los datos del Ejemplar con Éxito!");
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
              toast.error("Error al Actualizar Ejemplar. Intente nuevamente.");
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
            <a href={urlArchivo + 'Videos/' + this.state.ejemplarId + '/' + file} disabled target="_blank">{file}</a>
          </td>
        </tr>
      )
    })



  }

  subirCurriculum = () => {

    const MAXIMO_TAMANIO_BYTES = 5000000;
    const types = ['application/pdf'];
    var file = this.state.archivoCurriculum

    if (file !== null && file.length !== 0) {
      var nameFile = (file[0].name).replace(/\s+/g, "_");
      nameFile = this.reemplazar(nameFile);
      var size = file[0].size;
      var type = file[0].type;

      if (size > MAXIMO_TAMANIO_BYTES) {
        var tamanio = 5000000 / 1000000;
        toast.error("El archivo seleccionado supera los " + tamanio + 'Mb. permitidos.');
        document.getElementById('archivopdf').value = '';
      }
      else {
        if (!types.includes(type)) {
          toast.error("El archivo seleccionado tiene una extensión inválida.");
          document.getElementById('archivopdf').value = '';

        }
        else {
          $(".loader").removeAttr("style");
          document.getElementById('subirArchcv').setAttribute('disabled', 'disabled');
          fetch(urlApi + '/ejemplarId/' + this.state.ejemplarId, {
            method: 'get',
            headers: {
              'Authorization': 'Bearer ' + cookies.get('token')
            }
          })
            .then(response => {
              return response.json();
            })
            .then(function (response) {

              var listArchivosCV = response.ejemplarId.archivosCurriculum;
              listArchivosCV.push(nameFile);

              var dataCV = {
                "archivosCurriculum": listArchivosCV,
              };

              //Primero Actualizo la Exploracion
              fetch(urlApi + '/ejemplar/' + this.state.ejemplarId, {
                method: 'put',
                body: JSON.stringify(dataCV),
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + cookies.get('token')
                }
              })
                .then(function (response) {
                  if (response.ok) {
                    console.log("¡Se actualizaron los datos de la Excavación con Éxito!");
                    this.setState({ listArchivosCV: listArchivosCV });

                  }
                }.bind(this))
                .then(function (response) {
                  //segundo subo archivo al server

                  const destino = rutaEjemplares + 'Curriculum/' + this.state.ejemplarId;
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
                        this.setState({ archivoCurriculum: null, showSuccess: true, showError: false, urlArchivo: urlArchivo + 'Curriculum/' + this.state.ejemplarId + '/' + nameFile });
                        this.setState({ tableArchivosCV: this.renderTableArchivosCV() })
                        document.getElementById('archivopdf').value = '';
                      }
                      else {
                        this.setState({ showSuccess: false, showError: true });
                      }
                      document.getElementById('subirArchcv').removeAttribute('disabled');

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

  renderTableArchivosCV() {


    return this.state.listArchivosCV.map((file, index) => {

      return (
        <tr key={index}>
          <td>
            <Button variant="danger" type="button" id="eliminarArch" onClick={() => this.eliminarArchivoCV(file)}>
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </td>
          <td>
            <a href={urlArchivo + 'Curriculum/' + this.state.ejemplarId + '/' + file} disabled target="_blank">{file}</a>
          </td>

        </tr>
      )
    })



  }

  eliminarArchivoCV = (dato) => {
    var destino = rutaEjemplares + 'Curriculum/' + this.state.ejemplarId + "/" + dato;
    var opcion = window.confirm("¿Está seguro que deseas eliminar el Archivo?");
    if (opcion == true) {

      fetch(urlApi + '/ejemplarId/' + this.state.ejemplarId, {
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
          var archivos = response.ejemplarId.archivosCurriculum;
          var contador = 0;
          archivos.map((registro) => {
            if (dato == registro) {
              archivos.splice(contador, 1);
            }
            contador++;
          });

          var dataCV = {
            "archivosCurriculum": archivos

          }

          //Actualizo la Exploracion
          fetch(urlApi + '/ejemplar/' + this.state.ejemplarId, {
            method: 'put',
            body: JSON.stringify(dataCV),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + cookies.get('token')
            }
          })
            .then(function (response) {
              if (response.ok) {
                console.log("¡Se actualizaron los datos de la Excavación con Éxito!");
                this.setState({ listArchivosCV: archivos });

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
                    this.setState({ archivoCurriculum: null, tableArchivosCV: this.renderTableArchivosCV() })

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
              toast.error("Error al Actualizar Ejemplar. Intente nuevamente.");
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

  filehandleChange = (event) => {

    const file = event.target.files;
    const name = file[0].name;
    this.setState({ archivoCurriculum: file });

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
    const {validated3Dvideos} = this.state;    



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
      label: "Cód. Campo: " + opt.codigoCampo + " - Nro. Bochón:" + opt.nroBochon,
      value: opt._id,
    }));

    return (
      <>
        <Menu />
        <div className="row">
          <div className="col-md-12">
            <div id="contenido" align="left" className="container">
              <div className="loader" style={{ display: 'none' }}></div>
              <br />
              <h3 className="page-header" align="left">
                <FontAwesomeIcon icon={faIdCard} /> Nueva Ficha de Ingreso
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

                  <Form id="form1" noValidate validated={validated}>

                    <Form.Row >
                      <Form.Group className="col-sm-12" controlId="sigla">
                        <Form.Label>Sigla:</Form.Label>
                        <Form.Control type="text" placeholder="Obligatorio" autoComplete="off" required onChange={this.handleSiglaChange} value={this.state.sigla} />
                        <Form.Control.Feedback type="invalid">
                          Por favor, ingrese Sigla.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Form.Row>

                    <Form.Row >


                      <Form.Group className="col-sm-4" controlId="fechaIngreso">
                        <Form.Label>Fecha Ingreso:</Form.Label>
                        <Form.Control type="date" value={this.state.fechaIngreso}
                          onChange={this.handleFechaIngresoChange} required />
                        <Form.Control.Feedback type="invalid">
                          Por favor, ingrese Fecha.
                        </Form.Control.Feedback>
                      </Form.Group>


                      <Form.Group className="col-sm-8" controlId="coleccion">
                        <Form.Label>Tipo Colección:</Form.Label>

                        <Select
                          placeholder={"Seleccione Tipo Colección"}
                          options={optColecciones}
                          onChange={this.handleColeccionesChange}
                          value={selectedColeccion}
                          isClearable
                        />


                      </Form.Group>

                    </Form.Row>

                    <Form.Row >
                      <Form.Group className="col-sm-4" controlId="fechaBaja">
                        <Form.Label>Fecha Baja:</Form.Label>
                        <Form.Control type="date" value={this.state.fechaBaja} onChange={this.handleFbajaChange} />
                      </Form.Group>

                      <Form.Group className="col-sm-8" controlId="motivoBaja">
                        <Form.Label>Motivo Baja:</Form.Label>
                        <Form.Control as="textarea" rows={3} value={this.state.motivoBaja} onChange={this.handleMotivoChange} />
                      </Form.Group>
                    </Form.Row>


                    <Form.Row >
                      <Form.Group controlId="muestraHome">
                        <Form.Check inline
                          type="checkbox"
                          label="Muestra en Página Web?"
                          checked={this.state.muestraHome}
                          onChange={this.handleMuestraChange.bind(this)}
                        />
                      </Form.Group>
                    </Form.Row>

                    <Form.Row >
                      <Button variant="outline-secondary" type="button" id="siguiente" onClick={this.handleForm1}>
                        Siguiente <FontAwesomeIcon icon={faShare} />
                      </Button>
                      &nbsp;&nbsp;
                      <Link to="/ejemplares">
                        <Button variant="outline-danger" type="button" id="cancela">
                          <FontAwesomeIcon icon={faTimesCircle} /> Cancelar
                        </Button>
                      </Link>
                    </Form.Row>
                  </Form>

                </Tab>





                <Tab eventKey="ddimensiones" title="Piezas" disabled={this.state.tabdim}>
                  <Form id="form2" noValidate validated={validateddim} >

                    <Form.Row >
                      <Form.Group className="col-sm-6" controlId="nombrePieza">
                        <Form.Label>Nombre:</Form.Label>
                        <Form.Control type="text" placeholder="Obligatorio" autoComplete="off" required onChange={this.handleNombrePiezaChange} value={this.state.nombre} />
                        <Form.Control.Feedback type="invalid">
                          Por favor, ingrese Nombre Pieza.
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="col-sm-6" controlId="dimensionAlto">
                        <Form.Label>Alto:</Form.Label>
                        <Form.Control type="text" placeholder="Obligatorio" autoComplete="off" required onChange={this.handleDimensionAltoChange} value={this.state.dimensionAlto} />
                        <Form.Control.Feedback type="invalid">
                          Por favor, ingrese Dimensión Alto.
                        </Form.Control.Feedback>
                      </Form.Group>


                    </Form.Row>


                    <Form.Row >


                      <Form.Group className="col-sm-6" controlId="dimensionLargo">
                        <Form.Label>Largo:</Form.Label>
                        <Form.Control type="text" placeholder="Obligatorio" autoComplete="off" required value={this.state.dimensionLargo} onChange={this.handleDimensionLargoChange} />
                        <Form.Control.Feedback type="invalid">
                          Por favor, ingrese Largo.
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="col-sm-6" controlId="dimensionAncho">
                        <Form.Label>Ancho:</Form.Label>
                        <Form.Control type="text" placeholder="Obligatorio" autoComplete="off" required onChange={this.handleDimensionAnchoChange} value={this.state.dimensionAncho} />
                        <Form.Control.Feedback type="invalid">
                          Por favor, ingrese Ancho.
                        </Form.Control.Feedback>
                      </Form.Group>

                    </Form.Row>

                    <Form.Row >

                      <Form.Group className="col-sm-6" controlId="excavacion">
                        <Form.Label>Excavación:</Form.Label>

                        <Select
                          placeholder={"Seleccione Excavación"}
                          options={optExcavaciones}
                          onChange={this.handleExcavacionesChange}
                          value={selectedExcavacion}
                          isClearable
                        />


                      </Form.Group>

                      <Form.Group className="col-sm-6" controlId="bochones">
                        <Form.Label>Bochón:</Form.Label>

                        <Select
                          placeholder={"Seleccione Bochon"}
                          options={optBochones}
                          onChange={this.handleBochonChange}
                          value={selectedBochon}
                          isClearable
                        />


                      </Form.Group>
                    </Form.Row>



                    <Form.Row>
                      <Form.Group className="mx-sm-3 mb-2">
                        <Button variant="primary" type="button" id="guardarPieza" onClick={this.insertarPieza}>
                          <FontAwesomeIcon icon={faPlus} /> Agregar
                        </Button>

                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      <Table striped bordered hover responsive>
                        <thead className="thead-dark">
                          <tr>
                            <th>Acción</th>
                            <th>Nombre</th>
                            <th>Alto</th>
                            <th>Largo</th>
                            <th>Ancho</th>
                            <th>Excavación</th>
                            <th>Bochón</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.tablaPiezas}
                        </tbody>
                      </Table>
                    </Form.Row>


                    <Form.Row >
                      <Button variant="outline-secondary" type="button" id="anterior1" onClick={this.handleAntForm2}>
                        <FontAwesomeIcon icon={faReply} /> Anterior
                      </Button>
                      &nbsp;
                      <Button variant="outline-secondary" type="button" id="siguiente1" onClick={this.handleForm2}>
                        Siguiente <FontAwesomeIcon icon={faShare} />
                      </Button>
                    </Form.Row>

                  </Form>
                </Tab>
                <Tab eventKey="dgeologicos" title="Datos Geológicos" disabled={this.state.tabgeo}>
                  <Form id="form3" noValidate validated={validatedgeo} >

                    <Form.Row >

                      <Form.Group className="col-sm-4" controlId="formacion">
                        <Form.Label>Formación:</Form.Label>
                        <Form.Control type="text" autoComplete="off" onChange={this.handleFormacionChange} value={this.state.formacion} />
                      </Form.Group>

                      <Form.Group className="col-sm-4" controlId="grupo">
                        <Form.Label>Grupo:</Form.Label>
                        <Form.Control type="text" autoComplete="off" onChange={this.handleGrupoChange} value={this.state.grupo} />
                      </Form.Group>

                      <Form.Group className="col-sm-4" controlId="subgrupo">
                        <Form.Label>Subgrupo:</Form.Label>
                        <Form.Control type="text" autoComplete="off" onChange={this.handleSubgrupoChange} value={this.state.subgrupo} />
                      </Form.Group>

                    </Form.Row>

                    <Form.Row >

                      <Form.Group className="col-sm-4" controlId="edad">
                        <Form.Label>Edad:</Form.Label>
                        <Form.Control type="text" autoComplete="off" onChange={this.handleEdadChange} value={this.state.edad} />
                      </Form.Group>

                      <Form.Group className="col-sm-4" controlId="perido">
                        <Form.Label>Período:</Form.Label>
                        <Form.Control type="text" autoComplete="off" onChange={this.handlePeriodoChange} value={this.state.periodo} />
                      </Form.Group>

                      <Form.Group className="col-sm-4" controlId="era">
                        <Form.Label>Era:</Form.Label>
                        <Form.Control type="text" autoComplete="off" onChange={this.handleEraChange} value={this.state.era} />
                      </Form.Group>

                    </Form.Row>
                    <Form.Row >
                      <Button variant="outline-secondary" type="button" id="anterior2" onClick={this.handleAntForm3}>
                        <FontAwesomeIcon icon={faReply} /> Anterior
                      </Button>
                      &nbsp;
                      <Button variant="outline-secondary" type="button" id="siguiente2" onClick={this.handleForm3}>
                        Siguiente <FontAwesomeIcon icon={faShare} />
                      </Button>
                    </Form.Row>

                  </Form>
                </Tab>
                <Tab eventKey="dtaxonomicos" title="Datos Taxonómicos" disabled={this.state.tabtax}>

                  <Form id="form4" noValidate validated={validatedtax} >
                    <Form.Row >

                      <Form.Group className="col-sm-4" controlId="reino">
                        <Form.Label>Reino:</Form.Label>
                        <Form.Control type="text" autoComplete="off" onChange={this.handleReinoChange} value={this.state.reino} />
                      </Form.Group>

                      <Form.Group className="col-sm-4" controlId="filo">
                        <Form.Label>Filo:</Form.Label>
                        <Form.Control type="text" autoComplete="off" onChange={this.handleFiloChange} value={this.state.filo} />
                      </Form.Group>

                      <Form.Group className="col-sm-4" controlId="clase">
                        <Form.Label>Clase:</Form.Label>
                        <Form.Control type="text" autoComplete="off" onChange={this.handleClaseChange} value={this.state.clase} />
                      </Form.Group>

                    </Form.Row>

                    <Form.Row >

                      <Form.Group className="col-sm-4" controlId="orden">
                        <Form.Label>Orden:</Form.Label>
                        <Form.Control type="text" autoComplete="off" onChange={this.handleOrdenChange} value={this.state.orden} />
                      </Form.Group>

                      <Form.Group className="col-sm-4" controlId="familia">
                        <Form.Label>Familia:</Form.Label>
                        <Form.Control type="text" autoComplete="off" onChange={this.handleFamiliaChange} value={this.state.familia} />
                      </Form.Group>

                      <Form.Group className="col-sm-4" controlId="genero">
                        <Form.Label>Género:</Form.Label>
                        <Form.Control type="text" autoComplete="off" onChange={this.handleGeneroChange} value={this.state.genero} />
                      </Form.Group>

                    </Form.Row>

                    <Form.Row>
                      <Form.Group className="col-sm-12" controlId="especie">
                        <Form.Label>Especie:</Form.Label>
                        <Form.Control type="text" autoComplete="off" onChange={this.handleEspecieChange} value={this.state.especie} />
                      </Form.Group>
                    </Form.Row>

                    <Form.Row >
                      <Button variant="outline-secondary" type="button" id="anterior3" onClick={this.handleAntForm4}>
                        <FontAwesomeIcon icon={faReply} /> Anterior
                      </Button>
                      &nbsp;
                      <Button variant="outline-secondary" type="button" id="siguiente3" onClick={this.handleForm4}>
                        Siguiente <FontAwesomeIcon icon={faShare} />
                      </Button>
                    </Form.Row>
                  </Form>

                </Tab>
                <Tab eventKey="darea" title="Área de Hallazgo" disabled={this.state.tabarea}>
                  <Form id="form5" noValidate validated={validatedarea} >

                    <Form.Row >

                      <Form.Group className="col-sm-12" controlId="areaHallazgo">
                        <Form.Label>Nombre Área:</Form.Label>
                        <Form.Control as="textarea" onChange={this.handleAreaHChange} value={this.state.areaHallazgo} />
                      </Form.Group>

                    </Form.Row>


                    <Form.Row >
                      <Button variant="outline-secondary" type="button" id="anterior4" onClick={this.handleAntForm5}>
                        <FontAwesomeIcon icon={faReply} /> Anterior
                      </Button>
                      &nbsp;
                      <Button variant="outline-secondary" type="button" id="siguiente4" onClick={this.handleForm5}>
                        Siguiente <FontAwesomeIcon icon={faShare} />
                      </Button>
                    </Form.Row>

                  </Form>
                </Tab>



                <Tab eventKey="dotros" title="Otros Datos" disabled={this.state.tabotros}>
                  <Form id="form7" noValidate validated={validatedotros} >
                    <Form.Row>
                      <Form.Group className="col-sm-12" controlId="ubicacion">
                        <Form.Label>Ubicación:</Form.Label>
                        <Form.Control type="text" autoComplete="off" onChange={this.handleUbicacionChange} value={this.state.ubicacion} />
                      </Form.Group>
                    </Form.Row>

                    <Form.Row >


                      <Form.Group className="col-sm-6" controlId="ingresadoPor">
                        <Form.Label>Material Ingresado Por:</Form.Label>

                        <Select
                          placeholder={"Seleccione Opción"}
                          options={optMaterial}
                          onChange={this.handleIngresadoPorChange}
                          value={selectedMaterial}
                          isClearable
                        />



                      </Form.Group>


                      <Form.Group className="col-sm-6" controlId="preparador">
                        <Form.Label>Preparador:</Form.Label>
                        <Select
                          placeholder={"Seleccione Opción"}
                          options={optPreparador}
                          onChange={this.handlePreparadorChange}
                          value={selectedPreparador}
                          isClearable
                        />
                      </Form.Group>
                    </Form.Row>


                    <Form.Row >
                      <Form.Group className="col-sm-12" controlId="tipoIntervencion">
                        <Form.Label>Tipo de Intervención:</Form.Label>
                        <Form.Control as="textarea" rows={3} value={this.state.tipoIntervencion} onChange={this.handleTipoIntervencionChange} />
                      </Form.Group>
                    </Form.Row>

                    <Form.Row >
                      <Form.Group className="col-sm-12" controlId="autores">
                        <Form.Label>Autores:</Form.Label>
                        <Form.Control as="textarea" rows={3} value={this.state.autores} onChange={this.handleAutoresChange} />
                      </Form.Group>
                    </Form.Row>

                    <Form.Row >
                      <Form.Group className="col-sm-12" controlId="publicaciones">
                        <Form.Label>Publicaciones:</Form.Label>
                        <Form.Control as="textarea" rows={3} value={this.state.publicaciones} onChange={this.handlePublicacionesChange} />
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>

                      <Form.Group className="col-sm-8" >
                        <Form.Label>Papers:</Form.Label>
                        <input type="file" id="archivopdf" className="form-control" accept="application/pdf" onChange={this.filehandleChange.bind(this)} />
                      </Form.Group>

                    </Form.Row>

                    <Form.Row>
                      <Form.Group className="col-sm-2" >
                        <Button variant="primary" type="button" id="subirArchcv" onClick={() => this.subirCurriculum()} >
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
                      <Form.Group className="col-sm-6" controlId="archivopdf">

                        <Table striped bordered hover responsive>
                          <thead className="thead-dark">
                            <tr>
                              <th>Acción</th>
                              <th>Nombre</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.tableArchivosCV}
                          </tbody>
                        </Table>


                      </Form.Group>
                    </Form.Row>



                    <Form.Row >
                      <Form.Group className="col-sm-12" controlId="observacionesAdic">
                        <Form.Label>Observaciones Adicionales:</Form.Label>
                        <Form.Control as="textarea" rows={3} value={this.state.observacionesAdic} onChange={this.handleObservacionesAdicChange} />
                      </Form.Group>
                    </Form.Row>

                    <hr />
                    <Form.Row>
                      <Form.Group className="mx-sm-3 mb-2">
                        <Button variant="primary" type="button" id="guardar" onClick={this.actualizarEjemplar}>
                          <FontAwesomeIcon icon={faSave} /> Guardar
                        </Button>
                        &nbsp;&nbsp;
                        <Link to='/ejemplares'>
                          <Button variant="danger" type="button" id="volver">
                            <FontAwesomeIcon icon={faTimesCircle} /> Cancelar
                          </Button>
                        </Link>

                      </Form.Group>
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

                <Tab eventKey="videos3D" title="Videos 3D" disabled={this.state.tabvideos3D}>
                    <Form id="form8" noValidate validated={validated3Dvideos}>
                    <legend>Videos 3D</legend>
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
                show={this.state.modalActualizarPieza}
                onHide={() => this.cerrarModalActualizarPieza()}
                backdrop="static"
                keyboard={false}
                size="lg"
              >
                <Modal.Header closeButton>
                  <Modal.Title>Editar Pieza</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form id="form22" noValidate validated={validateddimM} >

                    <Form.Row >
                      <Form.Group className="col-sm-6" controlId="nombrePiezaM">
                        <Form.Label>Nombre:</Form.Label>
                        <Form.Control type="text" placeholder="Obligatorio" autoComplete="off" required onChange={this.handleNombrePiezaMChange} value={this.state.nombreM} />
                        <Form.Control.Feedback type="invalid">
                          Por favor, ingrese Nombre Pieza.
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="col-sm-6" controlId="dimensionAlto">
                        <Form.Label>Alto:</Form.Label>
                        <Form.Control type="text" placeholder="Obligatorio" autoComplete="off" required onChange={this.handleDimensionAltoMChange} value={this.state.dimensionAltoM} />
                        <Form.Control.Feedback type="invalid">
                          Por favor, ingrese Dimensión Alto.
                        </Form.Control.Feedback>
                      </Form.Group>


                    </Form.Row>


                    <Form.Row >


                      <Form.Group className="col-sm-6" controlId="dimensionLargoM">
                        <Form.Label>Largo:</Form.Label>
                        <Form.Control type="text" placeholder="Obligatorio" autoComplete="off" required value={this.state.dimensionLargoM} onChange={this.handleDimensionLargoMChange} />
                        <Form.Control.Feedback type="invalid">
                          Por favor, ingrese Largo.
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="col-sm-6" controlId="dimensionAnchoM">
                        <Form.Label>Ancho:</Form.Label>
                        <Form.Control type="text" placeholder="Obligatorio" autoComplete="off" required onChange={this.handleDimensionAnchoMChange} value={this.state.dimensionAnchoM} />
                        <Form.Control.Feedback type="invalid">
                          Por favor, ingrese Ancho.
                        </Form.Control.Feedback>
                      </Form.Group>

                    </Form.Row>

                    <Form.Row >

                      <Form.Group className="col-sm-6" controlId="excavacionM">
                        <Form.Label>Excavación:</Form.Label>

                        <Select
                          placeholder={"Seleccione Excavación"}
                          options={optExcavaciones}
                          onChange={this.handleExcavacionesMChange}
                          value={selectedExcavacionM}
                          isClearable
                        />


                      </Form.Group>

                      <Form.Group className="col-sm-6" controlId="bochonesM">
                        <Form.Label>Bochón:</Form.Label>

                        <Select
                          placeholder={"Seleccione Bochon"}
                          options={optBochones}
                          onChange={this.handleBochonMChange}
                          value={selectedBochonM}
                          isClearable
                        />


                      </Form.Group>
                    </Form.Row>



                  </Form>

                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => this.cerrarModalActualizarPieza()}>
                    Cerrar
                  </Button>
                  <Button variant="primary" id="guardarAct" onClick={this.editarPieza}> <FontAwesomeIcon icon={faSave} /> Guardar</Button>
                </Modal.Footer>
              </Modal>





            </div>
          </div>
        </div>
      </>

    )

  }

}
export default AddEjemplar;

