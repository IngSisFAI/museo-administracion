import React from 'react';
import logo from './logo-universidad.png';
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
                                <h2>MUSEO DE GEOLOGÍA Y PALEONTOLOGÍA</h2>
                                <span style={{textAlign: 'center', fontSize: '18px', color:'#777'}} >Sistema de Administración</span>
                
                        </div>
                        
                        <div  style={{paddingTop:'2%', textAlign:'center'}}>
                            <img className="img-fluid" src={logo}/> 
                        </div>              
         </div>
    </div>
        </>
    )
}
}
export default Home;



