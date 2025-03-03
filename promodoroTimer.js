const startElement = document.getElementById("start");
const stopElement = document.getElementById("stop");
const resetElement = document.getElementById("reset");
const timerElement = document.getElementById("timer");

let interval;
let timeleft = 1500;

function updateTimer(){
    let minutes = Math.floor(timeleft / 60);
    let seconds = timeleft % 60;
    
    let formatedTime = (minutes < 10 ? "0" : " " )+ minutes + ":"  + ( seconds < 10 ? "0" : " " ) + seconds;
    
    
    timerElement.innerHTML =  formatedTime;
}


function startTimer(){
interval = setInterval(() =>{
    timeleft--;
updateTimer();    

if(timeleft == 0){
    clearInterval(interval);
    alert("time is up")
    timeleft = 1500;
    updateTimer()
}
},1000)
}

function stopTimer(){
clearInterval(interval)    
}

function resetTimer(){
clearInterval(interval);
timeleft = 1500
updateTimer();
}


startElement.addEventListener("click",startTimer);
stopElement.addEventListener("click",stopTimer);
resetElement.addEventListener("click",resetTimer);