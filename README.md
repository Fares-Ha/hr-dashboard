# HR Management Dashboard (PyQt6)

This is a cross-platform desktop application for managing employee information, built with Python and the PyQt6 framework.

## Core Features

-   **Employee Management (CRUD):** Add, view, edit, and delete employee records.
-   **Rich Data Table:** The employee table supports sorting by any column, real-time filtering via a search bar, and displays image thumbnails for ID documents.
-   **Dashboard & Analytics:** A dashboard displays key KPIs like total employees and average salary, along with a chart for salary distribution.
-   **Customization:** The settings page allows users to switch between light and dark themes and set a custom application logo. All settings are persistent.
-   **Data Storage:** Uses a local SQLite database with the SQLAlchemy ORM.

## Tech Stack

-   **Framework:** PyQt6
-   **Database:** SQLite
-   **ORM:** SQLAlchemy
-   **Charting:** PyQtGraph

## Development Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Create a virtual environment (recommended):**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run the application:**
    ```bash
    python src/main.py
    ```

## Packaging for Production

To create a standalone executable for your platform, you can use PyInstaller.

1.  **Install PyInstaller:**
    ```bash
    pip install pyinstaller
    ```

2.  **Run the PyInstaller command:**
    From the root of the project directory, run the following command. This command bundles the application into a single executable, includes the necessary assets, and ensures it runs as a windowed (non-console) application.

    ```bash
    pyinstaller --name "HR-Dashboard" --onefile --windowed --add-data "assets:assets" src/main.py
    ```

3.  **Find the executable:**
    The final executable will be located in the `dist` directory that PyInstaller creates.
