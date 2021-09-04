import React from "react";
import { Form, Button, Tabs, Tab, Table, Modal, Alert } from 'react-bootstrap';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faReply, faPaw, faPlus, faFileArchive, faTrash, faEdit, faShare, faTimesCircle, faUpload } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import Select from 'react-select';
import Menu from "./../Menu"
import Cookies from 'universal-cookie';
import Moment from 'moment';
import $ from 'jquery';

const cookies = new Cookies();

//Variables Globales
const urlApi = process.env.REACT_APP_API_HOST;
const urlArchivo = process.env.REACT_APP_URL_EJEMPLARES;
const rutaEjemplares = process.env.REACT_APP_RUTA_EJEMPLARES;


class AddEjemplar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      sigla: "",
      nroColeccion: "",
      fechaIngeso: "",
      dimensionAlto: "",
      dimensionLargo: "",
      dimensionAncho: "",
      peso: "",
      alimentacion: "",
      ubicacion: "",
      descripcion1: "",
      descripcion1A: "",
      descripcion2: "",
      descripcion3: "",
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
      paises: [],
      selectedPais: null,
      provincias: [],
      selectedProvincia: null,
      ciudades: [],
      selectedCiudad: null,
      muestraHome: false,
      excavaciones: [],
      selectedExcavacion: null,
      //     selectedTipo: { value: 'Encontrado', label: 'Encontrado' },
      fechaBaja: "",
      motivoBaja: "",
      ilustracionCompleta: "",
      descripcionIC: "",
      periodo2: "",
      perteneceExca: "",
      fotos: [],
      videos: [],
      colecciones: [],
      selectedColeccion: null,
      selectedIngresadoPor: null,
      validated: false,
      paisesArray: [],
      colectores: [],
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
      piezaMId:''

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
          colectores: data.personas,
        });
      }).catch(function (error) {
        toast.error("Error al guardar. Intente nuevamente.");
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

  handleColectorChange = (selectedColector) => {
    this.setState({ selectedColector });
  };


  handleTipoChange = (selectedTipo) => {
    this.setState({ selectedTipo });
    console.log(`Option selected:`, selectedTipo);

  }



  handleColeccionesChange = (selectedColeccion) => {
    this.setState({ selectedColeccion });
  }

  handleIngresadoPorChange = (event) => {
    this.setState({ selectedIngresadoPor: event.target.value });
    // console.log(`Option selected:`, event.target.value );

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

  handleAlimentacionChange = evt => {
    this.setState({ alimentacion: evt.target.value });
  };

  handleUbicacionChange = evt => {
    this.setState({ ubicacion: evt.target.value });
  };

  handleDescripcion1Change = evt => {
    this.setState({ descripcion1: evt.target.value });
  };

  handleDescripcion1AChange = evt => {
    this.setState({ descripcion1A: evt.target.value });
  };

  handleDescripcion2Change = evt => {
    this.setState({ descripcion2: evt.target.value });
  };

  handleDescripcion3Change = evt => {
    this.setState({ descripcion3: evt.target.value });
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




  handleChange = (e) => {
    console.log(e.target.name)
    this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
  };




  handleExcavacionesChange = (selectedExcavacion) => {
    //  console.log(selectedExcavacion);
    this.setState({ selectedExcavacion });
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

  handleSubmit = (event) => {


    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();

      toast.error('Ingrese datos obligatorios.');
      if (this.state.selectedExcavacion === "" || this.state.selectedExcavacion === null) {
        toast.error('Seleccione una Excavación.');

      }

      if (this.state.selectedColeccion === "" || this.state.selectedColeccion === null) {
        toast.error('Seleccione una Colección.');

      }


    }
    else {
      if (this.state.selectedExcavacion === "" || this.state.selectedExcavacion === null) {
        toast.error('Seleccione una Excavación!');

      }
      else {
        if (this.state.selectedColeccion === "" || this.state.selectedColeccion === null) {
          toast.error('Seleccione una Colección.');

        }
        else {

          var idCountry = ''
          if (this.state.selectedPais !== null) { idCountry = this.state.selectedPais.value }

          var idProv = ''
          if (this.state.selectedProvincia !== null) { idProv = this.state.selectedProvincia.value }

          var idCity = ''
          if (this.state.selectedCiudad !== null) { idCity = this.state.selectedCiudad.value }


          var eraGeo = {
            "formacion": this.state.formacion,
            "grupo": this.state.grupo,
            "subgrupo": this.state.subgrupo,
            "edad": this.state.edad,
            "periodo": this.state.periodo,
            "era": this.state.era
          };

          var areaH = {
            "nombreArea": "",
            "pais": idCountry,
            "ciudad": idCity,
            "provincia": idProv
          };



          var data = {
            "tipoEjemplar": this.state.selectedTipo.value,
            "taxonReino": this.state.reino,
            "taxonFilo": this.state.filo,
            "taxonClase": this.state.clase,
            "taxonOrden": this.state.orden,
            "taxonFamilia": this.state.familia,
            "taxonGenero": this.state.genero,
            "taxonEspecie": this.state.especie,
            "eraGeologica": eraGeo,
            "ilustracionCompleta": this.state.ilustracionCompleta,
            "descripcionIC": this.state.descripcionIC,
            "areaHallazgo": areaH,
            "nroColeccion": this.state.selectedColeccion.value,
            "dimensionLargo": this.state.dimensionAncho,
            "dimensionAlto": this.state.dimensionAlto,
            "peso": this.state.peso,
            "alimentacion": this.state.alimentacion,
            "fechaIngresoColeccion": this.state.fechaColeccion,
            "ubicacionMuseo": this.state.ubicacion,
            "fotosEjemplar": this.state.fotos,
            "videosEjemplar": this.state.videos,
            "fechaBaja": this.state.fbaja,
            "motivoBaja": this.state.motivo,
            "nombre": this.state.nombre,
            "periodo": this.state.periodo2,
            "home": this.state.muestraHome,
            "descripcion1": this.state.descripcion1,
            "descripcion1A": this.state.descripcion1A,
            "descripcion2": this.state.descripcion2,
            "descripcion3": this.state.descripcion3,
            "perteneceExca": this.state.selectedExcavacion.value
          };

          fetch('http://museo.fi.uncoma.edu.ar:3006/api/ejemplar', {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
              'Content-Type': 'application/json'
            }
          })
            .then(function (response) {
              if (response.ok) {
                toast.success("¡Se guardó el Ejemplar con Éxito!");
                setTimeout(() => {
                  window.location.replace('/ejemplares');
                }, 1500);
              }
            })
            .catch(function (error) {
              toast.error("Error al guardar. Intente nuevamente.");
              console.log('Hubo un problema con la petición Fetch:', error.message);
            });
        }

      }

    }

    this.setState({ validated: true });
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
          archivosPublicaciones: [],
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
      if (this.state.selectedExcavacion === "" || this.state.selectedExcavacion === null) {
        toast.error('Seleccione una Excavación.');

      } else {
        this.setState({ tabotros: false, key: 'dotros', tabpres: false });
      }

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






  filehandleChange = (event) => {

    const files = event.target.files;
    var arrayFiles = this.state.archivos;


    Array.from(files).forEach(file => {
      var key = Math.floor(Math.random() * 1000);
      file.id = key;
      arrayFiles.push(file)
    })
    this.setState({ archivos: arrayFiles });

    //aca deberiamos mover el archivo a la carpeta 



  };




  renderTableDataFiles() {

    // console.log(this.state.archivos);

    return this.state.archivos.map((file, index) => {

      return (
        <tr key={index}>
          <td>
            <Button variant="danger" type="button" id="eliminar" onClick={() => this.eliminarArchivo(file)}>
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </td>
          <td>{file.name}</td>

        </tr>
      )
    })



  }


  eliminarArchivo = (dato) => {
    //aca tambien hay que eliminar en la BD y traer los prestamos
    var opcion = window.confirm("¿Está seguro que deseas eliminar el Archivo?");
    if (opcion == true) {
      var contador = 0;
      var arreglo = this.state.archivos;
      arreglo.map((registro) => {
        if (dato.id == registro.id) {
          arreglo.splice(contador, 1);
        }
        contador++;
      });
      this.setState({ archivos: arreglo });
    }
  };


  fileodatoshandleChange = (event) => {

    const files = event.target.files;
    var arrayFiles = this.state.archivosOD;


    Array.from(files).forEach(file => {
      var key = Math.floor(Math.random() * 1000);
      file.id = key;
      arrayFiles.push(file)
    })
    this.setState({ archivosOD: arrayFiles });

    console.log('SALIDA::', arrayFiles)

    //aca deberiamos mover el archivo a la carpeta 



  };




  renderTableDataFilesODatos() {

    return this.state.archivosOD.map((file, index) => {

      return (
        <tr key={index}>
          <td>
            <Button variant="danger" type="button" id="eliminarOD" onClick={() => this.eliminarArchivoODatos(file)}>
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </td>
          <td>{file.name}</td>

        </tr>
      )
    })


  }


  eliminarArchivoODatos = (dato) => {
    //aca tambien hay que eliminar en la BD y traer los prestamos
    var opcion = window.confirm("¿Está seguro que deseas eliminar el Archivo?");
    if (opcion == true) {
      var contador = 0;
      var arreglo = this.state.archivosOD;
      arreglo.map((registro) => {
        if (dato.id == registro.id) {
          arreglo.splice(contador, 1);
        }
        contador++;
      });
      this.setState({ archivosOD: arreglo });
    }
  };

  insertarPieza = (event) => {

    const form = document.getElementById("form2");
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {

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
        origen: ''

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
              this.setState({ nombre: "", dimensionAncho: "", dimensionLargo: "", dimensionAlto: "" });
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

  eliminarPieza() {
    alert('Elimina');
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

        </tr>
      )
    })

  }

  mostrarModalActualizarPieza = (dato) => {
    console.log(dato);

    this.setState({
      nombreM: dato.identificador,
      modalActualizarPieza: true,
      dimensionAltoM: dato.medidasPieza.alto,
      dimensionAnchoM: dato.medidasPieza.ancho,
      dimensionLargoM: dato.medidasPieza.largo,
      piezaMId: dato._id

    });

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
      var data = {
        identificador: this.state.nombreM,
        medidasPieza: {
          ancho: this.state.dimensionAnchoM,
          largo: this.state.dimensionLargoM,
          alto: this.state.dimensionAltoM,
          diametro: '',
          circunferencia: ''
        }
      }

      fetch(urlApi + "/pieza/"+this.state.piezaMId, {
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
              this.setState({ nombreM: "", dimensionAnchoM: "", dimensionLargoM: "", dimensionAltoM: "", modalActualizarPieza: false });
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








  render() {

    const { selectedExcavacion } = this.state;
    const { validated } = this.state;
    const { validateddim } = this.state;
    const { validateddimM } = this.state;
    const { validatedgeo } = this.state;
    const { validatedtax } = this.state;
    const { validatedarea } = this.state;

    const { validatedotros } = this.state;
    const { validatedfotos } = this.state;
    const { validatedvideos } = this.state;

    let optExcavaciones = this.state.excavaciones.map((opt) => ({ label: opt.nombre, value: opt._id }));


    const { selectedColector } = this.state;
    let optColectores = this.state.colectores.map((opt) => ({
      label: opt.nombres + " " + opt.apellidos,
      value: opt._id,
    }));

    const { selectedColeccion } = this.state;
    let optColecciones = this.state.colecciones.map((opt) => ({
      label: opt.nombre,
      value: opt._id,
    }));

    return (
      <>
        <Menu />
        <div className="row">
          <div className="col-md-12">
            <div id="contenido" align="left" className="container">
              <br />
              <h3 className="page-header" align="left">
                <FontAwesomeIcon icon={faPaw} /> Ficha de Ingreso
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
                      <Form.Group className="col-sm-12" controlId="excavacion">
                        <Form.Label>Excavación:</Form.Label>
                        <Select
                          placeholder={'Seleccione Excavación'}
                          options={optExcavaciones}
                          onChange={this.handleExcavacionesChange}
                          value={selectedExcavacion}
                          isClearable
                        />
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

                        <Form.Control
                          as="select"
                          className="form-control"
                          onChange={this.handleIngresadoPorChange}
                          required
                        >
                          <option value="">Seleccione Opción</option>
                          <option value="1">Donación</option>
                          <option value="2">Excavación realizada MUC</option>
                          <option value="3">Otros</option>



                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          Por favor, seleccione opción.
                        </Form.Control.Feedback>

                      </Form.Group>


                      <Form.Group className="col-sm-6" controlId="colector">
                        <Form.Label>Colector:</Form.Label>
                        <Select
                          placeholder={"Seleccione Opción"}
                          options={optColectores}
                          onChange={this.handleColectorChange}
                          value={selectedColector}
                          isClearable
                        />
                      </Form.Group>
                    </Form.Row>


                    <Form.Row >
                      <Form.Group className="col-sm-12" controlId="descripcion1">
                        <Form.Label>Tipo de Intervención:</Form.Label>
                        <Form.Control as="textarea" rows={3} value={this.state.descripcion1} onChange={this.handleDescripcion1Change} />
                      </Form.Group>
                    </Form.Row>

                    <Form.Row >
                      <Form.Group className="col-sm-12" controlId="descripcion1A">
                        <Form.Label>Autores:</Form.Label>
                        <Form.Control as="textarea" rows={3} value={this.state.descripcion1A} onChange={this.handleDescripcion1AChange} />
                      </Form.Group>
                    </Form.Row>

                    <Form.Row >
                      <Form.Group className="col-sm-12" controlId="descripcion2">
                        <Form.Label>Publicaciones:</Form.Label>
                        <Form.Control as="textarea" rows={3} value={this.state.descripcion2} onChange={this.handleDescripcion2Change} />
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      {/*    <Form.Group className="col-sm-6" controlId="archivopdf">
               
                      <Form.File id="archivopdf"  label="Archivos:" multiple onChange={this.fileodatoshandleChange.bind(this)} />*/}
                      <Form.Group className="col-sm-8" >
                        <Form.Label>Curriculum Vitae:</Form.Label>
                        <input type="file" id="archivopdf" className="form-control" accept="application/pdf" onChange={this.fileodatoshandleChange.bind(this)} />
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
                            {this.renderTableDataFilesODatos()}
                          </tbody>
                        </Table>


                      </Form.Group>
                    </Form.Row>



                    <Form.Row >
                      <Form.Group className="col-sm-12" controlId="descripcion3">
                        <Form.Label>Observaciones Adicionales:</Form.Label>
                        <Form.Control as="textarea" rows={3} value={this.state.descripcion3} onChange={this.handleDescripcion3Change} />
                      </Form.Group>
                    </Form.Row>

                    <hr />
                    <Form.Row>
                      <Form.Group className="mx-sm-3 mb-2">
                        <Button variant="primary" type="submit" id="guardar">
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

