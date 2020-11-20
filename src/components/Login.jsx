import { AssignmentReturnRounded, DesktopWindows } from "@material-ui/icons";
import React from "react";
import './Login.css'
import { Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignInAlt} from '@fortawesome/free-solid-svg-icons'
import  Imagen from './LOGOUNC.png';
import axios from 'axios';
import md5 from 'md5';
import Cookies from "universal-cookie"

const cookies = new Cookies();

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
         user:'',
         password:''
    }
  }

  handleUserChange = async evt => {
   await  this.setState({ user: evt.target.value });
  };

  handlePasswordChange = async evt => {
    await this.setState({ password: evt.target.value });
  };

  iniciarSesion  = async () => {


     await axios.get('http://museo.fi.uncoma.edu.ar:3006/api/validaUsuario/', { params:{"user": this.state.user, "password": md5(this.state.password)}})
           .then( response => {
               return response.data;
           })
           .then (response => {
               if(response.usuarios.length>0)
               {  
                     cookies.set('id', response.usuarios[0]._id, {path: "/"});
                     cookies.set('nombre', response.usuarios[0].nombre, {path: "/"});
                     cookies.set('apellido', response.usuarios[0].apellido, {path: "/"});
                     cookies.set('user', response.usuarios[0].user, {path: "/"});
                     cookies.set('password', response.usuarios[0].password, {path: "/"});
                     cookies.set('permiso', response.usuarios[0].permiso, {path: "/"});
                     window.location.href="/home";
               }
               else
               {
                 
                  document.getElementById('divAlerta').removeAttribute('style');
                  document.getElementById('password').value='';
               }

           })
           .catch ( error => {
                 console.log(error);
           })
   
    
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
                 <p>Museo de Geología y Paleontología - UNComa.</p>
                 <img src={Imagen} id="icono" alt="Museo Icono" />
                 <br/>
                 <br/>
              </div>
                  <Form >
                    <Form.Control type="text" id="user" name="user" placeholder="Usuario" className="inputCss form-control fadeIn second" onChange={this.handleUserChange} value={this.state.user} />
                    <Form.Control type="password" id="password" className="inputCss form-control fadeIn third" name="password" placeholder="Contraseña" onChange={this.handlePasswordChange} value={this.state.password} />
                    <br/>
                    <Button variant="primary" type="button" id="guardar" onClick={() =>{this.iniciarSesion()}}> <FontAwesomeIcon icon={faSignInAlt} /> Iniciar Sesión </Button>
                  </Form> 
                  <br/>
                  
                  <div id="formFooter">
                      <div className="underlineHover">
                      <div className="alert alert-danger" id="divAlerta" role="alert" style={{display: 'none'}}>
                        ¡Usuario o Contraseña incorrecto!
                      </div>
                      </div>
                  </div>
               </div>
                
             </div>
          </>
      )

 }   

}
export default Login; 