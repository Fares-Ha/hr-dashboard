from PyQt6.QtWidgets import (
    QWidget, QVBoxLayout, QFormLayout, QComboBox,
    QPushButton, QLabel, QFileDialog
)
from PyQt6.QtCore import pyqtSignal
from ..settings_manager import load_settings, save_settings

class SettingsPage(QWidget):
    theme_changed_signal = pyqtSignal(str)
    logo_changed_signal = pyqtSignal(str)

    def __init__(self):
        super().__init__()

        self.settings = load_settings()

        layout = QVBoxLayout(self)
        layout.setContentsMargins(20, 20, 20, 20)

        title = QLabel("Application Settings")
        title.setStyleSheet("font-size: 24px; font-weight: bold;")
        layout.addWidget(title)

        form_layout = QFormLayout()
        form_layout.setContentsMargins(0, 20, 0, 0)

        self.theme_combo = QComboBox()
        self.theme_combo.addItems(["Light", "Dark"])
        self.theme_combo.setCurrentText(self.settings.get("theme", "Light"))
        self.theme_combo.currentTextChanged.connect(self.on_theme_change)
        form_layout.addRow("Theme:", self.theme_combo)

        self.change_logo_button = QPushButton("Select Logo")
        self.change_logo_button.clicked.connect(self.on_change_logo)
        form_layout.addRow("App Logo:", self.change_logo_button)

        layout.addLayout(form_layout)
        layout.addStretch()

        self.setLayout(layout)

    def on_theme_change(self, theme_name):
        self.settings["theme"] = theme_name
        save_settings(self.settings)
        self.theme_changed_signal.emit(theme_name)

    def on_change_logo(self):
        file_path, _ = QFileDialog.getOpenFileName(
            self,
            "Select Logo Image",
            "", # Start directory
            "Image Files (*.png *.jpg *.jpeg *.gif)"
        )
        if file_path:
            self.settings["logo_path"] = file_path
            save_settings(self.settings)
            self.logo_changed_signal.emit(file_path)
