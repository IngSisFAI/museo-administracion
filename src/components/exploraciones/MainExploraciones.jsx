import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarked, faPlus } from "@fortawesome/free-solid-svg-icons";
import MaterialTable from "material-table";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Moment from "moment";
import Menu from "./../Menu";
import Cookies from "universal-cookie";

const cookies = new Cookies();

//Variables Globales
const urlApi = process.env.REACT_APP_API_HOST;


class MainExploraciones extends React.Component {
  constructor(props) {
    super(props);
    this.state = { exploraciones: []};
  }

  componentDidMount() {
    if (!cookies.get("username") && !cookies.get("password")) {
      window.location.href = "/";
    } else {
      fetch(urlApi+"/exploracion", {
        method: 'GET', 
        headers: {
          'Authorization': 'Bearer '+cookies.get('token')
        }})
        .then((res) => res.json())
        .then((result) => {
          this.setState({
            exploraciones: result.exploraciones,
          });
        })
        .catch((error) => {
          console.log("Error");
        });
    }
  }

  eliminar(id) { //Falta que elimine el dircetorio

    fetch(urlApi+"/exploracionId/"+id)
      .then(response => response.json())
      .then(data => {
            var longitud=(data.exploracionId.idExcavaciones).length
            if(longitud==0){
              //se puede eliminar la exploración
                fetch(urlApi+"/exploracion/" + id, {
                  method: "delete",
                })
                  .then(function (response) {
                    if (response.ok) {
                      toast.success("¡Se eliminó la Exploración con Éxito!");
                      setTimeout(() => {
                        window.location.href = "/exploraciones";
                      }, 1500);
                    }
                  })
                  .catch(function (error) {
                    toast.error("Error al eliminar. Intente nuevamente.");
                    console.log("Hubo un problema con la petición Fetch:" + error.message);
                  });
            }
            else{
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
                    render: (rowData) =>
                      Moment(rowData.fechaInicio).add(1, "days").format("DD/MM/YYYY"),
                  },
                ]}
                data={this.state.exploraciones}
                actions={[
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
