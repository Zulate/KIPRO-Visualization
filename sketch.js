let mydata = {};

function setup() {
  mydata = loadJSON("MonthOfJanuary.json", drawData);
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
        { isStatic: false, render: {fillStyle: 'rgb(' + map(mydata[index][1], 0, 200, 0, 255) + ', 0, 0)',
          text: {content: mydata[index][0] + ' ' + mydata[index][1],
            color: "#ffffff",
            size: 16}
        } }
      )
      Matter.World.add(engine.world, rect);
    }
  }
}
  
  document.body.appendChild(render.canvas);
  
  // Funktion, die aufgerufen wird, wenn ein Rechteck geklickt wird
  function onClick(event) {
    const rect = engine.world.bodies.find(body => {
      return body.bounds.min.x <= event.mouse.position.x &&
             event.mouse.position.x <= body.bounds.max.x &&
             body.bounds.min.y <= event.mouse.position.y &&
             event.mouse.position.y <= body.bounds.max.y;
    });
    if (rect) {
      // Ändere die Größe des geklickten Rechtecks
      rect.width *= 1.5;
      rect.height *= 1.5;
  
      // Anpassen der anderen Rechtecke
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < Math.ceil(Math.sqrt(numElements)); j++) {
          const index = i * Math.ceil(Math.sqrt(numElements)) + j;
          if (index < numElements) {
            const otherRect = engine.world.bodies[index];
            if (otherRect !== rect) {
              // Anpassen der Größe des anderen Rechtecks
              otherRect.width *= 0.9;
              otherRect.height *= 0.9;
            }
          }
        }
      }
    }
  }
  
  // Hinzufügen der onClick-Funktion zu jedem Rechteck
  function render() {
    // ...
    if (mouse.isDown) {
      onClick({ mouse: mouse });
    }
    // ...
    Render.run(render);
  }

  // Erstelle einen Runner und starte ihn
  const runner = Runner.create();
  Runner.run(runner, engine);

noLoop();
}
