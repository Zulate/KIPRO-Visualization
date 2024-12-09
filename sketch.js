let mydata = {};

function setup() {
  mydata = loadJSON("sortedFilteredTop20.json", drawData);
  noCanvas();
}

function drawData(spotifydata2024){
  
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
        { isStatic: false, render: {fillStyle: 'rgb(' + map(mydata[index][1], 102, 436, 0, 255) + ', 0, 0)',
          text: {content: mydata[index][0] + ' ' + mydata[index][1],
            color: "#ffffff",
            size: 16}
        } }
      )
      Matter.World.add(engine.world, rect);
    }
  }
}
  
for(index in mydata){
  console.log(mydata[index][0]);
}

  document.body.appendChild(render.canvas);
  

  // Erstelle einen Runner und starte ihn
  const runner = Runner.create();
  Runner.run(runner, engine);

  // Starte das Rendering
  Render.run(render);

noLoop();
}
