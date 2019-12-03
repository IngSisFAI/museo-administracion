import React, {Component} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';



class listarPersonas extends Component {

  constructor(props) {
    super(props);
    this.state = {personas:[]}
   
  }

 


  componentDidMount(){
   
   
    if(window.location.search.substring(1)=="")
    {
        axios.get('api/persona')
          .then(response => {
           this.setState({ personas: response.data.personas });
          })
          .catch(function (error) {
            console.log(error);
          })
    }
    else{

      const urlParams = new URLSearchParams(window.location.search.substring(1))
      const keyDni = urlParams.get('dni')
      const keyNombre = urlParams.get('nombre')
      const keyApellido = urlParams.get('apellido')
      var URL=''

      if(keyDni!=="" && keyApellido!=="" && keyNombre!=="")
      {
        URL= 'api/personasFiltro/'+keyDni+'&'+keyNombre+'&'+keyApellido
      }

      if(keyDni==="" && keyApellido==="" && keyNombre==="")
      {
        URL='api/persona'
      }

      if(keyDni==="" && keyApellido!=="" && keyNombre!=="")
      {
        URL='api/personaNombreApellido/'+keyNombre+'&'+keyApellido
      }

      if(keyDni!=="" && keyApellido==="" && keyNombre!=="")
      {
        URL='api/personaNombreDNI/'+keyNombre+'&'+keyDni
      }

      if(keyDni!=="" && keyApellido!=="" && keyNombre==="")
      {
        URL='api/personaApellidoDNI/'+keyApellido+'&'+keyDni
      }

      if(keyDni==="" && keyApellido==="" && keyNombre!=="")
      {
        URL='api/personaName/'+keyNombre
      }

      if(keyDni==="" && keyApellido!=="" && keyNombre==="")
      {
        URL='api/personaApellido/'+keyApellido
      }

      if(keyDni!=="" && keyApellido==="" && keyNombre==="")
      {
        URL='api/personaNroDoc/'+keyDni
      }


      fetch(URL)
          .then((response) => {
              return response.json()
            })
            .then((persons) => {
              console.log(persons)
              this.setState({ personas: persons.personas})
            });


    }

  }
 

    render() 
    { 
      
      
       // console.log("ARREGLO:",this.state.personas);

        let imprimir= this.state.personas.map(function(persona, i){
        return <tr key={i}><td >{persona.apellidos}</td>
                   <td >{persona.nombres}</td>
                   <td >{persona.dni}</td>
                   <td>
                    <Link to={"/editPersona/"+persona._id} className="btn btn-outline-primary my-2 my-sm-0">
                            <span className="fa fa-edit" title="Editar"></span>
                    </Link>
                    &nbsp;&nbsp;
                    <Link to={"/deletePersona/"+persona._id} className="btn btn-outline-danger my-2 my-sm-0">
                            <span className="fa fa-trash" title="Editar"></span>
                    </Link>
                    
                 

                    </td> 
               </tr>});
       
      return (<div>

                <div className="table-responsive">
                  <table className="table table-bordered table-hover list">
                     <thead className="thead-dark">
                        <tr>               
                              <th>Apellido</th>
                              <th>Nombre</th>
                              <th>Nro. Doc.</th> 
                              <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {imprimir}
                      </tbody>
                   </table>
                </div>
             </div>);

    }
  }
  export default listarPersonas;