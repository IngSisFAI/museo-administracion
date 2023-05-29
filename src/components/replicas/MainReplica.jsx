import React from 'react';
import MaterialTable from "material-table";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faClone } from '@fortawesome/free-solid-svg-icons'
import { withRouter, Link } from 'react-router-dom';
import Menu from "./../Menu"
import Cookies from 'universal-cookie';
import $ from 'jquery';

const cookies = new Cookies();

//Variables Globales
const urlApi = process.env.REACT_APP_API_HOST;
const rutaImg = process.env.REACT_APP_RUTA_IMG_REPLICA;
const rutaDoc = process.env.REACT_APP_RUTA_DOC_REPLICA;

const columnsMT = [
  {
    title: 'Id.',
    field: '_id',
    hidden: true
  },
  {
    title: 'Número',
    field: 'nroActa'
    //hay que ponerle el type
  },
  {
    title: 'Descripción',
    field: 'descripcion'
  },
  {
    title: 'Fecha',
    field: 'fecha',
    type: "date"
  }
];

class MainReplica extends React.Component {
  constructor(props) {
    super(props);
    this.state = { replicas: [] }
  }
  componentDidMount() {
    if (!cookies.get('user') && !cookies.get('password')) {
      window.location.href = '/';
    }
    else {
      fetch(urlApi + '/replicas', {
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
            if (typeof result.replicas !== 'undefined') {

              this.setState({
                replicas: result.replicas
              });
            } else {
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
            console.log("Error al consultar replicas:", error)
          });
    }
  }

  eliminar(id, foto, doc) {
    var resultReplicas = [];
    const img = rutaImg + foto;
    const docReplica = rutaDoc + doc;
    $(".loader").removeAttr("style");
    fetch(urlApi + '/replica/' + id, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + cookies.get('token')
      }
    })
      .then(function (response) {
        if (response.ok) {
          console.log("¡Se eliminó a la replica con Éxito!");
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
                'path': docReplica,
                'Authorization': 'Bearer ' + cookies.get('token')
              }
            }).then(response => {
              return response.json();
            })
              .then(function (response) {
                toast.success("¡Se eliminó la Replica con Éxito!");
              }).catch(error => {
                $(".loader").fadeOut("slow");
                console.log("Error al eliminar archivo:", error)
              });
          })
          .then(function () {
            fetch(urlApi + '/replicas', {
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
                  if (typeof result.replicas !== 'undefined') {
                    resultReplicas = result.replicas
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
                  console.log("Error al consultar replicas:", error)
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
      this.setState({ replicas: resultReplicas });
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
              <legend> <FontAwesomeIcon icon={faClone} /> Gestión de Replicas</legend>
              <hr />
              <Link to='/addReplica'>
                <Button variant="primary" type="buttom" >
                  <FontAwesomeIcon icon={faPlus} /> Agregar Replica
                </Button>
              </Link>
              <br />
              <br />
              <MaterialTable
                title="Listado"
                columns={columnsMT}
                data={this.state.replicas}
                actions={[
                  {
                    icon: 'visibility' ,
                    color: "black" ,          
                    tooltip: 'Mostrar Replica',
                    onClick: (event, rowData) => {
                      this.props.history.push(`/showReplica/${rowData._id}`);
                    }
                  },
                  {
                    icon: 'edit',
                    tooltip: 'Editar Replica',
                    onClick: (event, rowData) => {
                      this.props.history.push(`/editReplica/${rowData._id}`);
                    }
                  },
                  {
                    icon: 'delete',
                    tooltip: 'Eliminar Replica',
                    onClick: (event, rowData) => {
                      // Do save operation
                      if (window.confirm('¿Está seguro de eliminar la replica seleccionada?')) {
                        this.eliminar(rowData._id, rowData.foto, rowData.documentacion);
                      }
                    }
                  }
                ]}
                options={{
                  filtering: true,
                  exportButton: true,
                  exportFileName: 'Listado de Replicas'
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
export default withRouter(MainReplica);
