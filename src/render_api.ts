import { bundle } from "@remotion/bundler";
import { renderVideo, getCompositions } from "@remotion/renderer";
import path from "path";

const start = async () => {
    console.log("Starting render via API...");
    const entry = path.resolve("src/index.ts");

    console.log("Bundling...");
    const bundleLocation = await bundle({
        entryPoint: entry,
    });

    const compositions = await getCompositions(bundleLocation);
    const composition = compositions.find((c) => c.id === "IranNuclearTalks");

    if (!composition) {
        throw new Error("Composition not found");
    }

    console.log("Rendering...");
    await renderVideo({
        composition,
        bundle: bundleLocation,
        outputLocation: "rendered/iran_nuclear_talks_api_v1.mp4",
    });

    console.log("Render finished!");
};

start().catch(err => {
    console.error(err);
    process.exit(1);
});
