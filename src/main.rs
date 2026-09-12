use clap::{Parser, Subcommand};

mod codegen;
mod config;
mod doctor;
mod exec;
mod genes;
mod init;
mod invocation;
mod lockfile;
mod manifest;
mod modules;
mod sha256;

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
        /// Scaffold an app that runs in a browser rather than on a machine
        #[arg(long)]
        web: bool,
    },
    /// Run an Euglena application through the `code` interpreter
    Run {
        /// The app's project directory (default: this directory)
        #[arg(default_value = ".")]
        path: String,
        /// Show the `code` command euglena delegates to
        #[arg(short, long)]
        verbose: bool,
    },
    /// Compile an Euglena application to a native binary
    Build {
        /// The app's project directory (default: this directory)
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
        /// Show the `code` command euglena delegates to
        #[arg(short, long)]
        verbose: bool,
    },
    /// Run this project's tests/ fixtures (wraps `code test`)
    Test {
        /// Show the `code` command euglena delegates to
        #[arg(short, long)]
        verbose: bool,
    },
    /// Rewrite .code source in the one canonical layout (wraps `code format`)
    Format {
        /// Write nothing; exit non-zero if anything would change
        #[arg(long)]
        check: bool,
        /// Paths to format (default: src/ tests/)
        paths: Vec<String>,
    },
    /// Fetch an organelle and declare it — or, with no name, fetch every
    /// organelle manifest.json already declares
    Install {
        /// Module name (or a manifest URL `code install` accepts). Leave it
        /// out to install everything the manifest declares — what a fresh
        /// checkout needs.
        name: Option<String>,
        /// Install a gene rather than an organelle: `.code` source whose
        /// handlers link into the root, fetched from euglena's own registry.
        /// Not needed for a gene manifest.json already declares.
        #[arg(long = "gene")]
        gene: bool,
        /// Alias to declare in manifest.json (default: the module name)
        #[arg(long = "as")]
        alias: Option<String>,
    },
    /// Drop an organelle's manifest alias, and its module if unreferenced —
    /// or drop a declared gene
    ///
    /// Takes the *alias*, not the module name — the manifest is keyed by
    /// alias, and that is what `euglena list` prints. `code uninstall` is the
    /// one that takes a module name. A gene is matched by its name instead,
    /// because a gene has no alias.
    Uninstall {
        /// The alias as declared in manifest.json (or a gene's name)
        alias: String,
    },
    /// List declared organelles and whether each is installed
    List,
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
        Commands::Init { name, web } => init::run(&name, web),
        Commands::Run { path, verbose } => exec::run(&path, verbose),
        Commands::Build {
            path,
            release,
            target,
            output,
            verbose,
        } => exec::build(
            &path,
            release,
            target.as_deref(),
            output.as_deref(),
            verbose,
        ),
        Commands::Test { verbose } => exec::test(".", verbose),
        Commands::Format { check, paths } => {
            let paths = if paths.is_empty() {
                vec!["src".to_string(), "tests".to_string()]
            } else {
                paths
            };
            exec::format(check, &paths);
        }
        Commands::Install { name, gene, alias } => {
            modules::install(name.as_deref(), gene, alias.as_deref())
        }
        Commands::Uninstall { alias } => modules::uninstall(&alias),
        Commands::List => modules::list(),
        Commands::Doctor => doctor::run(),
        Commands::Code { command } => match command {
            CodeCommands::Set { path } => config::set_code_binary_path(&path),
            CodeCommands::Show => config::show_code_binary_path(),
            CodeCommands::Clear => config::clear_code_binary_path(),
        },
    }
}
