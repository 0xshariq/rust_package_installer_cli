# Basic Rust Template

A simple Rust project with two basic examples:
1. A function that prints "Hello, World!"
2. A guessing game where you try to guess a random number

## How to run

1. Make sure you have Rust installed: https://rustup.rs/
2. Run the program:
   ```bash
   cargo run
   ```

## What it does

- First prints "Hello, World!" using a function
- Then starts a guessing game where you need to guess a number between 1 and 100
- The game tells you if your guess is too high or too low
- When you guess correctly, it shows how many attempts you took

## Project structure

```
├── src/
│   └── main.rs    # Contains the hello world function and guessing game
├── Cargo.toml     # Project configuration and dependencies
└── README.md      # This file
```

## Learning points

- Basic function definition (`fn`)
- User input with `std::io`
- Error handling with `match`
- Loops with `loop`
- Random number generation with `rand`
- String parsing and type conversion 