import React from "react";
import { Form, Button } from 'react-bootstrap';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faReply, faMapMarked} from '@fortawesome/free-solid-svg-icons'
import { Link} from 'react-router-dom';
import CrearExploracion from "../../areaGeospatial/CrearExploracion";
import Menu from "./../Menu"
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class AddExploracion extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          nombre: "",
          fecha: "",
          areaId: "",
          validated: false
        };
      }
 

setAreaId = areaId => this.setState({ areaId });

componentDidMount() {
  if(!cookies.get('username') && !cookies.get('password'))
  {
      window.location.href='/';
  }
} 

handleNombreChange = evt => {
    this.setState({ nombre: evt.target.value });
  };

handleFechaChange = evt => {
    this.setState({ fecha: evt.target.value });
  };
 
  handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    else
    { 
        var data = {
            nombre: this.state.nombre,
            fecha: this.state.fecha,
            areaId: this.state.areaId
          };

        fetch("http://museo.fi.uncoma.edu.ar:3006/api/exploracion", {
            method: "post",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json"
            }
          })
            .then(function(response) {
              if (response.ok) {
                toast.success("¡Se guardó la Exploracion con Éxito!");
                setTimeout(() => {
                    window.location.replace('/exploraciones');
                  }, 1500);
              }
            })
            .catch(function(error) {
              toast.error("Error al guardar. Intente nuevamente.");
              console.log(
                "Hubo un problema con la petición Fetch:" + error.message
              );
            });
        
    }
    this.setState({ validated: true });
 }        



render()
{

    const {validated} = this.state;

    return(
         <>
             <Menu />
              <div className="row">
               <div className="col-md-12">
                <div id="contenido" align="left" className="container">
                     <br/>   
                    <h3 className="page-header" align="left">
                       <FontAwesomeIcon icon={faMapMarked} /> Agregar Exploración
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
                          <Form.Group className="col-sm-12" controlId="nombre">
                              <Form.Label>Nombre:</Form.Label>
                              <Form.Control type="text" placeholder="Ingrese Nombre" required onChange={this.handleNombreChange} value={this.state.nombre} />
                              <Form.Control.Feedback type="invalid">
                              Por favor, ingrese Nombre.
                              </Form.Control.Feedback>
                           </Form.Group>
                        </Form.Row>

                        <Form.Row >
                          <Form.Group className="col-sm-6" controlId="fecha">
                              <Form.Label>Fecha:</Form.Label>
                              <Form.Control type="date"  required onChange={this.handleFechaChange} value={this.state.fecha} />
                              <Form.Control.Feedback type="invalid">
                              Por favor, ingrese Fecha.
                              </Form.Control.Feedback>
                           </Form.Group>
                        </Form.Row>

                        <br />
                        <CrearExploracion setAreaId={this.setAreaId} />
                        <br />
                        <br />
                

                        <Form.Row> 
                        <Form.Group className="mx-sm-3 mb-2">
                              <Button variant="primary" type="submit" id="guardar">
                              <FontAwesomeIcon icon={faSave} /> Guardar
                              </Button>
                              &nbsp;&nbsp;
                             <Link to='/exploraciones'>
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


         </>
    )
}

}

export default AddExploracion; 