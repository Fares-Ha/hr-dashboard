import os
from PyQt6.QtWidgets import (
    QDialog, QVBoxLayout, QHBoxLayout, QFormLayout,
    QLineEdit, QPushButton, QDateEdit, QDoubleSpinBox, QMessageBox,
    QFileDialog
)
from PyQt6.QtCore import QDate
from ..db.database import SessionLocal, Employee

class AddEmployeeDialog(QDialog):
    def __init__(self, parent=None):
        super().__init__(parent)

        self.setWindowTitle("Add New Employee")
        self.setMinimumWidth(400)

        self.emirates_id_image_path = None
        self.passport_image_path = None

        layout = QVBoxLayout(self)
        form_layout = QFormLayout()

        self.name_input = QLineEdit()
        self.dob_input = QDateEdit()
        self.dob_input.setDate(QDate.currentDate())
        self.dob_input.setDisplayFormat("yyyy-MM-dd")
        self.emirates_id_input = QLineEdit()
        self.passport_number_input = QLineEdit()
        self.salary_input = QDoubleSpinBox()
        self.salary_input.setRange(0, 1000000)
        self.salary_input.setDecimals(2)

        self.emirates_id_image_button = QPushButton("Select Image")
        self.passport_image_button = QPushButton("Select Image")

        form_layout.addRow("Name:", self.name_input)
        form_layout.addRow("Date of Birth:", self.dob_input)
        form_layout.addRow("Emirates ID:", self.emirates_id_input)
        form_layout.addRow("Passport Number:", self.passport_number_input)
        form_layout.addRow("Salary:", self.salary_input)
        form_layout.addRow("Emirates ID Image:", self.emirates_id_image_button)
        form_layout.addRow("Passport Image:", self.passport_image_button)

        layout.addLayout(form_layout)

        button_layout = QHBoxLayout()
        self.save_button = QPushButton("Save")
        self.cancel_button = QPushButton("Cancel")
        button_layout.addStretch()
        button_layout.addWidget(self.save_button)
        button_layout.addWidget(self.cancel_button)

        layout.addLayout(button_layout)
        self.setLayout(layout)

        # Connections
        self.cancel_button.clicked.connect(self.reject)
        self.save_button.clicked.connect(self.accept_and_save)
        self.emirates_id_image_button.clicked.connect(lambda: self.select_image("emirates"))
        self.passport_image_button.clicked.connect(lambda: self.select_image("passport"))

    def select_image(self, image_type):
        file_path, _ = QFileDialog.getOpenFileName(self, "Select Image", "", "Image Files (*.png *.jpg *.jpeg)")
        if file_path:
            if image_type == "emirates":
                self.emirates_id_image_path = file_path
                self.emirates_id_image_button.setText(os.path.basename(file_path))
            elif image_type == "passport":
                self.passport_image_path = file_path
                self.passport_image_button.setText(os.path.basename(file_path))

    def accept_and_save(self):
        if not self.name_input.text() or not self.emirates_id_input.text():
            QMessageBox.warning(self, "Validation Error", "Name and Emirates ID are required.")
            return

        db = SessionLocal()
        try:
            new_employee = Employee(
                name=self.name_input.text(),
                dob=self.dob_input.date().toPyDate(),
                emirates_id=self.emirates_id_input.text(),
                passport_number=self.passport_number_input.text(),
                salary=self.salary_input.value(),
                emirates_id_image_path=self.emirates_id_image_path,
                passport_image_path=self.passport_image_path
            )
            db.add(new_employee)
            db.commit()
            self.accept()
        except Exception as e:
            db.rollback()
            QMessageBox.critical(self, "Database Error", f"Could not save employee: {e}")
        finally:
            db.close()
