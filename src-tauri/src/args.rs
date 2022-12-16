use clap::Parser;
use serde::{Deserialize, Serialize};

/// Simple program to greet a person
#[derive(Parser, Debug, Clone, Serialize, Deserialize)]
#[command(author, version, about, long_about = None)]
#[command(next_line_help = true)]
#[command(disable_version_flag = true)]
pub struct Args {
    pub filename: Option<String>,
    #[arg(short = 'V', long)]
    pub version: bool,
}
