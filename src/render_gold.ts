import { spawn } from "child_process";

export const render = async () => {
    console.log("Starting render for GoldSkyrocketing...");

    await new Promise<void>((resolve, reject) => {
        const proc = spawn("npx", ["remotion", "render", "GoldSkyrocketing", "rendered/gold_sky_v1.mp4", "--overwrite", "--bundle"], {
            stdio: "inherit",
            shell: true,
            env: { ...process.env, TMPDIR: "/tmp/remotion_tmp" }
        });

        proc.on("exit", (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error("Rendering failed"));
            }
        });
    });

    console.log("Finished rendering GoldSkyrocketing");
};

render().catch(err => {
    console.error(err);
    process.exit(1);
});
