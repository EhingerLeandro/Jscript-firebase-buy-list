
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js"
import {getDatabase, ref, push, onValue, remove} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js"

/*This portion of code was a test
import {add} from "./function.js";
console.log(add(66,20));*/

const appSettings = {
    databaseURL: "https://crud-vanilla-js-to-buy-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shopListInDB= ref(database, "to-buy-list");

const fieldText = document.querySelector("#fieldText");
const button1 = document.querySelector("#button1");
const shoppingList = document.getElementById("shoppingList");

/*This is an asynchronus function that push the new items into the
database*/
const pushItemDB = async (item) =>{
    try{
        await push(shopListInDB, item);
    }catch(error){
        console.log(error);
    }
}

//This function renders every item
const renderItems = (ite, iteID)=>{
    let newElem = document.createElement("li");
    newElem.textContent =  ite;
    newElem.addEventListener("click", ()=>{
        let exactLocation = ref(database, `to-buy-list/${iteID}`);
        remove(exactLocation);
    })
    shoppingList.append(newElem); 
}

//This routine allows to empty the input
function emptyInput (){
    fieldText.value="";
}

//This function 'onValue' comes from firebase database, it's predefined
onValue(shopListInDB, function (snapshot){
    if(snapshot.exists()){
        let tempArr = Object.entries(snapshot.val());
        shoppingList.innerHTML = "";
        for(let i=0; i<tempArr.length; i++){
            let currentItemID= tempArr[i][0];
            let currentItemValue = tempArr[i][1];
            renderItems(currentItemValue, currentItemID);
        }
    }else{
        shoppingList.innerHTML="";
        console.log("There aren't snapshots");
    }
})

button1.addEventListener("click", ()=>{
    if(fieldText.value !== ""){
        let inputValue = fieldText.value 
        pushItemDB(inputValue);
        emptyInput();
    }
})