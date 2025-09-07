from PyQt6.QtWidgets import QWidget, QVBoxLayout, QHBoxLayout, QLabel
from PyQt6.QtCore import Qt
import pyqtgraph as pg
import numpy as np
from ..db.database import SessionLocal, Employee

class DashboardPage(QWidget):
    def __init__(self):
        super().__init__()

        layout = QVBoxLayout(self)
        layout.setContentsMargins(20, 20, 20, 20)

        # Title
        title = QLabel("Dashboard")
        title.setStyleSheet("font-size: 24px; font-weight: bold;")
        layout.addWidget(title)

        # KPIs
        kpi_layout = QHBoxLayout()

        total_employees_widget, self.total_employees_value_label = self.create_kpi_label("Total Employees", "0")
        avg_salary_widget, self.avg_salary_value_label = self.create_kpi_label("Average Salary", "0.00")

        kpi_layout.addWidget(total_employees_widget)
        kpi_layout.addWidget(avg_salary_widget)
        layout.addLayout(kpi_layout)

        # Chart
        self.plot_widget = pg.PlotWidget()
        self.plot_widget.setBackground('w' if self.palette().window().color().lightness() > 127 else 'k')
        self.plot_widget.setTitle("Salary Distribution", color="b", size="16pt")
        self.plot_widget.setLabel('left', 'Number of Employees', color='gray', **{'font-size':'12pt'})
        self.plot_widget.setLabel('bottom', 'Salary Bins', color='gray', **{'font-size':'12pt'})
        self.salary_chart = pg.BarGraphItem(x=[], height=[], width=0.6, brush='b')
        self.plot_widget.addItem(self.salary_chart)
        layout.addWidget(self.plot_widget)

        self.load_dashboard_data()

    def create_kpi_label(self, title, value):
        kpi_widget = QWidget()
        kpi_layout = QVBoxLayout(kpi_widget)
        title_label = QLabel(title)
        title_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        value_label = QLabel(value)
        value_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        value_label.setStyleSheet("font-size: 20px; font-weight: bold;")
        kpi_layout.addWidget(title_label)
        kpi_layout.addWidget(value_label)
        kpi_widget.setStyleSheet("border: 1px solid #c0c0c0; border-radius: 5px; padding: 10px;")
        return kpi_widget, value_label

    def load_dashboard_data(self):
        db = SessionLocal()
        try:
            employees = db.query(Employee).all()
            salaries = [emp.salary for emp in employees if emp.salary is not None]

            # Update KPIs
            total_employees = len(employees)
            avg_salary = np.mean(salaries) if salaries else 0

            self.total_employees_value_label.setText(str(total_employees))
            self.avg_salary_value_label.setText(f"${avg_salary:,.2f}")

            # Update Chart
            if salaries:
                hist, bins = np.histogram(salaries, bins=10)
                bin_centers = (bins[:-1] + bins[1:]) / 2
                self.salary_chart.setOpts(x=bin_centers, height=hist, width=(bins[1]-bins[0])*0.8)
        finally:
            db.close()
