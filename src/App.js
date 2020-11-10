import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Menu from "./components/Menu"

import Home from './components/home'

//Personas
import Personas from './components/personas/MainPersonas'
import AddPersona from './components/personas/AddPersona'
import EditPersona from './components/personas/EditPersona'

//Exploraciones
import Exploraciones from './components/exploraciones/MainExploraciones'
import AddExploracion from './components/exploraciones/AddExploracion'
import EditExploracion from './components/exploraciones/EditExploracion'

//Excavaciones
import Excavaciones from './components/excavaciones/MainExcavaciones'
import AddExcavacion from './components/excavaciones/AddExcavacion'
import EditExcavacion from './components/excavaciones/EditExcavacion'
import Multimedia from './components/excavaciones/MultimediaExcavacion'

//Ejemplares
import Ejemplares from './components/ejemplares/MainEjemplares'
import AddEjemplar from './components/ejemplares/AddEjemplar'
import EditEjemplar from './components/ejemplares/EditEjemplar'
import MultimediaEjemplar from './components/ejemplares/MultimediaEjemplar'

//Bochones
import Bochones from './components/bochones/MainBochones'
import AddBochon from './components/bochones/AddBochon'
import EditBochon from './components/bochones/EditBochon'



class App extends Component {

  render() {
    return (
    

        <BrowserRouter>
		   <Menu />
           <Switch>
            <Route exact path="/" component={Home} />

            <Route path="/personas" component={Personas} />
            <Route path="/addPersona" component={AddPersona} />
            <Route path="/editPersona/:id" component={EditPersona} /> 

           
            <Route path="/exploraciones" component={Exploraciones} />
            <Route path="/addExploracion" component={AddExploracion} />
            <Route path="/editExploracion/:id" component={EditExploracion} />

            <Route path="/excavaciones" component={Excavaciones} />
            <Route path="/addExcavacion" component={AddExcavacion} />
            <Route path="/editExcavacion/:id" component={EditExcavacion} />
            <Route path="/multimedia/:id" component={Multimedia} />


            <Route path="/ejemplares" component={Ejemplares} />
            <Route path="/addEjemplar" component={AddEjemplar} />
            <Route path="/editEjemplar/:id" component={EditEjemplar} />
            <Route path="/multimediaEjemplar/:id" component={MultimediaEjemplar} />

            <Route path="/bochones" component={Bochones} />
            <Route path="/addBochon" component={AddBochon} />
            <Route path="/editBochon/:id" component={EditBochon} />
			
			
			<Route component={Home} />
  
            </Switch>
        </BrowserRouter>
   
    );
  }
}

export default App;
