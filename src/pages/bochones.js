import React from 'react';
import ListarBochones from '../components/bochones/listarBochones'



export default () => (

  <div> 
       <div className="row">
	   <div className="col-md-12">
            <div id="contenido" align="left" className="container">
            <h2 className="page-header" align="left"> <i class="fa fa-hand-lizard-o" aria-hidden="true"></i>    Gesti&oacute;n de Bochones</h2>  
            <hr/>

                <form className="form-horizontal">
                
                    <div className="form-group">
                        <div className="col-sm-6">
                            <label htmlFor="nombre">Nombre:</label>
                            <input name="nombre" type="text" className="form-control"  />
                        </div>   
                    </div>
                   
                    <div className="form-group">
                     <div className="col-sm-6">
                            <button className="btn btn-outline-success my-2 my-sm-0" 
                                            type="submit"><span className="fa fa-search"></span> 
                                    Buscar</button>
                            &nbsp;&nbsp;
                            <a className="btn btn-outline-primary my-2 my-sm-0" 
                             href="/addBochon"><span className="fa fa-plus"></span> Agregar</a>
                      </div>
                    </div>

                </form>

                <form className="form-horizontal">
                <legend>Listado</legend>
                <hr/>
                   <ListarBochones/>
                   
                </form>
            
            </div>
        </div>
      </div>
   </div>

);