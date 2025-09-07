from PyQt6.QtWidgets import QWidget, QVBoxLayout, QLabel
from PyQt6.QtCore import Qt

class AnalyticsPage(QWidget):
    def __init__(self):
        super().__init__()

        layout = QVBoxLayout(self)
        layout.setContentsMargins(20, 20, 20, 20)

        title = QLabel("Analytics")
        title.setStyleSheet("font-size: 24px; font-weight: bold;")
        layout.addWidget(title)

        placeholder = QLabel("More charts and detailed KPIs coming soon.")
        placeholder.setAlignment(Qt.AlignmentFlag.AlignCenter)
        layout.addWidget(placeholder)

        self.setLayout(layout)
