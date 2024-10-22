import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faIdCard, faPlus } from '@fortawesome/free-solid-svg-icons'
import MaterialTable from "material-table";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Menu from "./../Menu"
import Cookies from 'universal-cookie';

const cookies = new Cookies();


//Variables Globales
const urlApi = process.env.REACT_APP_API_HOST;
const urlArchivo = process.env.REACT_APP_URL_EJEMPLARES;
const rutaEjemplares = process.env.REACT_APP_RUTA_EJEMPLARES;


class MainEjemplares extends React.Component {

  constructor(props) {
    super(props);
    this.state = { ejemplares: [] }

  }

  componentDidMount() {
    if (!cookies.get('user') && !cookies.get('password')) {
      window.location.href = '/';
    }
    else {

      fetch(urlApi + '/ejemplares', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + cookies.get('token')
        }
      })
        .then((response) => {
         // console.log(response)
          return response.json()
        })
        .then((ejemplars) => {
          this.setState({ ejemplares: ejemplars.ejemplares })
        }).catch(function (error) {
          toast.error("Error al consultar. Intente nuevamente.");
          console.log("Hubo un problema con la petición Fetch:", error.message);
        });
    }

  }

  eliminar(id) {

    fetch(urlApi + '/piezasEjemplar/' + id, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + cookies.get('token')
      }
    })
      .then((response) => {
        return response.json()
      })
      .then(result => {
          console.log(result.piezas.length)
        if (result.piezas.length > 0) {
          toast.error("No se puede eliminar el ejemplar: Contiene piezas asociadas.")
        }
        else {
          fetch(urlApi + "/ejemplar/" + id,
            {
              method: "delete",
              headers: {
                'Authorization': 'Bearer ' + cookies.get('token')
              }
            }
          )
            .then(function (response) {
              if (response.ok) {
                console.log("¡Se eliminó el Ejemplar con Éxito!");

              }
            }).then(function (resp) {
              //Elimino todos los directorios asociados a la excavacion
              //Primero las Fotos
              const destinoFotos = rutaEjemplares + 'Fotos/' + id + "/";
              fetch(urlApi + "/deleteDirectorio", {
                method: "get",
                headers: {
                  "Content-Type": undefined,
                  path: destinoFotos,
                  'Authorization': 'Bearer ' + cookies.get('token')
                },
              })
                .then(function (response) {
                  if (response.ok) {
                    console.log('Se eliminó directorio fotos.');
                  }
                })
                .then(function () {
                  //Segundo los videos
                  const destinoVideos = rutaEjemplares + 'Videos/' + id + "/";
                  fetch(urlApi + "/deleteDirectorio", {
                    method: "get",
                    headers: {
                      "Content-Type": undefined,
                      path: destinoVideos,
                      'Authorization': 'Bearer ' + cookies.get('token')
                    },
                  })
                    .then(function (response) {
                      if (response.ok) {
                        console.log('Se eliminó directorio videos.');
                      }
                      //Cartel de Exito
                      toast.success("¡Se eliminó el Ejemplar con Éxito!");
                      setTimeout(() => {
                        window.location.href = "/ejemplares";
                      }, 1500);

                    })
                    .catch(function (error) {
                      toast.error("Error al eliminar. Intente nuevamente.");
                      console.log(
                        "Hubo un problema con la petición Fetch:" + error.message
                      );
                    });

                })
                .catch(function (error) {
                  toast.error("Error al eliminar. Intente nuevamente.");
                  console.log(
                    "Hubo un problema con la petición Fetch:" + error.message
                  );
                });

            })
            .catch(function (error) {
              toast.error("Error al eliminar. Intente nuevamente.");
              console.log(
                "Hubo un problema con la petición Fetch:" + error.message
              );
            });


        }

      })
      .catch(function (error) {
        console.log('Error:', error)
      })



  }

  
  render() {
    return (
      <>
        <Menu />
        <Form>
          <br />
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

              <legend> <FontAwesomeIcon icon={faIdCard} /> Inventario MUC </legend>
              <hr />
              <Link to='/addEjemplar'>
                <Button variant="primary" type="buttom" >
                  <FontAwesomeIcon icon={faPlus} /> Ficha de Ingreso
                </Button>
              </Link>
              <br />
              <br />


              <MaterialTable
                title="Listado"
                columns={[
                  {
                    title: 'Id.',
                    field: '_id',
                    hidden: true
                  },
                  {
                    title: 'Sigla',
                    field: 'sigla'
                  },
                  {
                    title: 'Tipo Colección',
                    field: 'tipoColeccion'
                  },
                  {
                    title: 'Especie',
                    field: 'taxonEspecie'
                  }
                ]}
                data={this.state.ejemplares}
                actions={[
                  {
                    icon: 'visibility',   
                    tooltip: 'Mostrar Ejemplar',
                    onClick: (event, rowData) => {
                      this.props.history.push(`/showEjemplar/${rowData._id}`);
                  }
                },
                  {
                    icon: 'edit',
                    tooltip: 'Editar Excavación',
                    onClick: (event, rowData) => {
                      this.props.history.push(`/editEjemplar/${rowData._id}`);

                    }

                  },
                  {
                    icon: 'delete',
                    tooltip: 'Eliminar Excavación',
                    onClick: (event, rowData) => {
                      // Do save operation
                      if (window.confirm('¿Está seguro de eliminar el Ejemplar seleccionado?')) {
                        this.eliminar(rowData._id);

                      }
                    }

                  }

                ]}
                options={{
                  filtering: true,
                  exportButton: true,
                  exportFileName: 'Listado de Excavaciones'
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

export default MainEjemplares;