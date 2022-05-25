import React from 'react';
import MaterialTable from "material-table";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faHandshake } from '@fortawesome/free-solid-svg-icons'
import { withRouter, Link } from 'react-router-dom';
import Menu from "./../Menu"
import Cookies from 'universal-cookie';
import $ from 'jquery';

const cookies = new Cookies();

//Variables Globales
const urlApi = process.env.REACT_APP_API_HOST;
const rutaImg = process.env.REACT_APP_RUTA_IMG_PRESTAMO;
const rutaDoc = process.env.REACT_APP_RUTA_DOC_PRESTAMO;

const columnsMT = [
  {
    title: 'Id.',
    field: '_id',
    hidden: true
  },
  {
    title: 'Número',
    field: 'nroActa'
    //hay que ponerle el type?
  },
  {
    title: 'Descripción',
    field: 'descripcion'
  },
  {
    title: 'Fecha',
    field: 'fechaInicio',
    type: "date"
  }
];

class MainPrestamos extends React.Component {
  constructor(props) {
    super(props);
    this.state = { prestamos: [] }
  }
  componentDidMount() {
    if (!cookies.get('user') && !cookies.get('password')) {
      window.location.href = '/';
    }
    else {
      fetch(urlApi + '/prestamos', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + cookies.get('token')
        }
      })
        .then(response => {
          return response.json();
        })
        .then(
          (result) => {
            if (typeof result.prestamos !== 'undefined') {
              this.setState({
                prestamos: result.prestamos
              });
            } else {

              console.log("Esta pasando por aqui")
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
            console.log("Error al consultar prestamos:", error)
          });
    }
  }

  eliminar(id, foto, doc) {
    var resultPrestamos = [];
    const img = rutaImg + foto;
    const docPrestamo = rutaDoc + doc;
    $(".loader").removeAttr("style");
    fetch(urlApi + '/prestamos/' + id, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + cookies.get('token')
      }
    })
      .then(function (response) {
        if (response.ok) {
          console.log("¡Se eliminó a el prestamo con Éxito!");
        }
      })
      .then(function (res) {
        fetch(urlApi + '/deleteArchivo', {
          method: 'get',
          headers: {
            'Content-Type': undefined,
            'path': img,
            'Authorization': 'Bearer ' + cookies.get('token')
          }
        }).then(response => {
          return response.json();
        })
          .then(function (response) {
            console.log('Se elimino el archivo con exito.');
          })
          .then(function () {
            fetch(urlApi + '/deleteArchivo', {
              method: 'get',
              headers: {
                'Content-Type': undefined,
                'path': docPrestamo,
                'Authorization': 'Bearer ' + cookies.get('token')
              }
            }).then(response => {
              return response.json();
            })
              .then(function (response) {
                toast.success("¡Se eliminó el Prestamo con Éxito!");
              }).catch(error => {
                $(".loader").fadeOut("slow");
                console.log("Error al eliminar archivo:", error)
              });
          })
          .then(function () {
            fetch(urlApi + '/prestamos', {
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
                  if (typeof result.prestamos !== 'undefined') {
                    resultPrestamos = result.prestamos
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
                  console.log("Error al consultar prestamos:", error)
                });
          })
          .catch(function (error) {
            $(".loader").fadeOut("slow");
            toast.error("Error al eliminar. Intente nuevamente.");
            console.log('Hubo un problema con la petición Fetch:' + error.message);
          });
      })
      .catch(function (error) {
        $(".loader").fadeOut("slow");
        toast.error("Error al eliminar. Intente nuevamente (1).");
        console.log('Hubo un problema con la petición Fetch:' + error.message);
      });
    setTimeout(() => {
      $(".loader").fadeOut("slow");
      this.setState({ prestamos: resultPrestamos });
    }, 2000);
  }

  render() {
    return (
      <>
        <Menu />
        <Form>
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
              <legend> <FontAwesomeIcon icon={faHandshake} /> Gestión de Préstamos</legend>
              <hr />
              <Link to='/addPrestamo'>
                <Button variant="primary" type="buttom" >
                  <FontAwesomeIcon icon={faPlus} /> Agregar Préstamo
                </Button>
              </Link>
              <br />
              <br />
              <MaterialTable
                title="Listado"
                columns={columnsMT}
                data={this.state.prestamos}
                actions={[
                  {
                    icon: 'visibility',   
                    tooltip: 'Mostrar Préstamo',
                    onClick: (event, rowData) => {
                      this.props.history.push(`/showPrestamo/${rowData._id}`);
                    }
                  },
                  {
                    icon: 'edit',
                    tooltip: 'Editar Préstamo',
                    onClick: (event, rowData) => {
                      this.props.history.push(`/editPrestamo/${rowData._id}`);
                    }
                  },
                  {
                    icon: 'delete',
                    tooltip: 'Eliminar Préstamo',
                    onClick: (event, rowData) => {
                      // Do save operation
                      if (window.confirm('¿Está seguro de eliminar el préstamo seleccionada?')) {
                        this.eliminar(rowData._id, rowData.foto, rowData.documentacion);
                      }
                    }
                  }
                ]}
                options={{
                  filtering: true,
                  exportButton: true,
                  exportFileName: 'Listado de Préstamos'
                }}
                localization={{
                  header: {
                    actions: 'Acciones'
                  }
                }}
              />
            </div>
          </Form.Row>
        </Form>
      </>
    )
  }
}
export default withRouter(MainPrestamos);