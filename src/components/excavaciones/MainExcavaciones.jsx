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

const cookies = new Cookies();

class MainExcavaciones extends React.Component {
  constructor(props) {
    super(props);
    this.state = { excavaciones: [] };
  }

  componentDidMount() {
    if (!cookies.get("username") && !cookies.get("password")) {
      window.location.href = "/";
    } else {
      fetch("http://museo.fi.uncoma.edu.ar:3006/api/excavacion")
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
                    title: "Código",
                    field: "codigo",
                  },
                  {
                    title: "Nombre",
                    field: "nombre",
                  },
                  {
                    title: "Fecha Inicio",
                    field: "fechaInicio",
                    type: "date",
                    render: (rowData) =>
                      Moment(rowData.fechaInicio)
                        .add(1, "days")
                        .format("DD/MM/YYYY"),
                  },
                  {
                    title: "Director",
                    field: "director",
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
