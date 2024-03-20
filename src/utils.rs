use serde::{Deserialize, Serialize};
use std::fs::{create_dir, File};
use std::io::Write;
use std::path::PathBuf;

#[derive(Serialize, Deserialize)]
pub struct Compose {
    pub version: &'static str,
    pub services: std::collections::HashMap<String, Service>,
}

#[derive(Serialize, Deserialize)]
pub struct Service {
    pub container_name: String,
    pub build: Build,
    pub command: String,
    pub volumes: Vec<String>,
    pub restart: &'static str,
}

#[derive(Serialize, Deserialize)]
pub struct Build {
    pub context: &'static str,
    pub target: &'static str,
}

pub fn create_file(name: &str, contents: &str) {
    let mut file_path = PathBuf::from(std::env::current_dir().unwrap());
    file_path.push(name);

    let mut file = File::create(file_path).unwrap();
    file.write_all(contents.as_bytes()).unwrap();
}

pub fn create_src_dir() -> bool {
    let mut file_path = PathBuf::from(std::env::current_dir().unwrap());
    file_path.push("src");

    if file_path.exists() {
        true
    } else {
        match create_dir(file_path) {
            Ok(()) => true,
            Err(_) => false,
        }
    }
}

pub fn write_env() {
    create_file(".env", "PARAM=123");
}

pub fn write_config(config_type: &str) {
    let contents = String::from(match config_type {
        "json" => "{\n\t\"setup\":{}\n}",
        "yaml" => "setup:",
        "ini" | "toml" => "[setup]\n",
        _ => "",
    });

    create_file(&format!("config.{}", config_type), &contents);
}
pub fn write_makefile(name: &str, language: Option<&str>) {
    let mut contents: String = String::from("start:\n\tdocker-compose up -d\n");
    contents.push_str("stop:\n\tdocker-compose down -v\n");
    contents.push_str(&format!("build:\n\tdocker build -t {}-app .\n", name));
    contents.push_str(&format!("remove:\n\tdocker image rm {}-app\n", name));
    contents.push_str("update:\n\tmake stop\n\tmake remove\n\tmake start\n");
    contents.push_str("production:\n\tdocker-compose -f docker-compose.yaml -f docker-compose.production.yaml up -d\n");
    if let Some(lang) = language {
        match lang {
            "Typescript" => contents.push_str("run:\n\tnpx ts-node src/index.ts\n"),
            "Javascript" => contents.push_str("run:\n\tnode src/index.js\n"),
            "Python" => contents.push_str("run:\n\tpython src/index.py\n"),
            "Rust" => contents.push_str("run:\n\tcargo run\n"),
            "Golang" => contents.push_str("run:\n\tgo run src/main.go\n"),
            _ => {}
        }
    }

    create_file("Makefile", &contents);
}

pub fn write_dockerfiles(
    dockerfile: &str,
    compose_dev: &str,
    compose_prod: &str,
    nodemon: Option<&str>,
) {
    create_file("Dockerfile", &dockerfile);
    create_file("docker-compose.yaml", &compose_dev);
    create_file("docker-compose.production.yaml", &compose_prod);

    if let Some(config) = nodemon {
        create_file("nodemon.json", &config);
    }
}
