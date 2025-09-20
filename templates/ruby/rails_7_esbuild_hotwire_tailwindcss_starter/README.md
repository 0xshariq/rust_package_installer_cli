# Rails 7 Boilerplate with ESBuild, Hotwire, and TailwindCSS

This repository is a starter template for Ruby on Rails 7 applications using **ESBuild**, **Hotwire (Turbo & Stimulus)**, and **TailwindCSS**. The setup is streamlined for modern frontend development while leveraging the power of Rails.

- **Rails 7** with ESBuild for JavaScript bundling.
- **Hotwire** for reactive apps using Turbo and Stimulus.
- **TailwindCSS** for utility-first CSS design.
- **PostgreSQL** setup via Docker.

## Getting Started

### Installation

1. Clone the repository:

    ```bash
    git clone [https://github.com/your_username/your_repo_name.git](https://github.com/voidzenn/rails_7_esbuild_hotwire_tailwindcss_starter/edit/main/README.md)
    cd rails_7_esbuild_hotwire_tailwindcss_starter
    ```

2. Copy the example environment file and update any necessary values:

    ```bash
    cp .env.example .env
    ```

3. Install dependencies:

    ```bash
    bundle install
    yarn install
    ```

4. Set up the database (using Docker for PostgreSQL):

    ```bash
    docker-compose up -d
    ```

5. Run database migrations:

    ```bash
    rails db:setup
    ```

6. Build JavaScript, CSS, and start watching for changes (includes Stimulus updates):

    ```bash
    yarn build
    ```

### Running the Application

Start the Rails server:

```bash
bin/dev
