import * as PIXI from "pixi.js";
import parseAPNG from "apng-js";

async function loadAPNG(url: string, app: PIXI.Application) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const apng = parseAPNG(buffer);

  if (apng instanceof Error) {
    console.error("Error parsing APNG:", apng.message);
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.width = apng.width;
  canvas.height = apng.height;
  const context = canvas.getContext("2d");

  if (context) {
    const player = await apng.getPlayer(context);
    player.play();

    const texture = PIXI.Texture.from(canvas);
    const sprite = new PIXI.Sprite(texture);
    app.stage.addChild(sprite);

    app.ticker.add(() => {
      texture.baseTexture.update();
    });

    sprite.x = (app.screen.width - apng.width) / 2;
    sprite.y = (app.screen.height - apng.height) / 2;
  }
}

const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view as HTMLCanvasElement);
loadAPNG("output.png", app).catch(console.error);
// loadAPNG("bear-img.png", app).catch(console.error);
