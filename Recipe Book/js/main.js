
function checkDefault(){                                        //checks if any of the navMenu buttons is active, if true puts it back to default
    if($('#nav-left-name').css('left') !=='1%'){
        $('#hidden-name').hide('slow');
        $('#nav-left-name').animate({left:'1%',top:'10%'});
    }
    if($('#nav-left-type').css('left') !=='1%'){
        $('.hidden-type').hide('slow');
        $('#nav-left-type').animate({left:'1%',top:'28%'});
    }
    if($('#nav-left-add').css('left') !=='1%'){
        $('.hidden-add').hide('slow');
        $('#nav-left-add').animate({left:'1%',top:'48%',width:'40%'});
    }
    if($('#nav-left-prep').css('left') !=='1%'){
        $('.hidden-prep').hide('slow');
        $('#nav-left-prep').animate({left:'1%',top:'72%',width:'40%'});
    }
}

function createTable(collection){                                   //creates a table of length depending on the number of ingredients
    document.getElementById('body').innerHTML = '';
    let tbody = document.getElementById('body');
    for (let x=0;x<collection.length;x+=2){            
        let tr = document.createElement('tr');
        let td = document.createElement('td');
        let text = document.createTextNode(collection[x]);
            td.appendChild(text);
        let td1 = document.createElement('td');
        let text1 = document.createTextNode(collection[x+1]);
            td1.appendChild(text1);
            tr.appendChild(td);
            tr.appendChild(td1);
            tbody.appendChild(tr);
    }
    document.getElementById('body').value = tbody;
}

function saveData(){
    let name = document.getElementById('hidden-name').value;                 //get the current name of food
    let image = document.getElementById('type-done').getAttribute('src');     // current image
    let type = localStorage.getItem('foodType');                                // current type of food
    let addIngredients = document.getElementById('first-input').value;       // get the first ingredient
    let preparation = document.getElementById('prep-textarea').value;        // get the current preparation description
    if (name === '' || image === '' || addIngredients === '' || preparation === ''){     //if any field is empty, alert and ask to fill it in
        if(name === '')
            alert('Please choose a name for your recipe');
        else if(image === '')
            alert('Please choose a type of recipe');
        else if(addIngredients==='')
            alert('Please add some ingredients');
        else if(preparation==='')
            alert('Please describe the preparation process');
    } 
    else{
        switch(type){
            case 'Baked':   
            let arrayOfNamesBaked = JSON.parse(localStorage.getItem('namesBaked'));
                if(arrayOfNamesBaked === null){                  // if it is empty, create a new array for bakery
                    arrayOfNamesBaked = [];
                }
                if (arrayOfNamesBaked.indexOf(name) === -1){  // add it to the list only if it`s name doesn`t exist already                
                    arrayOfNamesBaked.push(name);
                    localStorage.setItem('namesBaked',JSON.stringify(arrayOfNamesBaked));         //save the current name, along with the previous ones
                }
                    break;
            case 'Cookie':
            let arrayOfNamesCookie = JSON.parse(localStorage.getItem('namesCookie'));
                if(arrayOfNamesCookie === null){                  // if it is empty, create a new array for cookies
                    arrayOfNamesCookie = [];
                }
                if (arrayOfNamesCookie.indexOf(name) === -1){  // add it to the list only if it`s name doesn`t exist already  
                    arrayOfNamesCookie.push(name);
                    localStorage.setItem('namesCookie',JSON.stringify(arrayOfNamesCookie));         //save the current name, along with the previous ones
                }    
                break;
            case 'Meal':
            let arrayOfNamesMeal = JSON.parse(localStorage.getItem('namesMeal'));
            if(arrayOfNamesMeal === null){                  // if it is empty, create a new array for meals
                arrayOfNamesMeal = [];
            }
            if (arrayOfNamesMeal.indexOf(name) === -1){  // add it to the list only if it`s name doesn`t exist already  
                arrayOfNamesMeal.push(name);
                localStorage.setItem('namesMeal',JSON.stringify(arrayOfNamesMeal));         //save the current name, along with the previous ones
            }
        }

        localStorage.setItem('foodImage'+name,image);
        localStorage.setItem('foodType'+name,type);
        let $allIngredients = [];                                           //create and fill the array with all ingredients and their amounts
        $('.hidden-add input').map(function(item){
            $allIngredients.push($('.hidden-add input')[item].value);
        }); 
        localStorage.setItem('ingredients'+name,JSON.stringify($allIngredients));   //save ingredients for current recipe
        localStorage.setItem('preparations'+name,preparation);      //save preparation for current recipe
        alert('Recipe for ' + name + ' is saved.');
    }
}

function loadData(typeSelected){                                //create a list of recipes , based on their type
    let arrayOfNames = JSON.parse(localStorage.getItem('names'+typeSelected));    
    if(arrayOfNames === null || arrayOfNames.length === 0){                              
        alert("There are no saved recipes yet!");
    }
    else{                 
        let length = arrayOfNames.length;          
        for(let x = 0;x<length;x++){
            $('#list-of-recipes ul').append('<li>'+arrayOfNames[x]+'</li>');
        }
    }     
}

function activateRecipe(recipeName){                  // show recipe details
    document.getElementById('name-done').innerHTML = recipeName;
    let individualImage = localStorage.getItem('foodImage'+recipeName);
    $('#type-done').attr('src',individualImage);
    let allIngredients = JSON.parse(localStorage.getItem('ingredients'+recipeName));
        createTable(allIngredients);
    document.getElementById('prep-done').innerHTML = localStorage.getItem('preparations'+recipeName);
    $('#change-recipe').removeAttr('disabled');
    $('#delete-recipe').removeAttr('disabled');
}

function clearRecipeView(){                         // clear recipe details view
    document.getElementById('name-done').innerHTML = '';
    $('#type-done').attr('src','');
    document.getElementById('body').innerHTML = '';
    document.getElementById('prep-done').innerHTML = '';
}

function retrieveIngredients(){                     //when choosing to change old recipe, retrieve ingredients values from table in the recipe view
    let allIngredients = [];
    let tbody = document.getElementById('body');
    for (let row of tbody.rows){
        for(let cell of row.cells){
            allIngredients.push(cell.innerHTML);    //get all ingredients and amounts values into an array
        }
    }        
    if(allIngredients.length <= 10){                //if arrays length is not more than 10 -  fill the input fields
        let inputFields = [];
        inputFields = document.querySelectorAll('.hidden-add input');
        for(let x = 0;x<allIngredients.length;x++){
            inputFields[x].value = allIngredients[x];
        }
    } 
    else {                                             // if it is more than 10, add more input fields (calculate how many), and then fill them 
        let inputDifference = allIngredients.length - 10;            
        for(let x = inputDifference;x>0;x-=2){
            $('section.hidden-add').append('<input type="text"><input type="text"><br>'); 
        }
        let inputFields = [];
        inputFields = document.querySelectorAll('.hidden-add input');
        for(let x = 0;x<allIngredients.length;x++){
            inputFields[x].value = allIngredients[x];
        }
    }
}

function clearEntries(){                            // reset all fields in the New Recipe part
    document.getElementById('hidden-name').value =''; 
    document.getElementById('prep-textarea').value ='';  
    let inputFields = [];
    inputFields = document.querySelectorAll('.hidden-add input');
    for(let x = 0;x<10;x++){
        inputFields[x].value = '';
    }    
}

function headerSelected(e) {                        // when it is identified which help button is clicked (on which page) 
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    let helpDivId = e.target.parentElement;
    e.preventDefault();        
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = stopMoving;         // stop moving the help window
    document.onmousemove = moveDiv;        // move help window
  
    function moveDiv(e) {         
        e.preventDefault();         
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;         
        helpDivId.style.top = (helpDivId.offsetTop - pos2) + "px";
        helpDivId.style.left = (helpDivId.offsetLeft - pos1) + "px";
    }
  
    function stopMoving() {         
        document.onmouseup = null;
        document.onmousemove = null;
    }
} 

function clickChange(){
    document.getElementById('img-input-hidden').click();
}

function changeImage (e){   
    let files = e.target.files;
    let newImage = files[0].name;   
    document.getElementById('type-done').src = 'images/'+newImage;    
}



$(document).ready(() => {
    $('#side-button-name').on('click', () => {            //on name button click, animate its movement and enter name
    checkDefault();
    $('#nav-left-name').animate({left:'45%',top:'40%'});
    $('#hidden-name').show('slow').focus();
    });
    $('#hidden-name').on('keypress', (e) =>{
    if(e.key == 'Enter'){
        document.getElementById('name-done').innerHTML = document.getElementById('hidden-name').value;
        $('#name-done').hide().fadeIn(2000);
        $('#hidden-name').hide('slow');
        $('#nav-left-name').animate({left:'1%',top:'10%'});
    }
    });

    $('#side-button-type').on('click', () => {                //on type button click, animate its movement and choose recipe type
    checkDefault();
    $('#nav-left-type').animate({left:'45%',top:'40%'});
    $('.hidden-type').show('slow');
    });
    $('.hidden-type').on('click', (e) =>{         
        switch(e.currentTarget.innerHTML){                  // different image depending on the choice of button
            case 'MEAL': $('#type-done').attr('src','images/meal.jpg').hide().fadeIn(2000); 
                        localStorage.setItem('foodType','Meal');
                        $('#img-input').css('display','inline');
                break; 
            case 'BAKED':$('#type-done').attr('src','images/baked.jpg').hide().fadeIn(2000);
                        localStorage.setItem('foodType','Baked');
                        $('#img-input').css('display','inline');
                break;
            case 'COOKIE':$('#type-done').attr('src','images/cookie.jpg').hide().fadeIn(2000);
                        localStorage.setItem('foodType','Cookie');
                        $('#img-input').css('display','inline');
        }
        $('.hidden-type').hide('slow');
        $('#nav-left-type').animate({left:'1%',top:'28%'});
    });

    $('#side-button-add').on('click', () => {                     //on add button click, animate its movement and enter ingredients and their amounts
    checkDefault();
    $('#nav-left-add').animate({left:'45%',top:'20%',width:'50%'});
    $('.hidden-add').show('slow');
    $('#first-input').focus();
    });
    $('button#add-more').on('click', () =>{                      // add more input fields
        $('section.hidden-add').append('<input type="text"><input type="text"><br>');        
    });
    $('button#done').on('click', () =>{                 // on done collect all input values
        const $collection = [];
        $('section.hidden-add input').map(function(index){
            $collection.push($('section.hidden-add input')[index].value);
        });
        createTable($collection);               // create a table that will display input values on the right screen
        $('#body').hide().fadeIn(2000);
        $('.hidden-add').hide('slow');
        $('#nav-left-add').animate({left:'1%',top:'48%',width:'40%'});    
    });

    $('#side-button-prep').on('click', () => {                //on preparations button click, animate its movement and enter preparation description
    checkDefault();
    $('#nav-left-prep').animate({left:'45%',top:'20%',width:'50%'});
    $('.hidden-prep').show('slow');
    $('#prep-textarea').focus();
    });
    $('#button-prep-done').on('click', () =>{   
        const prepText = document.querySelector("#nav-left-prep textarea").value;
        document.getElementById('prep-done').innerHTML = prepText;
        $('.hidden-prep').hide('slow');
        $('#nav-left-prep').animate({left:'1%',top:'72%',width:'40%'});    
    });
    $('#save-recipe').on('click', () =>{                     // save recipe
        saveData();
    });
    $('#image1').on('click', () =>{                     // load bakery recipes
        loadData('Baked');
        $('#type-done').attr('src','images/baked.jpg').hide().fadeIn(2000);
        $('#old-recipes').fadeOut(1000);
        $('#list-of-recipes').fadeIn(1000);
        $('#list-of-recipes ul li').on('click', (e) =>{
           activateRecipe((e.currentTarget).innerHTML);            
        });
    });
      $('#image2').on('click', () =>{                  // load sweets recipes
        loadData('Cookie');
        $('#type-done').attr('src','images/cookie.jpg').hide().fadeIn(2000);
        $('#old-recipes').fadeOut(1000);
        $('#list-of-recipes').fadeIn(1000);        
        $('#list-of-recipes ul li').on('click', (e) =>{
           activateRecipe((e.currentTarget).innerHTML);           
        });
     });
      $('#image3').on('click', () =>{                   // load lunch/dinner recipes
        loadData('Meal');
        $('#type-done').attr('src','images/meal.jpg').hide().fadeIn(2000);
        $('#old-recipes').fadeOut(1000);
        $('#list-of-recipes').fadeIn(1000);
        $('#list-of-recipes ul li').on('click', (e) =>{
           activateRecipe((e.currentTarget).innerHTML);        
     });
    });   
    $('#old-recipes-button').on('click', () =>{       //move onto the old recipes part
        checkDefault();
        $('#enter-recipe').fadeOut(1000);
        clearRecipeView();
        $('#img-input').css('display','none');
        $('#old-recipes').fadeIn(1000);
    });
    $('#recipe-menu').on('click', () =>{         //go back onto the old recipes part
        $('#list-of-recipes').fadeOut(1000);
        $('#list-of-recipes ul').html('');        //empty the list so it is properly shown next time
            clearRecipeView();
        $('#change-recipe').attr('disabled','disabled');
        $('#delete-recipe').attr('disabled','disabled');
        $('#old-recipes').fadeIn(1000);
    });
    $('#back-to-new').on('click', () => {         //go and create a new recipe from old recipes menu
        $('#old-recipes').fadeOut(1000);
            clearRecipeView();
            clearEntries();
            window.location.reload(false);        //reload the page so the input fields in add ingredients are properly shown
    });
    $('#back-to-new2').on('click', () => {        // go and create a new recipe from list of recipes menu
        $('#list-of-recipes').fadeOut(1000);
        $('#list-of-recipes ul').html('');
            clearRecipeView();
            clearEntries();
        $('#change-recipe').attr('disabled','disabled');
        $('#delete-recipe').attr('disabled','disabled');
            window.location.reload(false);        
    });
    $('#change-recipe').on('click', () => {      // change currently viewed recipe
        $('#list-of-recipes').fadeOut(1000);
        $('#list-of-recipes ul').html('');
        $('#img-input').css('display','inline');
        $('#enter-recipe').fadeIn(1000);

        document.getElementById('hidden-name').value = document.getElementById('name-done').innerHTML;
        retrieveIngredients();        
        document.getElementById('prep-textarea').value = document.getElementById('prep-done').innerHTML;
        $('#change-recipe').attr('disabled','disabled');
        $('#delete-recipe').attr('disabled','disabled');
    });
    $('#delete-recipe').on('click', () => {             // delete selected recipe
        let confirmDelete = confirm("Are you sure you want to delete this recipe?");
        if(confirmDelete === true){            
            let name = document.getElementById('name-done').innerHTML;      // get the name of recipe
            let type = localStorage.getItem('foodType'+name);               // get the type of food
            let arrayOfNames = JSON.parse(localStorage.getItem('names'+type));
            let index = arrayOfNames.indexOf(name);
            arrayOfNames.splice(index,1);                               // remove the recipe from the recipe list
            localStorage.setItem('names'+type,JSON.stringify(arrayOfNames));    //remove recipe details from localStorage
            localStorage.removeItem('foodImage'+name);
            localStorage.removeItem('foodType'+name);
            localStorage.removeItem('ingredients'+name);
            localStorage.removeItem('preparations'+name);
            let listToRemove = document.getElementsByTagName('li')[index];  //use the previous index to select node for removal
            document.getElementsByTagName('li')[index].classList.add('fadeOut');    //add it temporary class for animation
            $('.fadeOut').hide(700, function(){                              // remove the node after hide is done
                listToRemove.remove();           
                clearRecipeView();
                $('#delete-recipe').attr('disabled','disabled');
                $('#change-recipe').attr('disabled','disabled');                
                });
            document.getElementsByTagName('li')[index].classList.remove('fadeOut');          
        }
    });
    $('#clear-fields').on('click', () => {       // clear current entries
        clearRecipeView();
        clearEntries();
        window.location.reload(false);          //reload to reset add ingredients input fields
    });
    $('#help-new-recipe').on('click', () => {     //help for new recipe
        $('#help-new-popup').fadeIn(1000);       
        document.getElementById('help-header-new').onmousedown = headerSelected;
    });
    $('#help-old-recipes').on('click', () => {       // help for old recipes menu
        $('#help-old-popup').fadeIn(1000);       
        document.getElementById('help-header-old').onmousedown = headerSelected;
    });
    $('#help-list-recipe').on('click', () => {    // help for list of recipes page
        $('#help-list-popup').fadeIn(1000);       
        document.getElementById('help-header-list').onmousedown = headerSelected;
    });
    $('.help-section').on('click', () => {     //close help window
        $('.help').fadeOut(600);        
    });
    document.getElementById('img-input').addEventListener('click', clickChange);
    document.getElementById('img-input-hidden').addEventListener('change', changeImage);
});

