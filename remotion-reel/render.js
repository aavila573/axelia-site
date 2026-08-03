const { bundle } = require("@remotion/bundler");
const { renderMedia, selectComposition } = require("@remotion/renderer");
const path = require("path");

(async () => {
  const entry = path.join(__dirname, "src", "Root.tsx");
  const output = "C:/Users/alexa/axelia-site/reel_pymes_ia.mp4";

  console.log("Bundling...");
  const bundled = await bundle({ entryPoint: entry, ignoreRegisterRootWarning: true });

  console.log("Selecting composition...");
  const comp = await selectComposition({ serveUrl: bundled, id: "AxelIAReel" });
  console.log(`Composition: ${comp.id} (${comp.width}x${comp.height}, ${comp.durationInFrames} frames)`);

  console.log("Rendering...");
  await renderMedia({
    serveUrl: bundled,
    composition: comp,
    codec: "h264",
    outputLocation: output,
    inputProps: {},
    onProgress: ({ progress }) => {
      process.stdout.write(`\rProgress: ${Math.round(progress * 100)}%`);
    },
  });

  console.log(`\nDone: ${output}`);
})();
