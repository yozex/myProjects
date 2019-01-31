import React from 'react';
import {Highscores} from './highscores';

export class Intro extends React.Component {
    constructor(props){
        super(props);
        this.state = {clas:'intro', showHighscores:'none'}; // clas determines whether an intro window should be shown or not, showHighscores whether highscores window should close
        this.hideModal = this.hideModal.bind(this);
        this.showHighscores = this.showHighscores.bind(this);
    }
    showHighscores(){
        this.setState({showHighscores:'highscores'});
    }
    hideModal(){
        this.setState({clas:'none',showHighscores:'none'});
    }
    render(){
        return (
            <React.Fragment>
            <div className = {this.state.clas}>
            <h1>CATCH THE SHEEP</h1>
            <p>The goal of the game is to click on as many sheeps as possible, before they reach the woods, and the wolf eats them!</p>
            <button onClick = {() => {this.hideModal();this.props.activate();}}>START A NEW GAME</button><br></br><br></br>
            <button onClick = {this.showHighscores}>HIGHSCORES</button>            
            </div>
            <Highscores show = {this.state.showHighscores}/>
            </React.Fragment>
        );
    }
}