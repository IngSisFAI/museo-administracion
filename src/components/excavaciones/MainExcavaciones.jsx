import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompass, faPlus } from "@fortawesome/free-solid-svg-icons";
import MaterialTable from "material-table";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Moment from "moment";
import Menu from "./../Menu";
import Cookies from "universal-cookie";
import axios from 'axios';

const cookies = new Cookies();

//Variables Globales
const urlApi = process.env.REACT_APP_API_HOST;
const urlArchivo = process.env.REACT_APP_URL_EXCAVACIONES;
const rutaExcavaciones = process.env.REACT_APP_RUTA_EXCAVACIONES;

var removeItemFromArr = (arr, item) => {
  return arr.filter(e => e !== item);
};

class MainExcavaciones extends React.Component {
  constructor(props) {
    super(props);
    this.state = { excavaciones: [], idExploracion: "", arrayExcExploracion: [], bochones: [] };
  }

  componentDidMount() {
    if (!cookies.get("user") && !cookies.get("password")) {
      window.location.href = "/";
    } else {
      fetch(urlApi + "/excavacion", {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + cookies.get('token')
        }
      })
        .then((res) => res.json())
        .then((result) => {
          this.setState({
            excavaciones: result.excavaciones,
          });
        })
        .catch((error) => {
          console.log("Error");
        });
    }
  }

  eliminar(id) {


    fetch("http://museo.fi.uncoma.edu.ar:3006/api/ejemplarExca/" + id)
      .then(response => response.json())
      .then(datax => {
        var ejemplares = datax.ejemplar;
        var longitud = ejemplares.length;
        if (longitud > 0) {
          toast.error("Imposible eliminar. Existen ejemplares asociados a la Excavación.");
        }
        else {
          fetch("http://museo.fi.uncoma.edu.ar:3006/api/excavacionId/" + id)
            .then(response => response.json())
            .then(data => {
              this.setState({ idExploracion: data.excavacionId.idExploracion, bochones: data.excavacionId.bochonesEncontrados });
            })
            .then(resp2 => {

              var bochones = this.state.bochones;
              var longitud = bochones.length;

              if (longitud > 0) {
                toast.error("Imposible eliminar. Existen bochones asociados a la Excavación.");
              }
              else {

                fetch("http://museo.fi.uncoma.edu.ar:3006/api/exploracionId/" + this.state.idExploracion)
                  .then(response => response.json())
                  .then(data2 => {

                    var excavacionesId = data2.exploracionId.idExcavaciones
                    excavacionesId = removeItemFromArr(excavacionesId, id)
                    this.setState({ arrayExcExploracion: excavacionesId });
                  })
                  .then(res3 => {
                    var dataExc = {
                      "idExcavaciones": this.state.arrayExcExploracion
                    }
                    fetch("http://museo.fi.uncoma.edu.ar:3006/api/exploracion/" + this.state.idExploracion, {
                      method: 'put',
                      body: JSON.stringify(dataExc),
                      headers: {
                        'Content-Type': 'application/json'
                      }
                    })
                      .then(function (response) {
                        if (response.ok) {

                          //Elimino la Excavación ahora
                          fetch("http://museo.fi.uncoma.edu.ar:3006/api/excavacion/" + id, {
                            method: "delete",
                          })
                            .then(function (response) {
                              if (response.ok) {
                                console.log("¡Se eliminó la Excavación con Éxito!");
                              }
                            })
                            .then(function (resp) {
                              const destino =
                                "/var/www/museo-administracion/html/images/excavaciones/" + id + "/";
                              fetch("http://museo.fi.uncoma.edu.ar:3006/api/deleteDirectorio", {
                                method: "get",
                                headers: {
                                  "Content-Type": undefined,
                                  path: destino,
                                },
                              })
                                .then(function (response) {
                                  if (response.ok) {
                                    toast.success("¡Se eliminó la Excavación con Éxito!");
                                    setTimeout(() => {
                                      window.location.href = "/excavaciones";
                                    }, 1500);
                                  }
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
                              console.log("Hubo un problema con la petición Fetch:" + error.message);
                            });

                        }

                      })
                      .catch(function (error) {
                        toast.error("Error al guardar. Intente nuevamente.");
                        console.log('Hubo un problema con la petición Fetch:', error.message);
                      });

                  })
                  .catch(function (error) {
                    console.log(error);
                  })



              }


            })
            .catch(function (error) {
              console.log(error);
            })




        }
      })
      .catch(function (error) {
        console.log(error);
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
              <legend>
                {" "}
                <FontAwesomeIcon icon={faCompass} /> Gestión de Excavaciones
              </legend>
              <hr />
              <Link to="/addExcavacion">
                <Button variant="primary" type="buttom">
                  <FontAwesomeIcon icon={faPlus} /> Agregar
                </Button>
              </Link>
              <br />
              <br />

              <MaterialTable
                title="Listado"
                columns={[
                  {
                    title: "Id.",
                    field: "_id",
                    hidden: true,
                  },
                  {
                    title: "Nombre Área",
                    field: "nombreArea",
                  },
                  {
                    title: " Código Campo",
                    field: "codigoCampo",
                  },
                ]}
                data={this.state.excavaciones}
                actions={[
                  {
                    icon: "edit",
                    tooltip: "Editar Excavación",
                    onClick: (event, rowData) => {
                      this.props.history.push(`/editExcavacion/${rowData._id}`);
                    },
                  },
                  {
                    icon: "delete",
                    tooltip: "Eliminar Excavación",
                    onClick: (event, rowData) => {
                      // Do save operation
                      if (
                        window.confirm(
                          "¿Está seguro de eliminar la Exploración seleccionada?"
                        )
                      ) {
                        this.eliminar(rowData._id);
                      }
                    },
                  },
                  {
                    icon: "view_column",
                    tooltip: "Subir Archivos",
                    onClick: (event, rowData) => {
                      this.props.history.push(`/multimedia/${rowData._id}`);
                    },
                  },
                ]}
                options={{
                  filtering: true,
                  exportButton: true,
                  exportFileName: "Listado de Excavaciones",
                }}
                localization={{
                  header: {
                    actions: "Acciones",
                  },
                }}
              />
            </div>
          </Form.Row>
        </Form>
      </>
    );
  }
}
export default MainExcavaciones;
