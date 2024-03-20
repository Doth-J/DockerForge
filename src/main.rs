use clap::Parser;
use inquire::{Confirm, Select, Text};
use spinners::{Spinner, Spinners};
use std::{env, thread::sleep, time::Duration};
pub mod languages;
pub mod utils;

#[derive(Parser, Debug)]
#[command(
    version,
    about = "🐳 Dockerfile generator cli tool for CI/CD operations."
)]
struct Args {
    #[arg(short, long = "name", value_name = "DIRECTORY", value_hint = clap::ValueHint::DirPath, help = "Target project name")]
    name: Option<String>,

    #[arg(
        short,
        long = "language",
        value_name = "LANGUAGE",
        help = "Target project language [possible values: Typescript, Javascript, Python, Rust, Golang]"
    )]
    language: Option<String>,

    #[arg(
        short,
        long = "config",
        value_name = "FORMAT",
        help = "Project config file format [possible values: JSON, Yaml, Ini, Toml, None] "
    )]
    config: Option<String>,

    #[arg(
        short,
        long = "scaffold",
        value_name = "ENABLE",
        help = "Scaffold template project"
    )]
    scaffold: Option<bool>,

    #[arg(
        short,
        long = "makefile",
        value_name = "ENABLE",
        help = "Forge Makefile"
    )]
    makefile: Option<bool>,

    #[arg(short, long = "env", value_name = "ENABLE", help = "Forge .env file")]
    env: Option<bool>,
}

fn main() {
    let args = Args::parse();
    let path = env::current_dir().unwrap();
    let (mut name, mut language, mut config, mut scaffold) = (
        String::from("."),
        String::from(""),
        String::from("none"),
        false,
    );
    match args.name {
        Some(n) => name = n,
        None => {
            match Text::new("Target project name?")
                .with_default(
                    &path
                        .file_name()
                        .and_then(|name| name.to_str())
                        .unwrap_or(&name)
                        .to_string(),
                )
                .prompt()
            {
                Ok(res) => name = res,
                Err(_) => {
                    println!("❌ An error occured while requesting project name !")
                }
            };
        }
    }
    match args.language {
        Some(l) => language = l,
        None => {
            let options: Vec<&str> = vec!["Typescript", "Javascript", "Python", "Rust", "Golang"];
            match Select::new("Target project language?", options).prompt() {
                Ok(choice) => language = String::from(choice),
                Err(_) => println!("❌ An error occured while requesting project language !"),
            }
        }
    }
    match args.config {
        Some(c) => config = c.to_lowercase(),
        None => {
            let options: Vec<&str> = vec!["None", "JSON", "YAML", "INI", "TOML"];
            match Select::new("Config file format?", options).prompt() {
                Ok(choice) => config = String::from(choice).to_lowercase(),
                Err(_) => println!("❌ An error occured while requesting config file format !"),
            }
        }
    }
    match args.scaffold {
        Some(s) => scaffold = s,
        None => match Confirm::new("Scaffold template project?")
            .with_default(true)
            .prompt()
        {
            Ok(choice) => scaffold = choice,
            Err(_) => println!("❌ An error occured while confirming scaffold !"),
        },
    }
    let mut progress = Spinner::new(Spinners::Aesthetic, String::new());
    progress.stop_and_persist("🐋", "Starting Dockerforge...".into());
    if config != "none" {
        let mut progress = Spinner::new(Spinners::Aesthetic, " Creating config file...".into());
        utils::write_config(&config);
        sleep(Duration::from_millis(250));
        progress.stop_and_persist("🛠️", " Config file created!".into());
    }

    if let Some(e) = args.env {
        let mut progress = Spinner::new(Spinners::Aesthetic, " Creating .env file...".into());
        if e {
            utils::write_env();
            sleep(Duration::from_millis(250));
            progress.stop_and_persist("⚙️", " Env file created!".into());
        } else {
            progress.stop_and_persist("⭕", "Skipping .env file creation...".into());
        }
    }
    if let Some(m) = args.makefile {
        let mut progress = Spinner::new(Spinners::Aesthetic, " Creating Makefile...".into());
        if m {
            utils::write_makefile(&name, Some(&language));
            sleep(Duration::from_millis(250));
            progress.stop_and_persist("📙", "Makefile created!".into());
        } else {
            progress.stop_and_persist("⭕", "Skipping Makefile creation...".into());
        }
    }
    let mut progress = Spinner::new(Spinners::Aesthetic, " Creating Dockerfiles...".into());
    match language.as_str() {
        "Typescript" => {
            let (nodemon, dockerfile, compose_dev, compose_prod) = languages::typescript::dockerize(
                &name,
                if config != "none" {
                    Some(&config)
                } else {
                    None
                },
            );
            utils::write_dockerfiles(&dockerfile, &compose_dev, &compose_prod, Some(&nodemon));
            sleep(Duration::from_millis(250));
            progress.stop_and_persist("🐳", format!("{} dockerfiles created!", &language));
            if scaffold {
                let mut progress = Spinner::new(
                    Spinners::Aesthetic,
                    " Scaffolding template project...".into(),
                );
                let (index, pkg, tsconfig) = languages::typescript::scaffold(&name);
                if utils::create_src_dir() {
                    utils::create_file("src/index.ts", &index);
                    utils::create_file("package.json", &pkg);
                    utils::create_file("tsconfig.json", &tsconfig);
                } else {
                    progress.stop_and_persist("❌", "Error scaffolding template!".into());
                }
                sleep(Duration::from_millis(250));
                progress.stop_and_persist("📒", "Template project scaffolded!".into());
            }
        }
        "Javascript" => {
            let (nodemon, dockerfile, compose_dev, compose_prod) = languages::javascript::dockerize(
                &name,
                if config != "none" {
                    Some(&config)
                } else {
                    None
                },
            );
            utils::write_dockerfiles(&dockerfile, &compose_dev, &compose_prod, Some(&nodemon));
            sleep(Duration::from_millis(250));
            progress.stop_and_persist("🐳", format!("{} dockerfiles created!", &language));
            if scaffold {
                let mut progress = Spinner::new(
                    Spinners::Aesthetic,
                    " Scaffolding template project...".into(),
                );
                let (index, pkg) = languages::javascript::scaffold(&name);
                if utils::create_src_dir() {
                    utils::create_file("src/index.js", &index);
                    utils::create_file("package.json", &pkg);
                } else {
                    progress.stop_and_persist("❌", "Error scaffolding template!".into());
                }
                sleep(Duration::from_millis(250));
                progress.stop_and_persist("📒", "Template project scaffolded!".into());
            }
        }
        "Python" => {
            let (nodemon, dockerfile, compose_dev, compose_prod) = languages::python::dockerize(
                &name,
                if config != "none" {
                    Some(&config)
                } else {
                    None
                },
            );
            utils::write_dockerfiles(&dockerfile, &compose_dev, &compose_prod, Some(&nodemon));
            sleep(Duration::from_millis(250));
            progress.stop_and_persist("🐳", format!("{} dockerfiles created!", &language));
            if scaffold {
                let mut progress = Spinner::new(
                    Spinners::Aesthetic,
                    " Scaffolding template project...".into(),
                );
                let index = languages::python::scaffold();
                if utils::create_src_dir() {
                    utils::create_file("src/index.py", &index);
                    utils::create_file("requirements.txt", &"");
                } else {
                    progress.stop_and_persist("❌", "Error scaffolding template!".into());
                }
                sleep(Duration::from_millis(250));
                progress.stop_and_persist("📒", "Template project scaffolded!".into());
            }
        }
        "Rust" => {
            let (nodemon, dockerfile, compose_dev, compose_prod) = languages::rust::dockerize(
                &name,
                if config != "none" {
                    Some(&config)
                } else {
                    None
                },
            );
            utils::write_dockerfiles(&dockerfile, &compose_dev, &compose_prod, Some(&nodemon));
            sleep(Duration::from_millis(250));
            progress.stop_and_persist("🐳", format!("{} dockerfiles created!", &language));
            if scaffold {
                let mut progress = Spinner::new(
                    Spinners::Aesthetic,
                    " Scaffolding template project...".into(),
                );
                let (main, cargo) = languages::rust::scaffold(&name);
                if utils::create_src_dir() {
                    utils::create_file("src/main.rs", &main);
                    utils::create_file("Cargo.toml", &cargo);
                } else {
                    progress.stop_and_persist("❌", "Error scaffolding template!".into());
                }
                sleep(Duration::from_millis(250));
                progress.stop_and_persist("📒", "Template project scaffolded!".into());
            }
        }
        "Golang" => {
            let (nodemon, dockerfile, compose_dev, compose_prod) = languages::golang::dockerize(
                &name,
                if config != "none" {
                    Some(&config)
                } else {
                    None
                },
            );
            utils::write_dockerfiles(&dockerfile, &compose_dev, &compose_prod, Some(&nodemon));
            sleep(Duration::from_millis(250));
            progress.stop_and_persist("🐳", format!("{} dockerfiles created!", &language));
            if scaffold {
                let mut progress = Spinner::new(
                    Spinners::Aesthetic,
                    " Scaffolding template project...".into(),
                );
                let (main, module) = languages::golang::scaffold(&name);
                if utils::create_src_dir() {
                    utils::create_file("src/main.go", &main);
                    utils::create_file("go.mod", &module);
                } else {
                    progress.stop_and_persist("❌", "Error scaffolding template!".into());
                }
                sleep(Duration::from_millis(250));
                progress.stop_and_persist("📒", "Template project scaffolded!".into());
            }
        }
        _ => {
            progress.stop_and_persist("❌", format!("Invalid language selection: {} !", &language));
        }
    }
    let mut progress = Spinner::new(Spinners::Aesthetic, String::new());
    progress.stop_and_persist("🚀", "DockerForge complete!".into());

    // if let Some(s) = args.scaffold {
    //     if s {
    //         let mut progress = Spinner::new(
    //             Spinners::Aesthetic,
    //             format!(" Scaffolding {} Template...", language),
    //         );
    //         // utils::write_dockerfiles();
    //         sleep(Duration::from_millis(250));
    //         progress.stop_and_persist("📒", format!("Scaffolded {} template!", &language));
    //     }
    // }
    // let mut sp = Spinner::new(Spinners::Aesthetic, "Fetching your name...".into());
    // sleep(Duration::from_secs(1));
}
