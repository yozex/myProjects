import React from 'react';
import ReactDOM from 'react-dom';
import {CreateEnvironment} from './components/createEnvironment';
import {SheepsStart} from './components/sheepsStart';
import {ScoreCounter} from './components/score';
import {Intro} from './components/intro';
import {Finish} from './components/finish';
import {Sound} from './components/sound';

class MainComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {counter:0,activate:false,gameDone:'none'};    //counter - total score, activate - to activate some components when new game is selected, gameDone - to activate a popup on game end
        this.countScore = this.countScore.bind(this);
        this.startGame = this.startGame.bind(this);
        this.saveScore = this.saveScore.bind(this);
    }
    countScore(){
        this.setState({counter:this.state.counter+1});      //every time you catch the sheep
    }
    startGame(){
        this.setState({activate:true});         //new game starts
    }
    saveScore(){       
        let highscoresNames = JSON.parse(localStorage.getItem('highscoresNames'));      
        let highscoresScores = JSON.parse(localStorage.getItem('highscoresScores'));
        let newPosition;
        let record = false;
        for (let x = 4;x>=0;x--){                       // calculate on which position the new score will move
            if (this.state.counter > parseInt(highscoresScores[x])){
                newPosition = x;
                record = true;
            }
        }
        if (record === true){                                       // if you enter highscore list
            let yourName = prompt("You have reached the highscores list! Enter your name:");
            for (let x = 3;x>=newPosition;x--){                     // sort the new highscore list
                highscoresScores[x+1] = highscoresScores[x];
                highscoresNames[x+1] = highscoresNames[x];
            }
            highscoresScores[newPosition]=this.state.counter;
            highscoresNames[newPosition]=yourName;
        }  
        localStorage.setItem('highscoresNames',JSON.stringify(highscoresNames));    //save new highscores
        localStorage.setItem('highscoresScores',JSON.stringify(highscoresScores)); 
        this.setState({gameDone:'intro'});      //activate finish game popup
    }    
    render(){
        return (
            <React.Fragment>
                <CreateEnvironment/>        
                <Intro activate = {this.startGame}/>
                <SheepsStart onClick = {this.countScore} activate = {this.state.activate} saveScore = {this.saveScore}/>                             
                <ScoreCounter result = {this.state.counter}/>  
                <Finish shouldILoad = {this.state.gameDone}/> 
                <Sound activateSound = {this.state.activate} stopSound = {this.state.gameDone}/>                 
            </React.Fragment>
            );
    }
}

ReactDOM.render(<MainComponent/>, document.getElementById('root'));