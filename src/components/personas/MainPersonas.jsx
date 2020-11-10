import React from 'react';
import MaterialTable from "material-table";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {  Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faPlus} from '@fortawesome/free-solid-svg-icons'
import { withRouter, Link } from 'react-router-dom';



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
        fetch('http://museo.fi.uncoma.edu.ar:3006/api/persona')
        .then(res => res.json())
      .then(
        (result) => {
            this.setState({
           personas: result.personas          
        });
        }).catch(error=>{
             console.log("Error")
         });

    }


    eliminar (id)
    {
	  var resultPersonas=[];	
      const destino = "/var/www/museo-administracion/html/images/personas/" + id+'/'; 

       fetch('http://museo.fi.uncoma.edu.ar:3006/api/persona/' + id, {
          method: 'DELETE',
        })
        .then(function(response) {
        if (response.ok) {
              console.log("¡Se eliminó a la persona con Éxito!");
        
        }
        }).then( function(res) {
					       fetch('http://museo.fi.uncoma.edu.ar:3006/api/deleteDirectorio', {
											method: 'get',
											headers:{
													  'Content-Type': undefined,
													  'path': destino
													}      
											})
						  .then(function(response) {
							  if(response.ok) {
								   console.log('Se eliminaron los archivos con exito.');
								   toast.success("¡Se eliminó la Persona con Éxito!");
					
							  } 
						  })
                          .then( function()
						     {
								  fetch('http://museo.fi.uncoma.edu.ar:3006/api/persona')
									.then(res => res.json())
								  .then(
									 function(result){
											resultPersonas= result.personas
									}).catch(error=>{
										 console.log("Error:"+ error.message)
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
                            if( window.confirm('¿Está seguro de eliminar el afiliado seleccionado?'))
                            {
                              this.eliminar(rowData._id); 
                              
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
