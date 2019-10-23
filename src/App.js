import React, { Component } from 'react';

import Home from './pages/home'

import Personas from './pages/personas'
import AddPersona from './components/personas/addPersona'
import EditPersona from './components/personas/editPersona'
import DeletePersona from './components/personas/deletePersona'

import Excavaciones from './pages/excavaciones'
import AddExcavacion from './components/excavaciones/addExcavacion'
import EditExcavacion from './components/excavaciones/editExcavacion'
import DeleteExcavacion from './components/excavaciones/deleteExcavacion'
import Multimedia from './components/excavaciones/multimedia'

import Exploraciones from './pages/exploraciones'
import AddExploracion from './components/exploraciones/addExploracion'
import EditExploracion from './components/exploraciones/editExploracion'
import DeleteExploracion from './components/exploraciones/deleteExploracion'


import Ejemplares from './pages/ejemplares'
import AddEjemplar from './components/ejemplares/addEjemplar'
import EditEjemplar from './components/ejemplares/editEjemplar'
import DeleteEjemplar from './components/ejemplares/deleteEjemplar'
import MultimediaEjemplar from './components/ejemplares/multimediaEjemplar'


import Bochones from './pages/bochones'
import AddBochon from './components/bochones/addBochon'
import EditBochon from './components/bochones/editBochon'
import DeleteBochon from './components/bochones/deleteBochon'


import { BrowserRouter, Route } from 'react-router-dom'
import Nav from "./components/Navbar"
import './App.css';


class App extends Component {

  render() {
    return (
      <div className="App">
       
        <BrowserRouter>
          <div>
            <Nav />
            <Route exact path="/" component={Home} />

            <Route path="/personas" component={Personas} />
            <Route path="/addPersona" component={AddPersona} />
            <Route path="/editPersona/:id" component={EditPersona} />
            <Route path="/deletePersona/:id" component={DeletePersona} />
            <Route path="/multimedia/:id" component={Multimedia} />

            <Route path="/exploraciones" component={Exploraciones} />
            <Route path="/addExploracion" component={AddExploracion} />
            <Route path="/editExploracion/:id" component={EditExploracion} />
            <Route path="/deleteExploracion/:id" component={DeleteExploracion} />

            <Route path="/excavaciones" component={Excavaciones} />
            <Route path="/addExcavacion" component={AddExcavacion} />
            <Route path="/editExcavacion/:id" component={EditExcavacion} />
            <Route path="/deleteExcavacion/:id" component={DeleteExcavacion} />


            <Route path="/ejemplares" component={Ejemplares} />
            <Route path="/addEjemplar" component={AddEjemplar} />
            <Route path="/editEjemplar/:id" component={EditEjemplar} />
            <Route path="/deleteEjemplar/:id" component={DeleteEjemplar} />
            <Route path="/multimediaEjemplar/:id" component={MultimediaEjemplar} />

            <Route path="/bochones" component={Bochones} />
            <Route path="/addBochon" component={AddBochon} />
            <Route path="/editBochon/:id" component={EditBochon} />
            <Route path="/deleteBochon/:id" component={DeleteBochon} />


          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
