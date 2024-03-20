use crate::utils;
use serde_json::json;
use serde_yaml::to_string as to_yaml_string;

pub fn dockerize(name: &str, config: Option<&str>) -> (String, String, String, String) {
    let mut dockerfile = vec![
        "FROM python:3-alpine as development\n",
        "RUN apk add --update npm\n",
        "RUN npm install -g nodemon\n",
        "WORKDIR /app",
        "COPY requirements.txt /app/requirements.txt",
        "RUN pip install -r requirements.txt\n",
        "COPY src /app/src",
        "COPY nodemon.json /app/nodemon.json\n",
        "# More development build configurations here\n",
        "FROM development as production\n",
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
        "ext": ".py",
        "ignore": [],
        "exec": "python3 ./src/index.py",
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
            command: String::from("python3 /app/src/index.py"),
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
pub fn scaffold() -> String {
    "print('Hello from Python!')".to_string()
}
