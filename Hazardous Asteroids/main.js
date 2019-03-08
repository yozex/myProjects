
function validateDates(){
    document.getElementById('list-of-chosen-asteroids').innerHTML = '';     //if dates are being changed, empty the list of selected asteroids
    document.getElementById('select-asteroids').value = '';                 //if dates are being changed, empty any input in autocomplete field
    let dates = document.getElementsByClassName('date');
    //create start and end date in a date format
    let startYear = dates[0].value.substring(0,4);
    let endYear = dates[1].value.substring(0,4);
    let startMonth = dates[0].value.substring(5,7);
    let endMonth = dates[1].value.substring(5,7);
    let startDate = dates[0].value.substring(8);
    let endDate = dates[1].value.substring(8);
    let start = new Date(startYear,startMonth-1,startDate);
    start.setTime( start.getTime() - new Date().getTimezoneOffset()*60*1000 );  //daylight saving time bug
    let end = new Date(endYear,endMonth-1,endDate);
    end.setTime( end.getTime() - new Date().getTimezoneOffset()*60*1000 );
    if(start > end){                                                    //so you cannot choose start date bigger than end date
        alert("Start date must be BEFORE the end date!");
    }
    else if(end.getTime() - start.getTime()  > 604800000){           // so that maximum difference between dates is 7 days
        alert("There should be no more than 7 day difference!");
    }  
    else  {                             // create a dynamic URL
        let defineUrl = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${dates[0].value}&end_date=${dates[1].value}&api_key=x0HeIJzRCLm3lj0zrfXt2LltusKVCO7aoHmRkVq2`;
        document.getElementById('request-status').style.display = "inline";
        document.getElementById('request-status').innerHTML = "Waiting...";
        document.getElementById('show-data').style.display = "block";
        document.getElementById('pagination-container').style.display = "none";
        getData(defineUrl);
    }   
}

function getData(location){
    let hazardousAsteroids= [];          //will be populated only by hazardous objects
    let data;                           //all the data from NASA in the selected date range
    let request = new XMLHttpRequest(); 
    request.open('GET',location,true);  
    request.send();   
        request.onload = function showAsteroids(){
            data  = JSON.parse(this.response);
            for (let singleDate in data.near_earth_objects){
                for (let hazard in data.near_earth_objects[singleDate]){
                    if (data.near_earth_objects[singleDate][hazard].is_potentially_hazardous_asteroid === true){
                        hazardousAsteroids.push(data.near_earth_objects[singleDate][hazard]);
                    }           
                }    
            }
            sessionStorage.setItem('hazardousAsteroids',JSON.stringify(hazardousAsteroids));      //save for later use
            document.getElementById('request-status').style.display = "none";
            createTable(hazardousAsteroids.length);    
            populateTable(1);
            if(hazardousAsteroids.length > 10){
                document.getElementById('pagination-container').style.display = "block";
            }
        }   
        setTimeout(function(){                                      //if there is an error, or no response after 10 seconds, abort the request
            if(request.readyState !== 4 || request.status !== 200){
                request.abort();
                alert("Error! Either there is a network error, or it takes too long for script to load. Request has been terminated!");
                document.getElementById('request-status').innerHTML = "ABORTED";
            }
        },10000);   
    };
    
function createTable(listLength){
    let tableBody = document.getElementById('table-body');
    let checkExistence = tableBody.getElementsByTagName('tr');
    if(checkExistence.length !== 0){                //if the table is already created  === user has clicked on another date === empty the cells content
        let rows = tableBody.getElementsByTagName('tr');
        for (let x = 0;x<rows.length;x++){  
            let cells = rows[x].getElementsByTagName('td');
            for (let y= 0;y<cells.length;y++){
                cells[y].innerHTML = '&nbsp;';
            }
        }
        document.getElementById('page-container').innerHTML = '';
    }
    else{
    for (let x = 0;x<10;x++){                   //create table grid
        let row = document.createElement('tr');
        for (let y = 0;y<5;y++){
            let cell = document.createElement('td');
            cell.innerHTML += '&nbsp;';
            row.appendChild(cell);
        }
        tableBody.appendChild(row);
    }
    }
    let numberOfPages = Math.ceil(listLength/10);
    let pageContainer = document.getElementById('page-container');
    for (let x = 1;x<=numberOfPages;x++){                           //add total number of pages in pagination div
        let span = document.createElement('span');
        span.setAttribute('class','page-number');
        let pageNumber = document.createTextNode(x);
        span.appendChild(pageNumber);       
        pageContainer.appendChild(span);
    }
    let allPages = document.getElementsByClassName('page-number');      //populate the table depending of the page selected
    for (let x = 0;x<allPages.length;x++){
        allPages[x].addEventListener('click',function(){populateTable(x+1)})
    }    
}

function populateTable(pageNumber){
    sessionStorage.setItem('selectedPage',pageNumber);                  //save the page that is currently active , when user clicks on arrows
    let allPages = document.getElementsByClassName('page-number');
    for (let x = 0;x<allPages.length;x++){                              //make all page numbers black again
        allPages[x].style.color = 'black';
    }
    allPages[pageNumber-1].style.color = 'red';                         // make selected page color red
    sessionStorage.setItem('numOfPages',allPages.length);
    let hazardousAsteroids = sessionStorage.getItem('hazardousAsteroids');
    hazardousAsteroids = JSON.parse(hazardousAsteroids);    
    let tableBody = document.getElementById('table-body');
    let rows = tableBody.getElementsByTagName('tr');
    let max;
    for (let x = 0;x<rows.length;x++){  
        let cells = rows[x].getElementsByTagName('td');
        let z = (pageNumber*10-10)+x;   //create indexes depending on a pageNumber (eg.0+x,10+x,20+x etc.)        
        if(z<hazardousAsteroids.length){  
            var arrayOfData = [hazardousAsteroids[z].close_approach_data[0].close_approach_date,hazardousAsteroids[z].name,         
            hazardousAsteroids[z].close_approach_data[0].relative_velocity.kilometers_per_hour,hazardousAsteroids[z].estimated_diameter.meters.estimated_diameter_min,
            hazardousAsteroids[z].estimated_diameter.meters.estimated_diameter_max];  
            for (let y = 0;y<cells.length;y++){                
                cells[y].innerHTML = arrayOfData[y];                          
            }  
            max = z;        //needed for creating autocomplete specifically for selected page. z will continue to grow, while max will not             
        }
        else {           
            for (let y = 0;y<cells.length;y++){                
                cells[y].innerHTML = '&nbsp;';                          
            }    
        }
    }    
    let allAsteroids = [];                              //create an array of asteroid names, to be sent to the autocomplete function
    for (let x = pageNumber*10-10;x<=max;x++){
        allAsteroids.push(hazardousAsteroids[x].name);
    }
    sessionStorage.setItem('allAsteroids',JSON.stringify(allAsteroids));    //save it for later use in function add()
    createAutocomplete(allAsteroids);
}   

function createAutocomplete(allAsteroids){    
    let asteroidNames = document.getElementById('asteroids');
    asteroidNames.innerHTML = '';               //clear the list from previous entrances
    for (let x = 0;x<allAsteroids.length;x++){
        let option = document.createElement('option');
        option.setAttribute('value',allAsteroids[x]);
        asteroidNames.appendChild(option);        
    }
    if(navigator.userAgent.indexOf("Firefox") != -1 ){
    document.getElementById('select-asteroids').addEventListener('select',add);     //if Firefox
    }
    else{
    document.getElementById('select-asteroids').addEventListener('change',add);     // if Chrome
    }
}

function add(event){
    let allAsteroids = sessionStorage.getItem('allAsteroids');      //needed for comparision, so that no weird results get into the list    
    allAsteroids = JSON.parse(allAsteroids);     
    let list = document.getElementById('list-of-chosen-asteroids');    //get the list of selected asteroids    
    if(list.children.length === 0 && allAsteroids.indexOf(event.currentTarget.value)!==-1){                     //if it is empty add the selected asteroid
        let ast = document.createElement('div');                //div will contain li(ast.name) and span(delete) elements
        let listElement = document.createElement('li');
        listElement.setAttribute('class','listOfAsteroids');
        let listContent = document.createTextNode(event.currentTarget.value);
        let deleteButton = document.createElement('span');
        deleteButton.innerHTML = "&nbsp;&#10007;&nbsp;";
        deleteButton.addEventListener('click',deleteAsteroidFromList);
        listElement.appendChild(listContent);
        ast.appendChild(listElement);
        ast.appendChild(deleteButton);
        list.appendChild(ast);         
        document.getElementById("select-asteroids").value = '';     //reset the input field when new asteroid is added
    }
    else{                                                           //if it is NOT empty, check if the selected asteroid is already in the list
        let isAsteroidAlreadyInTheList = false;
        let getAsteroids = document.getElementsByClassName('listOfAsteroids');
        for(let x = 0;x<list.children.length;x++){                  //check if asteroid is in the list
            if (getAsteroids[x].innerHTML === event.currentTarget.value){
               isAsteroidAlreadyInTheList = true;
            }
        }
        if(allAsteroids.indexOf(event.currentTarget.value)===-1){ 
            /*do nothing until a correct name is selected*/
        }
        else if(isAsteroidAlreadyInTheList === false){                   //if it is not, add it
            let ast = document.createElement('div');
            let listElement = document.createElement('li');
            listElement.setAttribute('class','listOfAsteroids');
            let listContent = document.createTextNode(event.currentTarget.value);
            let deleteButton = document.createElement('span');
            deleteButton.innerHTML = "&nbsp;&#10007;&nbsp;";
            deleteButton.addEventListener('click',deleteAsteroidFromList);
            listElement.appendChild(listContent);
            ast.appendChild(listElement);
            ast.appendChild(deleteButton);
            list.appendChild(ast); 
            document.getElementById("select-asteroids").value = '';     //reset the input field
        }
        else{
            alert("Chosen asteroid is already in the list!");
            document.getElementById("select-asteroids").value = '';     //reset the input field
        }        
    }   
}

function changePageWithArrows(whichArrow){
    let selectedPage = sessionStorage.getItem('selectedPage');      //on which page we are currently
    let numOfPages = sessionStorage.getItem('numOfPages');          //total number of pages    
    if(whichArrow === -1){
        if(selectedPage > 1){
        populateTable(parseInt(selectedPage)-1);
        }
    }
    else if(whichArrow === 1){
        if (selectedPage < numOfPages){
        populateTable(parseInt(selectedPage)+1);
        }
    }
}

function calculatePasses(){                                     //how many times passed by earth
    let arrayOfChosenAsteroids = document.getElementsByClassName('listOfAsteroids'); //get asteroid names from the list of selected asteroids
    let chosenAsteroidsNames = [];
    let arrayOfLinks = [];
    let hazardousAsteroids = sessionStorage.getItem('hazardousAsteroids');
    hazardousAsteroids = JSON.parse(hazardousAsteroids);   //two lines, because of JSON error if--> sessionStorage.getItem(JSON.parse('hazardousAsteroids'))
    for (let x = 0;x<arrayOfChosenAsteroids.length;x++){
        chosenAsteroidsNames.push(arrayOfChosenAsteroids[x].innerHTML);
    }  
    if(chosenAsteroidsNames.length !== 0){              //if the list is not empty
        for (let x = 0;x<chosenAsteroidsNames.length;x++){
            for (let y = 0;y<hazardousAsteroids.length;y++){
                if(chosenAsteroidsNames[x] === hazardousAsteroids[y].name){ //when asteroid from the list is found in the list of asteroids from the table
                    let newLink = hazardousAsteroids[y].links.self;              //create a link to its self property
                    arrayOfLinks.push(newLink);                 //push it into an array
                    break; 
                }
            }
        }
    }
    sessionStorage.setItem('chosenAsteroidNames',JSON.stringify(chosenAsteroidsNames));     //save the names
    sessionStorage.setItem('arrayOfLinks',JSON.stringify(arrayOfLinks));                    //and links for chart page
    document.getElementById('select-asteroids').value = '';
    location.href = './charts.htm';
}

function createCharts(){                                        
    let chosenAsteroidNames = sessionStorage.getItem('chosenAsteroidNames');
    chosenAsteroidNames = JSON.parse(chosenAsteroidNames);
    let arrayOfLinks = sessionStorage.getItem('arrayOfLinks');
    arrayOfLinks = JSON.parse(arrayOfLinks);
    let asteroidNamesDiv = document.getElementById('asteroid-names');
    let divForPasses = document.getElementById('asteroid-passes');
    for (let x = 0; x< chosenAsteroidNames.length;x++){        
        let p = document.createElement('p');                            //create <p>'s for asteroid names in a chart
        let text = document.createTextNode(chosenAsteroidNames[x]);
        p.appendChild(text);
        asteroidNamesDiv.appendChild(p);
        let p1 = document.createElement('p');                       //create more <p>'s for asteroid 'score'
        p1.setAttribute('class','results');
        p1.style.width = '10%';
        p1.innerHTML = 'Waiting...';
        divForPasses.appendChild(p1);
    }
    for (let x = 0; x<arrayOfLinks.length;x++){                 //for every link in an array create a request
        let data;
        let timesPassed = 0;
        let request = new XMLHttpRequest();
        request.open('GET',arrayOfLinks[x],true); 
        request.send(); 
        request.onload = function showAsteroids(){
            data  = JSON.parse(this.response);  
            for (let asteroid in data.close_approach_data){
                if(parseInt(data.close_approach_data[asteroid].close_approach_date.substring(0,4)) >= 1900 &&
                    parseInt(data.close_approach_data[asteroid].close_approach_date.substring(0,4)) <= 1999){
                    timesPassed++;
                }
            }
            document.getElementsByClassName('results')[x].innerHTML = timesPassed;      //write down the number of times passed by Earth
            styleCharts(x);                                                             //style and animate the chart
        } 
        setTimeout(function(){                                      //if there is an error, or no response after 10 seconds, abort the request
            if(request.readyState !== 4 || request.status !== 200){
                request.abort();               
                document.getElementsByClassName('results')[x].innerHTML = "ERROR";
            }
        },10000);          
    }
}

function goToFirstPage(){               //the back button on charts.htm
    window.history.back();
}

function sortData(column){     //sorting on a click on <th> (all except name, because it doesn`t seem very useful because of the nature of the names)

    let hazardousAsteroids = sessionStorage.getItem('hazardousAsteroids');
    hazardousAsteroids = JSON.parse(hazardousAsteroids);        //whole array will be rearranged
    let sortFromLowest = sessionStorage.getItem(column);        //helper variable to determine on which side to sort   
    if (sortFromLowest === null || sortFromLowest === 'false'){         //if this is the first sorting, or has been sorted from the lowest previously
    switch(column){                                                 //which column was clicked
        case 0: hazardousAsteroids = hazardousAsteroids.sort(function(a,b){
                    return a.close_approach_data[0].close_approach_date<b.close_approach_data[0].close_approach_date ? 1 : -1;}); 
                break;
        case 2: hazardousAsteroids = hazardousAsteroids.sort(function(a,b){               
                    return parseFloat(a.close_approach_data[0].relative_velocity.kilometers_per_hour)<parseFloat(b.close_approach_data[0].relative_velocity.kilometers_per_hour) ? 1 : -1;
                });
                break;
        case 3: hazardousAsteroids = hazardousAsteroids.sort(function(a,b){               
                    return parseFloat(a.estimated_diameter.meters.estimated_diameter_min)<parseFloat(b.estimated_diameter.meters.estimated_diameter_min) ? 1 : -1;
                });
                break;
        case 4: hazardousAsteroids = hazardousAsteroids.sort(function(a,b){               
                    return parseFloat(a.estimated_diameter.meters.estimated_diameter_max)<parseFloat(b.estimated_diameter.meters.estimated_diameter_max) ? 1 : -1;
                });
    }
    sessionStorage.setItem(column,'true');    
    }
    else if (sortFromLowest === 'true'){                            //if the previous sort was from the lalrgest
        switch(column){
            case 0: hazardousAsteroids = hazardousAsteroids.sort(function(a,b){
                        return a.close_approach_data[0].close_approach_date>b.close_approach_data[0].close_approach_date ? 1 : -1;});  
                    break;
            case 2: hazardousAsteroids = hazardousAsteroids.sort(function(a,b){               
                        return parseFloat(a.close_approach_data[0].relative_velocity.kilometers_per_hour)>parseFloat(b.close_approach_data[0].relative_velocity.kilometers_per_hour) ? 1 : -1;
                    });
                    break;
            case 3: hazardousAsteroids = hazardousAsteroids.sort(function(a,b){               
                        return parseFloat(a.estimated_diameter.meters.estimated_diameter_min)>parseFloat(b.estimated_diameter.meters.estimated_diameter_min) ? 1 : -1;
                    });
                    break;
            case 4: hazardousAsteroids = hazardousAsteroids.sort(function(a,b){               
                        return parseFloat(a.estimated_diameter.meters.estimated_diameter_max)>parseFloat(b.estimated_diameter.meters.estimated_diameter_max) ? 1 : -1;
                    });
        }
        sessionStorage.setItem(column,'false');
    }    
    sessionStorage.setItem('hazardousAsteroids',JSON.stringify(hazardousAsteroids));    //save rearranged array of hazardous asteroids
    let selectedPage = sessionStorage.getItem('selectedPage');          //get the page that is active
    populateTable(selectedPage);                            //repopulate the table with new sorted data
}

function deleteAsteroidFromList(event){
    event.currentTarget.parentNode.remove();               //delete from the list of selected asteroids
}

function styleCharts(x){
    let element = document.getElementsByClassName('results')[x];
    let elementNumber = parseInt(element.innerHTML);
    if(elementNumber<=25){
        element.style.backgroundColor = 'green';
        if(elementNumber>10){                                   //so the <p> keeps some width regardless of the result
            element.animate([ 
                { width:'10%' }, 
                { width:elementNumber+'%'}
              ], 2000);
        element.style.width = elementNumber+'%';
        }
        else {
        element.style.width = '10%';        
        }
    }
    else if (elementNumber>25 && elementNumber<=45){       
        element.animate([ 
            { width:'10%',backgroundColor:'green' }, 
            { width:elementNumber+'%',backgroundColor:'yellow'}
          ], 2000);
        element.style.width = elementNumber+'%';
        element.style.backgroundColor = "yellow";
    }
    else if (elementNumber>45 && elementNumber<=75){       
        element.animate([ 
            { width:'10%',backgroundColor:'green' }, 
            { width:elementNumber+'%',backgroundColor:'orange'}
          ], 2000);
        element.style.width = elementNumber+'%';
        element.style.backgroundColor = "orange";
    }
    else if (elementNumber>75) {      
        element.animate([ 
            { width:'10%',backgroundColor:'green'}, 
            { width:elementNumber+'%',backgroundColor:'red'}
          ], 2000);
        element.style.width = elementNumber+'%';
        element.style.backgroundColor = "red";
    }
}