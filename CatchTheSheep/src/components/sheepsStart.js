import React from 'react';
import {CreateSheeps} from './createSheeps';
import sheep from '../images/sheep.png';
import {createTrajectory} from './helperFunction.js';


const animDuration = [];    
for (let x = 0;x<100;x++){                      // create an array of random animation durations 
    let random = Math.ceil(Math.random()*10+5);
    animDuration.push(random);
}

const positionLeft = [];
const positionBottom = [];
for (let x = 0;x<100;x++){          // create arrays to form a movement trajectories of sheep images
    let coordinates = createTrajectory();
    positionLeft.push(coordinates[0]);
    positionBottom.push(coordinates[1]);
}

export class SheepsStart extends React.Component { 
    constructor(props){
        super(props);
        this.state = {gameOver:false};      
        this.handleAnimationEnd = this.handleAnimationEnd.bind(this);       
    }   
    handleAnimationEnd(){
        this.setState({gameOver:true});             // when sheep escapes (which is animation end), the game ends
    }
    shouldComponentUpdate(nextProps, nextState){        
        if (this.props.activate !== nextProps.activate)         //when user clicks the start button , game activates
            return true;
        else if (this.state.gameOver !== nextState.gameOver)    //if the game is already active, and sheep escapes - game over - update the component
            return true;
        else                                                    // game is active, but NOT game over - continue running the component without update
            return false;
    }
    render(){
        if (this.props.activate === true){          // only execute this component after the user chooses to start a new game
            const arrayOfComponents = [];  
            if(this.state.gameOver === false){      // if the game is running, create the array of sheeps
                for (let index = 0;index<100;index++){      // create array of sheep styled components          
                    arrayOfComponents.push(<CreateSheeps src={sheep} alt={`sheep-${index}`} 
                    style = {{animationDelay:`${index/2}s`}} left = {positionLeft[index]} bottom = {positionBottom[index]} 
                    time = {animDuration[index]} onClick = {this.props.onClick} onAnimationEnd = {this.handleAnimationEnd}/>);
                }
            }
            else {                                  //if the game is over, save the score 
                this.props.saveScore();               
            }       
            return (
            <React.Fragment>                                  
            {arrayOfComponents}                                                   
            </React.Fragment>
            );
        }    
        else {                  // don't execute this component until user chooses to start a new game
        return null;
        }
    }
}