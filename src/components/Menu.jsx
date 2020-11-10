import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faUsers, faMapMarked, faCompass, faPaw, faHandLizard } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';

const Menu = () => {
     return   <>
					<Navbar bg="dark" variant="dark" expand="lg">
						<Navbar.Brand as={Link} to={"/"}><FontAwesomeIcon icon={faHome} /></Navbar.Brand>
						<Navbar.Toggle aria-controls="basic-navbar-nav" />
						<Navbar.Collapse id="basic-navbar-nav">
							<Nav className="mr-auto">
							
								<NavDropdown title="Cátalogo" id="basic-nav-dropdown">
									<NavDropdown.Item as={Link} to={"/personas"} ><FontAwesomeIcon icon={faUsers} /> Personas</NavDropdown.Item>
									<NavDropdown.Item as={Link} to={"/exploraciones"} ><FontAwesomeIcon icon={faMapMarked} /> Exploraciones</NavDropdown.Item>
									<NavDropdown.Item as={Link} to={"/excavaciones"} ><FontAwesomeIcon icon={faCompass} /> Excavaciones</NavDropdown.Item>
									<NavDropdown.Item as={Link} to={"/ejemplares"} ><FontAwesomeIcon icon={faPaw} /> Ejemplares</NavDropdown.Item>
									<NavDropdown.Item as={Link} to={"/bochones"} ><FontAwesomeIcon icon={faHandLizard} /> Bochones</NavDropdown.Item>
								</NavDropdown>
							</Nav> 
						</Navbar.Collapse>
					</Navbar>
 
             </> 

}

export default Menu