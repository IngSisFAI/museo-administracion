import React from "react";
import { Form, Button, Tabs, Tab, Table, Modal } from 'react-bootstrap';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faReply, faPaw, faPlus, faFileArchive, faTrash, faEdit, faShare, faTimesCircle} from '@fortawesome/free-solid-svg-icons'
import { Link} from 'react-router-dom';
import Select from 'react-select';
import Menu from "./../Menu"
import Cookies from 'universal-cookie';
import Moment from 'moment';

const cookies = new Cookies();

const optTipos = [
        { value: 'Encontrado', label: 'Encontrado' },
        { value: 'No Encontrado', label: 'No Encontrado' },
        
      ];

class AddEjemplar extends React.Component {
	
	  constructor(props) {
        super(props);
        this.state = {
                nombre:"",
                nroColeccion:"",
                fechaColeccion:"",
                dimensionAlto:"",
                dimensionLargo:"",
                dimensionAncho:"",
                peso:"",
                alimentacion:"",
                ubicacion:"",
                descripcion1:"",
                descripcion1A:"",
                descripcion2:"",
                descripcion3:"",
                formacion:"",
                grupo:"",
                subgrupo:"",
                edad:"",
                periodo:"",
                era:"",
                reino:"",
                filo:"",
                clase:"",
                orden:"",
                familia:"",
                genero:"",
                especie:"",
                paises: [],
                selectedPais:null ,
                provincias:[],
                selectedProvincia:null ,
                ciudades:[],
                selectedCiudad:null,
                muestraHome: false,
                excavaciones: [],
                selectedExcavacion: null,
           //     selectedTipo: { value: 'Encontrado', label: 'Encontrado' },
                fbaja:"",
                motivo:"",
                ilustracionCompleta:"",
                descripcionIC:"",
                periodo2:"",
                perteneceExca:"",
                fotos:[],
                videos:[],
                colecciones:[],
                selectedColeccion:null,
                selectedIngresadoPor:null,
                validated: false,
                paisesArray:[],
                colectores:[],
                show: false,
                tabdim: true,
                key: 'dbasicos',
                op:'I',
                tabgeo: true,
                validateddim: false,
                tabbas: false,
                validatedgeo: false,
                tabgeo: true,
                tabtax: true,
                validatedtax: false,
                tabarea: true,
                validatedarea: false,
                tabpres: false,
                validatedpres: false,
                tabotros: true,
                validatedotros: false,
                prestamos:  [],
               fprestamo:'',
               fdevolucion:'',
               investigador:'',
               institucion:'',
               modalActualizar: false,
               modalInsertar: false,
               form: {
                id: "",
                fprestamo: "",
                fdevolucion: "",
                institucion:"",
                investigador:"",
              },
              modalSubir: false,
              archivos:[],
              archivosOD:[],
        }        
       
      }

    

      componentDidMount() {

        if(!cookies.get('username') && !cookies.get('password'))
        {
            window.location.href='/';
        }
      }


      //carga los select al iniciar el componente
      componentWillMount() {

          /*fetch('http://museo.fi.uncoma.edu.ar:3006/api/pais')
          .then((response) => {
              return response.json()
            })
            .then((countries) => {
			  var paisesA=  countries.paises.map((opt) => ({ label: opt.nombre, value: opt._id }) );	
              this.setState({paises: countries.paises, paisesArray: paisesA })
            });*/

        fetch('http://museo.fi.uncoma.edu.ar:3006/api/excavacion')
        .then((response) => {
            return response.json()
          })
          .then((excav) => {
            this.setState({ excavaciones: excav.excavaciones })
            
          fetch('http://museo.fi.uncoma.edu.ar:3006/api/coleccion')
          .then((response) => {
              return response.json()
            })
            .then((collection) => {
              this.setState({ colecciones: collection.colecciones })
              fetch("http://museo.fi.uncoma.edu.ar:3006/api/persona")
              .then((response) => {
                return response.json();
              })
              .then((empleados) => {
                this.setState({
                  colectores: empleados.personas,
                });
              }).catch(function (error) {
                toast.error("Error al guardar. Intente nuevamente.");
                console.log(
                  "Hubo un problema con la petición Fetch:",
                  error.message
                );
              });

            }).catch(function (error) {
              toast.error("Error al guardar. Intente nuevamente.");
              console.log(
                "Hubo un problema con la petición Fetch:",
                error.message
              );
            });
            
          }).catch(function (error) {
            toast.error("Error al guardar. Intente nuevamente.");
            console.log(
              "Hubo un problema con la petición Fetch:",
              error.message
            );
          });


           
      }
	  
	  //Manejadores de cada campo 


    handleShow = evt => {
      this.setState({ show: true });
    };

    handleClose = evt => {
      this.setState({ show: false});
    };
	  
      handleNombreChange = evt => {
        this.setState({ nombre: evt.target.value });
      };

      handleColectorChange = (selectedColector) => {
        this.setState({ selectedColector });
      };


      handleTipoChange = (selectedTipo) => {
        this.setState({selectedTipo});
        console.log(`Option selected:`, selectedTipo);
       
      }

  

       handleColeccionesChange = (selectedColeccion) => {
        this.setState({selectedColeccion:selectedColeccion.target.value });
       // console.log(`Option selected:`, selectedColeccion.target.value );
       
      }

      handleIngresadoPorChange = (event) => {
        this.setState({selectedIngresadoPor:event.target.value });
      // console.log(`Option selected:`, event.target.value );
       
      }

      handleFechaColeccionChange = evt => {
        this.setState({ fechaColeccion: evt.target.value });
      };

      handleDimensionLargoChange = evt => {
        this.setState({ dimensionLargo: evt.target.value });
      };

      handleDimensionAnchoChange = evt => {
		  
        this.setState({ dimensionAncho: evt.target.value });
      };

      handleDimensionAltoChange = evt => {
        this.setState({ dimensionAlto: evt.target.value });
      };

      handleAlimentacionChange = evt => {
        this.setState({ alimentacion: evt.target.value });
      };

      handleUbicacionChange = evt => {
        this.setState({ ubicacion: evt.target.value });
      };

      handleDescripcion1Change = evt => {
        this.setState({ descripcion1: evt.target.value });
      };

      handleDescripcion1AChange = evt => {
        this.setState({ descripcion1A: evt.target.value });
      };

      handleDescripcion2Change = evt => {
        this.setState({ descripcion2: evt.target.value });
      };

      handleDescripcion3Change = evt => {
        this.setState({ descripcion3: evt.target.value });
      };

      handleFormacionChange = evt => {
        this.setState({ formacion: evt.target.value });
      };

      handleGrupoChange = evt => {
        this.setState({ grupo: evt.target.value });
      };

      handleSubgrupoChange = evt => {
        this.setState({ subgrupo: evt.target.value });
      };

      handleEdadChange = evt => {
        this.setState({ edad: evt.target.value });
      }; 

      handlePeriodoChange = evt => {
        this.setState({ periodo: evt.target.value });
      };

      handleEraChange = evt => {
        this.setState({ era: evt.target.value });
      };
     

      handleReinoChange = evt => {
        this.setState({ reino: evt.target.value });
      };

      handleFiloChange = evt => {
        this.setState({ filo: evt.target.value });
      };

      handleClaseChange = evt => {
        this.setState({clase: evt.target.value });
      };

      handleOrdenChange = evt => {
        this.setState({ orden: evt.target.value });
      };

      handleFamiliaChange = evt => {
        this.setState({ familia: evt.target.value });
      };

      handleGeneroChange = evt => {
        this.setState({ genero: evt.target.value });
      };

      handleEspecieChange = evt => {
        this.setState({ especie: evt.target.value });
      };

      handleFPrestamoChange = evt => {
        this.setState({ fprestamo: evt.target.value });
      };

      handleFDevolucionChange = evt => {
        this.setState({ fdevolucion: evt.target.value });
      };

      handleInvestigadorChange = evt => {
        this.setState({ investigador: evt.target.value });
      };

      handleInstitucionChange = evt => {
        this.setState({ institucion: evt.target.value });
      };
      

   

      handleChange = (e) => {
        console.log(e.target.name)
        this.setState({
          form: {
            ...this.state.form,
            [e.target.name]: e.target.value,
          },
        });
      };

    


      handleExcavacionesChange = (selectedExcavacion) => {
      //  console.log(selectedExcavacion);
        this.setState({selectedExcavacion});
      }

  
      handleMuestraChange(evt) {
        this.setState({ muestraHome: evt.target.checked });
      }

      handleFbajaChange = evt => {
        this.setState({ fbaja: evt.target.value });
      };

      handleMotivoChange = evt => {
        this.setState({ motivo: evt.target.value });
      };
	  
	   handleSubmit = (event) => {
		 
		
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
          event.stopPropagation();
		  
		   toast.error('Ingrese datos obligatorios.');
		  if(this.state.selectedExcavacion==="" || this.state.selectedExcavacion===null)
		  {
			 toast.error('Seleccione una Excavación.');  
			  
		  }	
		  
		  if(this.state.selectedColeccion==="" || this.state.selectedColeccion===null)
		  {
			 toast.error('Seleccione una Colección.');  
			  
		  }	
			  
		  
        }
        else
        { 
	      if(this.state.selectedExcavacion==="" || this.state.selectedExcavacion===null)
		  {
			 toast.error('Seleccione una Excavación!');  
			  
		  }	
		  else
		  {
			   if(this.state.selectedColeccion==="" || this.state.selectedColeccion===null)
			  {
				 toast.error('Seleccione una Colección.');  
				  
			  }	
			  else{
				  
				  var idCountry=''
				  if(this.state.selectedPais!==null)
				  {idCountry=this.state.selectedPais.value}
				  
				  var idProv=''
				  if(this.state.selectedProvincia!==null)
				  {idProv=this.state.selectedProvincia.value}
		
				  var idCity=''
				  if(this.state.selectedCiudad!==null)
				  {idCity=this.state.selectedCiudad.value}


				  var eraGeo={
					"formacion":this.state.formacion,
					"grupo":this.state.grupo,
					"subgrupo":this.state.subgrupo,
					"edad":this.state.edad,
					"periodo":this.state.periodo,
					"era":this.state.era
				  };

				  var areaH={
					"nombreArea":"",
					"pais":idCountry,
					"ciudad":idCity,
					"provincia":idProv
				  };
                
				 
		
				  var data = {
					"tipoEjemplar": this.state.selectedTipo.value,
					"taxonReino":this.state.reino,
					"taxonFilo":this.state.filo,
					"taxonClase":this.state.clase,
					"taxonOrden":this.state.orden,
					"taxonFamilia": this.state.familia,
					"taxonGenero":this.state.genero,
					"taxonEspecie":this.state.especie,
					"eraGeologica": eraGeo,
					"ilustracionCompleta":this.state.ilustracionCompleta,
					"descripcionIC":this.state.descripcionIC,
					"areaHallazgo": areaH,
					"nroColeccion":this.state.selectedColeccion.value,
					"dimensionLargo":this.state.dimensionAncho,
					"dimensionAlto":this.state.dimensionAlto,
					"peso": this.state.peso,
					"alimentacion":this.state.alimentacion,
					"fechaIngresoColeccion":this.state.fechaColeccion,
					"ubicacionMuseo":this.state.ubicacion,
					"fotosEjemplar":this.state.fotos,
					"videosEjemplar":this.state.videos,
					"fechaBaja": this.state.fbaja, 
					"motivoBaja": this.state.motivo,
					"nombre":this.state.nombre,
					"periodo":this.state.periodo2,
					"home": this.state.muestraHome,
					"descripcion1":this.state.descripcion1,
					"descripcion1A":this.state.descripcion1A,
					"descripcion2":this.state.descripcion2,
					"descripcion3": this.state.descripcion3,  
					"perteneceExca":this.state.selectedExcavacion.value
				 };

				 fetch('http://museo.fi.uncoma.edu.ar:3006/api/ejemplar', {
					method: 'post',
					body: JSON.stringify(data),
					headers:{
							  'Content-Type': 'application/json'
							}      
					})
					.then(function(response) {
					  if(response.ok) {
						toast.success("¡Se guardó el Ejemplar con Éxito!");
						 setTimeout(() => {
									 window.location.replace('/ejemplares');
								  }, 1500);
					  } 
					})
					.catch(function(error) {
					  toast.error("Error al guardar. Intente nuevamente.");
					  console.log('Hubo un problema con la petición Fetch:', error.message);
					});
				 }
			  
		  }  
		  
		}

	   this.setState({ validated: true });
	}	


  handleForm1 = (event) => {
    const form = document.getElementById("form1");
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }else{
      this.setState({tabdim:false, key:'ddimensiones'});
    }
    this.setState({ validated: true });
  }

  handleSelect=(key) =>{
    this.setState({ key: key });
  } 

  handleForm2 = (event) => {
    const form = document.getElementById("form2");
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }else{
      this.setState({tabgeo:false, key:'dgeologicos'});
    }
    this.setState({ validateddim: true });
  }

  handleAntForm2 = (event) => {
   
      this.setState({tabbas:false, key:'dbasicos'});
  
  }

  handleForm3 = (event) => {
    const form = document.getElementById("form3");
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }else{
      this.setState({tabtax:false, key:'dtaxonomicos'});
    }
    this.setState({ validatedgeo: true });
  }

  handleAntForm3 = (event) => {
   
      this.setState({tabdim:false, key:'ddimensiones'});
  
  }

  handleForm4 = (event) => {
    const form = document.getElementById("form4");
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }else{
      this.setState({tabarea:false, key:'darea'});
    }
    this.setState({ validatedtax: true });
  }

  handleAntForm4 = (event) => {
   
      this.setState({tabgeo:false, key:'dgeologicos'});
  
  }

  handleForm5 = (event) => {
    const form = document.getElementById("form5");
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
     
      
    }else{
      if(this.state.selectedExcavacion==="" || this.state.selectedExcavacion===null)
		  {
			 toast.error('Seleccione una Excavación.');  
			  
		  }	else{
        this.setState({tabotros:false, key:'dotros', tabpres:false});
      }
    
    }
    this.setState({ validatedarea: true });
  }

  handleAntForm5 = (event) => {
   
      this.setState({tabtax:false, key:'dtaxonomicos'});
  
  }

  handleForm6 = (event) => {
   
      this.setState({tabotros:false, key:'dotros', validatedpres: true});
    
  }

  handleAntForm6 = (event) => {
   
      this.setState({tabarea:false, key:'dotros'});
  
  }


  renderTableData() {

    return this.state.prestamos.map((prestamo) => {
     
      return (
        <tr key={prestamo.id}>
         <td><Button variant="secondary" type="button" id="editar" onClick={() => this.mostrarModalActualizar(prestamo)}>
            <FontAwesomeIcon icon={faEdit} />
            </Button>
            &nbsp;
            <Button variant="danger" type="button" id="eliminar" onClick={()=> this.eliminar(prestamo)}>
            <FontAwesomeIcon icon={faTrash} />
            </Button></td>
         <td>{prestamo.fprestamo ? Moment(prestamo.fprestamo).format('DD/MM/YYYY') :''}</td>
         <td>{prestamo.fdevolucion ? Moment(prestamo.fdevolucion).format('DD/MM/YYYY') :''}</td>
         <td>{prestamo.investigador}</td>
         <td>{prestamo.institucion}</td>
         <td><Button variant="secondary" type="button" id="subir" onClick={() => this.mostrarModalSubir(prestamo)}>
            <FontAwesomeIcon icon={faFileArchive} />
            </Button></td>
      </tr>
      )
   })


  
 }



insertar= ()=>{

    //aca guardaria en BD y haria un select luego de los prestamos asociados al ejemplar y lo cargamos en el array prestamos
       var prestamos=this.state.prestamos
       var prestamo={
           "id": Math.floor(Math.random() * 100) ,
           "fprestamo": this.state.fprestamo,
           "fdevolucion": this.state.fdevolucion,
           "investigador":this.state.investigador,
           "institucion": this.state.institucion
       }
       prestamos.push(prestamo)
       this.setState({prestamos:prestamos, fprestamo:'', fdevolucion:'',investigador:'',institucion:''})
   
 }

 eliminar = (dato) => {
   //aca tambien hay que eliminar en la BD y traer los prestamos
  var opcion = window.confirm("¿Está seguro que deseas eliminar el Prestamo?");
  if (opcion == true) {
    var contador = 0;
    var arreglo = this.state.prestamos;
    arreglo.map((registro) => {
      if (dato.id == registro.id) {
        arreglo.splice(contador, 1);
      }
      contador++;
    });
    this.setState({ prestamos: arreglo});
  }
};


editar = (dato) => {
  //update en la BD
  var contador = 0;
  var arreglo = this.state.prestamos;
  arreglo.map((registro) => {
    if (dato.id == registro.id) {
      arreglo[contador].fprestamo = dato.fprestamo;
      arreglo[contador].fdevolucion = dato.fdevolucion;
      arreglo[contador].investigador = dato.investigador;
      arreglo[contador].institucion = dato.institucion;
    }
    contador++;
  });
  this.setState({ prestamos: arreglo, modalActualizar: false });
};

mostrarModalActualizar = (dato) => {
 console.log(dato);
  this.setState({
    form: dato,
    modalActualizar: true,
  });
};

cerrarModalActualizar = () => {
  this.setState({ modalActualizar: false });
};

mostrarModalSubir = (dato) => {
  console.log(dato);
   this.setState({
     form: dato,
     modalSubir: true,
   });
 };

 cerrarModalSubir = () => {
  this.setState({ modalSubir: false });
};

filehandleChange = (event) => {

  const files=  event.target.files;
  var arrayFiles= this.state.archivos;
  

  Array.from(files).forEach(file => {
    var key=Math.floor(Math.random() * 1000); 
    file.id=key;
    arrayFiles.push(file)
  })
  this.setState({archivos: arrayFiles});

  //aca deberiamos mover el archivo a la carpeta 
  


};




renderTableDataFiles() {

 // console.log(this.state.archivos);

  return this.state.archivos.map((file, index) => {
    
    return (
      <tr key={index}>
       <td>
            <Button variant="danger" type="button" id="eliminar" onClick={()=> this.eliminarArchivo(file)}>
            <FontAwesomeIcon icon={faTrash} />
            </Button>
       </td>
       <td>{file.name}</td>
     
    </tr>
    )
 })



}


eliminarArchivo = (dato) => {
  //aca tambien hay que eliminar en la BD y traer los prestamos
 var opcion = window.confirm("¿Está seguro que deseas eliminar el Archivo?");
 if (opcion == true) {
   var contador = 0;
   var arreglo = this.state.archivos;
   arreglo.map((registro) => {
     if (dato.id == registro.id) {
       arreglo.splice(contador, 1);
     }
     contador++;
   });
   this.setState({ archivos: arreglo});
 }
};


fileodatoshandleChange = (event) => {

  const files=  event.target.files;
  var arrayFiles= this.state.archivosOD;
  

  Array.from(files).forEach(file => {
    var key=Math.floor(Math.random() * 1000); 
    file.id=key;
    arrayFiles.push(file)
  })
  this.setState({archivosOD: arrayFiles});

  console.log('SALIDA::', arrayFiles)

  //aca deberiamos mover el archivo a la carpeta 
  


};




renderTableDataFilesODatos() {

  return this.state.archivosOD.map((file, index) => {
    
    return (
      <tr key={index}>
       <td>
            <Button variant="danger" type="button" id="eliminarOD" onClick={()=> this.eliminarArchivoODatos(file)}>
            <FontAwesomeIcon icon={faTrash} />
            </Button>
       </td>
       <td>{file.name}</td>
     
    </tr>
    )
 })


}


eliminarArchivoODatos = (dato) => {
  //aca tambien hay que eliminar en la BD y traer los prestamos
 var opcion = window.confirm("¿Está seguro que deseas eliminar el Archivo?");
 if (opcion == true) {
   var contador = 0;
   var arreglo = this.state.archivosOD;
   arreglo.map((registro) => {
     if (dato.id == registro.id) {
       arreglo.splice(contador, 1);
     }
     contador++;
   });
   this.setState({ archivosOD: arreglo});
 }
};

 


	
 render()
 {
	   /* const { selectedPais } = this.state; 
        const { selectedProvincia } = this.state; 
        const { selectedCiudad } = this.state;*/
        const { selectedExcavacion } = this.state;
       // const { selectedTipo } = this.state;
       // const { selectedColeccion} = this.state;
		const {validated} = this.state;
    const {validateddim} = this.state;
    const {validatedgeo} = this.state;
    const {validatedtax} = this.state;
    const {validatedarea} = this.state;
    const {validatedpres} = this.state;
    const {validatedotros} = this.state;

       /* let optPaises = this.state.paises.map((opt) => ({ label: opt.nombre, value: opt._id }) );
        let optProvincias = this.state.provincias.map((opt) => ({ label: opt.nombre, value: opt._id }) );
        let optCiudades = this.state.ciudades.map((opt) => ({ label: opt.nombre, value: opt._id }) );*/
        let optExcavaciones = this.state.excavaciones.map((opt) => ({ label: opt.nombre, value: opt._id }) );
      //  let optColecciones = this.state.colecciones.map((opt) => ({ label: opt.nombre, value: opt._id }) );

      const { selectedColector } = this.state;
      let optColectores = this.state.colectores.map((opt) => ({
        label: opt.nombres + " " + opt.apellidos,
        value: opt._id,
      }));
		

	 return(
	     <>
        <Menu />
		     <div className="row">
               <div className="col-md-12">
                <div id="contenido" align="left" className="container">
                     <br/>   
                    <h3 className="page-header" align="left">
                       <FontAwesomeIcon icon={faPaw} /> Ficha de Ingreso
                    </h3>
                    <hr />
				





  <Tabs id="tabEjemplar" activeKey={this.state.key} onSelect={this.handleSelect}>
  <Tab eventKey="dbasicos" title="Datos Básicos" disabled={this.state.tabbas}>

  <Form id="form1" noValidate validated={validated}>

  <Form.Row >
							  <Form.Group className="col-sm-12" controlId="nombre">
                                <Form.Label>Sigla:</Form.Label>
                                <Form.Control type="text" placeholder="Obligatorio" autoComplete="off" required onChange={this.handleNombreChange} value={this.state.nombre} />
                                <Form.Control.Feedback type="invalid">
                                Por favor, ingrese Sigla.
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Form.Row>
							
							<Form.Row >
							 
							
								<Form.Group className="col-sm-4" controlId="fechaColeccion">
								 <Form.Label>Fecha Ingreso:</Form.Label>
                                    <Form.Control type="date" value={this.state.fechaColeccion}
                                                    onChange={this.handleFechaColeccionChange} required/>
                                                    <Form.Control.Feedback type="invalid">
                                Por favor, ingrese Fecha.
                                </Form.Control.Feedback>
								</Form.Group>


                <Form.Group className="col-sm-8" controlId="coleccion">
								   <Form.Label>Tipo Colección:</Form.Label>
					
                   <Form.Control
                          as="select"
                          onChange={this.handleColeccionesChange} 
                          required
                      >
                        <option value="">Seleccione Opción</option>
                        {
                           this.state.colecciones.map(item=>(
                             <option key={item._id} value={item._id}>{item.nombre}</option>
                           ))

                        }
                        
                        
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                                Por favor, ingrese Tipo.
                                </Form.Control.Feedback>

								</Form.Group>
							
							</Form.Row>
							
							<Form.Row >
							 <Form.Group className="col-sm-4" controlId="fbaja">
                                    <Form.Label>Fecha Baja:</Form.Label>
                                    <Form.Control type="date"  value={this.state.fbaja} onChange={this.handleFbajaChange}/>
                            </Form.Group>

                            <Form.Group className="col-sm-8" controlId="motivo">
                                    <Form.Label>Motivo Baja:</Form.Label>
                                    <Form.Control as="textarea" rows={3}  value={this.state.motivo} onChange={this.handleMotivoChange}/>
                            </Form.Group>
							</Form.Row>

             
              <Form.Row >
							 <Form.Group controlId="muestraHome">
									<Form.Check inline 
									            type="checkbox" 
												label="Muestra en Página Web?" 
												checked={this.state.muestraHome}
												onChange={this.handleMuestraChange.bind(this)} 
												/>
						      </Form.Group>
                             </Form.Row>
                
                <Form.Row >
                  <Button variant="outline-secondary" type="button" id="siguiente" onClick={this.handleForm1}>
								  Siguiente <FontAwesomeIcon icon={faShare} /> 
								  </Button>  
                </Form.Row>  
    </Form> 

  </Tab>
 


  

  <Tab eventKey="ddimensiones" title="Dimensiones" disabled={this.state.tabdim}>
  <Form id="form2" noValidate validated={validateddim} >
    <Form.Row >
							<Form.Group className="col-sm-4" controlId="dimensionAlto">
                                <Form.Label>Alto:</Form.Label>
                                <Form.Control type="text" placeholder="Obligatorio" autoComplete="off" required onChange={this.handleDimensionAltoChange} value={this.state.dimensionAlto} />
                                <Form.Control.Feedback type="invalid">
                                Por favor, ingrese Dimensión Alto.
                                </Form.Control.Feedback>
                              </Form.Group>
							  
							   <Form.Group className="col-sm-4" controlId="dimensionLargo">
                                <Form.Label>Largo:</Form.Label>
                                <Form.Control type="text" placeholder="Obligatorio" autoComplete="off" required value={this.state.dimensionLargo} onChange={this.handleDimensionLargoChange} />
                                <Form.Control.Feedback type="invalid">
                                Por favor, ingrese Largo.
                                </Form.Control.Feedback>
                              </Form.Group>
							  
							  <Form.Group className="col-sm-4" controlId="dimensionAncho">
                                <Form.Label>Ancho:</Form.Label>
                                <Form.Control type="text" placeholder="Obligatorio" autoComplete="off" required onChange={this.handleDimensionAnchoChange} value={this.state.dimensionAncho} />
                                <Form.Control.Feedback type="invalid">
                                Por favor, ingrese Ancho.
                                </Form.Control.Feedback>
                              </Form.Group>
							
				</Form.Row>
        <Form.Row >
                <Button variant="outline-secondary" type="button" id="anterior1" onClick={this.handleAntForm2}>
								   <FontAwesomeIcon icon={faReply} /> Anterior
								  </Button> 
                  &nbsp;
                  <Button variant="outline-secondary" type="button" id="siguiente1" onClick={this.handleForm2}>
								  Siguiente <FontAwesomeIcon icon={faShare} /> 
								  </Button>  
        </Form.Row>  

        </Form>	   
  </Tab>
  <Tab eventKey="dgeologicos" title="Datos Geológicos" disabled={this.state.tabgeo}>
  <Form id="form3" noValidate validated={validatedgeo} >

  <Form.Row >
							
              <Form.Group className="col-sm-4" controlId="formacion">
                              <Form.Label>Formación:</Form.Label>
                              <Form.Control type="text"  autoComplete="off"  onChange={this.handleFormacionChange} value={this.state.formacion} />
                            </Form.Group>
              
               <Form.Group className="col-sm-4" controlId="grupo">
                              <Form.Label>Grupo:</Form.Label>
                              <Form.Control type="text"  autoComplete="off"  onChange={this.handleGrupoChange} value={this.state.grupo} />
                            </Form.Group>
              
               <Form.Group className="col-sm-4" controlId="subgrupo">
                              <Form.Label>Subgrupo:</Form.Label>
                              <Form.Control type="text"  autoComplete="off"  onChange={this.handleSubgrupoChange} value={this.state.subgrupo} />
                            </Form.Group>

            </Form.Row>

            <Form.Row >
							
							  <Form.Group className="col-sm-4" controlId="edad">
                                <Form.Label>Edad:</Form.Label>
                                <Form.Control type="text"  autoComplete="off"  onChange={this.handleEdadChange} value={this.state.edad} />
                              </Form.Group>
							  
							   <Form.Group className="col-sm-4" controlId="perido">
                                <Form.Label>Período:</Form.Label>
                                <Form.Control type="text"  autoComplete="off"  onChange={this.handlePeriodoChange} value={this.state.periodo} />
                              </Form.Group>
							  
							   <Form.Group className="col-sm-4" controlId="era">
                                <Form.Label>Era:</Form.Label>
                                <Form.Control type="text"  autoComplete="off"  onChange={this.handleEraChange} value={this.state.era} />
                              </Form.Group>

							</Form.Row>
              <Form.Row >
                  <Button variant="outline-secondary" type="button" id="anterior2" onClick={this.handleAntForm3}>
								   <FontAwesomeIcon icon={faReply} /> Anterior
								  </Button> 
                  &nbsp;
                  <Button variant="outline-secondary" type="button" id="siguiente2" onClick={this.handleForm3}>
								  Siguiente <FontAwesomeIcon icon={faShare} /> 
								  </Button>  
             </Form.Row>  

     </Form>         
  </Tab>
  <Tab eventKey="dtaxonomicos" title="Datos Taxonómicos" disabled={this.state.tabtax}>

  <Form id="form4" noValidate validated={validatedtax} >
     <Form.Row >
							
              <Form.Group className="col-sm-4" controlId="reino">
                              <Form.Label>Reino:</Form.Label>
                              <Form.Control type="text"  autoComplete="off"  onChange={this.handleReinoChange} value={this.state.reino} />
                            </Form.Group>
              
               <Form.Group className="col-sm-4" controlId="filo">
                              <Form.Label>Filo:</Form.Label>
                              <Form.Control type="text"  autoComplete="off"  onChange={this.handleFiloChange} value={this.state.filo} />
                            </Form.Group>
              
               <Form.Group className="col-sm-4" controlId="clase">
                              <Form.Label>Clase:</Form.Label>
                              <Form.Control type="text"  autoComplete="off"  onChange={this.handleClaseChange} value={this.state.clase} />
                            </Form.Group>

            </Form.Row>
            
            <Form.Row >
            
              <Form.Group className="col-sm-4" controlId="orden">
                              <Form.Label>Orden:</Form.Label>
                              <Form.Control type="text"  autoComplete="off"  onChange={this.handleOrdenChange} value={this.state.orden} />
                            </Form.Group>
              
               <Form.Group className="col-sm-4" controlId="familia">
                              <Form.Label>Familia:</Form.Label>
                              <Form.Control type="text"  autoComplete="off"  onChange={this.handleFamiliaChange} value={this.state.familia} />
                            </Form.Group>
              
               <Form.Group className="col-sm-4" controlId="genero">
                              <Form.Label>Género:</Form.Label>
                              <Form.Control type="text"  autoComplete="off"  onChange={this.handleGeneroChange} value={this.state.genero} />
                            </Form.Group>

            </Form.Row>
            
            <Form.Row>
               <Form.Group className="col-sm-12" controlId="especie">
                              <Form.Label>Especie:</Form.Label>
                              <Form.Control type="text" autoComplete="off"  onChange={this.handleEspecieChange} value={this.state.especie} />
               </Form.Group>	
            </Form.Row>

            <Form.Row >
                  <Button variant="outline-secondary" type="button" id="anterior3" onClick={this.handleAntForm4}>
								   <FontAwesomeIcon icon={faReply} /> Anterior
								  </Button> 
                  &nbsp;
                  <Button variant="outline-secondary" type="button" id="siguiente3" onClick={this.handleForm4}>
								  Siguiente <FontAwesomeIcon icon={faShare} /> 
								  </Button>  
             </Form.Row>  
     </Form>       

  </Tab>
  <Tab eventKey="darea" title="Área de Hallazgo" disabled={this.state.tabarea}>
   <Form id="form5" noValidate validated={validatedarea} >
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
							    <Form.Group className="col-sm-12" controlId="excavacion">
									<Form.Label>Excavación:</Form.Label>
									 <Select
											placeholder={'Seleccione Excavación'}
											options={optExcavaciones} 
											onChange={this.handleExcavacionesChange} 
											value={selectedExcavacion}
											isClearable
									  />
                	</Form.Group>    
              	</Form.Row>
                <Form.Row >
                  <Button variant="outline-secondary" type="button" id="anterior4" onClick={this.handleAntForm5}>
								   <FontAwesomeIcon icon={faReply} /> Anterior
								  </Button> 
                  &nbsp;
                  <Button variant="outline-secondary" type="button" id="siguiente4" onClick={this.handleForm5}>
								  Siguiente <FontAwesomeIcon icon={faShare} /> 
								  </Button>  
             </Form.Row>   

    </Form>
  </Tab>



  <Tab eventKey="dotros" title="Otros Datos" disabled={this.state.tabotros}>
  <Form id="form7" noValidate validated={validatedotros} >
  <Form.Row>
							   <Form.Group className="col-sm-12" controlId="ubicacion">
                                <Form.Label>Ubicación:</Form.Label>
                                <Form.Control type="text" autoComplete="off"   onChange={this.handleUbicacionChange} value={this.state.ubicacion} />
							   </Form.Group>	
							</Form.Row>

              <Form.Row >


                <Form.Group className="col-sm-6" controlId="ingresadoPor">
								   <Form.Label>Material Ingresado Por:</Form.Label>
					
                   <Form.Control
                          as="select"
                          className="form-control"
                          onChange={this.handleIngresadoPorChange} 
                          required
                      >
                        <option value="">Seleccione Opción</option>
                        <option value="1">Donación</option>
                        <option value="2">Excavación realizada MUC</option>
                        <option value="3">Otros</option>
                        
                        
                        
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                                Por favor, seleccione opción.
                                </Form.Control.Feedback>

								</Form.Group>
							

                    <Form.Group className="col-sm-6" controlId="colector">
                      <Form.Label>Colector:</Form.Label>
                      <Select
                        placeholder={"Seleccione Opción"}
                        options={optColectores}
                        onChange={this.handleColectorChange}
                        value={selectedColector}
                        isClearable
                      />
                    </Form.Group>
                  </Form.Row>

							
							<Form.Row >
							   <Form.Group className="col-sm-12" controlId="descripcion1">
                                <Form.Label>Tipo de Intervención:</Form.Label>
                                <Form.Control as="textarea" rows={3}   value={this.state.descripcion1} onChange={this.handleDescripcion1Change} />
                               </Form.Group>
							</Form.Row>
							
							<Form.Row >
							   <Form.Group className="col-sm-12" controlId="descripcion1A">
                                <Form.Label>Autores:</Form.Label>
                                <Form.Control as="textarea" rows={3}  value={this.state.descripcion1A} onChange={this.handleDescripcion1AChange} />
                               </Form.Group>
							</Form.Row>
							
							<Form.Row >
							   <Form.Group className="col-sm-12" controlId="descripcion2">
                                <Form.Label>Publicaciones:</Form.Label>
                                <Form.Control as="textarea" rows={3}   value={this.state.descripcion2} onChange={this.handleDescripcion2Change} />
                               </Form.Group>
							</Form.Row>
            
              <Form.Row>
            {/*    <Form.Group className="col-sm-6" controlId="archivopdf">
               
                      <Form.File id="archivopdf"  label="Archivos:" multiple onChange={this.fileodatoshandleChange.bind(this)} />*/}
                  <Form.Group className="col-sm-8" >
                                <Form.Label>Curriculum Vitae:</Form.Label>
                                <input type="file" id="archivopdf" className="form-control"  accept="application/pdf" onChange={this.fileodatoshandleChange.bind(this)}  />
                           </Form.Group>
            
              </Form.Row>

              <Form.Row>
                    <Form.Group className="col-sm-6" controlId="archivopdf">
                      
                        <Table striped bordered hover  responsive>
                            <thead className="thead-dark">
                            <tr>
                                <th>Acción</th>
                                <th>Nombre</th>
                              </tr>
                            </thead>	
                            <tbody>
                               {this.renderTableDataFilesODatos()}
                            </tbody>
                          </Table> 
                        
                             
                        </Form.Group>
              </Form.Row>


          
					<Form.Row >
							   <Form.Group className="col-sm-12" controlId="descripcion3">
                                <Form.Label>Observaciones Adicionales:</Form.Label>
                                <Form.Control as="textarea" rows={3}   value={this.state.descripcion3} onChange={this.handleDescripcion3Change} />
                               </Form.Group>
							</Form.Row>

              <hr/>
                      <Form.Row> 
					<Form.Group className="mx-sm-3 mb-2">
								  <Button variant="primary" type="submit" id="guardar">
								  <FontAwesomeIcon icon={faSave} /> Guardar
								  </Button>
								  &nbsp;&nbsp;
								 <Link to='/ejemplares'>
								  <Button variant="danger" type="button" id="volver">
								  <FontAwesomeIcon icon={faTimesCircle} /> Cancelar
								  </Button>
								  </Link>
  
							</Form.Group>
					  </Form.Row>					  
     </Form>
  </Tab>

  <Tab eventKey="dprestamos" title="Préstamos" disabled={this.state.tabpres}>
  <Form id="form6" noValidate validated={validatedpres} >
      <Form.Row>
                <Form.Group className="col-sm-3" controlId="fprestamo">
                                <Form.Label>Fecha Préstamo:</Form.Label>
                                <Form.Control type="date" autoComplete="off" name="fprestamo"  onChange={this.handleFPrestamoChange} value={this.state.fprestamo} />
							   </Form.Group>	

                 <Form.Group className="col-sm-3" controlId="fdevolucion">
                                <Form.Label>Fecha Devolución:</Form.Label>
                                <Form.Control type="date" autoComplete="off"  name="fdevolucion" onChange={this.handleFDevolucionChange} value={this.state.fdevolucion} />
							   </Form.Group>

                 <Form.Group className="col-sm-3" controlId="investigador">
                                <Form.Label>Investigador Resposable:</Form.Label>
                                <Form.Control type="text" autoComplete="off" name="investigador"  onChange={this.handleInvestigadorChange} value={this.state.investigador} />
							   </Form.Group>	

                 <Form.Group className="col-sm-3" controlId="institucion">
                                <Form.Label>Institución:</Form.Label>
                                <Form.Control type="text" autoComplete="off" name="institucion"  onChange={this.handleInstitucionChange} value={this.state.institucion} />
							   </Form.Group>		

                 



     </Form.Row>

     <Form.Row> 
					<Form.Group className="mx-sm-3 mb-2">
								  <Button variant="primary" type="button" id="guardarPres" onClick={() => this.insertar()}>
								  <FontAwesomeIcon icon={faPlus} /> Agregar
								  </Button>
							</Form.Group>
			</Form.Row>	
    
      <Form.Row>
      <Table striped bordered hover  responsive>
         <thead className="thead-dark">
         <tr>
           <th>Acción</th>
            <th>Fecha Préstamo</th>
            <th>Fecha Devolución</th>
            <th>Investigador Responsable</th>
            <th>Institución</th>
            <th>Archivos</th>
          </tr>
        </thead>	
        <tbody>
             {this.renderTableData()}
        </tbody>
      </Table> 
      </Form.Row>   
             <Form.Row >
                  <Button variant="outline-secondary" type="button" id="anterior5" onClick={this.handleAntForm6}>
								   <FontAwesomeIcon icon={faReply} /> Anterior
								  </Button> 
								
             </Form.Row>   
 
    </Form>
   </Tab>

  
</Tabs>


<Modal
        show={this.state.modalActualizar}
        onHide={() => this.cerrarModalActualizar()}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Editar Préstamo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
              <Form.Row>
                      <Form.Group className="col-sm-12" controlId="id">
                              <Form.Control as="input" type="hidden"  value={this.state.form.id} />
                      </Form.Group>
              </Form.Row>
              <Form.Row>
                      <Form.Group className="col-sm-6" controlId="fprestamo">
                                      <Form.Label>Fecha Préstamo:</Form.Label>
                                      <Form.Control type="date" autoComplete="off" name="fprestamo"   onChange={this.handleChange} value={this.state.form.fprestamo} />
                      </Form.Group>	

                      <Form.Group className="col-sm-6" controlId="fdevolucion">
                                      <Form.Label>Fecha Devolución:</Form.Label>
                                      <Form.Control type="date" autoComplete="off" name="fdevolucion"   onChange={this.handleChange} value={this.state.form.fdevolucion} />
                      </Form.Group>
              </Form.Row>

              <Form.Row> 
                  <Form.Group className="col-sm-12" controlId="investigador">
                                      <Form.Label>Investigador Responsable:</Form.Label>
                                      <Form.Control type="text" autoComplete="off" name="investigador"  onChange={this.handleChange} value={this.state.form.investigador} />
                      </Form.Group>	
              </Form.Row>  
              <Form.Row>
                      <Form.Group className="col-sm-12" controlId="institucion">
                                      <Form.Label>Institución:</Form.Label>
                                      <Form.Control type="text" autoComplete="off"  name="institucion"  onChange={this.handleChange} value={this.state.form.institucion} />
                      </Form.Group>		


              </Form.Row> 

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => this.cerrarModalActualizar()}>
            Cerrar
          </Button>
          <Button variant="primary" id="guardarAct" onClick={() => this.editar(this.state.form)}> <FontAwesomeIcon icon={faSave} /> Guardar</Button>
        </Modal.Footer>
      </Modal>


      <Modal
        show={this.state.modalSubir}
        onHide={() => this.cerrarModalSubir()}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Archivos Adjuntos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
              <Form.Row>
                      <Form.Group className="col-sm-12" controlId="id">
                              <Form.Control as="input" type="hidden"  value={this.state.form.id} />
                      </Form.Group>
              </Form.Row>
              <Form.Row>
                      <Form.Group className="col-sm-12" controlId="filesPrestamo">
                      <Form.File id="filesPrestamo" label="Archivos:" onChange={this.filehandleChange.bind(this)} multiple/>
                      </Form.Group>	        
              </Form.Row>
              <Form.Row>
                    <legend>Lista </legend>
                    <hr/>
                      <Form.Group className="col-sm-12" controlId="id">
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

    

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => this.cerrarModalSubir()}>
            Cerrar
          </Button>
        
        </Modal.Footer>
      </Modal>



					
						   

          
							
						 {/*  <Form.Group className="col-sm-4" controlId="tipoEjemplar">
								<Form.Label>Tipo Ejemplar:</Form.Label>
								  <Select  
                                                    placeholder={'Seleccione Tipo'}
                                                    options={optTipos} 
                                                    onChange={this.handleTipoChange} 
                                                    value={selectedTipo}
												
                                                    />
                </Form.Group> */}


  
						
							
							
							

    		{/*	   <Select      
                                                    placeholder={'Seleccione Colección'}
                                                    options={optColecciones} 
                                                    onChange={this.handleColeccionesChange} 
                                                    value={selectedColeccion}
													isClearable
              /> */}

						

					{/*		
							<Form.Row >
							   <Form.Group className="col-sm-12" controlId="alimentacion">
                                <Form.Label>Alimentación:</Form.Label>
                                <Form.Control type="text" autoComplete="off"   onChange={this.handleAlimentacionChange} value={this.state.alimentacion} />

                               </Form.Group>
          </Form.Row>*/}

    

        
			

                {/*      
							  
							    <Form.Group className="col-sm-6" controlId="pais">
									<Form.Label>País:</Form.Label>
									<Select 
											placeholder={'Seleccione País'} 
											options={optPaises}
											onChange={this.handlePaisChange} 
											value={selectedPais} 
											isDisabled
									/>
									
									</Form.Group>
							</Form.Row>
							
							 <Form.Row >
                              <Form.Group className="col-sm-6" controlId="provincia">
                                <Form.Label>Provincia:</Form.Label>
                                <Select 
                                        placeholder={'Seleccione Provincia'} 
                                        options={optProvincias}
                                        onChange={this.handleProvinciaChange} 
                                        value={selectedProvincia} 
										isDisabled
										/>
                                
                            </Form.Group>
                            <Form.Group className="col-sm-6" controlId="ciudad">
                                <Form.Label>Ciudad:</Form.Label>
                                <Select 
                                        placeholder={'Seleccione Ciudad'} 
                                        options={optCiudades}
                                        onChange={this.handleCiudadChange} 
                                        value={selectedCiudad} 
										isDisabled
										/>
                                
                            </Form.Group>
                </Form.Row> */}
							 
						 
					
			    </div>
              </div> 
        </div>		
		 </>
	    
	 )
	 
 } 
	
}	
export default AddEjemplar;  