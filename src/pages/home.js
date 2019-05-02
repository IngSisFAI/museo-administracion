import React from 'react';
import logo from './logo-universidad.png';





export default () => (
    <div>
          <div className="container">
                        <div style={{paddingTop:'5%', textAlign:'center'}}>              
                                <h2>MUSEO DE GEOLOGÍA Y PALEONTOLOGÍA</h2>
                                <span style={{textAlign: 'center', fontSize: '18px', color:'#777'}} >Universidad Nacional del Comahue</span>
                
                        </div>
                        
                        <div  style={{paddingTop:'2%', textAlign:'center'}}>
                            <img style={{maxWidth:'1000px', maxHeight:'700px'}} src={logo}/> 
                        </div>              
         </div>
    </div>
);