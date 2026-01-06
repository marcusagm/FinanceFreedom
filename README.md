# Finance Freedom

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)
![Node](https://img.shields.io/badge/node-%3E%3D20-green)

**Finance Freedom** is a self-hosted, open-source personal finance management platform designed to help you achieve financial freedom with zero cost. It focuses on privacy, ownership, and powerful automation via "Smart Import".

## 🚀 Features

- **Self-Hosted:** Full control over your data.
- **Smart Import:** Automated transaction importing via OFX and Bank Providers.
- **Dashboard:** Comprehensive view of your financial health.
- **Multi-Account:** Manage multiple bank accounts and cards.
- **Open Source:** Free to use and modify.

## 🛠️ Tech Stack

- **Backend:** NestJS
- **Frontend:** React (Vite)
- **Database:** SQLite
- **Language:** TypeScript
- **Monorepo Tools:** TurboRepo

## 📚 Documentation

For detailed documentation on architecture, product vision, and development plans, please verify the [docs](./docs) directory.

- [Concept & Idea](./docs/Idea/Idea.md)
- [Product Overview](./docs/Product/Product-overview.md)
- [Architecture](./docs/Architecture/Architecture.md)

## 🏁 Getting Started

### Prerequisites

- Node.js (v20+)
- Docker & Docker Compose

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
    - Web: `http://localhost:3000`
    - API: `http://localhost:3333`

### Development Setup

1.  Install dependencies:

    ```bash
    npm install
    ```

2.  Run the development server (API + Web):
    ```bash
    npm run dev
    ```

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
