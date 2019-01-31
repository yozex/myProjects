import React from 'react';
import {Highscores} from './highscores';

export class Finish extends React.Component{
    constructor(props){
        super(props);
        this.state = {display:this.props.shouldILoad, showHighscores:'none'};   //display - when the game ends, activate this component
        this.reloadGame = this.reloadGame.bind(this);
        this.showHighscores = this.showHighscores.bind(this);
    }
    componentWillReceiveProps(nextProps, prevState) {
        this.setState({display: nextProps.shouldILoad});
    }
    reloadGame(){
        window.location.reload();
    }
    showHighscores(){
        this.setState({showHighscores:'highscores'});
    }
    render(){
        return (
            <React.Fragment>
            <div className = {this.state.display}>
            <h1>GAME OVER</h1>
            <p>The sheep has escaped to the woods, and the wolf ate it! You lose, GAME OVER!</p>
            <button onClick = {this.reloadGame}>TRY AGAIN</button><br></br><br></br>
            <button onClick = {this.showHighscores}>HIGHSCORES</button>            
            </div>
            <Highscores show = {this.state.showHighscores}/>
            </React.Fragment>
        );
    }
}