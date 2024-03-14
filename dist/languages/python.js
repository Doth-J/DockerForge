"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scaffold = exports.dockerize = void 0;
const yaml_1 = __importDefault(require("yaml"));
function dockerize(name, config) {
    let dockerfile = [];
    dockerfile.push("FROM python:3-alpine as development\n");
    dockerfile.push("RUN apk add --update npm");
    dockerfile.push("RUN npm install -g nodemon\n");
    dockerfile.push("WORKDIR /app");
    dockerfile.push("COPY requirements.txt /app/requirements.txt");
    dockerfile.push("RUN pip install -r requirements.txt\n");
    if (config)
        dockerfile.push(`COPY config.${config} app/config.${config}`);
    dockerfile.push("COPY src /app/src");
    dockerfile.push("COPY nodemon.json /app/nodemon.json\n");
    dockerfile.push("# More development build configurations here\n");
    dockerfile.push("FROM development as production\n");
    dockerfile.push("# More production build configurations here");
    return {
        nodemon: JSON.stringify({
            watch: config ? ["src", "config." + config] : ["src"],
            ext: ".py",
            ignore: [],
            exec: "python3 ./src/index.py",
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
                    command: "python3 /app/src/index.py",
                    restart: "no",
                },
            },
        }),
    };
}
exports.dockerize = dockerize;
function scaffold(name) {
    return {
        index: "print('Hello from Python!');",
    };
}
exports.scaffold = scaffold;
