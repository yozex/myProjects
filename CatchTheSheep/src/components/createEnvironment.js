import React from 'react';
import './createEnvironment.css';
import sheepFence from '../images/sheepFence.png'
import wolf from '../images/wolf.png';

export class CreateEnvironment extends React.Component {
    shouldComponentUpdate(nextProps, nextState){
        return false;
    }
    render(){
        const arrayOfWolfImages = [];
        for (let x = 0;x<6;x++){
            let idValue = "wolf"+(x+1);
            arrayOfWolfImages.push(<img src = {wolf} alt = "Wolf" class = "wolf" id = {idValue}/>);
        }
        return (
            <div id = "forest">
                {arrayOfWolfImages}
                <div id = "escape-space">
                    <div id = "sheep-fence">
                        <img src = {sheepFence} alt = "Sheep Fence"/>
                    </div>
                </div>
            </div>
        );
    }
}