import {defineConfig} from "vite";
import typescript from 'vite-plugin-ts';
import {VitePWA} from 'vite-plugin-pwa';

const injectRegister = (process.env.SW_INLINE ?? 'auto');
const selfDestroying = process.env.SW_DESTROY === 'true';

export default defineConfig({
    plugins: [
        typescript(),
        VitePWA({
            mode: 'development',
            base: '/',
            srcDir: 'src',
            registerType: 'autoUpdate',
            injectRegister,
            selfDestroying,
            manifest: {
                name: 'Find The Coins',
                short_name: 'FTC Game',
                theme_color: '#F8EFBA',
                icons: [
                    {
                        src: 'logo-31x31.png',
                        sizes: '31x31',
                        type: 'image/png',
                    },
                    {
                        src: 'logo-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: 'logo-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    }
                ]
            },
            workbox: {
                cleanupOutdatedCaches: true,
                clientsClaim: true,
                skipWaiting: true
            },
            injectManifest: {
                injectionPoint: undefined
            },
            devOptions: {
                enabled: process.env.SW_DEV === 'true',
                type: 'module',
                navigateFallback: 'index.html',
            }
        })
    ],
    resolve: {
        preserveSymlinks: true,
    },
    build: {
        sourcemap: process.env.SOURCE_MAP === "true",
    }
})