import React from 'react';
import Menu from './../Menu';
import MaterialTable from "material-table";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {  Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserEdit, faPlus} from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios'

const cookies = new Cookies();



class MainUsuarios extends React.Component {

    constructor(props) {
        super(props);
        this.state = {usuarios:[]}
       
    }

    componentDidMount(){
    
        if(!cookies.get('username') && !cookies.get('password'))
        {
            window.location.href='/';
        }
        else{

            axios.get('http://museo.fi.uncoma.edu.ar:3006/api/usuarios', {params: {"user": cookies.get('user'), "password":cookies.get('password')}})
            .then(res => {
                  return res.data
            })
          .then(
            (result) => {
                this.setState({
              usuarios: result.usuarios          
            });
            }).catch(error=>{
                console.log("Error")
            });
        }
    }   
    
    eliminar (id)
    {
        var data= {
            "id": id,
            "user": cookies.get('user'),
            "password": cookies.get('password')
        } 

       fetch('http://museo.fi.uncoma.edu.ar:3006/api/deleteUsuario', {
          method: 'DELETE',
          body: JSON.stringify(data),
          headers: {
                      "Content-Type": "application/json"
                    }
        }).then(function(response) {
            if (response.ok) {
              return response.json();

            }
          }).then( function (data){
             if(data.usuarios!==[]) {
              toast.success("¡Se eliminó el usuario con Éxito!");
              setTimeout(() => {
                window.location.replace('/usuarios');
                }, 1000);
             }
             else{
                 console.log('Acceso restringido para el usuario logeado.');
             }      

          }).catch(error => {
                  toast.error('Ha ocurrido un problema. Por favor, verifique nuevamente');
                  console.log(error);
          })
    } 

  render()
  {
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
                    
                    <legend> <FontAwesomeIcon icon={faUserEdit} /> Gestión de Usuarios</legend>
                    <hr/>  
                    <Link to='/addUsuario'>
                        <Button variant="primary" type="buttom" >
                            <FontAwesomeIcon icon={faPlus} /> Agregar
                        </Button>
                    </Link>
                    <br/>
                    <br/>

                    
                    <MaterialTable
                      title="Listado"
                       columns={[
                        {
                          title: 'Id.',
                          field: '_id',
                          hidden: true
                        },
                        {
                          title: 'Usuario',
                          field: 'user'
                        },
                        {
                          title: 'Apellido',
                          field: 'apellido'
                        },
                        {
                            title: 'Nombres',
                            field: 'nombre',
                          },
                          {
                            title: 'Permiso',
                            field: 'permiso',
                            render: rowData => rowData.permiso==1? '(1) Administrador':'(2) Usuario Museo'
                          }
                      ]}
                       data={this.state.usuarios}
                       actions={[
                        {
                          icon: 'edit',
                          tooltip: 'Editar Usuario',
                          onClick: (event, rowData) => {
						     this.props.history.push(`/editUsuario/${rowData._id}`); ;
							
                          }  
              
                        },
                        {
                          icon: 'delete',
                          tooltip: 'Eliminar Usuario',
                          onClick: (event, rowData) => {
                            // Do save operation
                            if( window.confirm('¿Está seguro de eliminar el usuario seleccionado?'))
                            {
                                this.eliminar(rowData._id); 
                            }
                          }
              
                        }

                      ]}
                      options={{
                           filtering:true,
                           exportButton: true,
                           exportFileName:'Listado de Usuarios'
                      }}
                      localization= {{
                             header:{
                               actions:'Acciones'
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
export default MainUsuarios;