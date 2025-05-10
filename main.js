const carCanvas=document.getElementById("carCanvas");
carCanvas.width=200;
const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=660;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road=new Road(carCanvas.width/2,carCanvas.width*0.9);

var playerCar=true
const BrainitemSlot="bestBrain3"

//  bestBrain - training base,
//  bestBrain3 - trained,

const N=1
const cars=generateCars(N,true);
let bestCar=cars[0];
for(let i=0;i<cars.length;i++){
    cars[i].brain=JSON.parse(brainStorage)
}

const traffic=[]

generateTraffic();
animate(null,true);

function playerFocusSwitch(){
    playerCar=playerCar?false:true
}

function save(){
    localStorage.setItem(BrainitemSlot,
        JSON.stringify(bestCar.brain));

}

function discard(){
    localStorage.removeItem(BrainitemSlot);
}

function setMaxSpeeds(speed){
    for(i=0;i<cars.length;i++){
        cars[i].maxSpeed=speed
    }
    console.log('SetmaxSpeed:'+speed)
}

function generateTraffic(N=100){
    for(let i=0;i<N;i++){
        traffic.push(new Car(road.getLaneCenter(randomNumber(0,2)),i*-150,30,50,"DUMMY",2,getRandomColour()))
    }
}

function generateCars(N,playerCar){
    const cars=[];

    for(let i=1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"))
    }

    if(playerCar){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"KEYS",3,"hsla(221, 40%, 90%, 1"))
    }

    return cars
}

function animate(time){
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    for(let i=0;i<cars.length;i++){
        cars[i].update(road.borders,traffic);
    }

    
    bestCar=cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        ));
        
    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;

    carCtx.save();

    if(playerCar){
        carCtx.translate(0,-cars[cars.length-1].y+carCanvas.height*0.7)
    }else{
        carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);
    }

    road.draw(carCtx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx);
    }
    carCtx.globalAlpha=0.2;
    for(let i=0;i<cars.length;i++){
        cars[i].draw(carCtx);
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx,true)
    playerCar?cars[cars.length-1].draw(carCtx):

    carCtx.restore();

    networkCtx.lineDashOffset=-time/50;
    Visualiser.drawNetwork(networkCtx,bestCar.brain);
    requestAnimationFrame(animate);
}