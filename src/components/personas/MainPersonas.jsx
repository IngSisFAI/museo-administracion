import React from 'react';
import MaterialTable from "material-table";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {  Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faPlus} from '@fortawesome/free-solid-svg-icons'
import { withRouter, Link } from 'react-router-dom';
import Menu from "./../Menu"
import Cookies from 'universal-cookie';


const cookies = new Cookies();

//Variables Globales
const urlApi = process.env.REACT_APP_API_HOST
const rutaImg=process.env.REACT_APP_RUTA_IMG_PERSONA;
const rutaDoc=process.env.REACT_APP_RUTA_DOC_PERSONA;


const columnsMT = [
    {
      title: 'Id.',
      field: '_id',
      hidden: true
    },
    {
      title: 'Apellido',
      field: 'apellidos'
    },
    {
      title: 'Nombres',
      field: 'nombres'
    },
    {
        title: 'Nro. Doc.',
        field: 'dni',
        type: "numeric"
      },
      {
        title: 'Titulo',
        field: 'titulos'
      }
  ];
  


class MainPersonas extends React.Component {

    constructor(props) {
        super(props);
        this.state = {personas:[]}
       
    }
	
	

	
	componentDidMount(){

    
    
      if(!cookies.get('user') && !cookies.get('password'))
      {
          window.location.href='/';
      }
      else
      {
      
    
          fetch(urlApi+'/personas', {
            method: 'GET', 
            headers: {
              'Authorization': 'Bearer '+cookies.get('token')
            }})
            .then( response => {
              return response.json();
          })
        .then(
          (result) => {
              if(typeof result.personas !== 'undefined') {
                 
                        this.setState({
                      personas: result.personas          
                    });
              }else{
                cookies.remove("id", { path: "/" });
                cookies.remove("nombre", { path: "/" });
                cookies.remove("apellido", { path: "/" });
                cookies.remove("user", { path: "/" });
                cookies.remove("password", { path: "/" });
                cookies.remove("permiso", { path: "/" });
                cookies.remove("token", { path: "/" });
                window.location.href = "/";
              }
             
             
          }).catch(error=>{
              console.log("Error al consultar personas:", error)
          });
      } 

    }


    eliminar(id, foto, cv)
    {
	    var resultPersonas=[];	
  
      const img=rutaImg+foto;
      const curriculum=rutaDoc+cv;

       fetch(urlApi+'/persona/' + id, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer '+cookies.get('token')
          }
        })
        .then(function(response) {
        if (response.ok) {
              console.log("¡Se eliminó a la persona con Éxito!");
        
        }
        })
        .then( function(res) {
					       fetch(urlApi+'/deleteArchivo', {
											method: 'get',
											headers:{
													  'Content-Type': undefined,
													  'path': img,
                            'Authorization': 'Bearer '+cookies.get('token')
													}      
											}) .then(response => {
                        return response.json();
                      })  
						   .then(function(response) {
							
								   console.log('Se elimino el archivo con exito.');
							
						   })
              .then(function(){

               
                  fetch(urlApi+'/deleteArchivo', {
                       method: 'get',
                       headers:{
                             'Content-Type': undefined,
                             'path': curriculum,
                             'Authorization': 'Bearer '+cookies.get('token')
                           }      
                       }) .then(response => {
                         return response.json();
                       })  
                   .then(function(response) {
                          toast.success("¡Se eliminó la Persona con Éxito!");
                     }).catch(error=>{
                                 console.log("Error al eliminar archivo:", error)
                       });
              })
              .then( function()
						     {
                   
                  fetch(urlApi+'/personas', {
                    method: 'GET', 
                    headers: {
                      'Authorization': 'Bearer '+cookies.get('token')
                    }})
                    .then( response => {
                      return response.json();
                      })
                    .then(
                      function(result) {
                          if(typeof result.personas !== 'undefined') {
                            
                                   resultPersonas=result.personas
                              //   this.setState({ personas: result.personas });

                          }else{
                            cookies.remove("id", { path: "/" });
                            cookies.remove("nombre", { path: "/" });
                            cookies.remove("apellido", { path: "/" });
                            cookies.remove("user", { path: "/" });
                            cookies.remove("password", { path: "/" });
                            cookies.remove("permiso", { path: "/" });
                            cookies.remove("token", { path: "/" });
                            window.location.href = "/";
                          }
                        
                        
                      }).catch(error=>{
                          console.log("Error al consultar personas:", error)
                      });
								 
							 }
						  
						   
						  )			  
						  .catch(function(error) { 
							  toast.error("Error al eliminar. Intente nuevamente.");
							  console.log('Hubo un problema con la petición Fetch:' + error.message);
						  });
						
		})
        .catch(function(error) {
                        toast.error("Error al eliminar. Intente nuevamente (1).");
                        console.log('Hubo un problema con la petición Fetch:' + error.message);
         });
		
				setTimeout(() => {
				   this.setState({ personas: resultPersonas });
				}, 2000);		
		

    }

    render() 
    {

         return(

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
                    
                    <legend> <FontAwesomeIcon icon={faUsers} /> Gestión de Personas</legend>
                    <hr/>  
                    <Link to='/addPersona'>
                        <Button variant="primary" type="buttom" >
                            <FontAwesomeIcon icon={faPlus} /> Agregar
                        </Button>
                    </Link>
                    <br/>
                    <br/>

                    
                    <MaterialTable
                      title="Listado"
                      
                       columns={columnsMT}
                       data={this.state.personas}
                       actions={[
                        {
                          icon: 'edit',
                          tooltip: 'Editar Persona',
                          onClick: (event, rowData) => {
						     this.props.history.push(`/editPersona/${rowData._id}`); ;
							
                          }  
              
                        },
                        {
                          icon: 'delete',
                          tooltip: 'Eliminar Persona',
                          onClick: (event, rowData) => {
                            // Do save operation
                            if( window.confirm('¿Está seguro de eliminar la persona seleccionada?'))
                            {
                              this.eliminar(rowData._id, rowData.foto, rowData.curriculum); 
                              
                            }
                          }
              
                        }

                      ]}
                      options={{
                           filtering:true,
                           exportButton: true,
                           exportFileName:'Listado de Personas'
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

export default withRouter(MainPersonas);  
