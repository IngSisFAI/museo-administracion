import React from "react";
import { Form, Button, Alert } from 'react-bootstrap';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faReply, faUserEdit } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import axios from "axios";
import Menu from "./../Menu"
import Cookies from 'universal-cookie';
import md5 from 'md5';


const cookies = new Cookies();

//Variables Globales
const urlApi = process.env.REACT_APP_API_HOST;

class EditUsuario extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nombre: "",
      apellido: "",
      user: "",
      password: "",
      confPassword: "",
      permiso: "",
      validated: false
    };

  }

  componentDidMount() {

    if (!cookies.get('user') && !cookies.get('password')) {
      window.location.href = '/';
    }
    else {
      axios.get(urlApi + '/getUsuario', {
        params: {
          "id": this.props.match.params.id
        },
        headers: {
          'Authorization': 'Bearer ' + cookies.get('token')
        }
      }

      )
        .then(res => {
          return res.data
        })
        .then(
          (result) => {
          //  console.log('ID: ', result.usuarioId._id)
            this.setState({
              nombre: result.usuarioId.nombre,
              apellido: result.usuarioId.apellido,
              user: result.usuarioId.user,
              permiso: result.usuarioId.permiso
            })

          }).catch(error => {
            console.log("Error")
          });

    }
  }

  handleNombreChange = evt => {
    this.setState({ nombre: evt.target.value });
  };

  handleApellidoChange = evt => {
    this.setState({ apellido: evt.target.value });
  };

  handleUserChange = evt => {
    this.setState({ user: evt.target.value });
  };

  handlePasswordChange = evt => {
    this.setState({ password: evt.target.value });
  };

  handleConfPasswordChange = evt => {
    this.setState({ confPassword: evt.target.value });
  };

  handlePermisoChange = (selectedPermiso) => {
    this.setState({ permiso: selectedPermiso.target.value });
  }

  validarPassword = () => {
    if (this.state.password !== this.state.confPassword) {
      this.setState({ confPassword: '' });
      toast.error('Las contraseñas no coinciden.');

    }
  }

  handleSubmit = (event) => {

    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    else {

      if ((this.state.password !== "" && this.state.confPassword === "") || (this.state.password !== "" && this.state.confPassword === "")) {
        toast.error('Si engresa contraseña, ingrese su confirmación.');
      }
      else {
        if (this.state.password !== "" && this.state.confPassword !== "") {
          var data = {
            "id": this.props.match.params.id,
            "nombre": this.state.nombre,
            "apellido": this.state.apellido,
            "user": this.state.user,
            "password": md5(this.state.password),
            "permiso": this.state.permiso
          }


        }
        else {
          var data = {
            "id": this.props.match.params.id,
            "nombre": this.state.nombre,
            "apellido": this.state.apellido,
            "user": this.state.user,
            "permiso": this.state.permiso
          }


        }

        fetch(urlApi+'/editUsuario', {
          method: 'put',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookies.get('token')
          }
        })
          .then(function (response) {
            if (response.ok) {
              return response.json();

            }
          }).then(function (data) {
      
              toast.success("¡Se actualizó la información con Éxito!");
              setTimeout(() => {
                window.location.replace('/usuarios');
              }, 1500);
            
          }).catch(error => {
            toast.error('Ha ocurrido un problema, Por favor, verifique nuevamente');
            console.log(error);
          })

      }



    }
    this.setState({ validated: true });

  }

  render() {
    const { validated } = this.state;
    const { permiso } = this.state;


    return (<>


      <Menu />
      <div className="row">
        <div className="col-md-12">
          <div id="contenido" align="left" className="container">
            <br />
            <h3 className="page-header" align="left">
              <FontAwesomeIcon icon={faUserEdit} /> Editar Usuario
            </h3>
            <hr />

            <Form noValidate validated={validated} onSubmit={this.handleSubmit}>
              <ToastContainer
                position="top-right"
                autoClose={5000}
                transition={Slide}
                hideProgressBar={true}
                newestOnTop={true}
                closeOnClick
                pauseOnHover
              />

              <Form.Row >
                <Form.Group className="col-sm-6" controlId="apellido">
                  <Form.Label>Apellido:</Form.Label>
                  <Form.Control type="text" placeholder="Ingrese Apellido" required onChange={this.handleApellidoChange} value={this.state.apellido} />
                  <Form.Control.Feedback type="invalid">
                    Por favor, ingrese Apellido.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="col-sm-6" controlId="nombre">
                  <Form.Label>Nombres:</Form.Label>
                  <Form.Control type="text" placeholder="Ingrese Nombres" required onChange={this.handleNombreChange} value={this.state.nombre} />
                  <Form.Control.Feedback type="invalid">
                    Por favor, ingrese Nombres.
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row>

              <Form.Row >
                <Form.Group className="col-sm-4" controlId="usuario">
                  <Form.Label>Usuario:</Form.Label>
                  <Form.Control type="text" placeholder="Usuario" required onChange={this.handleUserChange} value={this.state.user} disabled />
                  <Form.Control.Feedback type="invalid">
                    Por favor, ingrese Usuario.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="col-sm-4" controlId="password">
                  <Form.Label>Contraseña (*):</Form.Label>
                  <Form.Control type="password" placeholder="Contraseña" onChange={this.handlePasswordChange} value={this.state.password} />

                </Form.Group>

                <Form.Group className="col-sm-4" controlId="confPass">
                  <Form.Label>Confirmar Contraseña (*):</Form.Label>
                  <Form.Control type="password" placeholder="Confirmar Contraseña" onChange={this.handleConfPasswordChange} value={this.state.confPassword} onBlur={() => this.validarPassword()} />

                </Form.Group>



              </Form.Row>

              <Form.Row>
                <Form.Group className="col-sm-4" controlId="permiso">
                  <Form.Label>Permiso:</Form.Label>
                  <Form.Control as="select" value={permiso} onChange={this.handlePermisoChange} >
                    <option value="1">Administrador</option>
                    <option value="2">Usuario Museo</option>
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    Por favor, ingrese Confirmacion.
                  </Form.Control.Feedback>
                </Form.Group>

              </Form.Row>
              <Form.Row>
                <Alert variant="info">

                  <p>
                    (*) Ingrese contraseña y confirmación solo si desea cambiarsela al usuario.
                  </p>
                </Alert>
              </Form.Row>


              <hr />

              <Form.Row>
                <Form.Group className="mx-sm-3 mb-2">
                  <Button variant="primary" type="submit" id="guardar">
                    <FontAwesomeIcon icon={faSave} /> Guardar
                  </Button>
                  &nbsp;&nbsp;
                  <Link to='/usuarios'>
                    <Button variant="secondary" type="button" id="volver">
                      <FontAwesomeIcon icon={faReply} /> Cancelar
                    </Button>
                  </Link>
                </Form.Group>
              </Form.Row>


            </Form>


          </div>
        </div>
      </div>

    </>)
  }

}
export default EditUsuario;