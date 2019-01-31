import React from 'react';
import './createEnvironment.css';

export class Highscores extends React.Component{
    constructor(props){
        super(props);
        this.state = {whichClass:this.props.show};  //whichClass determines whether highscores window should be shown or not
        this.closeWindow = this.closeWindow.bind(this);
    }  
    closeWindow(){
        this.setState({whichClass:'none'});
    }  
    componentWillReceiveProps(nextProps, prevState) {
        this.setState({whichClass: nextProps.show});        //because state gets it value from the props, so that it can be properly updated
    }
    render(){
        let arrayOfNames = JSON.parse(localStorage.getItem('highscoresNames')); //load names from highscores list
            if(arrayOfNames === null){              // initial load if localStorage is empty
                arrayOfNames = ['Empty','Empty','Empty','Empty','Empty'];
                localStorage.setItem('highscoresNames',JSON.stringify(arrayOfNames));          
            }
        let arrayOfScores = JSON.parse(localStorage.getItem('highscoresScores'));          //load scores from highscores list
            if(arrayOfScores === null){             // initial load if localStorage is empty
                arrayOfScores = [0,0,0,0,0];
                localStorage.setItem('highscoresScores',JSON.stringify(arrayOfScores));
            }
        return (
            <div className = {this.state.whichClass}>
                <div id = "narrower-scores">
                <p>1.<span className = 'highscores-names'>{arrayOfNames[0]}</span><span className = 'highscores-scores'>{arrayOfScores[0]}</span></p>
                <p>2.<span className = 'highscores-names'>{arrayOfNames[1]}</span><span className = 'highscores-scores'>{arrayOfScores[1]}</span></p>
                <p>3.<span className = 'highscores-names'>{arrayOfNames[2]}</span><span className = 'highscores-scores'>{arrayOfScores[2]}</span></p>
                <p>4.<span className = 'highscores-names'>{arrayOfNames[3]}</span><span className = 'highscores-scores'>{arrayOfScores[3]}</span></p>
                <p>5.<span className = 'highscores-names'>{arrayOfNames[4]}</span><span className = 'highscores-scores'>{arrayOfScores[4]}</span></p>
                <button onClick = {this.closeWindow}>CLOSE</button>
                </div>
            </div>
        );
    }
}