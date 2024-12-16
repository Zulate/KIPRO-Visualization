let mydata = {};
let selectedRect = [];
let Mouse = Matter.Mouse;
let MouseConstraint = Matter.MouseConstraint;

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
const viewportWidth = window.innerWidth - (window.innerWidth / 2);
const viewportHeight = window.innerHeight - (window.innerWidth / 10);
const rectWidth = viewportWidth / Math.ceil(Math.sqrt(numElements));
const rectHeight = viewportHeight / Math.ceil(numElements / Math.ceil(Math.sqrt(numElements)));

const rows = Math.ceil(numElements / Math.ceil(Math.sqrt(numElements)));

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < Math.ceil(Math.sqrt(numElements)); j++) {
    const index = i * Math.ceil(Math.sqrt(numElements)) + j;
    
    if (index < numElements) {
      const x = j * rectWidth + viewportWidth / 2;
      const y = i * rectHeight + viewportHeight / 10;
      const rect = Matter.Bodies.rectangle(x + rectWidth / 2, y + rectHeight / 2, rectWidth, rectHeight, 
        { isStatic: false, render: {fillStyle: 'rgb(0, ' + map(mydata[index][1], 0, 400, 25, 255) + ', 0)'
          // text: {content: mydata[index][0] + ' ' + mydata[index][1],
          //   color: "#ffffff",
          //   size: viewportWidth / 100}
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

 function drawRectsToBasePosition() {
  for (const rect of selectedRect) {
    const currentPosition = rect.position; // Die aktuelle Position des Rechtecks
    const basePosition = {x: rect.basePosition.x, y: rect.basePosition.y}; // Die Basisposition des Rechtecks
    const distanceToBasePosition = Matter.Vector.magnitude(Matter.Vector.sub(basePosition, currentPosition)); // Der Abstand zwischen der Basisposition und der aktuellen Position
    let directionToBasePosition = rect.directionToBasePosition; // Der Vektor, der die Richtung zur Basisposition angibt
    
    if (!directionToBasePosition) {
      directionToBasePosition = Matter.Vector.create();
      rect.directionToBasePosition = directionToBasePosition;
    }
    
    Matter.Vector.sub(basePosition, currentPosition, directionToBasePosition);
    const length = Matter.Vector.magnitude(directionToBasePosition);
    directionToBasePosition.x /= length;
    directionToBasePosition.y /= length;

    const maxForce = 10;
const force = {
  x: Math.min(directionToBasePosition.x * (distanceToBasePosition / 100), maxForce),
  y: Math.min(directionToBasePosition.y * (distanceToBasePosition / 100), maxForce)
};
    Matter.Body.applyForce(rect, rect.position, force);
  }
}

 Matter.Events.on(engine, 'beforeUpdate', function(event){
  
  // let mousePosition = {x: mouseX, y: mouseY};
  // let rectUnderMouse = Matter.Query.point(selectedRect, mousePosition);
  
  drawRectsToBasePosition();

});

// console.log("Datum:", selectedRect.render.text.content.split(" ")[0], "Anzahl Streams:", selectedRect.render.text.content.split(" ")[1]);




Matter.World.add(engine.world, mouseConstraint, ...selectedRect);

  // Erstelle einen Runner und starte ihn
  const runner = Runner.create();
  Runner.run(runner, engine);

  render.mouse = mouse;
  Render.run(render);


noLoop();
}
