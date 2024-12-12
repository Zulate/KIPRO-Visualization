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
const viewportWidth = window.innerWidth;
const viewportHeight = window.innerHeight;
const rectWidth = viewportWidth / Math.ceil(Math.sqrt(numElements));
const rectHeight = viewportHeight / Math.ceil(numElements / Math.ceil(Math.sqrt(numElements)));

const rows = Math.ceil(numElements / Math.ceil(Math.sqrt(numElements)));

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < Math.ceil(Math.sqrt(numElements)); j++) {
    const index = i * Math.ceil(Math.sqrt(numElements)) + j;
    
    if (index < numElements) {
      const x = j * rectWidth;
      const y = i * rectHeight;
      const rect = Matter.Bodies.rectangle(x + rectWidth / 2, y + rectHeight / 2, rectWidth, rectHeight, 
        { isStatic: false, render: {fillStyle: 'rgb(0, ' + map(mydata[index][1], 0, 400, 0, 255) + ', 0)',
          text: {content: mydata[index][0] + ' ' + mydata[index][1],
            color: 'hsl(' + map(mydata[index][1], 0, 400, 0, 360) + ', 0, 100)',
            size: 6}
        } }
      )
      Matter.World.add(engine.world, rect);
      selectedRect.push(rect);
    }
  }
}
console.log(selectedRect);

 let mouse = Mouse.create(render.canvas);
 let mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.2,
    render: {
      visible: true
    }
  }
 })

//  Matter.Events.on(engine, 'beforeUpdate', function(event){

//   var mousePosition = MouseConstraint.mouse.position;

//   const selectedRect = Matter.Query.point(engine.world.bodies, mousePosition);
//   console.log(selectedRect);
  
//   // Matter.Body.scale(selectedRect, 1.5, 1.5);
// // console.log("Datum:", selectedRect.render.text.content.split(" ")[0], "Anzahl Streams:", selectedRect.render.text.content.split(" ")[1]);

//   });

console.log(engine.world.constraints);

Matter.World.add(engine.world, mouseConstraint, ...selectedRect);

  // Erstelle einen Runner und starte ihn
  const runner = Runner.create();
  Runner.run(runner, engine);

  render.mouse = mouse;
  Render.run(render);


noLoop();
}
