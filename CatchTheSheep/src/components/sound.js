import React from 'react';
import sheepSound from '../sound/sheepSound.mp3';

export class Sound extends React.Component{
    
    render(){
        if(this.props.activateSound === true && this.props.stopSound === 'none'){       //play sound when game starts until you lose
        return  <audio src = {sheepSound} type = "audio/mpeg" autoPlay loop></audio>;
        }
        else{
            return null;
        }
    }
}