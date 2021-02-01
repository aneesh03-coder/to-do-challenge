const newListForm=document.querySelector(".mylist__createNew form");
const leafletForm=document.querySelector(".leaflet__section form");
const newCreation=document.querySelector(".mylist__createNew span");
const listCollection=document.querySelector(".list__collections");
const leafletContent=document.querySelector(".leaflet__content");
const listCollectionFilter=document.querySelectorAll(".list_collections_filter div");

let optimizedString="all_lists";
let performanceOptimizedString=0;
let contentToBeEdited="";

let lists=[{
    "listName":"Sample List",
    "listStatus":"Uncompleted"
}];

let allicons=[];

let selectedListType="All";

let completed=[{
    "listName":"Sample List1",
    "content":["Oh my GOD"],
},];
let uncompleted=[{
    "listName":"Sample List",
    "content":["On a dark desert highway","Cool went in my ears"],
}];
let deleted=[];
let newLists=[];

let currentSelectedList="Sample List";
let currentSelectedListLocation=uncompleted;
let currentListLocation="";

let selectedIcon="";
let flag=1;
let completedContent=[];
let notPresent=1;
let splicedStatusList=[];
let splicedStatusList1=[];
let items;


/***********************For Local storage **********************************/
//For storing data into the local storage
const storeInLocalStorage=()=>{
    let toDoListItemDetails={
        "lists":lists,        
        "completed":completed,
        "uncompleted":uncompleted,
        "newLists":newLists,
        "currentSelectedList":currentSelectedList,
        "completedContent":completedContent,
    }
    localStorage.setItem("items", JSON.stringify(toDoListItemDetails));
}

//Fetcing the items from local storage
const setAllItems=()=>{
    if(items){
        lists=items.lists
        completed=items.completed;
        uncompleted=items.uncompleted;
        newLists=items.newLists;
        completedContent=items.completedContent;
        currentSelectedList=items.currentSelectedList;
    }
   
  }

 //Setting the local storage items 
const setAllLocalStorageItems=()=>{
    items =  JSON.parse(localStorage.getItem('items'));
 }



//To basically get the selected List Data and populate the same on the leaflet
const dataGot=false;
const getCurentListData=()=>{    
    if(dataGot == false){
        selectList();
    }
    currentListLocation=filteredListBasedOnListValue(lists,currentSelectedList)[0].listStatus;    
    getcurrentSelectedListLocation(currentListLocation);
    const currentListData=filteredListBasedOnListValue(currentSelectedListLocation,currentSelectedList);    
    leafletContent.innerHTML="";
    leafletContent.innerHTML=`<h1>${currentListData[0].listName}</h1>`;
    if(currentListLocation == "Completed"){
        populateLeaflet(currentListData[0].content,true);
    }else if(currentListLocation == "Uncompleted" || currentListLocation == "All"){
        populateLeaflet(currentListData[0].content,false);
    }    
    completedContentData=filteredListBasedOnListValue(completedContent,currentSelectedList);
    
    //Also need to populate the completed items within the uncompleted list along with the uncompleted items
    if(completedContentData.length > 0){
        completedContentData=completedContentData[0].content;
        populateLeaflet(completedContentData,true);
    }
    
}

// Basically for searching the Master List table and assigning the complete corresponding list to the pointer value

const getcurrentSelectedListLocation=(currentListLocation)=>{
    switch (currentListLocation) {
        case "Completed":
            currentSelectedListLocation=completed;
            break;
        case "Uncompleted":
            currentSelectedListLocation=uncompleted;
            break;
        case "Deleted":
            currentSelectedListLocation=deleted;
            break;
        case "New":
            currentSelectedListLocation=newLists;
            break;
    
        default:
            break;
    }
}


//The form for entering your To-do's into the leaflet within the selected list

leafletForm.addEventListener("submit",(e)=>{
    e.preventDefault();    
    const checkValidation=validate(leafletForm.todos.value);
    if(checkValidation){
        document.getElementById("validity").style.display="none";
        addToDosToTheCurrentList(leafletForm.todos.value);    
    }
    else{        
        document.getElementById("validity").style.display="inline";
    }
    leafletForm.reset();
})


//The generic function to add all the To-Do's into it's corresponding lists
const addToDosToTheCurrentList=(newValue)=>{    
    if(currentListLocation == "Completed"){
        const poppedList2=filteredListBasedOnNonListValue(completed,currentSelectedList);
        completed=poppedList2;
        uncompleted.push({
            "listName":currentSelectedList,
            "content":[newValue],
        })
        const poppedList3=filteredListBasedOnNonListValue(lists,currentSelectedList);
        poppedList3.push({
            "listName":currentSelectedList,
            "listStatus":"Uncompleted",
        })
        lists=poppedList3;
    }else if(currentListLocation == "New"){        
        const poppedList=filteredListBasedOnNonListValue(newLists,currentSelectedList);
        newLists=poppedList;
        uncompleted.push({
            "listName":currentSelectedList,
            "content":[newValue],
        })    
        const poppedList1=filteredListBasedOnNonListValue(lists,currentSelectedList);
        poppedList1.push({
            "listName":currentSelectedList,
            "listStatus":"Uncompleted",
        })
        lists=poppedList1;            
    }else{
        const filteredPopped=filteredListBasedOnListValue(uncompleted,currentSelectedList);
        const poppedList4=filteredListBasedOnNonListValue(uncompleted,currentSelectedList);
        poppedList4.push({
            "listName":filteredPopped[0].listName,
            "content":[...filteredPopped[0].content,newValue],
        }) 
        uncompleted=poppedList4; 
    }
    getCurentListData();
    
}

//Generic function for popping out values out of an array
const popOutFromAnArray=(arr,value)=>{
    arr.splice(arr.indexOf(value),1)

}

//For the appearance of the magical input box for entering the list Name
newCreation.addEventListener("click",()=>{
    if(newListForm.style.display == "inline"){
        newListForm.style.display="none";
    }else{
        newListForm.style.display="inline";
    }
})


//Attach the event listerners to the input field of the form for creating new lists
newListForm.addEventListener('submit',(e)=>{   
    e.preventDefault();
    let uniqueDiv=document.getElementById("show__unique");
    let uniqueDiv1=document.getElementById("show__unique1");
    let newListName=newListForm.new__list__value.value;
    let isListNameUnique=checkUniqueListName(newListName);
    let isValidList=validate(newListName);
    if(isListNameUnique && isValidList ){
        uniqueDiv.style.display="none";
        uniqueDiv1.style.display="none";
        lists.push({
            "listName":newListName,
            "listStatus":"New",
        });
        newLists.push({
            "listName":newListName,
            "content":[],
        })
        showList(selectedListType)
        newListForm.style.display="none";
        newListForm.reset();
        currentSelectedList=newListName;
        getCurentListData();        
    }else if(!isListNameUnique){
        uniqueDiv.style.display="inline";
        uniqueDiv1.style.display="none";
    }else{
        uniqueDiv.style.display="none";
        uniqueDiv1.style.display="inline";
    }
   
})


//A check for the unique list name
const checkUniqueListName=(newListName)=>{
    const checkAllList=filteredListBasedOnListValue(lists, newListName);
    if(checkAllList.length > 0){
        return false;
    }else{
        return true;
    }
}


//Things to do when the complete document loads
window.onload = function() {
    allStartingContent=setAllLocalStorageItems();
    setAllItems();    
    showList(selectedListType);
    getCurentListData();    
    allicons=document.querySelectorAll(".content__icons i");   
    selectList();    
  };
  
//Basically to attach and control the icons within the leaflet i.e, for the edit, delete and completed icons
  
const attachIconsFunction=()=>{    
    allicons.forEach(icon=>{        
            icon.addEventListener("click",(e)=>{                
            if(document.querySelector(".selectedIcon")){               
                document.querySelector(".selectedIcon").classList.remove("selectedIcon");
            }
            icon.classList.add("selectedIcon");
            const splitContent=icon.classList.value.split(" ");            
            contentToBeEdited="";
            for(let i=2;i<splitContent.length-1;i++){
                if(i == 2){
                    contentToBeEdited = splitContent[i];
                }
                else{
                    contentToBeEdited = contentToBeEdited+" "+splitContent[i];
                }
            }
            let contentClassDot=contentToBeEdited.replaceAll(/\s/g,'.');

            //Function to handdle what happens when a person clicks on the edit icon

           if(icon.classList.contains("fa-pencil")){
            document.querySelector(".edit__listName").innerHTML="";
            document.querySelector(".edit__listName").innerHTML=currentSelectedList;
            document.querySelector(".editedValue").value=contentToBeEdited;
            $('#myModal').modal('show');
            document.querySelector(".selectedIcon").classList.remove("selectedIcon");
            getCurentListData();
           } 
           //Function to handdle what happens when a person clicks on the tick mark icon
           else if(icon.classList.contains("fa-check")){
               
               const selectedContent=document.querySelectorAll(".content h3");
               selectedContent.forEach(content =>{
                    if(content.innerHTML == contentToBeEdited){
                        content.classList.add("strikeThrough");                       
                    }
                    document.querySelector(`.fa.fa-pencil.${contentClassDot}`).style.display="none";
                    document.querySelector(`.fa.fa-trash.${contentClassDot}`).style.display="none";                        
                    })
                   
                    const filteredUncompletedListStatus=filteredListBasedOnListValue(uncompleted,currentSelectedList);
                    const poppedConentFromfilteredUncompletedListStatus=filteredListBasedOnNonContent(filteredUncompletedListStatus,contentToBeEdited);
                   
                   const filterCompltedContentArr=filteredListBasedOnListValue(completedContent,currentSelectedList);

                   if(filterCompltedContentArr.length >0){
                       
                    filterCompltedContentArr[0].content.push(contentToBeEdited)
                   }else{
                    completedContent=[...completedContent,{
                        "listName":currentSelectedList,
                        "content":[contentToBeEdited],
                    }];
                   }
                   const filterCompltedContentArr1=filteredListBasedOnListValue(uncompleted,currentSelectedList);                   
                   if(filterCompltedContentArr1.length >0){
                        if(filterCompltedContentArr1[0].content.length == 0){
                            const uncompletedFiltered=filteredListBasedOnNonListValue(uncompleted,currentSelectedList);
                            const completedContentFiltered=filteredListBasedOnNonListValue(completedContent,currentSelectedList);
                            const completedContentFiltered1=filteredListBasedOnListValue(completedContent,currentSelectedList)[0];
                            const changeAllListsFiltered=filteredListBasedOnListValue(lists,currentSelectedList);
                            completedContent=completedContentFiltered;
                            uncompleted=uncompletedFiltered;
                            completed=[...completed,{
                                "listName":completedContentFiltered1.listName,
                                "content":completedContentFiltered1.content,
                            }]
                            changeAllListsFiltered[0].listStatus="Completed";                           
                        }
                   }
                    getCurentListData();                   
               }

               //Function to handdle what happens when a person clicks on the trash icon
               else if(icon.classList.contains("fa-trash")){
                   
                    let filteredUncompletedList=filteredListBasedOnListValue(uncompleted,currentSelectedList);
                    let filteredUncompletedListValue=filteredListBasedOnNonContent(filteredUncompletedList,contentToBeEdited);
                    let remainingUncompletedList=filteredListBasedOnNonListValue(uncompleted,currentSelectedList);
                    uncompleted=[...remainingUncompletedList,...filteredUncompletedListValue];
                    getCurentListData();
                       uncompleted.forEach(uncompleteList=>{
                       if(uncompleteList.listName == currentSelectedList){                        
                        if(uncompleteList.content.length == 0){
                            const contentArr=document.querySelectorAll(".leaflet__content h3");                         
                            if(contentArr.length > 0){                               
                                completed=[...completed,
                                    ...completedContent
                                ];                                
                                const foundListStatus=filteredListBasedOnListValue(lists,currentSelectedList);                                
                                foundListStatus[0].listStatus="Completed";                                
                                splicedStatusList=filteredListBasedOnNonListValue(uncompleted,currentSelectedList);
                                splicedStatusList1=filteredListBasedOnNonListValue(completedContent,currentSelectedList);                               
                                uncompleted=[...splicedStatusList]                                       
                                completedContent=[...splicedStatusList1]
                            }                      
                        }
                       } 
                        
                    })
                    
                    
               }
           
        })
    })
     
}

//Sub handler for editing the item within a list

function editlistValue(event){
    event.preventDefault();
    const newContent=document.querySelector(".editedValue").value;
    const checkIfValid=validate(newContent);
    if(checkIfValid == true){
        document.getElementById("validity1").style.display="none";
        currentListLocation=filteredListBasedOnListValue(lists,currentSelectedList)[0].listStatus;
        getcurrentSelectedListLocation(currentListLocation);
        let prevListData=filteredListBasedOnNonListValue(currentSelectedListLocation,currentSelectedList)
        const currentListData=filteredListBasedOnListValue(currentSelectedListLocation,currentSelectedList);
        let currentListWithoutEditedData=filteredListBasedOnNonContent(currentListData,contentToBeEdited);
        currentListWithoutEditedData[0].content.push(newContent);
        prevListData=[...prevListData,currentListWithoutEditedData[0]]
        if(currentListLocation == "Uncompleted"){
            uncompleted=prevListData;     
        }
        $('#myModal').modal('hide');
        getCurentListData();
        
    }
        else{
            document.getElementById("validity1").style.display="inline";
        }
}



//To show a list Name based on the button(All,Completed,Completed,Deleted) click

const showList=(selectedListType)=>{
    switch (selectedListType) {
        case "All":
            populateListCollection(lists);
            break;
        case "Completed":
            const completedList=filteredList(lists,"Completed");
          
            populateListCollection(completedList);
            break;
        case "Uncompleted":
            const uncompletedList=filteredList(lists,"Uncompleted");
            populateListCollection(uncompletedList);
            break;    
        case "Deleted":
            const deletedList=filteredList(lists,"Deleted");
            populateListCollection(deletedList);
            break;
        default:
            break;
    }
}

//To loop though a filteredArray

const populateListCollection=(filteredList)=>{
    listCollection.innerHTML="";
    filteredList.forEach(list=>{
        listCollection.innerHTML += `<h3 class="${list.listName}">${list.listName}</h3>`;
    })
}

//Populate the leaflet

const populateLeaflet=(arr,contentFromCompletedContent)=>{
    arr.forEach(arrVal=>{
        if(!contentFromCompletedContent){
            leafletContent.innerHTML +=
            `<div class="content ${arrVal}">
                <h3>${arrVal}</h3> 
                <div class="content__icons ${arrVal}">
                    <i class="fa fa-pencil ${arrVal}" aria-hidden="true"></i>
                    <i class="fa fa-check ${arrVal}" aria-hidden="true"></i>
                    <i class="fa fa-trash ${arrVal}" aria-hidden="true"></i>
                </div>
            </div>`;  
        }else{
            leafletContent.innerHTML +=
            `<div class="content ${arrVal}">
                <h3>${arrVal}</h3> 
                <div class="content__icons ${arrVal}">
                    <i class="fa fa-check ${arrVal}" aria-hidden="true"></i>
                </div>
            </div>`;
        }
       
    })
  
    allicons=document.querySelectorAll(".content__icons i");
    attachIconsFunction();
     
}

//Basically to filter out a random array based on a dynamic filterType like "Completed"

const filteredList=(arr,filterType)=>{
    const filteredArray=arr.filter(singleArrValue=>{
       return singleArrValue.listStatus == filterType; 
    })

    return filteredArray;
}

//Basically to filter out a random array based on the list Name
const filteredListBasedOnListValue=(arr,filterType)=>{
    const filteredArray=arr.filter(singleArrValue=>{
       return singleArrValue.listName == filterType; 
    })
    return filteredArray;
}

const filteredListBasedOnNonListValue=(arr,filterType)=>{
    const filteredArray=arr.filter(singleArrValue=>{
       return singleArrValue.listName != filterType; 
    })
    return filteredArray;
}

const filteredListBasedOnNonContent=(arr,content1)=>{      
       let contentToBeEditedIndex=arr[0].content.indexOf(content1);
        arr[0].content.splice(contentToBeEditedIndex,1)
        return arr;
}

//to change the value of the list Filter based on the button click of 
//All Completed Uncompleted and Deleted


    listCollectionFilter.forEach((individualFilter)=>{
    
        individualFilter.addEventListener("click",(e)=>{
            
            optimizedString=''; 
            optimizedString=e.target.classList.value;
            
            selectedListType=e.target.innerHTML;
         
            showList(e.target.innerHTML);
            selectList();
            
        })
    })


let trialval="";
const selectList=()=>{
    let test=1;
    const check=filteredListBasedOnListValue(completed,currentSelectedList);
    if(check.length == 0){
        leafletForm.style.display="inline"
        document.getElementById("congratulations").style.display="none";
    }
    else{
        leafletForm.style.display="none"
        document.getElementById("congratulations").style.display="inline";
    }
    const list=document.querySelectorAll(".list__collections h3");    
    list.forEach(listValue=>{        
        listValue.addEventListener("click",(e)=>{            
            if(document.querySelector(".todo__lists").classList.contains("open")){
                document.querySelector(".todo__lists").classList.remove("open");
            }            
           if(selectedListType == "All"){
            document.getElementById("all_lists").click();
           }
           else if(selectedListType == "Completed"){
            document.getElementById("completed__tasks").click(); 
           }
           else if(selectedListType == "Uncompleted"){
            document.getElementById("uncompleted__tasks").click(); 
           }
           else{
            document.getElementById("deleted__tasks").click();
           }        
            currentSelectedList=e.target.innerHTML;                     
            getCurentListData();            
        })        
    })

}

//Validate my text fields so no one can enter special characters
function validate(value) {
    //Regex for Valid Characters i.e. Alphabets, Numbers and Space.
    var regex = /^[A-Za-z ]+$/
    //Validate TextBox value against the Regex.
    var isValid = regex.test(value);
    return isValid;
}

//Basically want the items to be stored into the local storage just before the refresh or closing of a webpage
window.onbeforeunload = function (e) {
    storeInLocalStorage();
};


//Some magic for mobile resposive animations 
document.querySelector(".fa-list").addEventListener("click",e=>{    
    document.querySelector(".todo__lists").classList.toggle("open");
    if(document.querySelector(".todo__lists").classList.contains("open")){
        document.querySelector(".fa-times").classList.add("open");
    }else{
        document.querySelector(".fa-times").classList.remove("open");
    }    
})
//Some magic for mobile resposive animations 
document.querySelector(".fa-times").addEventListener("click",e=>{    
    document.querySelector(".todo__lists").classList.toggle("open");
    
})






