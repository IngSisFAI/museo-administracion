import React from 'react';
import {NavLink, withRouter}  from 'react-router-dom'
class Navbar extends React.Component {
    getNavLinkClass = (path) => {
        return this.props.location.pathname === path ? 'active' : '';
    }
    render() {
        
        return (
        
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <a className="navbar-brand" href="/">
                    <span className="fa fa-home fa-lg">
                    </span>
                </a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                 
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
<<<<<<< HEAD
                            Operaciones
                            </a>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                            <a className="dropdown-item" href="/personas"><span className="fa fa-users">
                    </span> Gestión de Personas</a>
                            
                            <div className="dropdown-divider"></div>
=======
                            Catálogo
                            </a>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                            
                            
                            <div className="dropdown-divider"></div>
                            <a className="dropdown-item" href="/personas"><span className="fa fa-users">
                    </span> Personas</a>
>>>>>>> 2612c23c0459c228666e70167540712941074266
                                <a className="dropdown-item" href="/excavaciones"><span className="fa fa-compass">
                    </span> Excavaciones</a>
                                <a className="dropdown-item" href="/exploraciones"><span className="fa fa-map-marker">
                    </span> Exploraciones</a>
<<<<<<< HEAD
=======
					 <a className="dropdown-item" href="/ejemplares"><span className="fa fa-paw">
                    </span> Ejemplares</a>
                    <a className="dropdown-item" href="/bochones"><span className="fa fa-hand-lizard-o">
                    </span> Bochones</a>
>>>>>>> 2612c23c0459c228666e70167540712941074266
                            </div>
                        </li>

                    </ul>
                    
                </div>
             </nav>
         
   
        )
    }
};
Navbar = withRouter(Navbar);
export default Navbar;