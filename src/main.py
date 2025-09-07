import sys
import sys
import sys
import os
from PyQt6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QHBoxLayout, QVBoxLayout,
    QPushButton, QStackedWidget, QLabel, QFrame
)
from PyQt6.QtGui import QPixmap, QIcon
from PyQt6.QtCore import Qt, QSize
from components.employees_page import EmployeesPage
from components.settings_page import SettingsPage
from components.dashboard_page import DashboardPage
from components.analytics_page import AnalyticsPage
from db.database import init_db
from settings_manager import load_settings

class MainWindow(QMainWindow):
    def __init__(self, app_instance):
        super().__init__()
        self.app = app_instance

        self.setWindowTitle("HR Management Dashboard")
        self.setGeometry(100, 100, 1200, 800)

        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        main_layout = QHBoxLayout(central_widget)
        main_layout.setContentsMargins(0, 0, 0, 0)
        main_layout.setSpacing(0)

        sidebar = QFrame()
        sidebar.setObjectName("sidebar")
        sidebar.setFixedWidth(200)

        sidebar_layout = QVBoxLayout(sidebar)
        sidebar_layout.setAlignment(Qt.AlignmentFlag.AlignTop)
        sidebar_layout.setContentsMargins(10, 10, 10, 10)
        sidebar_layout.setSpacing(10)

        # Logo
        self.logo_label = QLabel("HR Dashboard")
        self.logo_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.logo_label.setFixedSize(180, 60)
        sidebar_layout.addWidget(self.logo_label)

        self.dashboard_button = QPushButton(" Dashboard")
        self.employees_button = QPushButton(" Employees")
        self.analytics_button = QPushButton(" Analytics")
        self.settings_button = QPushButton(" Settings")

        # Set icons
        self.dashboard_button.setIcon(QIcon.fromTheme("view-dashboard"))
        self.employees_button.setIcon(QIcon.fromTheme("system-users"))
        self.analytics_button.setIcon(QIcon.fromTheme("utilities-statistics"))
        self.settings_button.setIcon(QIcon.fromTheme("preferences-system"))

        for btn in [self.dashboard_button, self.employees_button, self.analytics_button, self.settings_button]:
            btn.setIconSize(QSize(24, 24))
            btn.setMinimumHeight(40)

        sidebar_layout.addWidget(self.dashboard_button)
        sidebar_layout.addWidget(self.employees_button)
        sidebar_layout.addWidget(self.analytics_button)
        sidebar_layout.addWidget(self.settings_button)

        self.stacked_widget = QStackedWidget()
        self.dashboard_page = DashboardPage()
        self.employees_page = EmployeesPage()
        self.analytics_page = AnalyticsPage()
        self.settings_page = SettingsPage()

        self.stacked_widget.addWidget(self.dashboard_page)
        self.stacked_widget.addWidget(self.employees_page)
        self.stacked_widget.addWidget(self.analytics_page)
        self.stacked_widget.addWidget(self.settings_page)

        main_layout.addWidget(sidebar)
        main_layout.addWidget(self.stacked_widget)

        self.dashboard_button.clicked.connect(lambda: self.stacked_widget.setCurrentWidget(self.dashboard_page))
        self.employees_button.clicked.connect(lambda: self.stacked_widget.setCurrentWidget(self.employees_page))
        self.analytics_button.clicked.connect(lambda: self.stacked_widget.setCurrentWidget(self.analytics_page))
        self.settings_button.clicked.connect(lambda: self.stacked_widget.setCurrentWidget(self.settings_page))

        # Connect settings signals
        self.settings_page.theme_changed_signal.connect(self.apply_theme)
        self.settings_page.logo_changed_signal.connect(self.apply_logo)

        # Load initial settings
        self.settings = load_settings()
        self.apply_theme(self.settings["theme"])
        self.apply_logo(self.settings["logo_path"])

    def apply_logo(self, logo_path):
        if logo_path and os.path.exists(logo_path):
            pixmap = QPixmap(logo_path)
            self.logo_label.setPixmap(pixmap.scaled(
                self.logo_label.size(),
                Qt.AspectRatioMode.KeepAspectRatio,
                Qt.TransformationMode.SmoothTransformation
            ))
        else:
            self.logo_label.setText("HR Dashboard")

    def apply_theme(self, theme_name):
        style_sheet = ""
        if theme_name == "Dark":
            try:
                with open("assets/styles/dark.qss", "r") as f:
                    style_sheet = f.read()
            except FileNotFoundError:
                print("dark.qss not found")
        else: # Default to light
            try:
                with open("assets/styles/light.qss", "r") as f:
                    style_sheet = f.read()
            except FileNotFoundError:
                print("light.qss not found")
        self.app.setStyleSheet(style_sheet)


if __name__ == "__main__":
    init_db()
    app = QApplication(sys.argv)
    window = MainWindow(app)
    window.show()
    sys.exit(app.exec())
