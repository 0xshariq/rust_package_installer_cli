use std::io;
use std::cmp::Ordering;
use rand::Rng;

// Simple function that prints hello world
fn print_hello_world() {
    println!("Hello, World!");
}

// Guessing game function
fn guessing_game() {
    println!("Welcome to the Guessing Game!");
    println!("I'm thinking of a number between 1 and 100.");
    
    let secret_number = rand::thread_rng().gen_range(1..=100);
    let mut attempts = 0;
    
    loop {
        println!("Please input your guess:");
        
        let mut guess = String::new();
        
        io::stdin()
            .read_line(&mut guess)
            .expect("Failed to read line");
            
        let guess: u32 = match guess.trim().parse() {
            Ok(num) => num,
            Err(_) => {
                println!("Please enter a valid number!");
                continue;
            }
        };
        
        attempts += 1;
        
        match guess.cmp(&secret_number) {
            Ordering::Less => println!("Too small!"),
            Ordering::Greater => println!("Too big!"),
            Ordering::Equal => {
                println!("You win! You guessed it in {} attempts!", attempts);
                break;
            }
        }
    }
}

fn main() {
    // Call the hello world function
    print_hello_world();
    
    println!("\n--- Guessing Game ---");
    guessing_game();
} 