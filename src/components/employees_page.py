import os
from PyQt6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QPushButton, QTableWidget,
    QTableWidgetItem, QLabel, QMessageBox, QLineEdit
)
from PyQt6.QtGui import QPixmap
from PyQt6.QtCore import Qt, QSize
from .add_employee_dialog import AddEmployeeDialog
from .edit_employee_dialog import EditEmployeeDialog
from ..db.database import SessionLocal, Employee

class NumericTableWidgetItem(QTableWidgetItem):
    def __lt__(self, other):
        try:
            return float(self.text()) < float(other.text())
        except (ValueError, TypeError):
            return super().__lt__(other)

class EmployeesPage(QWidget):
    def __init__(self):
        super().__init__()

        layout = QVBoxLayout(self)

        top_bar_layout = QHBoxLayout()
        title = QLabel("Manage Employees")
        title.setStyleSheet("font-size: 24px; font-weight: bold;")

        add_button = QPushButton("Add Employee")
        edit_button = QPushButton("Edit Employee")
        delete_button = QPushButton("Delete Employee")

        top_bar_layout.addWidget(title)
        top_bar_layout.addStretch()

        self.search_input = QLineEdit()
        self.search_input.setPlaceholderText("Search employees...")
        self.search_input.textChanged.connect(self.filter_table)

        top_bar_layout.addWidget(self.search_input)
        top_bar_layout.addWidget(add_button)
        top_bar_layout.addWidget(edit_button)
        top_bar_layout.addWidget(delete_button)

        layout.addLayout(top_bar_layout)

        add_button.clicked.connect(self.open_add_employee_dialog)
        edit_button.clicked.connect(self.open_edit_employee_dialog)
        delete_button.clicked.connect(self.delete_employee)

        self.table = QTableWidget()
        self.table.setColumnCount(8)
        self.table.setHorizontalHeaderLabels([
            "ID", "Name", "Date of Birth", "Emirates ID",
            "Passport Number", "Salary", "ID Image", "Passport Image"
        ])

        self.table.setEditTriggers(QTableWidget.EditTrigger.NoEditTriggers)
        self.table.setSelectionBehavior(QTableWidget.SelectionBehavior.SelectRows)
        self.table.setSelectionMode(QTableWidget.SelectionMode.SingleSelection)
        self.table.verticalHeader().setVisible(False)
        self.table.setSortingEnabled(True)
        self.table.verticalHeader().setDefaultSectionSize(90) # Row height for thumbnails

        layout.addWidget(self.table)
        self.setLayout(layout)

        self.load_employees()

    def load_employees(self):
        self.table.setSortingEnabled(False)
        self.table.setRowCount(0)
        db = SessionLocal()
        try:
            employees = db.query(Employee).order_by(Employee.id).all()
            for emp in employees:
                self.add_employee_to_table(emp)
        finally:
            db.close()

        self.table.resizeColumnsToContents()
        self.table.setSortingEnabled(True)

    def open_add_employee_dialog(self):
        dialog = AddEmployeeDialog(self)
        if dialog.exec():
            self.load_employees()

    def open_edit_employee_dialog(self):
        selected_row = self.table.currentRow()
        if selected_row < 0:
            QMessageBox.warning(self, "No Employee Selected", "Please select an employee to edit.")
            return

        employee_id = int(self.table.item(selected_row, 0).text())
        dialog = EditEmployeeDialog(employee_id, self)
        if dialog.exec():
            self.load_employees()

    def delete_employee(self):
        selected_row = self.table.currentRow()
        if selected_row < 0:
            QMessageBox.warning(self, "No Employee Selected", "Please select an employee to delete.")
            return

        employee_id = int(self.table.item(selected_row, 0).text())

        reply = QMessageBox.question(
            self,
            "Confirm Delete",
            "Are you sure you want to delete this employee?",
            QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No
        )

        if reply == QMessageBox.StandardButton.Yes:
            db = SessionLocal()
            try:
                employee_to_delete = db.query(Employee).filter(Employee.id == employee_id).first()
                if employee_to_delete:
                    db.delete(employee_to_delete)
                    db.commit()
                    self.load_employees()
                else:
                    QMessageBox.warning(self, "Error", "Employee not found in database.")
            except Exception as e:
                db.rollback()
                QMessageBox.critical(self, "Database Error", f"Could not delete employee: {e}")
            finally:
                db.close()

    def filter_table(self, text):
        for i in range(self.table.rowCount()):
            row_is_visible = False
            for j in range(self.table.columnCount()):
                item = self.table.item(i, j)
                if item and text.lower() in item.text().lower():
                    row_is_visible = True
                    break
            self.table.setRowHidden(i, not row_is_visible)

    def add_employee_to_table(self, employee):
        row_position = self.table.rowCount()
        self.table.insertRow(row_position)

        self.table.setItem(row_position, 0, NumericTableWidgetItem(str(employee.id)))
        self.table.setItem(row_position, 1, QTableWidgetItem(employee.name))
        self.table.setItem(row_position, 2, QTableWidgetItem(employee.dob.strftime('%Y-%m-%d')))
        self.table.setItem(row_position, 3, QTableWidgetItem(employee.emirates_id))
        self.table.setItem(row_position, 4, QTableWidgetItem(employee.passport_number or 'N/A'))
        self.table.setItem(row_position, 5, NumericTableWidgetItem(f"{employee.salary:.2f}"))

        # Image thumbnails
        self.set_image_in_cell(row_position, 6, employee.emirates_id_image_path)
        self.set_image_in_cell(row_position, 7, employee.passport_image_path)

    def set_image_in_cell(self, row, col, image_path):
        label = QLabel()
        label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        if image_path and os.path.exists(image_path):
            pixmap = QPixmap(image_path)
            pixmap = pixmap.scaled(QSize(120, 80), Qt.AspectRatioMode.KeepAspectRatio, Qt.TransformationMode.SmoothTransformation)
            label.setPixmap(pixmap)
        else:
            label.setText("No Image")
        self.table.setCellWidget(row, col, label)
