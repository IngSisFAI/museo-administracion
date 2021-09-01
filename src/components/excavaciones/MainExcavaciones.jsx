import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompass, faPlus } from "@fortawesome/free-solid-svg-icons";
import MaterialTable from "material-table";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Menu from "./../Menu";
import Cookies from "universal-cookie";


const cookies = new Cookies();

//Variables Globales
const urlApi = process.env.REACT_APP_API_HOST;
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
          console.log("Error:", error);
        });
    }
  }

  eliminar(id) {

    fetch(urlApi + "/excavacionId/" + id, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + cookies.get('token')
      }
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ idExploracion: data.excavacionId.idExploracion, bochones: data.excavacionId.bochonesEncontrados });
      })
      .then(resp2 => {

        //Verifico si tiene bochones asociados
        var bochones = this.state.bochones;
        var longitud = bochones.length;

        if (longitud > 0) {
          toast.error("Imposible eliminar. Existen bochones asociados a la Excavación.");
        } else {
          fetch(urlApi + "/exploracionId/" + this.state.idExploracion, {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + cookies.get('token')
            }
          })
            .then(response => response.json())
            .then(data2 => {

              //Elimino la excavacion del arreglo de excavaciones del Ejemplar Asociado a ella
              var excavacionesId = data2.exploracionId.idExcavaciones
              excavacionesId = removeItemFromArr(excavacionesId, id)
              this.setState({ arrayExcExploracion: excavacionesId });

            })
            .then(res3 => {
              var dataExc = {
                "idExcavaciones": this.state.arrayExcExploracion
              }
              fetch(urlApi + "/exploracion/" + this.state.idExploracion, {
                method: 'put',
                body: JSON.stringify(dataExc),
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + cookies.get('token')
                }
              })
                .then(function (response) {
                  if (response.ok) {
                    console.log("Se actualizo la Exploracion con exito.")
                  }
                })
                .then(function () {
                  //Elimino la Excavación ahora
                  fetch(urlApi + "/excavacion/" + id, {
                    method: "delete",
                    headers: {
                      'Authorization': 'Bearer ' + cookies.get('token')
                    }
                  })
                    .then(function (response) {
                      if (response.ok) {
                        console.log("¡Se eliminó la Excavación con Éxito!");
                      }
                    })
                    .then(function () {

                      //Elimino todos los directorios asociados a la excavacion
                      //Primero las Fotos
                      const destinoFotos = rutaExcavaciones + 'Fotos/' + id + "/";
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
                        .then(function(){
                          //Segundo los videos
                          const destinoVideos = rutaExcavaciones + 'Videos/' + id + "/";
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
                          })
                          .then(function(){
                            const destinoDenuncias = rutaExcavaciones + 'Denuncias/' + id + "/";
                            fetch(urlApi + "/deleteDirectorio", {
                              method: "get",
                              headers: {
                                "Content-Type": undefined,
                                path: destinoDenuncias,
                                'Authorization': 'Bearer ' + cookies.get('token')
                              },
                            })
                            .then(function (response) {
                              if (response.ok) {
                                console.log('Se eliminó directorio Denuncias.');
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

                        //Cartel de Exito
                        toast.success("¡Se eliminó la Excavación con Éxito!");
                        setTimeout(() => {
                                    window.location.href = "/excavaciones";
                        }, 1500);

                    })
                    .catch(function (error) {
                      toast.error("Error al eliminar. Intente nuevamente.");
                      console.log("Hubo un problema con la petición Fetch:" + error.message);
                    });

                })
                .catch(function (error) {
                  console.log('Error:', error)
                })

            })
            .catch(function (error) {
              console.log('Error:', error)
            })

        }
      })
      .catch(function (error) {
        console.log(error);
      })


  }

  eliminar2(id) {


    fetch(urlApi + "/ejemplarExca/" + id, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + cookies.get('token')
      }
    })
      .then(response => response.json())
      .then(datax => {
        var ejemplares = datax.ejemplar;
        var longitud = ejemplares.length;
        if (longitud > 0) {
          toast.error("Imposible eliminar. Existen ejemplares asociados a la Excavación.");
        }
        else {
          fetch(urlApi + "/excavacionId/" + id, {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + cookies.get('token')
            }
          })
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

                fetch(urlApi + "/exploracionId/" + this.state.idExploracion, {
                  method: 'GET',
                  headers: {
                    'Authorization': 'Bearer ' + cookies.get('token')
                  }
                })
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
                    fetch(urlApi + "/exploracion/" + this.state.idExploracion, {
                      method: 'put',
                      body: JSON.stringify(dataExc),
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + cookies.get('token')
                      }
                    })
                      .then(function (response) {
                        if (response.ok) {

                          //Elimino la Excavación ahora
                          fetch(urlApi + "/excavacion/" + id, {
                            method: "delete",
                            headers: {
                              'Authorization': 'Bearer ' + cookies.get('token')
                            }
                          })
                            .then(function (response) {
                              if (response.ok) {
                                console.log("¡Se eliminó la Excavación con Éxito!");
                              }
                            })
                            .then(function (resp) {
                              const destino = rutaExcavaciones + 'Fotos/' + id + "/";
                              fetch(urlApi + "/deleteDirectorio", {
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
