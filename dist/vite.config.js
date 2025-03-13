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
    root: './src/web',
    server: {
        port: 4000,
        proxy: {
            '/api': 'http://localhost:3001',
            '/ws': {
                target: 'ws://localhost:3001',
                ws: true,
            },
        },
    },
    build: {
        outDir: '../../dist/web',
        emptyOutDir: true,
    },
    resolve: {
        alias: {
            '@': (0, path_1.resolve)(__dirname, './src'),
        },
    },
});
