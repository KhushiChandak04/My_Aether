"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const plugin_react_1 = __importDefault(require("@vitejs/plugin-react"));
const path_1 = require("path");
exports.default = (0, vite_1.defineConfig)({
    plugins: [(0, plugin_react_1.default)()],
    root: (0, path_1.resolve)(__dirname, 'src/web'),
    publicDir: (0, path_1.resolve)(__dirname, 'src/web/public'),
    server: {
        port: 4000,
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                secure: false,
                configure: (proxy, _options) => {
                    proxy.on('error', (err, _req, _res) => {
                        console.log('Proxy Error:', err);
                    });
                    proxy.on('proxyReq', (_proxyReq, req, _res) => {
                        console.log('Sending Request:', req.method, req.url);
                    });
                    proxy.on('proxyRes', (proxyRes, req, _res) => {
                        console.log('Received Response:', proxyRes.statusCode, req.url);
                    });
                },
                rewrite: (path) => {
                    console.log('Rewriting path:', path);
                    return path.replace(/^\/api/, '/api'); // Ensure '/api' prefix is preserved
                }
            },
            '/ws': {
                target: 'ws://localhost:3000',
                ws: true,
                changeOrigin: true
            },
        },
    },
    build: {
        outDir: (0, path_1.resolve)(__dirname, 'dist/web'),
        emptyOutDir: true,
    },
    resolve: {
        alias: {
            '@': (0, path_1.resolve)(__dirname, 'src'),
        },
    },
});
