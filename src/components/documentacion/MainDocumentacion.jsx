import React from 'react';
import MaterialTable from "material-table";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form, Button, Modal, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faSave, faPlus, faFileArchive, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { withRouter, Link } from 'react-router-dom';
import Menu from "./../Menu"
import Cookies from 'universal-cookie';
import axios from "axios";
import $ from 'jquery';
import Select from 'react-select';


const cookies = new Cookies();

//Variables Globales
const urlApi = process.env.REACT_APP_API_HOST;
const urlArchivo = process.env.REACT_APP_URL_DOCUMENTACION;
const rutaDocumentacion = process.env.REACT_APP_RUTA_DOCUMENTACION;

const optionsTipo = [{ label: 'Nota Enviada', value: 'Nota Enviada' }, { label: 'Nota Recibida', value: 'Nota Recibida' }]



const columnsMT = [
  {
    title: 'Id.',
    field: '_id',
    hidden: true
  },
  {
    title: 'Tipo Documento',
    field: 'tipoDocumentacion'
  },
  {
    title: 'Nombre',
    field: 'nombre'
  },
  {
    title: 'Año',
    field: 'anio',
    type: "numeric",
    cellStyle: {
      textAlign: 'center'
    },
    headerStyle: {
      textAlign: 'left'
    },

  },
  {
    title: 'Comentarios',
    field: 'comentarios'
  }
];




class MainDocumentacion extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      documentacion: [],
      modalAgregar: false,
      modalEditar: false,
      anio: '',
      selectedtipoDoc: '',
      comentarios: '',
      archivo: null,
      validated: false,
      nombreArchivo: '',
      idDocumento: '',
      op: 'I'
    }
    this.reemplazar = this.reemplazar.bind(this);

  }




  componentDidMount() {

    if (!cookies.get('user') && !cookies.get('password')) {
      window.location.href = '/';
    }
    else {


      fetch(urlApi + '/documentacion', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + cookies.get('token')
        }
      })
        .then(res => res.json())
        .then(
          (result) => {
            //console.log(result);
            this.setState({
              documentacion: result.documentacion
            });
          }).catch(error => {
            console.log("Error")
          });
    }

  }


  eliminar(id) {

    $(".loader").removeAttr("style");

    var resultDocumentacion = [];
    const ruta = rutaDocumentacion + id + '/';


    fetch(urlApi + '/documentacion/' + id, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + cookies.get('token')
      }
    })
      .then(function (response) {
        if (response.ok) {
          console.log("¡Se eliminó la documentación con Éxito!");

        }
      }).then(function (res) {

        fetch(urlApi + '/deleteDirectorio', {
          method: 'get',
          headers: {
            'Content-Type': undefined,
            'path': ruta,
            'Authorization': 'Bearer ' + cookies.get('token')
          }
        }).then(response => {
          return response.json();
        })
          .then(function (response) {
            toast.success("¡Se eliminó la Exploración con Éxito!");
          }).catch(error => {
            $(".loader").fadeOut("slow");
            console.log("Error al eliminar archivo:", error)
          });


      })
      .then(function () {
        fetch(urlApi + '/documentacion', {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + cookies.get('token')
          }
        })
          .then(response => {
            return response.json();
          })
          .then(
            function (result) {
              $(".loader").fadeOut("slow");
              if (typeof result.documentacion !== 'undefined') {

                resultDocumentacion = result.documentacion

              } else {
                $(".loader").fadeOut("slow");
                cookies.remove("id", { path: "/" });
                cookies.remove("nombre", { path: "/" });
                cookies.remove("apellido", { path: "/" });
                cookies.remove("user", { path: "/" });
                cookies.remove("password", { path: "/" });
                cookies.remove("permiso", { path: "/" });
                cookies.remove("token", { path: "/" });
                window.location.href = "/";
              }


            }).catch(error => {
              $(".loader").fadeOut("slow");
              console.log("Error al consultar personas:", error)
            });


      })
      .catch(function (error) {
        $(".loader").fadeOut("slow");
        toast.error("Error al eliminar. Intente nuevamente (1).");
        console.log('Hubo un problema con la petición Fetch:' + error.message);
      });

    setTimeout(() => {
      this.setState({ documentacion: resultDocumentacion });
    }, 2000);


  }

  mostrarModalAgregar = () => {

    this.setState({
      modalAgregar: true,
    });
  };

  cerrarModalAgregar = () => {
    this.setState({ modalAgregar: false, archivo: null, anio: '', selectedtipoDoc: null, comentarios: '', op: 'I' });
  };

  handleAnioChange = evt => {
    this.setState({ anio: evt.target.value });
  };



  handleTipoDocChange = (selectedtipoDoc) => {
    this.setState({ selectedtipoDoc });
  };

  handleComentariosChange = (evt) => {
    this.setState({ comentarios: evt.target.value });
  };

  filehandleChange = (event) => {

    const MAXIMO_TAMANIO_BYTES = 5000000;
    const types = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const file = event.target.files;

    var size = file[0].size;
    var type = file[0].type;

    if (size > MAXIMO_TAMANIO_BYTES) {
      var tamanio = 5000000 / 1000000;
      toast.error("El archivo seleccionado supera los " + tamanio + 'Mb. permitidos.');
      document.getElementById('archivo').value = '';
    }
    else {
      if (!types.includes(type)) {
        toast.error("El archivo seleccionado tiene una extensión inválida.");
        document.getElementById('archivo').value = '';

      }
      else {
        this.setState({ archivo: file });
      }
    }


  }

  renderTableData() {

    let file = this.state.archivo
    if (file !== null) {
      return (
        <tr key={Math.floor(Math.random() * 1000)}>
          <td>
            <Button variant="danger" type="button" id="eliminarCV" onClick={() => this.eliminarArchivo(FileReader)}>
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </td>
          <td>{file[0].name}</td>

        </tr>
      )

    }
    else {

      return (<></>)
    }

  }

  eliminarArchivo = (dato) => {
    //aca tambien hay que eliminar en la BD y traer los prestamos
    var opcion = window.confirm("¿Está seguro que deseas eliminar el Archivo?");
    if (opcion == true) {
      console.log(dato)
      document.getElementById('archivo').value = "";
      this.setState({ archivo: null });

    }
  };


  insertar = (event) => {

    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    else {
     
      if (this.state.selectedtipoDoc === null || this.state.selectedtipoDoc === '') {
        toast.error('Ingrese un Tipo.');
      }
      else {
        var tipo=this.state.selectedtipoDoc.value
        var op = this.state.op;

        if (op === "I") {

          $(".loader").removeAttr("style");
          var file = this.state.archivo
          var nameFile = (file[0].name).replace(/\s+/g, "_");
          nameFile = this.reemplazar(nameFile);
          var data = {
            "tipoDocumentacion": tipo,
            "nombre": nameFile,
            "anio": this.state.anio,
            "comentarios": this.state.comentarios
          }

          fetch(urlApi + "/saveDocumentacion", {
            method: "post",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
              'Authorization': 'Bearer ' + cookies.get('token')
            },
          })
            .then(res => res.json())
            .then(function (response) {

              if (typeof response.documentacion === 'undefined') {
                toast.error("Error al guardar. Intente nuevamente.");
              }
              else {
                var destino = rutaDocumentacion + response.documentacion._id;
                const data = new FormData();
                data.append("file", file[0]);


                axios.post(urlApi + "/uploadArchivo", data, {
                  headers: {
                    "Content-Type": undefined,
                    path: destino,
                    "newfilename": '',
                    'Authorization': 'Bearer ' + cookies.get('token')
                  }
                }).then(response => {

                  $(".loader").fadeOut("slow");
                  if (response.statusText === "OK") {
                    toast.success("¡Se guardó el Documento con Éxito!");
                    setTimeout(() => {
                      window.location.reload();
                    }, 1200);

                  }
                  else {
                    toast.error("No se pudo subir el archivo al servidor. Intente nuevamente.");
                  }


                })
                  .catch(error => {
                    this.setState({ showSuccess: false, showError: true });
                    console.log(error);
                  });
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
        else {
          //edito
          $(".loader").removeAttr("style");
          var data = {
            "tipoDocumentacion": tipo,
            "anio": this.state.anio,
            "comentarios": this.state.comentarios
          }

          fetch(urlApi + "/updateDocumentacion/" + this.state.idDocumento, {
            method: "put",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
              'Authorization': 'Bearer ' + cookies.get('token')
            },
          })
            .then(res => res.json())
            .then(function (response) {
              $(".loader").fadeOut("slow");
              if (typeof response.documentacion === 'undefined') {
                toast.error("Error al guardar. Intente nuevamente.");
              }
              else {

                toast.success("¡Se Actualizó el Documento con Éxito!");
                setTimeout(() => {
                  window.location.reload();
                }, 1200);

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
      }

    }

    this.setState({ validated: true });

  }

  cerrarModalEditar = () => {
    this.setState({ modalEditar: false, archivo: null, anio: '', selectedtipoDoc: null, comentarios: '', nombreArchivo: '', idDocumento: '', op: 'I' });
  };

  mostrarModalEditar = (id) => {


    fetch(urlApi + '/documentacionId/' + id, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + cookies.get('token')
      }
    })
      .then(res => res.json())
      .then(
        (result) => {

          var tipoSelect= {label:result.documentacionId.tipoDocumentacion, value: result.documentacionId.tipoDocumentacion};
          this.setState({
            modalEditar: true,
            anio: result.documentacionId.anio,
            selectedtipoDoc: tipoSelect,
            comentarios: result.documentacionId.comentarios,
            nombreArchivo: result.documentacionId.nombre,
            idDocumento: id,
            op: 'U'
          });

        }).catch(error => {
          console.log("Error")
        });


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
    const { validated } = this.state;
    const { selectedtipoDoc } = this.state;
    return (

      <>
        <Menu />
        <Form  >
          <ToastContainer
            position="top-right"
            autoClose={5000}
            transition={Slide}
            hideProgressBar={true}
            newestOnTop={true}
            closeOnClick
            pauseOnHover
          />
          <Form.Row>
            <div id="contenido" align="left" className="container">
              <div className="loader" style={{ display: 'none' }}></div>

              <legend> <FontAwesomeIcon icon={faFileArchive} /> Gestión de Documentación</legend>
              <hr />

              <Button variant="primary" id="agregar" type="button" onClick={() => this.mostrarModalAgregar()}>
                <FontAwesomeIcon icon={faPlus} /> Agregar
              </Button>

              <br />
              <br />



              <MaterialTable
                title="Listado"
                columns={columnsMT}
                data={this.state.documentacion}
                detailPanel={rowData => {
                  return (
                    <iframe
                      width="100%"
                      height="315"
                      src={urlArchivo + rowData._id + '/' + rowData.nombre}
                      frameborder="0"
                    />
                  )
                }}
                onRowClick={(event, rowData, togglePanel) => togglePanel()}
                actions={[
                  {
                    icon: 'edit',
                    tooltip: 'Editar Documento',
                    onClick: (event, rowData) => {
                      this.mostrarModalEditar(rowData._id)
                      // this.props.history.push(`/editPersona/${rowData._id}`);;

                    }

                  },
                  {
                    icon: 'delete',
                    tooltip: 'Eliminar Documento',
                    onClick: (event, rowData) => {
                      // Do save operation
                      if (window.confirm('¿Está seguro de eliminar el documento seleccionado?')) {
                        this.eliminar(rowData._id);

                      }
                    }

                  }


                ]}
                options={{
                  filtering: true,
                  exportButton: true,
                  exportFileName: 'Listado de Documentación'
                }}
                localization={{
                  header: {
                    actions: 'Acciones'
                  }
                }}
              />



            </div>
          </Form.Row>


          <Modal
            show={this.state.modalAgregar}
            onHide={() => this.cerrarModalAgregar()}
            backdrop="static"
            keyboard={false}
            size="lg"
          >

            <Modal.Header closeButton>
              <Modal.Title>Nuevo Documento</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form noValidate validated={validated} onSubmit={this.insertar}>
                <Form.Row >


                  <Form.Group className="col-sm-4" controlId="anioDoc">
                    <Form.Label>Año:</Form.Label>
                    <Form.Control type="number" value={this.state.anio}
                      onChange={this.handleAnioChange} required />
                    <Form.Control.Feedback type="invalid">
                      Por favor, ingrese Año.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="col-sm-8" controlId="tipoDoc">
                    <Form.Label>Tipo Documento:</Form.Label>


                    <Select
                      placeholder={"Seleccione Opción"}
                      options={optionsTipo}
                      onChange={this.handleTipoDocChange}
                      value={selectedtipoDoc}
                      isClearable
                    />


                  </Form.Group>

                </Form.Row>

                <Form.Row >
                  <Form.Group className="col-sm-12" >
                    <Form.Label>Archivo:</Form.Label>
                    <input type="file" id="archivo" className="form-control" accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={this.filehandleChange.bind(this)} required />
                  </Form.Group>
                </Form.Row>
                <Form.Row >
                  <Form.Group className="col-sm-8" controlId="listFile">
                    <Table border="0">
                      <tbody>
                        {this.renderTableData()}
                      </tbody>
                    </Table>
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group className="col-sm-12" controlId="Comentarios">
                    <Form.Label>Comentarios:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={this.state.comentarios}
                      onChange={this.handleComentariosChange}
                    />
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group>
                    <Button variant="primary" id="guardar" type="submit" >
                      <FontAwesomeIcon icon={faSave} /> Guardar
                    </Button>
                    &nbsp;&nbsp;
                    <Button variant="danger" onClick={() => this.cerrarModalAgregar()}>
                      <FontAwesomeIcon icon={faTimesCircle} /> Cerrar
                    </Button>
                  </Form.Group>
                </Form.Row>


              </Form>


            </Modal.Body>
            <Modal.Footer>

            </Modal.Footer>
          </Modal>

          <Modal
            show={this.state.modalEditar}
            onHide={() => this.cerrarModalEditar()}
            backdrop="static"
            keyboard={false}
            size="lg"
          >

            <Modal.Header closeButton>
              <Modal.Title>Editar Documento</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form noValidate validated={validated} onSubmit={this.insertar}>
                <Form.Row >


                  <Form.Group className="col-sm-4" controlId="anioDoc">
                    <Form.Label>Año:</Form.Label>
                    <Form.Control type="number" value={this.state.anio}
                      onChange={this.handleAnioChange} required />
                    <Form.Control.Feedback type="invalid">
                      Por favor, ingrese Año.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="col-sm-8" controlId="tipoDoc">
                    <Form.Label>Tipo Documento:</Form.Label>
                    <Select
                      placeholder={"Seleccione Opción"}
                      options={optionsTipo}
                      onChange={this.handleTipoDocChange}
                      value={selectedtipoDoc}
                      isClearable
                    />


                    <Form.Control.Feedback type="invalid">
                      Por favor, seleccione opción.
                    </Form.Control.Feedback>
                  </Form.Group>

                </Form.Row>

                <Form.Row >
                  <Form.Group className="col-sm-12" >
                    <Form.Label>Archivo:</Form.Label>
                    <br />
                    <a href={urlArchivo + this.state.idDocumento + '/' + this.state.nombreArchivo} disabled target="_blank">{this.state.nombreArchivo}</a>
                  </Form.Group>
                </Form.Row>


                <Form.Row>
                  <Form.Group className="col-sm-12" controlId="Comentarios">
                    <Form.Label>Comentarios:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={this.state.comentarios}
                      onChange={this.handleComentariosChange}
                    />
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group>
                    <Button variant="primary" id="guardar" type="submit" >
                      <FontAwesomeIcon icon={faSave} /> Guardar
                    </Button>
                    &nbsp;&nbsp;
                    <Button variant="danger" onClick={() => this.cerrarModalEditar()}>
                      <FontAwesomeIcon icon={faTimesCircle} /> Cerrar
                    </Button>
                  </Form.Group>
                </Form.Row>


              </Form>


            </Modal.Body>
            <Modal.Footer>

            </Modal.Footer>
          </Modal>

        </Form>
      </>


    )
  }



}

export default withRouter(MainDocumentacion);

