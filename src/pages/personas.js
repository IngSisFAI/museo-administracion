import React from 'react';
import ListarPersonas from '../components/personas/listarPersonas'

export default () => (

  <div> 
     <div className="row">
	   <div className="col-md-12">
            <div id="contenido" align="left" className="container">
            <h2 className="page-header" align="left"> Gesti&oacute;n de Personas</h2>  
            <hr/>

                <form className="form-horizontal">
                
                    <div className="form-group">
                        <div className="col-sm-6">
                            <label htmlFor="nombre">Nombre:</label>
                            <input name="nombre" type="text" className="form-control"  />
                        </div>

                        <div className="col-sm-6">
                            <label htmlFor="apellido">Apellido:</label>
                            <input name="apellido" type="text" className="form-control"  />
                        </div>

                        <div className="col-sm-6">
                            <label htmlFor="dni">Nro. Doc.:</label>
                            <input name="dni" type="text" className="form-control"  />
                        </div>
                        
                    </div>
                   
                    <div className="form-group">
                     <div className="col-sm-6">
                            <button className="btn btn-outline-success my-2 my-sm-0" 
                                            type="submit"><span className="fa fa-search"></span> 
                                    Buscar</button>
                            &nbsp;&nbsp;
                            <a className="btn btn-outline-primary my-2 my-sm-0" 
                             href="/addPersona"><span className="fa fa-plus"></span> Agregar</a>
                      </div>
                    </div>

                </form>

                <form className="form-horizontal">
                <legend>Listado</legend>
                <hr/>
                    <ListarPersonas />
                </form>
            
            </div>
        </div>
      </div>


    

   </div>

);