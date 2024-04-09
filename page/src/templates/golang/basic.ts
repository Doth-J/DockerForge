import yaml from "yaml";

export function dockerize(
  name: string,
  config?: string,
  _author?: string,
  _license?: string
) {
  let dockerfile: string[] = [];

  dockerfile.push("FROM golang:1.22-alpine as development\n");

  dockerfile.push("RUN apk add --update npm");
  dockerfile.push("RUN npm install -g nodemon\n");

  dockerfile.push("WORKDIR /app");
  dockerfile.push("COPY go.mod /app/go.mod");
  dockerfile.push("RUN go mod download\n");

  if (config) dockerfile.push(`COPY config.${config} ./config.${config}`);
  dockerfile.push("COPY src /app/src");
  dockerfile.push("COPY nodemon.json /app/nodemon.json\n");

  dockerfile.push("# More development build configurations here\n");
  dockerfile.push("FROM development as production\n");
  dockerfile.push(`RUN go build -o ${name} /app/src/main.go\n`);
  dockerfile.push("# More production build configurations here");

  return {
    env: "FOO=bar\nBAZ=bob",
    scaffold: {
      source: {
        name: "main.go",
        content: `package main\n\nimport "fmt"\n\nfunc main(){\n\tfmt.Println("Hello from Golang!")\n}`,
      },
      manager: { name: "go.mod", content: `module ${name}/main\n\ngo 1.22` },
    },
    nodemon: JSON.stringify(
      {
        watch: config ? ["src", "config." + config] : ["src"],
        ext: ".go",
        ignore: [],
        exec: "go run src/main.go",
      },
      null,
      1
    ),
    dockerfile: dockerfile.join("\n"),
    compose_dev: yaml.stringify({
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
    compose_prod: yaml.stringify({
      version: "3.9",
      services: {
        app: {
          container_name: name,
          build: {
            context: ".",
            target: "production",
          },
          command: "./" + name,
          restart: "no",
        },
      },
    }),
  };
}
