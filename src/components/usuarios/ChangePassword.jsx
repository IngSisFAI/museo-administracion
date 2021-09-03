import React from "react";
import { Form, Button, Alert } from 'react-bootstrap';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faReply, faKey} from '@fortawesome/free-solid-svg-icons'
import { Link} from 'react-router-dom';
import Menu from "./../Menu"
import Cookies from 'universal-cookie';
import md5 from 'md5';

const cookies = new Cookies();

//Variables Globales
const urlApi = process.env.REACT_APP_API_HOST;


class ChangePassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: "",
            validated: false
          };
    
    }

    componentDidMount(){

        if(!cookies.get('user') && !cookies.get('password'))
        {
            window.location.href='/';
        }
    }  

    handleOldPasswordChange = evt => {
        this.setState({ oldPassword: evt.target.value });
      };

     handleNewPasswordChange = evt => {
        this.setState({ newPassword: evt.target.value });
      };

      handleConfirmNewPasswordChange = evt => {
        this.setState({ confirmNewPassword: evt.target.value });
      };
    
  verificaOldPassword = ()  =>{
      if(cookies.get('password')!==md5(this.state.oldPassword))
      {
          toast.error('La contraseña ingresada no es correcta');
          this.setState({oldPassword: ""})
          document.getElementById('oldPassword').focus();
      }
     
   }   

   validarPassword =() => {
    if(this.state.newPassword!==this.state.confirmNewPassword)
    {
       this.setState({ confirmNewPassword: ''});
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
            var data={
                "id": cookies.get('id'),
                "password": md5(this.state.newPassword)
            }

         fetch(urlApi+'/editUsuario', {
            method: 'put',
            body: JSON.stringify(data),
            headers:{
                      'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + cookies.get('token')
                    }      
            })
            .then(function(response) {
                if (response.ok) {
                  return response.json();

                }
              }).then( function (data){
                 
                  toast.success("¡Se actualizó la información con Éxito!");

                    cookies.remove('id',{path:"/"});
                    cookies.remove('nombre',{path:"/"});
                    cookies.remove('apellido',{path:"/"});
                    cookies.remove('user',{path:"/"});
                    cookies.remove('password',{path:"/"});
                    cookies.remove('permiso',{path:"/"});
                  setTimeout(() => {
                      window.location.replace('/');
                      }, 1500);   

              }).catch(error => {
                      toast.error('Ha ocurrido un problema, Por favor, verifique nuevamente');
                      console.log(error);
              })

    }
    this.setState({ validated: true });
 }

 render()
 {
    const {validated} = this.state;

     return (<>
                 <Menu />
              <div className="row">
               <div className="col-md-12">
                <div id="contenido" align="left" className="container">
                     <br/>   
                    <h3 className="page-header" align="left">
                       <FontAwesomeIcon icon={faKey} /> Cambiar Contraseña
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
                            <Form.Group className="col-sm-6" controlId="oldPassword">
                                <Form.Label>Contraseña Anterior:</Form.Label>
                                <Form.Control type="password" placeholder="Ingrese Contraseña Anterior" required onChange={this.handleOldPasswordChange} value={this.state.oldPassword} onBlur={()=>this.verificaOldPassword()}/>
                                <Form.Control.Feedback type="invalid">
                                   Por favor, ingrese la contraseña anterior.
                                </Form.Control.Feedback>
                            </Form.Group>

                        </Form.Row>
                        <Form.Row >
                            <Form.Group className="col-sm-6" controlId="newPassword">
                              <Form.Label>Nueva Contraseña:</Form.Label>
                              <Form.Control type="password" placeholder="Ingrese Nueva Contraseña" required onChange={this.handleNewPasswordChange} value={this.state.newPassword} />
                              <Form.Control.Feedback type="invalid">
                              Por favor, ingrese Nueva Contraseña.
                              </Form.Control.Feedback>
                           </Form.Group>
                         </Form.Row>  

                         <Form.Row >
                            <Form.Group className="col-sm-6" controlId="confirmNewPassword">
                              <Form.Label>Confirmación Nueva Contraseña:</Form.Label>
                              <Form.Control type="password" placeholder="Ingrese Confirmación" required onChange={this.handleConfirmNewPasswordChange} value={this.state.confirmNewPassword} onBlur={()=>this.validarPassword()}/>
                              <Form.Control.Feedback type="invalid">
                              Por favor, ingrese la confirmación.
                              </Form.Control.Feedback>
                           </Form.Group>
                         </Form.Row>  

                        
                        
                   <hr/>
               
                <Form.Row> 
                    <Form.Group className="mx-sm-3 mb-2">
                              <Button variant="primary" type="submit" id="guardar">
                              <FontAwesomeIcon icon={faSave} /> Guardar
                              </Button>
                              &nbsp;&nbsp;
                             <Link to='/home'>
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
export default ChangePassword;