import React from 'react';
import MaterialTable from "material-table";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faPlus } from '@fortawesome/free-solid-svg-icons'
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
    title: 'Denunciante',
    field: 'denunciante'
  },
  {
    title: 'Paleontologo',
    field: 'paleontologo'
  },
  {
      title: 'Fecha Ingreso',
      field: 'fechaIngreso'
  }
];



class MainDenuncias extends React.Component {

  constructor(props) {
    super(props);
    this.state = { denuncias: [] }

  }

  componentDidMount() {

    if (!cookies.get('user') && !cookies.get('password')) {
      window.location.href = '/';
    }
    else {

      fetch(urlApi + '/denuncias', {
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
            if (typeof result.denuncias !== 'undefined') {

              this.setState({
                denuncias: result.denuncias
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
            console.log("Error al consultar Denuncias:", error)
          });
    }
  }

  eliminar(id,idArea){
    var resultDenuncias = [];
    fetch(urlApi + '/denuncia/' + id, {
              method: 'DELETE',
              headers: {
                'Authorization': 'Bearer ' + cookies.get('token')
              }
            })
              .then(function (response) { //Elimino la Denuncia
                if (response.ok) {
                  console.log("¡Se eliminó la Denuncia con Éxito!");
                  toast.success("¡Se eliminó la Denuncia con Éxito!");
                }
              })
              .then(function (res) {
                  if(idArea !=""){
                        fetch(urlApi + '/area/'+idArea, { //Elimino el area asociada
                          method: 'DELETE',
                          headers: {
                            'Content-Type': undefined,
                            'Authorization': 'Bearer ' + cookies.get('token')
                          }
                        }).then(response => {
                            console.log(response);
                            if(response.ok){
                                console.log('Se elimino el Area con exito.');
                            }
                        })}
                }).then(function () {
                    fetch(urlApi + '/denuncias', { //Vuelvo a cargar la lista de denuncias
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
                            $(".loader").fadeOut("slow");
                            if (typeof result.denuncias !== 'undefined') {
                                resultDenuncias = result.denuncias
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
                            console.log("Error al consultar Denuncias:", error)
                          });
                })

                setTimeout(() => {
                    $(".loader").fadeOut("slow");
                    this.setState({ denuncias: resultDenuncias });
                  }, 2000);
}

//   eliminar(id, foto, cv) {

//     var resultPersonas = [];

//     const img = rutaImg + foto;
//     const curriculum = rutaDoc + cv;
//     $(".loader").removeAttr("style");

//     fetch(urlApi + '/persona/' + id, {
//       method: 'DELETE',
//       headers: {
//         'Authorization': 'Bearer ' + cookies.get('token')
//       }
//     })
//       .then(function (response) {
//         if (response.ok) {
//           console.log("¡Se eliminó a la persona con Éxito!");

//         }
//       })
//       .then(function (res) {
//         fetch(urlApi + '/deleteArchivo', {
//           method: 'get',
//           headers: {
//             'Content-Type': undefined,
//             'path': img,
//             'Authorization': 'Bearer ' + cookies.get('token')
//           }
//         }).then(response => {
//           return response.json();
//         })
//           .then(function (response) {

//             console.log('Se elimino el archivo con exito.');

//           })
//           .then(function () {


//             fetch(urlApi + '/deleteArchivo', {
//               method: 'get',
//               headers: {
//                 'Content-Type': undefined,
//                 'path': curriculum,
//                 'Authorization': 'Bearer ' + cookies.get('token')
//               }
//             }).then(response => {
//               return response.json();
//             })
//               .then(function (response) {

//                 toast.success("¡Se eliminó la Persona con Éxito!");
//               }).catch(error => {
//                 $(".loader").fadeOut("slow");
//                 console.log("Error al eliminar archivo:", error)
//               });
//           })
//           .then(function () {

//             fetch(urlApi + '/personas', {
//               method: 'GET',
//               headers: {
//                 'Authorization': 'Bearer ' + cookies.get('token')
//               }
//             })
//               .then(response => {
//                 return response.json();
//               })
//               .then(
//                 function (result) {
//                   $(".loader").fadeOut("slow");
//                   if (typeof result.personas !== 'undefined') {

//                     resultPersonas = result.personas
//                     //   this.setState({ personas: result.personas });

//                   } else {
//                     $(".loader").fadeOut("slow");
//                     cookies.remove("id", { path: "/" });
//                     cookies.remove("nombre", { path: "/" });
//                     cookies.remove("apellido", { path: "/" });
//                     cookies.remove("user", { path: "/" });
//                     cookies.remove("password", { path: "/" });
//                     cookies.remove("permiso", { path: "/" });
//                     cookies.remove("token", { path: "/" });
//                     window.location.href = "/";
//                   }


//                 }).catch(error => {
//                   $(".loader").fadeOut("slow");
//                   console.log("Error al consultar personas:", error)
//                 });

//           }


//           )
//           .catch(function (error) {
//             $(".loader").fadeOut("slow");
//             toast.error("Error al eliminar. Intente nuevamente.");
//             console.log('Hubo un problema con la petición Fetch:' + error.message);
//           });

//       })
//       .catch(function (error) {
//         $(".loader").fadeOut("slow");
//         toast.error("Error al eliminar. Intente nuevamente (1).");
//         console.log('Hubo un problema con la petición Fetch:' + error.message);
//       });

//     setTimeout(() => {
//       $(".loader").fadeOut("slow");
//       this.setState({ personas: resultPersonas });
//     }, 2000);


//   }

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

              <legend> <FontAwesomeIcon icon={faUsers} /> Gestión de Denuncias</legend>
              <hr />
              <Link to='/addDenuncia'>
                <Button variant="primary" type="buttom" >
                  <FontAwesomeIcon icon={faPlus} /> Agregar
                </Button>
              </Link>
              <br />
              <br />


              <MaterialTable
                title="Listado"

                columns={columnsMT}
                data={this.state.denuncias}
                actions={[
                  {
                    icon: 'visibility',   
                    tooltip: 'Mostrar Denuncia',
                    onClick: (event, rowData) => {
                      this.props.history.push(`/showDenuncia/${rowData._id}`);
                  }
                },
                  {
                    icon: 'edit',
                    tooltip: 'Editar Denuncias',
                    onClick: (event, rowData) => {
                      this.props.history.push(`/editDenuncia/${rowData._id}`);;

                    }
                  },
                  {
                    icon: 'delete',
                    tooltip: 'Eliminar Denuncia',
                    onClick: (event, rowData) => {
                      // Do save operation
                      if (window.confirm('¿Está seguro de eliminar la Denuncia seleccionada?')) {
                          console.log(rowData);
                        this.eliminar(rowData._id, rowData.idArea);
                      }
                    }

                  }

                ]}
                options={{
                  filtering: true,
                  exportButton: true,
                  exportFileName: 'Listado de Denuncias'
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

export default withRouter(MainDenuncias);
