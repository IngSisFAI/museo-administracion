import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarked, faPlus } from "@fortawesome/free-solid-svg-icons";
import MaterialTable from "material-table";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Menu from "./../Menu";
import Cookies from "universal-cookie";
import $ from 'jquery';
import CustomDatePicker from "./../customDatePicker";

const cookies = new Cookies();

//Variables Globales
const urlApi = process.env.REACT_APP_API_HOST;
const rutaExploraciones = process.env.REACT_APP_RUTA_EXPLORACIONES;


class MainExploraciones extends React.Component {
  constructor(props) {
    super(props);
    this.state = { exploraciones: [] };
  }

  componentDidMount() {
    if (!cookies.get("username") && !cookies.get("password")) {
      window.location.href = "/";
    } else {
      fetch(urlApi + "/exploracion", {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + cookies.get('token')
        }
      })
        .then((res) => res.json())
        .then((result) => {
          if (typeof result.exploraciones !== 'undefined') {
            this.setState({
              exploraciones: result.exploraciones,
            });
          }
          else {
            cookies.remove("id", { path: "/" });
            cookies.remove("nombre", { path: "/" });
            cookies.remove("apellido", { path: "/" });
            cookies.remove("user", { path: "/" });
            cookies.remove("password", { path: "/" });
            cookies.remove("permiso", { path: "/" });
            cookies.remove("token", { path: "/" });
            window.location.href = "/";
          }
        })
        .catch((error) => {
          console.log("Error");
        });
    }
  }

  eliminar(id) {

    fetch(urlApi + "/exploracionId/" + id, {
      method: 'get',
      headers: {
        'Authorization': 'Bearer ' + cookies.get('token')
      }
    })
      .then(response => response.json())
      .then(data => {
        var longitud = (data.exploracionId.idExcavaciones).length
        //verifico primero si tiene excavaciones asociadas, si tiene imposible eliminar.
        if (longitud == 0) {
          $(".loader").removeAttr("style");
          fetch(urlApi + '/exploracion/' + id, {
            method: 'DELETE',
            headers: {
              'Authorization': 'Bearer ' + cookies.get('token')
            }
          })
            .then(function (response) {
              if (response.ok) {
                console.log("¡Se eliminó a la persona con Éxito!");

              }
            })

            .then(function () {
              var ruta = rutaExploraciones + id + '/';
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
                  $(".loader").fadeOut("slow");
                  toast.success("¡Se eliminó la Exploración con Éxito!");
                  setTimeout(() => {
                    window.location.href = "/exploraciones";
                  }, 1500);
                }).catch(error => {
                  console.log("Error al eliminar archivo:", error)
                });

            })
            .catch(function (error) {
              $(".loader").fadeOut("slow");
              toast.error("Error al eliminar. Intente nuevamente.");
              console.log('Hubo un problema con la petición Fetch:' + error.message);
            });

        }
        else {
          toast.error("Existen Excavaciones asociadas a la Exploración.");
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
              <legend>
                {" "}
                <FontAwesomeIcon icon={faMapMarked} /> Gestión de Exploraciones
              </legend>
              <hr />
              <Link to="/addExploracion">
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
                    title: "Nombre del Área",
                    field: "nombreArea",
                  },
                  {
                    title: "Fecha Inicio",
                    field: "fechaInicio",
                    type: "date",
                    dateSetting: { locale: "en-GB" },
                    filterComponent: (props) => <CustomDatePicker {...props} />,
                  },
                ]}
                data={this.state.exploraciones}
                actions={[
                  {
                    icon: 'visibility',   
                    tooltip: 'Mostrar Exploración',
                    onClick: (event, rowData) => {
                      this.props.history.push(`/showExploracion/${rowData._id}`);
                  }
                },
                  {
                    icon: "edit",
                    tooltip: "Editar Exploración",
                    onClick: (event, rowData) => {
                      this.props.history.push(
                        `/editExploracion/${rowData._id}`
                      );
                    },
                  },
                  {
                    icon: "delete",
                    tooltip: "Eliminar Exploración",
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
                  exportFileName: "Listado de Exploraciones",
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

export default MainExploraciones;
