import { defineConfig } from "vite";
import typescript from 'vite-plugin-ts';

export default defineConfig({
    plugins: [typescript()],
    resolve: {
        preserveSymlinks: true,
    }
})