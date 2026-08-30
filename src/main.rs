use clap::{Parser, Subcommand};

mod codegen;
mod config;
mod doctor;
mod exec;
mod init;
mod invocation;
mod lockfile;
mod manifest;
mod modules;
mod testrunner;

#[derive(Parser)]
#[command(
    name = "euglena",
    about = "Euglena app framework CLI — scaffold, run, build, and test Euglena applications",
    version
)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Scaffold a new Euglena application in a new directory
    Init {
        /// Name of the new project (used as directory name and cell name)
        name: String,
    },
    /// Run an Euglena application (or a bare .code file/project) with the `code` interpreter
    Run {
        /// Project directory, or a .code file (default: this directory)
        #[arg(default_value = ".")]
        path: String,
    },
    /// Compile an Euglena application (or a bare .code file/project) to native binary
    Build {
        /// Project directory, or a .code file (default: this directory)
        #[arg(default_value = ".")]
        path: String,
        /// Enable LLVM optimizations (slower compile, faster runtime)
        #[arg(short = 'r', long)]
        release: bool,
        /// Build target: exe (default), shared, static, or wasm
        #[arg(short = 't', long, value_parser = ["exe", "shared", "static", "wasm"])]
        target: Option<String>,
        /// Where to write the artifact (default: build/<name> beside what you named)
        #[arg(short = 'o', long)]
        output: Option<String>,
    },
    /// Run every tests/*.code fixture in the current project, in place
    Test,
    /// Rewrite .code source in the one canonical layout (wraps `code format`)
    Format {
        /// Write nothing; exit non-zero if anything would change
        #[arg(long)]
        check: bool,
        /// Paths to format (default: src/ tests/)
        paths: Vec<String>,
    },
    /// Fetch an organelle via `code install` and declare it in manifest.json
    Add {
        /// Module name (or a manifest URL `code install` accepts)
        name: String,
        /// Alias to declare in manifest.json (default: the module name)
        #[arg(long = "as")]
        alias: Option<String>,
    },
    /// Drop an organelle's manifest alias, and its module if unreferenced
    Remove {
        /// The alias as declared in manifest.json
        alias: String,
    },
    /// List declared organelles and whether each is installed
    Ls,
    /// Check the Code interpreter, project layout, and declared organelles
    Doctor,
    /// Manage Code interpreter path used by euglena-cli
    Code {
        #[command(subcommand)]
        command: CodeCommands,
    },
}

#[derive(Subcommand)]
enum CodeCommands {
    /// Set or replace the Code interpreter binary path
    Set {
        /// Absolute or relative path to the Code interpreter binary
        path: String,
    },
    /// Show current configured Code interpreter path
    Show,
    /// Clear configured Code interpreter path
    Clear,
}

fn main() {
    let cli = Cli::parse();
    match cli.command {
        Commands::Init { name } => init::run(&name),
        Commands::Run { path } => exec::run(&path),
        Commands::Build {
            path,
            release,
            target,
            output,
        } => exec::build(&path, release, target.as_deref(), output.as_deref()),
        Commands::Test => {
            let binary = exec::find_code_binary_or_exit();
            let root = std::env::current_dir().unwrap_or_else(|_| std::path::PathBuf::from("."));
            testrunner::run(&root, &binary);
        }
        Commands::Format { check, paths } => {
            let paths = if paths.is_empty() {
                vec!["src".to_string(), "tests".to_string()]
            } else {
                paths
            };
            exec::format(check, &paths);
        }
        Commands::Add { name, alias } => modules::add(&name, alias.as_deref()),
        Commands::Remove { alias } => modules::remove(&alias),
        Commands::Ls => modules::ls(),
        Commands::Doctor => doctor::run(),
        Commands::Code { command } => match command {
            CodeCommands::Set { path } => config::set_code_binary_path(&path),
            CodeCommands::Show => config::show_code_binary_path(),
            CodeCommands::Clear => config::clear_code_binary_path(),
        },
    }
}
