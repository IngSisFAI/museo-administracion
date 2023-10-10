import React from "react";
import './Login.css'
import { Form, Button, Alert} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignInAlt} from '@fortawesome/free-solid-svg-icons'
import  Imagen from './iconoMUC.jpeg';
import axios from 'axios';
import md5 from 'md5';
import Cookies from "universal-cookie"
import moment from 'moment'

const cookies = new Cookies();

//Variables Globales
const urlApi = process.env.REACT_APP_API_HOST;

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
         user:"",
         password:"",
         show: false,
         showError:false
    }
  }

  handleUserChange = async evt => {
   await  this.setState({ user: evt.target.value });
  };

  handlePasswordChange = async evt => {
    await this.setState({ password: evt.target.value });
  };

  handleFormSubmit = async (e) => {
   e.preventDefault(); // Prevenir la recarga de la página por defecto
   await this.iniciarSesion();
 }
  iniciarSesion  = async () => {

   //   await axios.get(urlApi+'/validaUsuario/', { params:{"user": this.state.user , "password": md5(this.state.password)}})
   //         .then( response => {
   //            console.log(response.data)
   //             return response.data;
   //         })
   //         .then (response => {
   //             if(response.usuario!==null)
   //             {  
   //                   cookies.set('id', response.usuario._id, {path: "/", expires: new Date(moment().add(120, 'm').format())});
   //                   cookies.set('nombre', response.usuario.nombre, {path: "/", expires: new Date(moment().add(120, 'm').format())});
   //                   cookies.set('apellido', response.usuario.apellido, {path: "/", expires: new Date(moment().add(120, 'm').format())});
   //                   cookies.set('user', response.usuario.user, {path: "/", expires: new Date(moment().add(120, 'm').format())});
   //                   cookies.set('password', response.usuario.password, {path: "/",  expires: new Date(moment().add(120, 'm').format())});
   //                   cookies.set('permiso', response.usuario.permiso, {path: "/", expires: new Date(moment().add(120, 'm').format())});
   //                   cookies.set('token', response.token, {path: "/", expires: new Date(moment().add(120, 'm').format())});
   //                   window.location.href="/home";
   //             }
   //             else
   //             {
   //                this.setState({show: true, password:'', showError:false})
   //             }

   //         })
   //         .catch ( error => {
   //               this.setState({showError: true, show: false})
   //         })

  
   const response = await axios.get(urlApi + '/validaUsuario/', {
      
      params: { "user": this.state.user, "password": md5(this.state.password) },
      timeout: 30000
    });
    
    if (response.data.usuario !== null) {
       cookies.set('id', response.data.usuario._id, {path: "/", expires: new Date(moment().add(120, 'm').format())});
                         cookies.set('nombre', response.data.usuario.nombre, {path: "/", expires: new Date(moment().add(120, 'm').format())});
                         cookies.set('apellido', response.data.usuario.apellido, {path: "/", expires: new Date(moment().add(120, 'm').format())});
                         cookies.set('user', response.data.usuario.user, {path: "/", expires: new Date(moment().add(120, 'm').format())});
                         cookies.set('password', response.data.usuario.password, {path: "/",  expires: new Date(moment().add(120, 'm').format())});
                         cookies.set('permiso', response.data.usuario.permiso, {path: "/", expires: new Date(moment().add(120, 'm').format())});
                         cookies.set('token', response.data.token, {path: "/", expires: new Date(moment().add(120, 'm').format())});
                         window.location.href="/home";
    } else {
      this.setState({ show: true, password: '', showError: false });
    }
  }


 render()
 {
      return (
          <>
             <div className="wrapper fadeInDown">
               <div id="formContent">
               <div className="fadeIn first">
                 <br/>
                 <p>Sistema de Administración</p>
                 <p>Museo de Ciencias Naturales - UNComa.</p>
                 <img src={Imagen} id="icono" alt="Museo Icono" />
                 <br/>
                 <br/>
              </div>
                  <Form onSubmit={this.handleFormSubmit}>
                    <Form.Control type="text" id="user" name="user" placeholder="Usuario" className="inputCss form-control fadeIn second" onChange={this.handleUserChange} value={this.state.user} />
                    <Form.Control type="password" id="password" className="inputCss form-control fadeIn third" name="password" placeholder="Contraseña" onChange={this.handlePasswordChange} value={this.state.password} />
                    <br/>
                    <Button className="btn" type="submit" id="guardar"
                                           >  <FontAwesomeIcon icon={faSignInAlt}/> Iniciar Sesión </Button>
                  </Form> 
                  <br/>
                  
                  <div id="formFooter">
                      <div className="underlineHover">
                            <Alert variant="danger" show={this.state.show}>
                               ¡Usuario o Contraseña incorrecto!
                            </Alert>
                            <Alert variant="danger" show={this.state.showError}>
                               Error de conexión, intente nuevamente.
                            </Alert>
                      </div>
                  </div>
               </div>
                
             </div>
          </>
      )

 }   

}
export default Login; 