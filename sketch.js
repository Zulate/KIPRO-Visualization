let mydata = {};
let artistsArray = [];
let testNumber;
let colorMap;
let circleSizeMap;

function setup() {
  mydata = loadJSON("sortedFilteredTop20.json", drawData);
  noCanvas();
}

function drawData(spotifydata2024){
  
}

function draw(){

  // Matter.js Setup
  const { Engine, Render, Composite, Bodies, Mouse, MouseConstraint, Runner, Body } = Matter;

  // Erstelle den Engine und setze die Gravitation auf 0
  const engine = Engine.create();
  engine.world.gravity.y = 0;  // Setze die Schwerkraft auf 0 (keine Gravitation nach unten)

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

  // Erstelle 20 kleinere Rechtecke mit weißer Füllung
  const circles = [];

  for (let i = 0; i < 20; i++) {

    colorMap = map(mydata[i][1], 102, 500, 50, 240);
    circleSizeMap = map(mydata[i][1], 102, 436, 40, 100);

    // Position zufällig setzen und kleinere Rechtecke erzeugen
    const circleConst = Matter.Bodies.circle(
      Math.random() * render.options.width,  // Zufällige X-Position
      Math.random() * render.options.height, // Zufällige Y-Position
      circleSizeMap,  // Breite des Rechtecks
      { isStatic: false, render: { fillStyle: 'rgb(' + colorMap + ', '+ colorMap + ', '+ colorMap +')',
                                  text: {content: mydata[i][0] + ' ' + mydata[i][1],
                                          color: "#ffffff",
                                          size: circleSizeMap / 5}
                                        }
                                      }
    );
    console.log(mydata[i]);
    circles.push(circleConst);
  }

  // Erstelle einen MouseConstraint für die Mausinteraktion
  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.001,
      render: {
        visible: true, // Verstecke die Mauslinie,
        type: 'line',
        strokeStyle: 'red'
      }
    }
  });

  // Begrenze die Welt, damit die Rechtecke nicht den Render-Bereich verlassen
  // Erstelle die Kanten (Wände) der Welt
  const wallThickness = 50;
  const walls = [
    Matter.Bodies.rectangle(render.options.width / 2, 0 - wallThickness / 2, render.options.width, wallThickness, { isStatic: true }),  // Oben
    Matter.Bodies.rectangle(render.options.width / 2, render.options.height + wallThickness / 2, render.options.width, wallThickness, { isStatic: true }),  // Unten
    Matter.Bodies.rectangle(0 - wallThickness / 2, render.options.height / 2, wallThickness, render.options.height, { isStatic: true }),  // Links
    Matter.Bodies.rectangle(render.options.width + wallThickness / 2, render.options.height / 2, wallThickness, render.options.height, { isStatic: true })  // Rechts
  ];

  // Hinzufügen der Objekte zur Welt
  Composite.add(engine.world, [...circles, mouseConstraint, ...walls]);

  // Eine Funktion, die eine konstante Kraft in die Mitte des Canvas anwendet
  function applyCentralForce() {
    const centerX = render.options.width / 2; // Mitte des Canvas (horizontal)
    const centerY = render.options.height / 2; // Mitte des Canvas (vertikal)
    
    // Für jedes Rechteck eine Kraft in die Mitte anwenden
    circles.forEach(circle => {
      // Berechne die Richtung zum Mittelpunkt des Canvas
      const forceX = centerX - circle.position.x;
      const forceY = centerY - circle.position.y;
      
      // Normiere die Richtung (damit die Kraft immer konstant bleibt)
      const magnitude = 0.00001; // Stärke der Kraft (je kleiner der Wert, desto weniger stark die Anziehung)
      const force = {
        x: forceX * magnitude,
        y: forceY * magnitude
      };
      
      // Wende die Kraft an
      Body.applyForce(circle, circle.position, force);
    });
  }

  // Erstelle einen Runner und starte ihn
  const runner = Runner.create();
  Runner.run(runner, engine);

  // Starte das Rendering
  Render.run(render);

  // Wende konstant die Zentralkraft in jedem Update an
  (function applyForceLoop() {
    // Zentralkraft in jedem Update anwenden
    applyCentralForce();
    
    // Starte die nächste Schleife
    requestAnimationFrame(applyForceLoop);
  })();
noLoop();
}
