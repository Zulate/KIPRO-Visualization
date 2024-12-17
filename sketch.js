let mydata = {};
let selectedRect = [];
let Mouse = Matter.Mouse;
let MouseConstraint = Matter.MouseConstraint;
let monthValues;

function setup() {
  mydata = loadJSON("2024WholeYear.json", drawData);
  noCanvas();
}

function drawData(mydata){
  
}

function draw(){

  // Matter.js Setup
  const { Engine, Render, Composite, Runner } = Matter;

  
  // Erstelle den Engine und setze die Gravitation auf 0
  const engine = Engine.create();
  engine.world.gravity.y = 0;

  // Erstelle den Renderer
  const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: window.innerWidth,
      height: window.innerHeight,
      wireframes: false,  // Setze auf false, um die Rechtecke gefüllt darzustellen
    },
  });

  let anzahlIndex = 0;
for(index in mydata){
  anzahlIndex++;
}

const numElements = anzahlIndex;
const rows = Math.ceil(numElements / Math.ceil(Math.sqrt(numElements)));

const viewportWidth = window.innerWidth - 50;
const viewportHeight = window.innerHeight - (window.innerHeight / Math.sqrt(numElements)) - 50;

const rectWidth = viewportWidth / Math.ceil(Math.sqrt(numElements));
const rectHeight = viewportHeight / Math.ceil(numElements / Math.ceil(Math.sqrt(numElements)));



for (let i = 0; i < rows; i++) {
  for (let j = 0; j < Math.ceil(Math.sqrt(numElements)); j++) {

    const index = i * Math.ceil(Math.sqrt(numElements)) + j;
    
    if (index < numElements) {

      for(let i = 0; i < 11; i++){}
      if(mydata[index][0].includes("2024-01")){monthValues = 0;}
      if(mydata[index][0].includes("2024-02")){monthValues = 5;}
      if(mydata[index][0].includes("2024-03")){monthValues = 10;}
      if(mydata[index][0].includes("2024-04")){monthValues = 15;}
      if(mydata[index][0].includes("2024-05")){monthValues = 20;}
      if(mydata[index][0].includes("2024-06")){monthValues = 25;}
      if(mydata[index][0].includes("2024-07")){monthValues = 30;}
      if(mydata[index][0].includes("2024-08")){monthValues = 35;}
      if(mydata[index][0].includes("2024-09")){monthValues = 40;}
      if(mydata[index][0].includes("2024-10")){monthValues = 45;}
      if(mydata[index][0].includes("2024-11")){monthValues = 50;}

      const x = j * rectWidth + 25;
      const y = i * rectHeight + 25;
      const rect = Matter.Bodies.rectangle(x + rectWidth / 2 , y + rectHeight / 2 + monthValues, rectWidth, rectHeight, 
        { isStatic: true, render: {fillStyle: 'hsl(' + 0 + (monthValues * 3) + 'deg, 100%, ' + map(mydata[index][1], 20, 450, 20, 90) + '%)',
          text: {content: mydata[index][1],
            color: '#ffffff',
            size: 12}
        }}
      )
      rect.collisionFilter.group = -1;
      rect.basePosition = {x: x, y: y}; // Setze die basePosition des Rechtecks
      Matter.World.add(engine.world, rect);
      selectedRect.push(rect);
    }
  }
}


let mouse = Mouse.create(render.canvas);
 let mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.01,
    render: {
      visible: true
    }
  }
 })

 Matter.Events.on(engine, 'beforeUpdate', function(event){

});

Matter.Events.on(mouseConstraint, 'mousedown', (event) => {

  console.clear();

  const mousePosition = { x: event.mouse.position.x, y: event.mouse.position.y };
  const index = selectedRect.findIndex((rect) => {
    return (
      rect.bounds.min.x <= mousePosition.x &&
      rect.bounds.max.x >= mousePosition.x &&
      rect.bounds.min.y <= mousePosition.y &&
      rect.bounds.max.y >= mousePosition.y
    );
  });
  if (index !== -1) {
    console.log("Datum:", mydata[index][0] + ".", "An diesem Tag habe ich", selectedRect[index].render.text.content, "-mal gestreamt");
  }
  
});

Matter.World.add(engine.world, mouseConstraint, ...selectedRect);

  // Erstelle einen Runner und starte ihn
  const runner = Runner.create();
  Runner.run(runner, engine);

  render.mouse = mouse;
  Render.run(render);


noLoop();
}
