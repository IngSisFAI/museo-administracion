import React from "react";
import { Form, Button, Tabs, Tab, Table, Alert } from 'react-bootstrap';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faReply, faMapMarked, faTimesCircle, faShare, faUpload, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import ModificarExploracion from '../../areaGeospatial/ModificarExploracion';
import axios from 'axios';
import Moment from 'moment';
import Menu from "./../Menu"
import Cookies from 'universal-cookie';
import Select from 'react-select';

const cookies = new Cookies();

//Variables Globales
const urlApi = process.env.REACT_APP_API_HOST;
const urlArchivo = process.env.REACT_APP_URL_EXPLORACIONES;
const rutaExploraciones = process.env.REACT_APP_RUTA_EXPLORACIONES;


class EditExploracion extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      nombreArea: "",
      fechaInicio: "",
      fechaTermino: "",
      directorId: '',
      selectedDirector: null,
      directores: [],
      selectedIntegrante: null,
      integrantes: [],
      key: 'dbasicos',
      validateddbas: false,
      tabbas: false,
      validateddsolic: false,
      tabsolic: false,
      validateddpicking: false,
      tabpicking: false,
      validatedimg: false,
      tabimg: false,
      empresa: '',
      proyectoInvestigacion: '',
      otrasEspecificaciones: '',
      archivoAut: null,
      detalle: '',
      archivosImg: [],
      integrantesGrupo: [],
      exploracionId: '',
      urlArchivo: '',
      showSuccess: false,
      showError: false,
      tableArchivosAut: null,
      listArchivosAut: [],
      showSuccessf: false,
      showErrorf: false,
      tableImagenes: null,
      listImages: []
    };
    this.reemplazar = this.reemplazar.bind(this);
  }


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
      .then((people) => {
        this.setState({
          directores: people.personas, integrantes: people.personas
        });

      }).catch(function (error) {
        toast.error("Error al consultar. Intente nuevamente.");
        console.log(
          "Hubo un problema con la petición Fetch:",
          error.message
        );
      });

  }


  componentDidMount() {
    if (!cookies.get('user') && !cookies.get('password')) {
      window.location.href = '/';
    }
    else {
      axios.get('http://museo.fi.uncoma.edu.ar:3006/api/exploracionId/' + this.props.match.params.id, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + cookies.get('token')
        }
      })
        .then(response => {

          var fechaT = "";
          if (response.data.exploracionId.fechaTermino !== "" && response.data.exploracionId.fechaTermino !== null) {
            fechaT = (Moment(response.data.exploracionId.fechaTermino).add(1, 'days')).format('YYYY-MM-DD')
          }

          var directorSelect = [];
          if (response.data.exploracionId.directorId !== null && response.data.exploracionId.directorId !== '') {
            directorSelect = this.state.directores.filter(option => option._id === response.data.exploracionId.directorId)
            directorSelect = directorSelect.map((opt) => ({ label: opt.nombres + ' ' + opt.apellidos, value: opt._id }));
          }

          var integrantesSelect = [];
          if (response.data.exploracionId.integrantesGrupo !== null && response.data.exploracionId.integrantesGrupo !== []) {
            integrantesSelect = this.state.integrantes.filter(({ _id }) => response.data.exploracionId.integrantesGrupo.includes(_id))
            integrantesSelect = integrantesSelect.map((opt) => ({ label: opt.nombres + ' ' + opt.apellidos, value: opt._id }));
          }


          this.setState({
            nombreArea: response.data.exploracionId.nombreArea,
            fechaInicio: (Moment(response.data.exploracionId.fechaInicio).add(1, 'days')).format('YYYY-MM-DD'),
            fechaTermino: fechaT,
            directorId: response.data.exploracionId.directorId,
            integrantesGrupo: response.data.exploracionId.integrantesGrupo,
            empresa: response.data.exploracionId.empresa,
            proyectoInvestigacion: response.data.exploracionId.proyectoInvestigacion,
            otrasEspecificaciones: response.data.exploracionId.otrasEspecificaciones,
            detallePicking: response.data.exploracionId.detallePicking,
            imagenesExploracion: response.data.exploracionId.imagenesExploracion,
            archAutorizaciones: response.data.exploracionId.archAutorizaciones,
            selectedDirector: directorSelect,
            selectedIntegrante: integrantesSelect,
            tableArchivosAut: this.cargarArchivosAut(response.data.exploracionId.archAutorizaciones),
            tableImagenes: this.cargarImagenes(response.data.exploracionId.imagenesExploracion)
          });

        })
        .catch(function (error) {
          console.log(error);
        })
    }
  }






  handleNombreChange = (evt) => {
    this.setState({ nombreArea: evt.target.value });
  };

  handleFechaInicioChange = (evt) => {
    this.setState({ fechaInicio: evt.target.value });
  };

  handlefechaTerminoChange = (evt) => {
    this.setState({ fechaTermino: evt.target.value });
  };



  handleDirectorChange = (selectedDirector) => {
    this.setState({ selectedDirector });
  };

  handleIntegrantesChange = (selectedIntegrante) => {
    let integrantes = Array.from(selectedIntegrante, option => option.value);
    this.setState({ selectedIntegrante });
    this.setState({ integrantesId: integrantes });

  }

  handleSelect = (key) => {
    this.setState({ key: key });

  }

  handleForm1 = (event) => {
    const form = document.getElementById("form1");
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {


      if (this.state.selectedDirector === null) {
        toast.error('Ingrese un Director.');
      }
      else {

        var data = {
          "nombreArea": this.state.nombreArea,
          "fechaInicio": this.state.fechaInicio,
          "fechaTermino": this.state.fechaTermino,
          "directorId": this.state.selectedDirector.value,
          "integrantesGrupo": this.state.integrantesId
        }

        fetch(urlApi + "/exploracion/" + this.props.match.params.id, {
          method: "put",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + cookies.get('token')
          },
        })
          .then(function (response) {
            if (response.ok) {
              console.log("¡Se guardó la Exploracion con Éxito!");
              this.setState({  key: 'dsolic' });
            
            }
          }.bind(this))
          .catch(function (error) {
            toast.error("Error al guardar. Intente nuevamente.");
            console.log(
              "Hubo un problema con la petición Fetch:" + error.message
            );
          });


      }

    }
    this.setState({ validateddbas: true });
  }

  handleProyectoChange = (evt) => {
    this.setState({ proyectoInvestigacion: evt.target.value });
  };

  handleEmpresaChange = (evt) => {
    this.setState({ empresa: evt.target.value });
  };

  handleOtrasChange = (evt) => {
    this.setState({ otrasEspecificaciones: evt.target.value });
  };

  fileshandleChange = (event) => {
    const file = event.target.files;
    const name = file[0].name;
    this.setState({ archivoAut: file });
  };

  handleDetalleChange = (evt) => {
    this.setState({ detallePicking: evt.target.value });
  };

  imageneshandleChange = (event) => {
    const file = event.target.files;
    this.setState({ imagen: file });

  };

  handleAntForm2 = (event) => {

    this.setState({ tabbas: false, key: 'dbasicos' });

  }

  handleAntForm4 = (event) => {

    this.setState({ tabpicking: false, key: 'dpicking' });

  }

  handleForm2 = (event) => {
    const form = document.getElementById("form2");
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      this.setState({ tabpicking: false, key: 'dpicking', tabimg: false });

    }
    this.setState({ validateddsolic: true });
  }

  handleForm3 = (event) => {

    var data = {
      "nombreArea": this.state.nombreArea,
      "fechaInicio": this.state.fechaInicio,
      "fechaTermino": this.state.fechaTermino,
      "directorId": this.state.selectedDirector.value,
      "integrantesGrupo": this.state.integrantesId,
      "empresa": this.state.empresa,
      "proyectoInvestigacion": this.state.proyectoInvestigacion,
      "otrasEspecificaciones": this.state.otrasEspecificaciones,
      "detallePicking":this.state.detallePicking
    }

    fetch(urlApi+"/exploracion/"+this.props.match.params.id, {
      method: "put",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + cookies.get('token')
      },
    })
      .then(function (response) {
        if (response.ok) {
          toast.success("¡Se guardó la Exploracion con Éxito!");
          return response.json();
        }
      })
      .catch(function (error) {
        toast.error("Error al guardar. Intente nuevamente.");
        console.log(
          "Hubo un problema con la petición Fetch:" + error.message
        );
      });


  }

  cargarArchivosAut(archivos) {

    return archivos.map((file, index) => {

      return (
        <tr key={index}>
          <td>
            <Button variant="danger" type="button" id="eliminarArch" onClick={() => this.eliminarArchivoAut(file)}>
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </td>
          <td>
            <a href={urlArchivo+this.props.match.params.id+'/'+file} disabled target="_blank">{file}</a>
          </td>

        </tr>
      )
    })


  }
  cargarImagenes(imagenes){
    return imagenes.map((file, index) => {

      return (
        <tr key={index}>
          <td>
            <Button variant="danger" type="button" id="eliminarI" onClick={() => this.eliminarImagen(file)}>
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </td>
          <td>
            <a href={urlArchivo+this.props.match.params.id+'/'+file} disabled target="_blank">{file}</a>
          </td>

        </tr>
      )
    })
  }

  subirAutorizacion = () => {

    const MAXIMO_TAMANIO_BYTES = 5000000;
    const types = ['application/pdf'];
    var file = this.state.archivoAut

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
          document.getElementById('subirArch').setAttribute('disabled', 'disabled');
          fetch(urlApi+'/exploracionId/' + this.props.match.params.id, {
            method: 'get',
            headers: {
              'Authorization': 'Bearer ' + cookies.get('token')
            }
          })
            .then(response => {
              return response.json();
            })
            .then(function (response) {

              var listArchivosAut = response.exploracionId.archAutorizaciones;
              listArchivosAut.push(nameFile);

              var dataAut = {
                "archAutorizaciones": listArchivosAut,
              };

              //Primero Actualizo la Exploracion
              fetch(urlApi+'/exploracion/' + this.props.match.params.id, {
                method: 'put',
                body: JSON.stringify(dataAut),
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + cookies.get('token')
                }
              })
                .then(function (response) {
                  if (response.ok) {
                    console.log("¡Se actualizaron los datos de la Exploracion con Éxito!");
                    this.setState({ listArchivosAut: listArchivosAut });

                  }
                }.bind(this))
                .then(function (response) {
                  //segundo subo archivo al server

                  const destino = rutaExploraciones + this.props.match.params.id;
                  const data = new FormData();
                  data.append("file", file[0]);


                  axios.post(urlApi+"/uploadArchivo", data, {
                    headers: {
                      "Content-Type": undefined,
                      path: destino,
                      "newfilename": '',
                      'Authorization': 'Bearer ' + cookies.get('token')
                    }
                  })
                    .then(response => {
                      console.log(response);
                      if (response.statusText === "OK") {
                        this.setState({ archivoAut: null, showSuccess: true, showError: false, urlArchivo: urlArchivo + this.state.exploracionId + '/' + nameFile });
                        this.setState({ tableArchivosAut: this.renderTableArchivosAut() })
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
                      this.setState({ showSuccess: false, showError: true });
                      console.log(error);
                    });




                }.bind(this))
                .catch(function (error) {
                  toast.error("Error al Actualizar Exploracion. Intente nuevamente.");
                  console.log('Hubo un problema con la petición Fetch (1):' + error.message);
                });


            }.bind(this))
            .catch(function (error) {
              toast.error("Error al consultar. Intente nuevamente.");
              console.log('Hubo un problema con la petición Fetch (2):' + error.message);
            });

        }

      }

    } else {
      toast.error("Seleccione un Archivo.");
    }
  }

  renderTableArchivosAut() {


    return this.state.listArchivosAut.map((file, index) => {

      return (
        <tr key={index}>
          <td>
            <Button variant="danger" type="button" id="eliminarArch" onClick={() => this.eliminarArchivoAut(file)}>
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </td>
          <td>
            <a href={urlArchivo+this.props.match.params.id+'/'+file} disabled target="_blank">{file}</a>
          </td>

        </tr>
      )
    })

  }

  renderTableImagenes() {

    return this.state.listImages.map((file, index) => {

      return (
        <tr key={index}>
          <td>
            <Button variant="danger" type="button" id="eliminarI" onClick={() => this.eliminarImagen(file)}>
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </td>
          <td>
            <a href={urlArchivo+this.props.match.params.id+'/'+file} disabled target="_blank">{file}</a>
          </td>

        </tr>
      )
    })



  }

  subirImagen = () => {

    const MAXIMO_TAMANIO_BYTES = 5000000;
    const types = ['image/jpg', 'image/jpeg', 'image/jpe','image/png','image/gif', 'image/bpm', 'image/tif','image/tiff'];
    var file = this.state.imagen

    if (file !== null && file.length !== 0) {
      var nameFile = (file[0].name).replace(/\s+/g, "_");
      nameFile = this.reemplazar(nameFile);
      var size = file[0].size;
      var type = file[0].type;

      if (size > MAXIMO_TAMANIO_BYTES) {
        var tamanio = 5000000 / 1000000;
        toast.error("El archivo seleccionado supera los " + tamanio + 'Mb. permitidos.');
        document.getElementById('imagenes').value = '';
      }
      else {
        if (!types.includes(type)) {
          toast.error("El archivo seleccionado tiene una extensión inválida.");
          document.getElementById('imagenes').value = '';

        }
        else {
          document.getElementById('subirImg').setAttribute('disabled', 'disabled');
          fetch(urlApi+'/exploracionId/' + this.props.match.params.id, {
            method: 'get',
            headers: {
              'Authorization': 'Bearer ' + cookies.get('token')
            }
          })
            .then(response => {
              return response.json();
            })
            .then(function (response) {

              var listImages = response.exploracionId.imagenesExploracion;
              listImages.push(nameFile);

              var dataAut = {
                "imagenesExploracion": listImages,
              };

              //Primero Actualizo la Exploracion
              fetch(urlApi+'/exploracion/' + this.props.match.params.id, {
                method: 'put',
                body: JSON.stringify(dataAut),
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + cookies.get('token')
                }
              })
                .then(function (response) {
                  if (response.ok) {
                    console.log("¡Se actualizaron los datos de la Exploracion con Éxito!");
                    this.setState({ listImages: listImages });

                  }
                }.bind(this))
                .then(function (response) {
                  //segundo subo archivo al server

                  const destino = rutaExploraciones + this.props.match.params.id;
                  const data = new FormData();
                  data.append("file", file[0]);


                  axios.post(urlApi+"/uploadArchivo", data, {
                    headers: {
                      "Content-Type": undefined,
                      path: destino,
                      "newfilename": '',
                      'Authorization': 'Bearer ' + cookies.get('token')
                    }
                  })
                    .then(response => {
                      console.log(response);
                      if (response.statusText === "OK") {
                        this.setState({ imagen: null, showSuccessf: true, showErrorf: false, urlArchivo: urlArchivo + this.state.exploracionId + '/' + nameFile });
                        this.setState({ tableImagenes: this.renderTableImagenes() })
                        document.getElementById('imagenes').value = '';
                      }
                      else {
                        this.setState({ showSuccessf: false, showErrorf: true });
                      }
                      document.getElementById('subirImg').removeAttribute('disabled');

                      setTimeout(() => {
                        this.setState({ showSuccessf: false, showErrorf: false });
                      }, 5000);


                    })
                    .catch(error => {
                      this.setState({ showSuccess: false, showError: true });
                      console.log(error);
                    });




                }.bind(this))
                .catch(function (error) {
                  toast.error("Error al Actualizar Exploracion. Intente nuevamente.");
                  console.log('Hubo un problema con la petición Fetch (1):' + error.message);
                });


            }.bind(this))
            .catch(function (error) {
              toast.error("Error al consultar. Intente nuevamente.");
              console.log('Hubo un problema con la petición Fetch (2):' + error.message);
            });

        }

      }

    } else {
      toast.error("Seleccione un Archivo.");
    }
  }


  eliminarImagen = (dato) => {
    var destino = rutaExploraciones + this.props.match.params.id + "/" + dato;
    var opcion = window.confirm("¿Está seguro que deseas eliminar el Archivo?");
    if (opcion == true) {

      fetch(urlApi+'/exploracionId/' + this.props.match.params.id, {
        method: 'get',
        headers: {
          'Authorization': 'Bearer ' + cookies.get('token')
        }
      })
        .then(response => {
          return response.json();
        })
        .then(function (response) {
          //aca ya tengo la exploracion, tengo que obtener los archivos de imagenes y quitar el candidato a eliminar

          //elimino archivo del array
          var archivos = response.exploracionId.imagenesExploracion;
          var contador = 0;
          archivos.map((registro) => {
            if (dato == registro) {
              archivos.splice(contador, 1);
            }
            contador++;
          });

          var dataImg = {
            "imagenesExploracion": archivos

          }

          //Actualizo la Exploracion
          fetch(urlApi+'/exploracion/' + this.props.match.params.id, {
            method: 'put',
            body: JSON.stringify(dataImg),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + cookies.get('token')
            }
          })
            .then(function (response) {
              if (response.ok) {
                console.log("¡Se actualizaron los datos de la Exploracion con Éxito!");
                this.setState({ listImages: archivos });

              }
            }.bind(this))
            .then(function (response) {
              //Elimino Archivo del Server
              fetch(urlApi+'/deleteArchivo', {
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

                  if ((response.msg).trim() === 'OK') {
                    console.log('ok');
                    toast.success("¡Se eliminó el Archivo con Éxito!");
                    this.setState({ imagen: null, tableImagenes: this.renderTableImagenes() })

                  } else {
                    console.log('error');
                    toast.error("¡Se produjo un error al eliminar archivo!");
                  }
                }.bind(this)).catch(function (error) {
                  toast.error("Error al eliminar. Intente nuevamente.");
                  console.log('Hubo un problema con la petición Fetch (3):' + error.message);
                });


            }.bind(this))
            .catch(function (error) {
              toast.error("Error al Actualizar Exploracion. Intente nuevamente.");
              console.log('Hubo un problema con la petición Fetch (2):' + error.message);
            });

        }.bind(this))
        .catch(function (error) {
          toast.error("Error al consultar. Intente nuevamente.");
          console.log('Hubo un problema con la petición Fetch (1):' + error.message);
        });



    }
   
  };


  eliminarArchivoAut = (dato) => {
    var destino = rutaExploraciones + this.props.match.params.id + "/" + dato;
    var opcion = window.confirm("¿Está seguro que deseas eliminar el Archivo?");
    if (opcion == true) {

      fetch(urlApi+'/exploracionId/' + this.props.match.params.id, {
        method: 'get',
        headers: {
          'Authorization': 'Bearer ' + cookies.get('token')
        }
      })
        .then(response => {
          return response.json();
        })
        .then(function (response) {
          //aca ya tengo la exploracion, tengo que obtener los archivos de autorizacion y quitar el candidato a eliminar

          //elimino archivo del array
          var archivos = response.exploracionId.archAutorizaciones;
          var contador = 0;
          archivos.map((registro) => {
            if (dato == registro) {
              archivos.splice(contador, 1);
            }
            contador++;
          });

          var dataAut = {
            "archAutorizaciones": archivos

          }

          //Actualizo la Exploracion
          fetch(urlApi+'/exploracion/' + this.props.match.params.id, {
            method: 'put',
            body: JSON.stringify(dataAut),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + cookies.get('token')
            }
          })
            .then(function (response) {
              if (response.ok) {
                console.log("¡Se actualizaron los datos de la Exploracion con Éxito!");
                this.setState({ listArchivosAut: archivos });

              }
            }.bind(this))
            .then(function (response) {
              //Elimino Archivo del Server
              fetch(urlApi+'/deleteArchivo', {
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

                  if ((response.msg).trim() === 'OK') {
                    console.log('ok');
                    toast.success("¡Se eliminó el Archivo con Éxito!");
                    this.setState({ archivoAut: null, tableArchivosAut: this.renderTableArchivosAut() })

                  } else {
                    console.log('error');
                    toast.error("¡Se produjo un error al eliminar archivo!");
                  }
                }.bind(this)).catch(function (error) {
                  toast.error("Error al eliminar. Intente nuevamente.");
                  console.log('Hubo un problema con la petición Fetch (3):' + error.message);
                });


            }.bind(this))
            .catch(function (error) {
              toast.error("Error al Actualizar Exploracion. Intente nuevamente.");
              console.log('Hubo un problema con la petición Fetch (2):' + error.message);
            });

        }.bind(this))
        .catch(function (error) {
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





  render() {
    const { validateddbas } = this.state;
    const { validateddsolic } = this.state;
    const { validateddpicking } = this.state;
    const { validatedimg } = this.state;
    const { selectedDirector } = this.state;
    const { selectedIntegrante } = this.state;


    return (
      <>
        <Menu />
        <div className="row">
          <div className="col-md-12">
            <div id="contenido" align="left" className="container">
              <br />
              <h3 className="page-header" align="left">
                <FontAwesomeIcon icon={faMapMarked} /> Editar Exploración
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

              <Tabs id="tabExploracion" activeKey={this.state.key} onSelect={this.handleSelect}>
                <Tab eventKey="dbasicos" title="Datos Básicos/Geográficos" disabled={this.state.tabbas}>
                  <Form id="form1" noValidate validated={validateddbas}>


                    <Form.Row>
                      <Form.Group className="col-sm-12" controlId="nombre">
                        <Form.Label>Nombre del Área:</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Obligatorio"
                          required
                          onChange={this.handleNombreChange}
                          value={this.state.nombreArea}
                        />
                        <Form.Control.Feedback type="invalid">
                          Por favor, ingrese Nombre.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      <Form.Group className="col-sm-12" controlId="director">
                        <Form.Label>Director:</Form.Label>
                        <Select
                          placeholder={"Seleccione Opción"}
                          options={this.state.directores.map((opt) => ({
                            label: opt.nombres + " " + opt.apellidos,
                            value: opt._id,
                          }))}
                          onChange={this.handleDirectorChange}
                          value={selectedDirector}
                          isClearable
                        />
                      </Form.Group>

                    </Form.Row>

                    <Form.Row>
                      <Form.Group className="col-sm-12" controlId="integrantes">
                        <Form.Label>Integrantes Grupo:</Form.Label>
                        <Select
                          placeholder={"Seleccione Opción"}
                          options={this.state.integrantes.map((opt) => ({
                            label: opt.nombres + " " + opt.apellidos,
                            value: opt._id,
                          }))}
                          onChange={this.handleIntegrantesChange}
                          value={selectedIntegrante}
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
                          required
                          onChange={this.handleFechaInicioChange}
                          value={this.state.fechaInicio}
                        />
                        <Form.Control.Feedback type="invalid">
                          Por favor, ingrese Fecha.
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="col-sm-6" controlId="fechaTermino">
                        <Form.Label>Fecha de Termino:</Form.Label>
                        <Form.Control
                          type="date"
                          onChange={this.handlefechaTerminoChange}
                          value={this.state.fechaTermino}
                        />
                      </Form.Group>
                    </Form.Row>




                    <legend>Datos Geográficos</legend>
                    <hr />
                    <br />
                    <ModificarExploracion exploracionId={this.props.match.params.id} />
                    <br />
                    <br />

                    <Form.Row>
                      <Form.Group className="mx-sm-3 mb-2">
                        <Button variant="outline-secondary" type="button" id="siguiente1" onClick={this.handleForm1}>
                          Siguiente  <FontAwesomeIcon icon={faShare} />
                        </Button>
                        &nbsp;&nbsp;
                        <Link to='/exploraciones'>
                          <Button variant="danger" type="button" id="volver">
                            <FontAwesomeIcon icon={faTimesCircle} /> Cancelar
                          </Button>
                        </Link>
                      </Form.Group>

                    </Form.Row>

                  </Form>
                </Tab>

                <Tab eventKey="dsolic" title="Solicitud/Autorización" disabled={this.state.tabsolic}>
                <Form id="form2" noValidate validated={validateddsolic}>
                   
                   <br />
                   <legend>Solicitud de Exploración</legend>
                   <hr />

                   <Form.Row>
                     <Form.Group className="col-sm-12" controlId="empresa">
                       <Form.Label>Empresa:</Form.Label>
                       <Form.Control
                         type="text"

                         onChange={this.handleEmpresaChange}
                         value={this.state.empresa}
                       />

                     </Form.Group>
                   </Form.Row>

                   <Form.Row>
                     <Form.Group className="col-sm-12" controlId="proyecto">
                       <Form.Label>Proyecto de Investigación:</Form.Label>
                       <Form.Control
                         type="text"
                         onChange={this.handleProyectoChange}
                         value={this.state.proyectoInvestigacion}
                       />
                     </Form.Group>
                   </Form.Row>


                   <Form.Row>
                     <Form.Group className="col-sm-12" controlId="otras">
                       <Form.Label>Otras Especificaciones:</Form.Label>
                       <Form.Control
                         as='textarea'
                         onChange={this.handleOtrasChange}
                         value={this.state.otrasEspecificaciones}
                       />
                     </Form.Group>
                   </Form.Row>

                   <legend>Autorizaciones</legend>
                   <hr />

                   <Form.Row>
                     <Form.Group className="col-sm-8">
                       <label>Archivos:</label>
                       <input type="file" className="form-control" id="filesAut" accept="application/pdf" onChange={this.fileshandleChange.bind(this)} />
                     </Form.Group>
                   </Form.Row>

                   <Form.Row>
                     <Form.Group className="col-sm-2" >
                       <Button variant="primary" type="button" id="subirArch" onClick={() => this.subirAutorizacion()} >
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
                     <Form.Group className="col-sm-8" controlId="archivospdf">

                       <Table striped bordered hover responsive>
                         <thead className="thead-dark">
                           <tr>
                             <th>Acción</th>
                             <th>Nombre</th>
                           </tr>
                         </thead>
                         <tbody>
                           {this.state.tableArchivosAut}
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

                <Tab eventKey="dpicking" title="Picking" disabled={this.state.tabpicking}>
                  <Form id="form3" noValidate validated={validateddpicking}>

                    <Form.Row>
                      <Form.Group className="col-sm-12" controlId="detalle">
                        <Form.Label>Detalles:</Form.Label>
                        <Form.Control
                          as='textarea'
                          rows={5}
                          onChange={this.handleDetalleChange}
                          value={this.state.detallePicking}
                        />
                      </Form.Group>
                    </Form.Row>


                    <br />
                    <br />
                    <Form.Row>
                      <Form.Group className="mx-sm-3 mb-2">
                        <Button variant="primary" type="button" id="guardar" onClick={this.handleForm3}>
                          <FontAwesomeIcon icon={faSave} /> Guardar
                        </Button>
                        &nbsp;&nbsp;
                        <Link to="/exploraciones">
                          <Button variant="danger" type="button" id="volver">
                            <FontAwesomeIcon icon={faTimesCircle} /> Cancelar
                          </Button>
                        </Link>
                      </Form.Group>
                    </Form.Row>
                  </Form>
                </Tab>

                
                <Tab eventKey="dimg" title="Imágenes" disabled={this.state.tabimg}>
                  <Form id="form4" noValidate validated={validatedimg}>
                    <br />
                    <legend>Imágenes Adjuntas</legend>
                    <hr />
                    <Form.Row>
                      <Form.Group className="col-sm-8" controlId="imagenes">


                        <input type="file" id="imagenes" className="form-control" accept="image/*" onChange={this.imageneshandleChange.bind(this)} />
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      <Form.Group className="col-sm-2" >
                        <Button variant="primary" type="button" id="subirImg" onClick={() => this.subirImagen()} >
                          <FontAwesomeIcon icon={faUpload} /> Subir
                        </Button>
                      </Form.Group>
                      <Form.Group className="col-sm-6">
                        <Alert show={this.state.showSuccessf} variant="success">
                          <p>
                            Se subió el archivo con Éxito!!
                          </p>
                        </Alert>

                        <Alert show={this.state.showErrorf} variant="danger">
                          <p>
                            El archivo no se pudo subir. Intente nuevamente.
                          </p>
                        </Alert>
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      <Form.Group className="col-sm-8" >

                        <Table striped bordered hover responsive>
                          <thead className="thead-dark">
                            <tr>
                              <th>Acción</th>
                              <th>Nombre</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.tableImagenes}
                          </tbody>
                        </Table>


                      </Form.Group>
                    </Form.Row>



                    <Form.Row >
                      <Button variant="outline-secondary" type="button" id="anterior4" onClick={this.handleAntForm4}>
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

    )

  }
}


export default EditExploracion;