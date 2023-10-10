import React from 'react';
import MaterialTable from "material-table";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiagnoses, faPlus } from '@fortawesome/free-solid-svg-icons'
import { withRouter, Link } from 'react-router-dom';
import Menu from "./../Menu"
import Cookies from 'universal-cookie';
import $ from 'jquery';

const cookies = new Cookies();

//Variables Globales
const urlApi = process.env.REACT_APP_API_HOST
const rutaImg = process.env.REACT_APP_RUTA_IMG_PERSONA;
const rutaDoc = process.env.REACT_APP_RUTA_DOC_PERSONA;

const columnsMT = [
  {
    title: 'Id.',
    field: '_id',
    hidden: true
  },
  {
    title: 'Número',
    field: 'nroActa'
  },
  {
    title: 'Descripción',
    field: 'descripción'
  },
  {
    title: 'Fecha',
    field: 'fecha',
    type: "date"
  },
  {
    title: 'Ubicación',
    field: 'ubicacion'
  }
];

class MainExhibicion extends React.Component {
  constructor(props) {
    super(props);
    this.state = { personas: [] }
  }
  componentDidMount() {
    if (!cookies.get('user') && !cookies.get('password')) {
      window.location.href = '/';
    }
    else {
      fetch(urlApi + '/exhibiciones', {
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
            if (typeof result.exhibiciones !== 'undefined') {
              this.setState({
                exhibiciones: result.exhibiciones
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
            console.log("Error al consultar exhibiciones:", error)
          });
    }
  }

  eliminar(id, foto, doc) {
    var resultExhibiciones = [];
    const img = rutaImg + foto;
    const curriculum = rutaDoc + doc;
    $(".loader").removeAttr("style");
    fetch(urlApi + '/exhibicion/' + id, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + cookies.get('token')
      }
    })
      .then(function (response) {
        if (response.ok) {
          console.log("¡Se eliminó a la exhibición con Éxito!");
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
                'path': curriculum,
                'Authorization': 'Bearer ' + cookies.get('token')
              }
            }).then(response => {
              return response.json();
            })
              .then(function (response) {
                toast.success("¡Se eliminó la Persona con Éxito!");
              }).catch(error => {
                $(".loader").fadeOut("slow");
                console.log("Error al eliminar archivo:", error)
              });
          })
          .then(function () {
            fetch(urlApi + '/exhibicion', {
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
                  if (typeof result.exhibicion !== 'undefined') {
                    resultExhibiciones = result.exhibiciones
                    //   this.setState({ personas: result.personas });
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
          }
          )
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
      this.setState({ exhibiciones: resultExhibiciones });
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

              <legend> <FontAwesomeIcon icon={faDiagnoses} /> Gestión de Exhibiciones</legend>
              <hr />
              <Link to='/addExhibicion'>
                <Button variant="primary" type="buttom" >
                  <FontAwesomeIcon icon={faPlus} /> Agregar Exhibición
                </Button>
              </Link>
              <br />
              <br />
              <MaterialTable
                title="Listado"
                columns={columnsMT}
                data={this.state.exhibiciones}
                actions={[
                  {
                    icon: 'visibility',   
                    tooltip: 'Mostrar Exhibición',
                    onClick: (event, rowData) => {
                      this.props.history.push(`/showExhibicion/${rowData._id}`);
                    }
                  },
                  {
                    icon: 'edit',
                    tooltip: 'Editar Exhibición',
                    onClick: (event, rowData) => {
                      this.props.history.push(`/editExhibicion/${rowData._id}`);;
                    }
                  },
                  {
                    icon: 'delete',
                    tooltip: 'Eliminar Exhibición',
                    onClick: (event, rowData) => {
                      // Do save operation
                      if (window.confirm('¿Está seguro de eliminar la Exhibición seleccionada?')) {
                        this.eliminar(rowData._id, rowData.foto, rowData.documentacion);
                      }
                    }
                  }
                ]}
                options={{
                  filtering: true,
                  exportButton: true,
                  exportFileName: 'Listado de Exhibiciones'
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
export default withRouter(MainExhibicion);
