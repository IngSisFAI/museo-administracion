import React from 'react';
import logo from './logo_muc.jpg';
import Menu from './Menu'
import Cookies from 'universal-cookie';

const cookies = new Cookies();


class Home extends React.Component {

    componentDidMount()
    {
      if(!cookies.get('username') && !cookies.get('password'))
      {
          window.location.href='/';
      }

    }

render(){

    return (
        <>
        <div>
         <Menu />
          <div className="container">
                        <div style={{paddingTop:'5%', textAlign:'center'}}>              
                                <h2>MUSEO DE CIENCIAS NATURALES</h2>
                                <span style={{textAlign: 'center', fontSize: '22px', color:'#777', fontWeight: 'bold'}} >Sistema de Administración</span>
                                <br/><span style={{textAlign: 'center', fontSize: '18px', color:'#777'}} >Universidad Nacional del Comahue</span>
                
                        </div>
                        
                        <div  style={{paddingTop:'2%', textAlign:'center'}}>
                            <img className="img-fluid" src={logo} /> 
                        </div>              
         </div>
    </div>
        </>
    )
}
}
export default Home;



