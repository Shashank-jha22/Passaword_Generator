const inputSlider=document.querySelector("[data-length-slider]");
const lengthDisplay=document.querySelector("[data-length-number]");
const passwordDisplay=document.querySelector("[dataPasswordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]")
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numberCheck=document.querySelector("#numbers");
const symbolCheck=document.querySelector("#symbol");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButton");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols='~`!@#$%^&*()_+={[}]|:;"<,>.?/'

let password="";
let passwordLength=10;
let checkCount=0;
handleSlider()
// set strenght circle color to grey
setIndicator("#ccc");
// functions-of password generator    - 
// copy content                       -
// handle slider                      -
// generate password                  -
// set indicator color                -
// get random integer                 -
// get random uppercase               -
// get random lowercase               -
// get random symbol                  -
// check strength of password         -

//set password length
//reflect password length on ui
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    const mini=inputSlider.min;
    const maxi=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-mini)*100/(maxi-mini))+"% 100%"
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    const r=getRndInteger(0,symbols.length);
    return symbols.charAt(r);
}

function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;
    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numberCheck.checked) hasNum=true;
    if(symbolCheck.checked) hasSym=true;

    if(hasUpper && hasLower &&
       (hasNum || hasSym) && passwordLength >= 8)
        setIndicator("#0f0");
    else if((hasUpper || hasLower) &&
            (hasNum || hasSym) && passwordLength >= 6)
        setIndicator("#ff0");
    else
        setIndicator("#f00");
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="Failed";
    }
    // to make copy span visible
    copyMsg.classList.add("active");
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}

function shufflePassword(arr){
    //fisher yates method
    for(let i=arr.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=arr[i];
        arr[i]=arr[j];
        arr[j]=temp;
    }
    let str="";
    arr.forEach((el)=>(str+=el))
    return str;

}

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(password.length>0)
        copyContent();
})

function handleCheckNoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
            checkCount++;
    })
    //special condition
    if(passwordLength<checkCount){
        passwordLength=4;
        handleSlider();
    }
}

//maintain how many checkbox are checked
allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckNoxChange);
});


generateBtn.addEventListener('click',()=>{
    //none of the checkbox in selected
    if(checkCount<=0)
        return;

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    // let's find new password
    
    //remove old password
    password="";
    //lets put the stuff mentioned by checkboxes
    // if(uppercaseCheck.checked){
    //     password+=generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password+=generateLowerCase();
    // }
    // if(numberCheck.checked){
    //     password+=generateRandomNumber;
    // }
    // if(symbolCheck.checked){
    //     password+=generateSymbol();
    // }
    let funArr=[];
    if(uppercaseCheck.checked){
        funArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funArr.push(generateLowerCase);
    }
    if(numberCheck.checked){
        funArr.push(generateRandomNumber);
    }
    if(symbolCheck.checked){
        funArr.push(generateSymbol);
    }
    //compalsory addition;
    for(let i=0;i<funArr.length;i++){
        password+=funArr[i]();
    }

    
    for(let i=0;i<passwordLength-funArr.length;i++){
        let ind=getRndInteger(0,funArr.length);
        password+=funArr[ind]();
    }
    console.log("length is achieved");
    // console.log("");
    //shufflePassword
    password=shufflePassword(Array.from(password));
    
    //show password
    passwordDisplay.value=password;
    //claculate strength
    calcStrength();
});