export function createTrajectory(){
    let left, bottom;
    let randomNumber = Math.random();
    let randomNumber5to95 = (Math.floor(Math.random()*91))+5;
    if (randomNumber < 0.5){        // left param fixed
        randomNumber = Math.random();
        if (randomNumber <0.5){     // left param 5%
            left = 5;
            bottom = randomNumber5to95;
        }
        else {                      // left param 95%
            left = 95;
            bottom = randomNumber5to95;
        }
    }
    else {                          //bottom param fixed
        randomNumber = Math.random();
        if (randomNumber <0.5){     // bottom param 5%
            bottom = 5;
            left = randomNumber5to95;
        }
        else {                      // bottom param 95%
            bottom = 95;
            left = randomNumber5to95;
        }
    }
    let coordinates = [left,bottom];
    return coordinates;
}