"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scaffold = exports.dockerize = void 0;
const yaml_1 = __importDefault(require("yaml"));
function dockerize(name, config) {
    let dockerfile = [];
    dockerfile.push("FROM rust:1.76-alpine as development\n");
    dockerfile.push("RUN apk add --update npm");
    dockerfile.push("RUN npm install -g nodemon\n");
    dockerfile.push("WORKDIR /app");
    dockerfile.push("COPY Cargo.toml /app/Cargo.toml");
    if (config)
        dockerfile.push(`COPY config.${config} ./config.${config}`);
    dockerfile.push("COPY src /app/src");
    dockerfile.push("RUN cargo build");
    dockerfile.push("COPY nodemon.json /app/nodemon.json\n");
    dockerfile.push("# More development build configurations here\n");
    dockerfile.push("FROM development as production\n");
    dockerfile.push("RUN cargo build --release\n");
    dockerfile.push("# More production build configurations here");
    return {
        nodemon: JSON.stringify({
            watch: config ? ["src", "config." + config] : ["src"],
            ext: ".rs",
            ignore: [],
            exec: "cargo run src/main.rs",
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
                    command: "/app/target/release/" + name,
                    restart: "no",
                },
            },
        }),
    };
}
exports.dockerize = dockerize;
function scaffold(name) {
    return {
        main: `fn main(){\n\tprintln!("Hello from Rust!")\n}`,
        cargo: `[package]\nname = "${name}"\nversion = "0.1.0"\nedition = "2021"\n\n# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html\n\n[dependencies]\n`,
    };
}
exports.scaffold = scaffold;
