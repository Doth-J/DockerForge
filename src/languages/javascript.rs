use crate::utils;
use serde_json::json;
use serde_yaml::to_string as to_yaml_string;

pub fn dockerize(name: &str, config: Option<&str>) -> (String, String, String, String) {
    let mut dockerfile = vec![
        "FROM node:lts-alpine as development\n",
        "RUN npm install -g nodemon\n",
        "WORKDIR /app",
        "COPY package.json /app/package.json",
        "RUN npm install\n",
        "COPY src /app/src",
        "COPY nodemon.json /app/nodemon.json\n",
        "# More development build configurations here\n",
        "FROM development as production\n",
        "RUN rm -r /app/node_modules",
        "RUN npm install --omit=dev\n",
        "# More production build configurations here",
    ];

    let cmd: String;
    if let Some(conf) = config {
        cmd = format!("COPY config.{} /app/config.{}", conf, conf);
        dockerfile.insert(5, &cmd);
    }

    let watch = match config {
        Some(conf) => {
            let mut watch_vec = vec!["src".to_string()];
            watch_vec.push(format!("config.{}", conf));
            watch_vec
        }
        None => vec!["src".to_string()],
    };

    let nodemon_config = json!({
        "watch": watch,
        "ext": ".js",
        "ignore": [],
        "exec": "node ./src/index.js",
    });

    let services = std::collections::HashMap::from([(
        "app".to_string(),
        utils::Service {
            container_name: name.to_string(),
            build: utils::Build {
                context: ".",
                target: "development",
            },
            command: String::from("nodemon"),
            volumes: if config.is_some() {
                vec![
                    "./src:/app/src".into(),
                    format!(
                        "./config.{}:/app/config.{}",
                        config.unwrap(),
                        config.unwrap()
                    ),
                ]
            } else {
                vec!["./src:/app/src".into()]
            },
            restart: "unless-stopped",
        },
    )]);

    let compose_dev = utils::Compose {
        version: "3.9",
        services,
    };

    let services_prod = std::collections::HashMap::from([(
        "app".to_string(),
        utils::Service {
            container_name: name.to_string(),
            build: utils::Build {
                context: ".",
                target: "production",
            },
            command: String::from("npm start"),
            volumes: vec![],
            restart: "no",
        },
    )]);

    let compose_prod = utils::Compose {
        version: "3.9",
        services: services_prod,
    };

    (
        serde_json::to_string_pretty(&nodemon_config).unwrap(),
        dockerfile.join("\n"),
        to_yaml_string(&compose_dev).unwrap(),
        to_yaml_string(&compose_prod).unwrap(),
    )
}
pub fn scaffold(name: &str) -> (String, String) {
    let index = "console.log('Hello from NodeJS!');".to_string();
    let pkg = json!({
      "name": name,
      "version": "1.0.0",
      "author": "",
      "license": "",
      "main": "src/index.ts",
      "dependencies": {},
      "devDependencies": {},
      "scripts": {
        "start": "node src/index.js",
      },
    });

    (index, serde_json::to_string_pretty(&pkg).unwrap())
}
