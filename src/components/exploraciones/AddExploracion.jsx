import React from "react";
import { Form, Button, Tabs, Tab, Table } from "react-bootstrap";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faShare,
  faMapMarked,
  faTimesCircle,
  faReply,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import CrearExploracion from "../../areaGeospatial/CrearExploracion";
import Menu from "./../Menu";
import Cookies from "universal-cookie";
import Select from 'react-select';

const cookies = new Cookies();

class AddExploracion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nombre: "",
      fechaInicio: "",
      fechaFin:"",
      areaId: "",
      selectedDirector: null,
      directores:[],
      selectedIntegrante: null,
      integrantes:[],
      key: 'dbasicos',
      validateddbas: false,
      tabbas: false,
      validateddsolic: false,
      tabsolic: true,
      validateddpicking: false,
      tabpicking: true,
      validatedimg: false,
      tabimg: true,
      empresa:'',
      proyecto:'',
      otras:'',
      archivosAut: [],
      detalle:'',
      archivosImg:[]
    };
  }

  setAreaId = (areaId) => this.setState({ areaId });

  componentDidMount() {
    if (!cookies.get("username") && !cookies.get("password")) {
      window.location.href = "/";
    }
  }

  componentWillMount() {

      fetch('http://museo.fi.uncoma.edu.ar:3006/api/persona')
      .then((response) => {
          return response.json()
        })
        .then((people) => {
              this.setState({
                directores: people.personas, integrantes:people.personas
              });
          

          
        }).catch(function (error) {
          toast.error("Error al guardar. Intente nuevamente.");
          console.log(
            "Hubo un problema con la petición Fetch:",
            error.message
          );
        });

}



  handleNombreChange = (evt) => {
    this.setState({ nombre: evt.target.value });
  };

  handleFechaInicioChange = (evt) => {
    this.setState({ fechaInicio: evt.target.value });
  };

  handleFechaFinChange = (evt) => {
    this.setState({ fechaFin: evt.target.value });
  };


  handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      var data = {
        nombre: this.state.nombre,
        fecha: this.state.fecha,
        areaId: this.state.areaId,
      };

      fetch("http://museo.fi.uncoma.edu.ar:3006/api/exploracion", {
        method: "post",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(function (response) {
          if (response.ok) {
            toast.success("¡Se guardó la Exploracion con Éxito!");
            setTimeout(() => {
              window.location.replace("/exploraciones");
            }, 1500);
          }
        })
        .catch(function (error) {
          toast.error("Error al guardar. Intente nuevamente.");
          console.log(
            "Hubo un problema con la petición Fetch:" + error.message
          );
        });
    }
    this.setState({ validated: true });
  };

  handleDirectorChange = (selectedDirector) => {
    this.setState({ selectedDirector });
  };

  handleIntegrantesChange = (selectedIntegrante) => {
    let integrantes = Array.from(selectedIntegrante, option => option.value);
    this.setState({selectedIntegrante});
    this.setState({integrantesId:integrantes});
   
} 

handleSelect=(key) =>{
  this.setState({ key: key });
 
} 

handleForm1 = (event) => {
  const form = document.getElementById("form1");
  event.preventDefault();
  if (form.checkValidity() === false) {
    event.stopPropagation();
  }else{
    this.setState({tabsolic:false, key:'dsolic'});

  }
  this.setState({ validateddbas: true });
}

handleForm2 = (event) => {
  const form = document.getElementById("form2");
  event.preventDefault();
  if (form.checkValidity() === false) {
    event.stopPropagation();
  }else{
    this.setState({tabpicking:false, key:'dpicking', tabimg:false});

  }
  this.setState({ validateddsolic: true });
}

handleAntForm2 = (event) => {
   
  this.setState({tabbas:false, key:'dbasicos'});

}

handleAntForm4 = (event) => {
   
  this.setState({tabpicking:false, key:'dpicking'});

}

handleProyectoChange = (evt) => {
  this.setState({ proyecto: evt.target.value });
};

handleEmpresaChange = (evt) => {
  this.setState({ empresa: evt.target.value });
};

handleOtrasChange = (evt) => {
  this.setState({ otras: evt.target.value });
};

fileshandleChange = (event) => {
  const files=  event.target.files;
  var arrayFiles= this.state.archivosAut;
  

  Array.from(files).forEach(file => {
    var key=Math.floor(Math.random() * 1000); 
    file.id=key;
    arrayFiles.push(file)
  })
  this.setState({archivosAut: arrayFiles});

  //aca deberiamos mover el archivo a la carpeta 
};


renderTableDataFiles() {

  return this.state.archivosAut.map((file, index) => {
    
    return (
      <tr key={index}>
       <td>
            <Button variant="danger" type="button" id="eliminarfaut" onClick={()=> this.eliminarArchivoAut(file)}>
            <FontAwesomeIcon icon={faTrash} />
            </Button>
       </td>
       <td>{file.name}</td>
     
    </tr>
    )
 })


}

eliminarArchivoAut = (dato) => {
  //aca tambien hay que eliminar en la BD y traer los prestamos
 var opcion = window.confirm("¿Está seguro que deseas eliminar el Archivo?");
 if (opcion == true) {
   var contador = 0;
   var arreglo = this.state.archivosAut;
   arreglo.map((registro) => {
     if (dato.id == registro.id) {
       arreglo.splice(contador, 1);
     }
     contador++;
   });
   this.setState({ archivosOD: arreglo});
 }
};

handleDetalleChange = (evt) => {
  this.setState({ detalle: evt.target.value });
};

imageneshandleChange = (event) => {
  const files=  event.target.files;
  var arrayFiles= this.state.archivosImg;
  

  Array.from(files).forEach(file => {
    var key=Math.floor(Math.random() * 1000); 
    file.id=key;
    arrayFiles.push(file)
  })
  this.setState({archivosImg: arrayFiles});

  //aca deberiamos mover el archivo a la carpeta 
};

renderTableDataFilesImagenes() {

  return this.state.archivosImg.map((file, index) => {
    
    return (
      <tr key={index}>
       <td>
            <Button variant="danger" type="button" id="eliminarImg" onClick={()=> this.eliminarArchivoImg(file)}>
            <FontAwesomeIcon icon={faTrash} />
            </Button>
       </td>
       <td>{file.name}</td>
     
    </tr>
    )
 })


}

eliminarArchivoImg = (dato) => {
  //aca tambien hay que eliminar en la BD y traer los prestamos
 var opcion = window.confirm("¿Está seguro que deseas eliminar el Archivo?");
 if (opcion == true) {
   var contador = 0;
   var arreglo = this.state.archivosImg;
   arreglo.map((registro) => {
     if (dato.id == registro.id) {
       arreglo.splice(contador, 1);
     }
     contador++;
   });
   this.setState({ archivosImg: arreglo});
 }
};


  render() {
    const { validateddbas } = this.state;
    const { validateddsolic } = this.state;
    const { validateddpicking } = this.state;
    const { validatedimg } = this.state;
    const { selectedDirector } = this.state;
    const { selectedIntegrante } = this.state;
    
        

    return (
      <>
        <Menu />
        <div className="row">
          <div className="col-md-12">
            <div id="contenido" align="left" className="container">
              <br />
              <h3 className="page-header" align="left">
                <FontAwesomeIcon icon={faMapMarked} /> Nueva Exploración
              </h3>
              <hr />


              <Tabs id="tabExploracion" activeKey={this.state.key} onSelect={this.handleSelect}>
              <Tab eventKey="dbasicos" title="Datos Básicos/Geográficos" disabled={this.state.tabbas}>
               <Form id="form1" noValidate validated={validateddbas}>
              
                    <Form.Row>
                      <Form.Group className="col-sm-12" controlId="nombre">
                        <Form.Label>Nombre del Área:</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Obligatorio"
                          required
                          onChange={this.handleNombreChange}
                          value={this.state.nombre}
                        />
                        <Form.Control.Feedback type="invalid">
                          Por favor, ingrese Nombre.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Form.Row>

                  <Form.Row>
                  <Form.Group className="col-sm-12" controlId="director">
                          <Form.Label>Director:</Form.Label>
                          <Select
                            placeholder={"Seleccione Opción"}
                            options={this.state.directores.map((opt) => ({
                              label: opt.nombres + " " + opt.apellidos,
                              value: opt._id,
                            }))}
                            onChange={this.handleDirectorChange}
                            value={selectedDirector}
                            isClearable
                          />
                        </Form.Group>
      
                    </Form.Row>

                    <Form.Row>
                        <Form.Group className="col-sm-12" controlId="integrantes">
                          <Form.Label>Integrantes Grupo:</Form.Label>
                          <Select
                            placeholder={"Seleccione Opción"}
                            options={this.state.integrantes.map((opt) => ({
                              label: opt.nombres + " " + opt.apellidos,
                              value: opt._id,
                            }))}
                            onChange={this.handleIntegrantesChange}
                            value={selectedIntegrante}
                            isClearable
                            isMulti
                          />
                        </Form.Group>
      
                    </Form.Row>



                    <Form.Row>
                      <Form.Group className="col-sm-6" controlId="fechaInicio">
                        <Form.Label>Fecha Inicio:</Form.Label>
                        <Form.Control
                          type="date"
                          required
                          onChange={this.handleFechaInicioChange}
                          value={this.state.fechaInicio}
                        />
                        <Form.Control.Feedback type="invalid">
                          Por favor, ingrese Fecha.
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="col-sm-6" controlId="fechaFin">
                        <Form.Label>Fecha de Termino:</Form.Label>
                        <Form.Control
                          type="date"
                          onChange={this.handleFechaFinChange}
                          value={this.state.fechaFin}
                        />
                      </Form.Group>
                    </Form.Row>

                    


                    <legend>Datos Geográficos</legend>
                    <hr/>
 
                      <Form.Row>
                            <Form.Group className="col-sm-12" >
                            <CrearExploracion setAreaId={this.setAreaId} />
                              </Form.Group> 
                      </Form.Row>  
                        
                        <br/>
                      
 
                        <Form.Row >

                      <Button variant="outline-secondary" type="button" id="siguiente1" onClick={this.handleForm1}>
								       Siguiente <FontAwesomeIcon icon={faShare} /> 
								      </Button>  
                    </Form.Row>  
                    <br/>

                    
                  </Form>
                 </Tab>
           
 
             
              <Tab eventKey="dsolic" title="Solicitud/Autorización" disabled={this.state.tabsolic}>
                 <Form id="form2" noValidate validated={validateddsolic}>
                 <br/> 
                 <legend>Solicitud de Exploración</legend>
                    <hr/>

                    <Form.Row>
                      <Form.Group className="col-sm-12" controlId="empresa">
                        <Form.Label>Empresa:</Form.Label>
                        <Form.Control
                          type="text"
                         
                          onChange={this.handleEmpresaChange}
                          value={this.state.empresa}
                        />
                        
                      </Form.Group>
                      </Form.Row>  

                      <Form.Row>  
                      <Form.Group className="col-sm-12" controlId="proyecto">
                        <Form.Label>Proyecto de Investigación:</Form.Label>
                        <Form.Control
                          type="text"
                          onChange={this.handleProyectoChange}
                          value={this.state.proyecto}
                        />
                      </Form.Group>
                    </Form.Row>


                    <Form.Row>  
                      <Form.Group className="col-sm-12" controlId="otras">
                        <Form.Label>Otras Especificaciones:</Form.Label>
                        <Form.Control
                         as='textarea'
                          onChange={this.handleOtrasChange}
                          value={this.state.otras}
                        />
                      </Form.Group>
                    </Form.Row>
                   
                   <legend>Autorizaciones</legend>
                   <hr/>

                   <Form.Row>  
                      <Form.Group className="col-sm-8" controlId="filesAut">
                          <label>Archivos:</label>
                          {/* <Form.File id="filesAut" label="Archivos:" onChange={this.fileshandleChange.bind(this)} multiple/> */}
                           <input type="file" className="form-control" onChange={this.fileshandleChange.bind(this)} multiple />
                      </Form.Group>
                    </Form.Row>
                    
                    <Form.Row>
                    <Form.Group className="col-sm-8" controlId="archivopdf">
                      
                        <Table striped bordered hover  responsive>
                            <thead className="thead-dark">
                            <tr>
                                <th>Acción</th>
                                <th>Nombre</th>
                              </tr>
                            </thead>	
                            <tbody>
                               {this.renderTableDataFiles()}
                            </tbody>
                          </Table> 
                        
                             
                        </Form.Group>
                     </Form.Row>




                 <Form.Row >
                       <Button variant="outline-secondary" type="button" id="anterior2" onClick={this.handleAntForm2}>
                        <FontAwesomeIcon icon={faReply} /> Anterior
                        </Button> 
                        &nbsp;
                      <Button variant="outline-secondary" type="button" id="siguiente2" onClick={this.handleForm2}>
								       Siguiente <FontAwesomeIcon icon={faShare} /> 
								      </Button>  
                    </Form.Row>  

                
                  </Form>
               </Tab> 


               <Tab eventKey="dpicking" title="Picking" disabled={this.state.tabpicking}>
                 <Form id="form3" noValidate validated={validateddpicking}>

                 <Form.Row>  
                      <Form.Group className="col-sm-12" controlId="detalle">
                        <Form.Label>Detalles:</Form.Label>
                        <Form.Control
                         as='textarea'
                          onChange={this.handleDetalleChange}
                          value={this.state.detalle}
                        />
                      </Form.Group>
                    </Form.Row>

                  
                  <br/>
                  <br/>
                  <Form.Row>
                      <Form.Group className="mx-sm-3 mb-2">
                        <Button variant="primary" type="submit" id="guardar">
                          <FontAwesomeIcon icon={faSave} /> Guardar
                        </Button>
                        &nbsp;&nbsp;
                        <Link to="/exploraciones">
                          <Button variant="danger" type="button" id="volver">
                            <FontAwesomeIcon icon={faTimesCircle} /> Cancelar
                          </Button>
                        </Link>
                      </Form.Group>
                    </Form.Row>
                  </Form>
               </Tab> 

               <Tab eventKey="dimg" title="Imágenes" disabled={this.state.tabimg}>
                 <Form id="form4" noValidate validated={validatedimg}>
                  <br/> 
                 <legend>Imágenes Adjuntas</legend>
                 <hr/>
                 <Form.Row>
                <Form.Group className="col-sm-8" controlId="imagenes">
               
                  {/*<Form.File id="imagenes"  label="Archivos:" multiple onChange={this.imageneshandleChange.bind(this)} />*/}
                  <input type="file" id="imagenes" className="form-control" multiple onChange={this.imageneshandleChange.bind(this)} />
                </Form.Group>
                  </Form.Row>

                  <Form.Row>
                        <Form.Group className="col-sm-8" >
                          
                            <Table striped bordered hover responsive>
                                <thead className="thead-dark">
                                <tr>
                                    <th>Acción</th>
                                    <th>Nombre</th>
                                  </tr>
                                </thead>	
                                <tbody>
                                  {this.renderTableDataFilesImagenes()}
                                </tbody>
                              </Table> 
                            
                                
                            </Form.Group>
                  </Form.Row>



                     <Form.Row >
                        <Button variant="outline-secondary" type="button" id="anterior4" onClick={this.handleAntForm4}>
                        <FontAwesomeIcon icon={faReply} /> Anterior
                        </Button> 
								
                     </Form.Row>   
                  
               
                  </Form>
               </Tab> 

            </Tabs> 


             
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default AddExploracion;
