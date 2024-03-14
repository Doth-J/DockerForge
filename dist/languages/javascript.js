"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scaffold = exports.dockerize = void 0;
const yaml_1 = __importDefault(require("yaml"));
function dockerize(name, config) {
    let dockerfile = [];
    // Create language dockerfile
    dockerfile.push("FROM node:lts-alpine as development\n");
    dockerfile.push("RUN npm install -g nodemon\n");
    dockerfile.push("WORKDIR /app");
    dockerfile.push("COPY package.json /app/package.json");
    dockerfile.push("RUN npm install\n");
    if (config)
        dockerfile.push(`COPY config.${config} app/config.${config}`);
    dockerfile.push("COPY src /app/src");
    dockerfile.push("COPY nodemon.json /app/nodemon.json\n");
    dockerfile.push("# More development build configurations here\n");
    dockerfile.push("FROM development as production\n");
    dockerfile.push("RUN -r rm /app/node_modules");
    dockerfile.push("RUN npm install --omit=dev");
    dockerfile.push("# More production build configurations here");
    return {
        nodemon: JSON.stringify({
            watch: config ? ["src", "config." + config] : ["src"],
            ext: ".js",
            ignore: [],
            exec: "node ./src/index.js",
        }, null, 1),
        dockerfile: dockerfile.join("\n"),
        compose_dev: yaml_1.default.stringify({
            version: "3.9",
            services: {
                app: {
                    container_name: name,
                    build: {
                        context: ".",
                        target: "development",
                    },
                    command: "nodemon",
                    volumes: config
                        ? ["./src:/app/src", `./config.${config}:/app/config.${config}`]
                        : ["./src:/app/src"],
                    restart: "unless-stopped",
                },
            },
        }),
        compose_prod: yaml_1.default.stringify({
            version: "3.9",
            services: {
                app: {
                    container_name: name,
                    build: {
                        context: ".",
                        target: "production",
                    },
                    command: "npm start",
                    restart: "no",
                },
            },
        }),
    };
}
exports.dockerize = dockerize;
function scaffold(name) {
    return {
        index: "console.log('Hello from NodeJS!');",
        pkg: JSON.stringify({
            name: name,
            version: "1.0.0",
            author: "",
            license: "",
            main: "src/index.js",
            dependencies: {},
            devDependencies: {
                nodemon: "^1.3.3",
            },
            scripts: {
                start: "node src/index.js",
            },
        }, null, 2),
    };
}
exports.scaffold = scaffold;
