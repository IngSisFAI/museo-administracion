import React from "react";
import { Form, Button, Tabs, Tab, Table, Alert } from 'react-bootstrap';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTimesCircle, faClone, faUpload, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Link, withRouter } from 'react-router-dom';
import Moment from 'moment';
import axios from 'axios';
import Menu from "./../Menu"
import Cookies from 'universal-cookie';
import $ from 'jquery';

const cookies = new Cookies();
//Variables Globales
const urlApi = process.env.REACT_APP_API_HOST
const urlImage = process.env.REACT_APP_URL_REPLICA;
const urlDoc = process.env.REACT_APP_URL_REPLICA;
const rutaImg = process.env.REACT_APP_RUTA_REPLICA;
const rutaDoc = process.env.REACT_APP_RUTA_REPLICA;

class EditReplica extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        nroActa: "",
        descripcion: "",
        fecha: "",
        foto: "",
        documentacion: "",

      show: false,
      extFoto: '',
      validated: false,
      tabbas: false,
      key: 'dbasicos',
      validatedfile: false,
      tabfile: false,
      showSuccess: false,
      showError: false,  
      showSuccessdoc: false,
      showErrordoc: false,
      archivoFoto: '',
      archivoDoc: '',
      tableDoc: null,
      tableImage: null,
    }
  }

  componentDidMount() {
    if (!cookies.get('user') && !cookies.get('password')) {
      window.location.href = '/';
    }
    else {
      fetch(urlApi + '/replicaId/' + this.props.match.params.id,
        {
          headers: {
            'Authorization': 'Bearer ' + cookies.get('token')
          }
        })
        .then(res => res.json())
        .then(
          (response) => {
            //console.log(response)
            this.setState({
              nroActa: response.replicaId.nroActa,
              descripcion: response.replicaId.descripcion,
              fecha: (Moment(response.replicaId.fecha).add(0, 'days')).format('YYYY-MM-DD'),
              foto: response.replicaId.foto,
              documentacion: response.replicaId.documentacion,
              tableDoc: this.cargarTableDataDoc(response.replicaId.documentacion),
              tableImage: this.cargarTableDataFoto(response.replicaId.foto),
            });
          }).catch(error => {
            console.log("Error:", error.message)
          });
    }
  }

  handleNroActaChange = evt => {
    this.setState({ nroActa: evt.target.value });
  };
  handleDescripcionChange = evt => {
    this.setState({ descripcion: evt.target.value });
  };
  handleFechaChange = evt => {
    this.setState({ fecha: evt.target.value });
  };

  handleSubmit = evt => {
    const form = evt.currentTarget;
    evt.preventDefault();
    if (form.checkValidity() === false) {
      evt.stopPropagation();
    }
    else {
      evt.preventDefault();
      $(".loader").removeAttr("style");
      var data = {
        "nroActa": this.state.nroActa,
        "descripcion": this.state.descripcion,
        "fecha": (Moment(this.state.fecha).add(1, 'days')).format('YYYY-MM-DD'),
      };
      fetch(urlApi + '/replica/' + this.props.match.params.id, {
        method: 'put',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + cookies.get('token')
        }
      })
        .then(function (response) {
          $(".loader").fadeOut("slow");
          if (response.ok) {
            toast.success("¡Se guardó la Replica con Éxito!");
            return response.json();
          }
        })
        .catch(function (error) {
          $(".loader").fadeOut("slow");
          toast.error("Error al guardar. Intente nuevamente.");
          console.log('Hubo un problema con la petición Fetch:' + error.message);
        });
    }
    this.setState({ validated: true });
  }


  handleSelect = (key) => {
    this.setState({ key: key });
  }
  filehandleChange = (event) => {
    const file = event.target.files;
    const name = file[0].name;
    const lastDot = name.lastIndexOf('.');
    const ext = name.substring(lastDot + 1);
    this.setState({ archivoFoto: file, extFoto: ext });
    // console.log('SALIDA::', file)
  }

  cargarTableDataFoto(foto) {
    // alert(foto);
    if (foto !== null && foto !== "") {
      return (
        <tr key={Math.floor(Math.random() * 1000)}>
          <td>
            <Button variant="danger" type="button" id="eliminarF" onClick={() => this.eliminarArchivoFoto(foto)}>
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </td>
          <td>
            <a href={urlImage + foto} disabled target="_blank">{foto}</a>
          </td>
        </tr>
      )
    }
    else {
      return (<></>)
    }
  }

  eliminarArchivoFoto = (dato) => {
    //console.log(dato);
    var opcion = window.confirm("¿Está seguro que desea eliminar el Archivo?");
    var destino = rutaImg + dato;
    if (opcion == true) {
      var data = {
        "foto": ""
      }
      $(".loader").removeAttr("style");
      fetch(urlApi + '/replica/' + this.state.idReplica, {
        method: 'put',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + cookies.get('token')
        }
      })
        .then(function (response) {
          if (response.ok) {
            console.log("¡Se actualizaron los datos de la Replica con Éxito!");
          }
        })
        .then(function () {
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
                this.setState({ archivoFoto: null, extFoto: '', tableImage: null })
              } else {
                console.log('error');
                toast.error("¡Se produjo un error al eliminar archivo!");
              }
            }.bind(this)).catch(function (error) {
              $(".loader").fadeOut("slow");
              toast.error("Error al eliminar. Intente nuevamente.");
              console.log('Hubo un problema con la petición Fetch (2):' + error.message);
            });
        }.bind(this))
        .catch(function (error) {
          $(".loader").fadeOut("slow");
          toast.error("Error al guardar. Intente nuevamente.");
          console.log('Hubo un problema con la petición Fetch (1):' + error.message);
        });
    }
  }

  eliminarArchivoDoc = (dato) => {
    //console.log(dato);
    var opcion = window.confirm("¿Está seguro que desea eliminar el Documento?");
    var destino = rutaDoc + dato;
    if (opcion == true) {
      var data = {
        "documentacion": ""
      }
      $(".loader").removeAttr("style");
      fetch(urlApi + '/replica/' + this.state.idReplica, {
        method: 'put',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + cookies.get('token')
        }
      })
        .then(function (response) {
          if (response.ok) {
            console.log("¡Se actualizaron los datos de la Replica con Éxito!");
          }
        })
        .then(function () {
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
                this.setState({ archivoDoc: null, extDoc: '', tableDoc: null })
              } else {
                $(".loader").fadeOut("slow");
                console.log('error');
                toast.error("¡Se produjo un error al eliminar archivo!");
              }
            }.bind(this)).catch(function (error) {
              $(".loader").fadeOut("slow");
              toast.error("Error al eliminar. Intente nuevamente.");
              console.log('Hubo un problema con la petición Fetch (2):' + error.message);
            });
        }.bind(this))
        .catch(function (error) {
          $(".loader").fadeOut("slow");
          toast.error("Error al guardar. Intente nuevamente.");
          console.log('Hubo un problema con la petición Fetch (1):' + error.message);
        });
    }
  }

  fileDochandleChange = (event) => {
    const file = event.target.files;
    const name = file[0].name;
    const lastDot = name.lastIndexOf('.');
    const ext = name.substring(lastDot + 1);
    this.setState({ archivoDoc: file, extDoc: ext });
  }

  cargarTableDataDoc(cv) {
    //let cv= this.state.curriculum

    if (cv !== null && cv !== "") {
      return (
        <tr key={Math.floor(Math.random() * 1000)}>
          <td>
            <Button variant="danger" type="button" id="eliminarDoc" onClick={() => this.eliminarArchivoDoc(cv)}>
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </td>
          <td>
            <a href={urlDoc + cv} disabled target="_blank">{cv}</a>
          </td>
        </tr>
      )
    }
    else {
      return (<></>)
    }
  }

  subirFoto = () => {
    //console.log(this.state.archivoFoto);
    const MAXIMO_TAMANIO_BYTES = 5000000;
    const types = ['image/jpg', 'image/jpeg', 'image/jpe', 'image/png', 'image/gif', 'image/bpm', 'image/tif', 'image/tiff'];
    var foto = this.state.archivoFoto
    var name = (foto[0].name).lastIndexOf('.');
    if (foto !== null && foto.length !== 0) {
      var namePhoto = '/rep_'+ this.state.nroActa + '.' + this.state.extFoto
      
      var size = foto[0].size;
      var type = foto[0].type;
      console.log("Paso por acá!");

      if (size > MAXIMO_TAMANIO_BYTES) {
        var tamanio = 5000000 / 1000000;
        toast.error("El archivo seleccionado supera los " + tamanio + 'Mb. permitidos.');
        document.getElementById('foto').value = '';
      }
      else {
        if (!types.includes(type)) {
          toast.error("El archivo seleccionado tiene una extensión inválida.");
          document.getElementById('foto').value = '';

        }
        else {
          $(".loader").removeAttr("style"); 
          var data1 = {
            foto: namePhoto,
          };
          document.getElementById('subir').setAttribute('disabled', 'disabled');
          fetch(urlApi + '/replica/' + this.state.idReplica, {
            method: 'put',
            body: JSON.stringify(data1),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + cookies.get('token')
            }
          })
            .then(function (response) {
              if (response.ok) {
                console.log("¡Se actualizaron los datos de la Replica con Éxito!");
                //const destino = rutaImg;                      
                const data = new FormData();
                data.append("file", foto[0]);
                // console.log(foto);
                axios.post(urlApi + "/uploadArchivo", data, {
                  headers: {
                    "Content-Type": undefined,
                    path: rutaImg,
                    "newfilename": 'rep_' + this.state.nroActa,
                    'Authorization': 'Bearer ' + cookies.get('token')
                  }
                })
                  .then(response => {
                    $(".loader").fadeOut("slow");
                    if (response.statusText === "OK") {
                      this.setState({ showSuccess: true, showError: false, urlImage: urlImage +'rep_'+ this.state.nroActa + '.' + this.state.extFoto });
                      this.setState({ tableImage: this.renderTableDataFoto() })
                      document.getElementById('foto').value = '';
                    }
                    else {
                      this.setState({ showSuccess: false, showError: true });
                    }
                    document.getElementById('subir').removeAttribute('disabled');
                    setTimeout(() => {
                      this.setState({ showSuccess: false, showError: false });
                    }, 2500);
                  })
                  .catch(error => {
                    $(".loader").fadeOut("slow");
                    this.setState({ showSuccess: false, showError: true });
                    console.log(error);
                  });
              }
            }.bind(this))
            .catch(function (error) {
              $(".loader").fadeOut("slow");
              toast.error("Error al guardar. Intente nuevamente.");
              document.getElementById('subir').removeAttribute('disabled');
              console.log('Hubo un problema con la petición Fetch:' + error.message);
            });
        }
      }
    } else {
      toast.error("Seleccione una foto.");
    }
  }

  subirDoc = () => {
    const MAXIMO_TAMANIO_BYTES = 5000000;
    const types = ['application/pdf'];
    var cv = this.state.archivoDoc
    if (cv !== null && cv.length !== 0) {
      var nameCV = '/rep_' + this.state.nroActa + '.' + this.state.extDoc
      var size = cv[0].size;
      var type = cv[0].type;
      if (size > MAXIMO_TAMANIO_BYTES) {
        var tamanio = 5000000 / 1000000;
        toast.error("El archivo seleccionado supera los " + tamanio + 'Mb. permitidos.');
        document.getElementById('documentacion').value = '';
      }
      else {
        if (!types.includes(type)) {
          toast.error("El archivo seleccionado tiene una extensión inválida.");
          document.getElementById('documentacion').value = '';
        }
        else {
          $(".loader").removeAttr("style");
          var data1 = {
            documentacion: nameCV,
          };
          document.getElementById('subirDoc').setAttribute('disabled', 'disabled');
          fetch(urlApi + '/replica/' + this.state.idReplica, {
            method: 'put',
            body: JSON.stringify(data1),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + cookies.get('token')
            }
          })
            .then(function (response) {
              if (response.ok) {
                console.log("¡Se actualizaron los datos de la Replica con Éxito!");
                //  const destino = rutaDoc;                      
                const data = new FormData();
                data.append("file", cv[0]);
                axios.post(urlApi + "/uploadArchivo", data, {
                  headers: {
                    "Content-Type": undefined,
                    path: rutaDoc,
                    "newfilename": 'rep_' + this.state.nroActa,
                    'Authorization': 'Bearer ' + cookies.get('token')
                  }
                })
                  .then(response => {
                    //  console.log(response);
                    $(".loader").fadeOut("slow");
                    if (response.statusText === "OK") {
                      this.setState({ showSuccessDoc: true, showErrorDoc: false, urlDoc: urlDoc + 'rep_' + this.state.nroActa + '.' + this.state.extDoc });
                      this.setState({ tableDoc: this.renderTableDataDoc() })
                      document.getElementById('documentacion').value = '';
                    }
                    else {
                      this.setState({ showSuccess: false, showError: true });
                    }
                    document.getElementById('subirDoc').removeAttribute('disabled');
                    setTimeout(() => {
                      this.setState({ showSuccessdoc: false, showErrordoc: false });
                    }, 2500);
                  })
                  .catch(error => {
                    $(".loader").fadeOut("slow");  
                    console.log(error);
                  });
              }
            }.bind(this))
            .catch(function (error) {
              toast.error("Error al subir el archivo. Intente nuevamente.");
              document.getElementById('subirDoc').removeAttribute('disabled');
              console.log('Hubo un problema con la petición Fetch:' + error.message);
            });
        }
      }
    } else {
      toast.error("Seleccione una Documentación.");
    }
  }
  

  render() {
    const { validated } = this.state;
    const { validatedfile } = this.state;
    return (
      <>
        <Menu />
        <div className="row">
          <div className="col-md-12">
            <div id="contenido" align="left" className="container">
              <div className="loader" style={{ display: 'none' }}></div>
              <br />
              <h3 className="page-header" align="left">
                <FontAwesomeIcon icon={faClone} /> Editar Replica
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
              <Tabs id="tabReplicas" activeKey={this.state.key} onSelect={this.handleSelect}>
                <Tab eventKey="dbasicos" title="Datos Básicos" disabled={this.state.tabbas}>
                  <Form noValidate validated={validated} onSubmit={this.handleSubmit}>
                    <br />   
                    <Form.Row >
                      <Form.Group className="col-sm-6" controlId="nroActa">
                        <Form.Label>Número Acta:</Form.Label>
                        <Form.Control type="number" placeholder="Ingrese Nro. de Acta" required onChange={this.handleNroActaChange} value={this.state.nroActa} />
                        <Form.Control.Feedback type="invalid">
                          Por favor, ingrese Nro. de Acta.
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="col-sm-6" controlId="fecha">
                        <Form.Label>Fecha:</Form.Label>
                        <Form.Control type="date" value={this.state.fecha} onChange={this.handleFechaChange} />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group className="col-sm-12" controlId="descripcion" >
                      <Form.Label>Descripción:</Form.Label>
                        <Form.Control as="textarea" rows={2} value={this.state.descripcion} onChange={this.handleDescripcionChange} />
                      </Form.Group>
                    </Form.Row>
                    <hr />
                    <Form.Row>
                      <Form.Group className="mx-sm-3 mb-2">
                        <Button variant="primary" type="submit" id="guardar">
                          <FontAwesomeIcon icon={faSave} /> Guardar
                        </Button>
                        &nbsp;&nbsp;
                        <Link to='/replicas'>
                          <Button variant="danger" type="button" id="volver">
                            <FontAwesomeIcon icon={faTimesCircle} /> Cancelar
                          </Button>
                        </Link>
                      </Form.Group>
                    </Form.Row>
                  </Form>
                
                </Tab>
                <Tab eventKey="dfiles" title="Archivos Adjuntos" disabled={this.state.tabfile}>
                  <Form id="form" noValidate validated={validatedfile}>
                    <br />
                    <Form.Row >
                      <Form.Group className="col-sm-12">
                        <Form.Label>Foto(s):</Form.Label>
                        <input type="file" id="foto" className="form-control" accept="image/*" onChange={this.filehandleChange.bind(this)} />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row >
                      <Form.Group className="col-sm-8" controlId="listFoto">
                        <Table border="0">
                          <tbody id="tbodyimage">
                            {this.state.tableImage}
                          </tbody>
                        </Table>
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group className="mx-sm-3 mb-2">
                        <Button variant="primary" type="button" id="subir" onClick={() => this.subirFoto()} >
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
                    <Form.Row >
                      <Form.Group className="col-sm-12" >
                        <Form.Label>Documentación:</Form.Label>
                        <input type="file" id="documentacion" className="form-control" accept="application/pdf" onChange={this.fileDochandleChange.bind(this)} />
                      </Form.Group>
                    </Form.Row>
                    <Form.Row >
                      <Form.Group className="col-sm-8" controlId="listDoc">
                        <Table border="0">
                          <tbody>
                            {this.state.tableDoc}
                          </tbody>
                        </Table>
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group className="mx-sm-3 mb-2">
                        <Button variant="primary" type="button" id="subirDoc" onClick={() => this.subirDoc()} >
                          <FontAwesomeIcon icon={faUpload} /> Subir
                        </Button>
                      </Form.Group>
                      <Form.Group className="col-sm-6">
                        <Alert show={this.state.showSuccessdoc} variant="success">
                          <p>
                            Se subió el archivo con Éxito!!
                          </p>
                        </Alert>
                        <Alert show={this.state.showErrordoc} variant="danger">
                          <p>
                            El archivo no se pudo subir. Intente nuevamente.
                          </p>
                        </Alert>
                      </Form.Group>
                    </Form.Row>
                    <hr />
                    <Form.Row>
                      <Form.Group className="mx-sm-3 mb-1">
                        &nbsp;&nbsp;
                        <Link to='/replicas'>
                          <Button variant="primary" type="button" id="volver">
                            <FontAwesomeIcon icon={faTimesCircle} /> Volver a Replicas
                          </Button>
                        </Link>
                      </Form.Group>
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

export default withRouter(EditReplica);