import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const phasermsg = () => {
    return {
        name: "phasermsg",
        buildStart() {
            process.stdout.write(`Building for production...\n`);
        },
        buildEnd() {
            process.stdout.write(`✨ Done ✨\n`);
            process.stdout.write(
                `aHR0cHM6Ly9mb3Jtcy5nbGUvUFBOVHROaW9zZVoxanN6OTc=\n`,
            );
        },
    };
};

export default defineConfig({
    base: "/final-project-blue/",
    plugins: [react(), phasermsg()],
    logLevel: "warning",
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    phaser: ["phaser"],
                },
            },
        },
        minify: "terser",
        terserOptions: {
            compress: {
                passes: 2,
            },
            mangle: true,
            format: {
                comments: false,
            },
        },
    },
});
