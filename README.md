# Finance Freedom

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)
![Node](https://img.shields.io/badge/node-%3E%3D20-green)

**Finance Freedom** is a self-hosted, open-source personal finance management platform designed to help you achieve financial freedom with zero cost. It focuses on privacy, ownership, and powerful automation via "Smart Import".

## 🚀 Features

-   **Self-Hosted:** Full control over your data.
-   **Smart Import:** Automated transaction importing via OFX and Bank Providers.
-   **Dashboard:** Comprehensive view of your financial health.
-   **Multi-Account:** Manage multiple bank accounts and cards.
-   **Open Source:** Free to use and modify.

## 🛠️ Tech Stack

-   **Backend:** NestJS
-   **Frontend:** React (Vite)
-   **Database:** SQLite
-   **Language:** TypeScript
-   **Monorepo Tools:** TurboRepo

## 📚 Documentation

For detailed documentation on architecture, product vision, and development plans, please verify the [docs](./docs) directory.

-   [Concept & Idea](./docs/Idea/Idea.md)
-   [Product Overview](./docs/Product/Product-overview.md)
-   [Architecture](./docs/Architecture/Architecture.md)

## 🏁 Getting Started

### Prerequisites

-   Node.js (v20+)
-   Docker & Docker Compose

### Fast Installation (Users)

1.  Clone the repository:

    ```bash
    git clone https://github.com/yourusername/finance-freedom.git
    cd finance-freedom
    ```

2.  Start with Docker:

    ```bash
    docker-compose up -d
    ```

3.  Access the application:
    -   Web: `http://localhost:3000`
    -   API: `http://localhost:3333`

### Development Setup

1.  Install dependencies:

    ```bash
    npm install
    ```

2.  Run the development server (API + Web):
    ```bash
    npm run dev
    ```

### Rebuilding the Docker Image

To update the container state and ensure all configuration changes (such as those in Vite and the Dockerfile) are applied, use the following command in the terminal at the project root:

    ```bash
    docker compose up --build -d
    ```

**What this command does:**

-   `up`: Starts the services defined in `docker-compose.yml`.
-   `--build`: Forces the reconstruction of images (useful when you change the `Dockerfile` or `package.json`).
-   `-d`: Detached mode (runs in the background, freeing up the terminal).

**Other useful commands:**

Restart only one service (e.g., if you only changed `vite.config.ts`):

    ```bash
    docker compose restart web
    ```

Check container status:

    ```bash
    docker compose ps
    ```

View logs for a service (e.g., the frontend):

    ```bash
    docker compose logs -f web
    ```

## 🚢 Production Deployment

For a stable, optimized, and persistent environment (Self-hosted), use the production configuration.

1.  **Start the production stack:**

    ```bash
    docker-compose -f docker-compose.prod.yml up -d --build
    ```

    > **Note:** This will build optimized images (Node.js for API, Nginx for Web).

2.  **Access:**

    -   Web: `http://localhost:8080` (or the port defined in `docker-compose.prod.yml`)
    -   API: Internal usage mostly, but accessible if mapped.

3.  **Data Persistence:**
    -   Database (`.db`) and Redis data are stored in named Docker volumes (`sqlite_data`, `redis_data`) and will survive container restarts.

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
