import React from 'react';
import './createEnvironment.css';

export class ScoreCounter extends React.Component{
    render(){      
        return <div id = "score">
        SHEEPS CAUGHT: <br></br><br></br>
        <span>{this.props.result}</span>
        </div>         
    }
}