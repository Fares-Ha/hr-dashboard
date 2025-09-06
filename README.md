# HR Management Dashboard

A modern, cross-platform desktop application for managing employee information, built with Electron, React, and TypeScript.

## Core Features

- **Employee Management (CRUD):** Add, view, edit, and delete employee records.
- **Modern UI:** A clean, modern interface built with Material-UI (MUI).
- **Search, Filter, and Sort:** Powerful data grid with global search and advanced column filtering.
- **Dashboard & Analytics:** Visualize HR data with interactive charts for salary distribution and hiring trends.
- **Customization:** Supports light/dark themes and a customizable application logo.
- **Persistent Storage:** Uses a local SQLite database to store all application data.
- **Cross-Platform:** Designed to run on Windows, macOS, and Linux.

## Tech Stack

- **Framework:** [Electron](https://www.electronjs.org/)
- **UI:** [React](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **UI Components:** [Material-UI (MUI)](https://mui.com/)
- **Charting:** [Recharts](https://recharts.org/)
- **Database:** [SQLite](https://www.sqlite.org/)
- **Build Tool:** [Electron Forge](https://www.electronforge.io/) with Vite

## Development

To run the application in a development environment:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    This will launch the application with hot-reloading enabled.
    ```bash
    npm start
    ```

## Building for Production

To create a distributable executable for your platform:

```bash
npm run make
```

This command will generate the packaged application in the `out` directory.
