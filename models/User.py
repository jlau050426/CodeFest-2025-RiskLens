class User:
    def __init__(self, name, age, email, gross_monthly_income, employment_status, loan_purpose):
        self.name = name
        self.age = age
        self.email = email
        self.gross_monthly_income = gross_monthly_income
        self.employment_status = employment_status
        self.loan_purpose = loan_purpose

    def to_string(self):
        return (f"Name: {self.name}\n"
                f"Age: {self.age}\n"
                f"Email: {self.email}\n"
                f"Gross Monthly Income: {self.gross_monthly_income}\n"
                f"Employment Status: {self.employment_status}\n"
                f"Loan Purpose: {self.loan_purpose}\n")