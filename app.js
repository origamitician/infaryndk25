const canvas = document.getElementById("myCanvas");
const c = canvas.getContext("2d");
let particleColors = [["#46eb34", "#85d166", "grey"], ["#13ede6", "red", "#3c9e9b"], ["orange", "#c4bc27", "#9e873c"], ["green", "lime"], ["cornflowerblue", "lightblue"], ["lime", "lightblue"], ["red"], ["cornflowerblue", "lime"], ["orange"], ["purple", "lime", "lightblue"], ["purple", "lime"], ["purple", "lightblue"], ["white", "pink"], ["red", "orange", "yellow", "green", "blue", "purple"]];

var deathParticles = []

let subDeathParticles = []

let nonExplodedParticles = [];

var defaultHeight = 609;
var defaultWidth = 1280;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function explode(x, y){
    subDeathParticles = [];
    let radius = 5
    let numParticles = Math.floor(Math.random()*30)+85 //85-115 particles

    let mainParticleColor = Math.round(Math.random()*particleColors.length);
    for (let k = 0; k < numParticles; k++){
        subDeathParticles.push({
            x: x+(radius*Math.cos(k*((Math.PI*2)/numParticles))),
            y: y+(radius*Math.sin(k*((Math.PI*2)/numParticles))),
            variationX: (Math.random()*4)-2,
            variationY: (Math.random()*4)-2,
            angle: k*((Math.PI*2)/numParticles),
            size: Math.floor(Math.random()*(6*(window.innerWidth / defaultWidth)))+2.5,
            initGravity: 4*(window.innerHeight / defaultHeight),
            particleColor: particleColors[mainParticleColor][Math.floor(Math.random()*(particleColors[mainParticleColor].length))],
            loop: 0,
            life: 500,
        })
    }
    deathParticles.push(subDeathParticles)
}
            

function updateDeathParticles(){
    let i = 0;
    let j = 0;
    while (i < deathParticles.length){
        j = 0;
        while (j < deathParticles[i].length){
            if(deathParticles[i][j].loop < deathParticles[i][j].life){
                deathParticles[i][j].x += Math.cos(deathParticles[i][j].angle)*0.5 + deathParticles[i][j].variationX
                deathParticles[i][j].y -= Math.sin(deathParticles[i][j].angle)*0.5 + deathParticles[i][j].initGravity + deathParticles[i][j].variationY
                deathParticles[i][j].initGravity -= 0.1
                deathParticles[i][j].loop++;
                j++
            }else{
                deathParticles[i].splice(j, 1)
            }
        }
        if(deathParticles[i].length == 0){
            deathParticles.splice(i, 1)
            i--;
        }
        i++;
    }
}

let size;
function drawDeathParticles(){
    for(let i = 0; i < deathParticles.length; i++){
        for(let j = 0; j < deathParticles[i].length; j++){
            size = deathParticles[i][j].size
            c.beginPath()
            c.save()
            c.globalAlpha = 1-(deathParticles[i][j].loop/deathParticles[i][j].life);
            c.rect(deathParticles[i][j].x-size, deathParticles[i][j].y-size, size*2, size*2)
            c.fillStyle = deathParticles[i][j].particleColor;
            c.fill()
            c.closePath()
            c.restore()
        }
    }
}

function initParticle(){
    
    if(Math.round(Math.random()) == 1){
        //default fireworks
        nonExplodedParticles.push({x: Math.round(Math.random()*window.innerWidth), y: window.innerHeight, initGravity: 0-((Math.random()*4)+4)*(window.innerHeight/defaultHeight), type: "default"})
    }else{
        //curvy fireworks
        let randomX = Math.round(Math.random()*window.innerWidth)
        nonExplodedParticles.push({x: randomX, y: window.innerHeight, initGravity: 0-((Math.random()*4)+4)*(window.innerHeight/defaultHeight), amplitude: ((Math.random()*2)+50)*(window.innerHeight/defaultHeight), type: "curvy", loop: 0, referenceX: randomX})
    }
}

function updateInitParticle(){
    let i=0;
    while(i < nonExplodedParticles.length){
        if(nonExplodedParticles[i].initGravity < -0.8){
            console.log("aaaaaaa");
            if(nonExplodedParticles[i].type == "default"){
                //runs if default
                
                nonExplodedParticles[i].y += nonExplodedParticles[i].initGravity
                nonExplodedParticles[i].initGravity += 0.05;
                console.log("non")
            }else{
                //runs if curvy
                nonExplodedParticles[i].y += nonExplodedParticles[i].initGravity
                nonExplodedParticles[i].initGravity += 0.05;
                nonExplodedParticles[i].x = nonExplodedParticles[i].referenceX + (nonExplodedParticles[i].amplitude)*Math.sin((nonExplodedParticles[i].loop*5)*(Math.PI/180));
                nonExplodedParticles[i].loop++;
            }
        }else{
            console.log("deleting");
            explode(nonExplodedParticles[i].x, nonExplodedParticles[i].y);
            nonExplodedParticles.splice(i, 1);
            i--;
        }
        
        i++;
    }
}

function drawInitParticle(){
    let size = 5*(window.innerWidth / 1280);
    for(let i = 0; i < nonExplodedParticles.length; i++){
        c.beginPath()
        c.rect(nonExplodedParticles[i].x-size, nonExplodedParticles[i].y-size, size*2, size*2)
        c.fillStyle = "white"
        c.fill()
        c.closePath()


    }
}

function frame(){
    
    c.clearRect(0, 0, canvas.width, canvas.height);
    if(Math.floor(Math.random()*50) == 1){
        initParticle();
        console.log("init particle")
    }

    c.font = 100*(window.innerWidth / 1280) + "px inconsolata";
    c.textAlign = "center";
    c.fillStyle = "white";

    c.fillText("Happy 54th Birthday!", window.innerWidth / 2, window.innerHeight / 2);
    

    drawInitParticle()
    updateInitParticle()
    
    drawDeathParticles()
    updateDeathParticles()
    console.log(nonExplodedParticles);
}

var wrapper = frame();

var interval = setInterval(frame, 10);