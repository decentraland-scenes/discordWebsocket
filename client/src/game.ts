const cube = new Entity();
cube.addComponent(new Transform({ position: new Vector3(8,2.7,8), scale: new Vector3(8,5,1) }));
cube.addComponent(new PlaneShape());
cube.addComponent(new Material());
cube.getComponent(Material).albedoColor = Color3.Black();
engine.addEntity(cube);

const chat = new Entity()
chat.setParent(cube)
chat.addComponent(new TextShape())
chat.addComponent(new Transform({position: new Vector3(0,0,-0.1), scale: new Vector3(0.5,0.5,0.5)}))
chat.getComponent(TextShape).fontSize = 1
chat.getComponent(TextShape).hTextAlign = "center"
var socket = new WebSocket("wss://chat.dcl.guru/700404990967152701");

socket.onmessage = function (event) {
  try {
    const parsed = JSON.parse(event.data);
    log(parsed)
    if(parsed[0]) chat.getComponent(TextShape).value = `${parsed[0].author}: ${parsed[0].message}`;
    else chat.getComponent(TextShape).value = `${parsed.author}: ${parsed.message}`;
  } catch (error) {
    log(error)
  }
};

socket.onopen = (ev) => {
  socket.send(
    JSON.stringify({ command: "getHistory", channel: "700404990967152701" })
  );
};