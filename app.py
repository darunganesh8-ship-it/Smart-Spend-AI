
from flask import Flask, render_template, request, redirect
import numpy as np

app = Flask(__name__)

expenses = [
    {"name": "Food", "amount": 150, "alert": False},
    {"name": "Transport", "amount": 80, "alert": False},
    {"name": "Shopping", "amount": 300, "alert": False},
    {"name": "Food", "amount": 120, "alert": False},
    {"name": "Entertainment", "amount": 200, "alert": False}
]

def detect_anomaly(amount):
    if len(expenses) < 3:
        return False

    values = [e["amount"] for e in expenses]

    mean = np.mean(values)
    std = np.std(values)

    if std == 0:
        return amount > mean * 1.5

    return (amount - mean) / std > 2


@app.route("/")
def home():
    total = sum(e["amount"] for e in expenses)

    return render_template(
        "index.html",
        expenses=expenses,
        total=total
    )


@app.route("/add", methods=["POST"])
def add():
    name = request.form["name"]
    amount = float(request.form["amount"])

    alert = detect_anomaly(amount)

    expenses.append({
        "name": name,
        "amount": amount,
        "alert": alert
    })

    return redirect("/")


if __name__ == "__main__":
    app.run(debug=True)
