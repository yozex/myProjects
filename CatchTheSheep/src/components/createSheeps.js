import React from 'react';
import styled, {keyframes} from 'styled-components';

export class CreateSheeps extends React.Component { 
    constructor(props){
        super(props);
        this.state = {left:this.props.left, bottom:this.props.bottom, display:'inline'};
        this.handleClickAnimation = this.handleClickAnimation.bind(this);                 
    }    
    handleClickAnimation(){                 // when the sheep is clicked on it disappears from the screen
        this.setState({display:'none'});
    }     
    render(){        
        const sheepWantsToEscape = keyframes`
        100% {
          left:${this.state.left}%;
          bottom:${this.state.bottom}%;
        }
        `        
        const CreateSheeps = styled.img`
        width:2.5%;
        cursor:pointer;
        z-index: 1;
        position:absolute;
        left:48.75%;
        bottom:48.75%;
        animation-name: ${sheepWantsToEscape};
        animation-duration: ${this.props.time}s;
        animation-iteration-count:1;
        animation-timing-function:linear;        
        `
         
        return (
        <React.Fragment>
        <CreateSheeps src = {this.props.src} style = {this.props.style} 
            onClick={() => { this.handleClickAnimation();this.props.onClick() }} onAnimationEnd = {this.props.onAnimationEnd}/>         
        </React.Fragment>   
        )  
    }
}