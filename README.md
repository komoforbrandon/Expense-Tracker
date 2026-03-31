# Expense Tracker App

A responsive frontend expense tracker built with HTML, CSS, and vanilla JavaScript. The app lets users add income and expense transactions, updates account totals in real time, and visualizes expense categories with a doughnut chart powered by Chart.js.

## Overview

This project is a lightweight personal finance dashboard designed for tracking basic cash flow in the browser. It includes:

- A balance summary for total balance, total income, and total expenses
- A transaction form for adding income and expense entries
- A transaction history panel with delete support
- A styled payment card summary
- An expense breakdown chart that updates automatically when expenses change

The app is fully client-side and does not require a backend or database.

## Features

- Add new transactions as either `income` or `expense`
- Show or hide the expense-type field depending on the selected transaction type
- Validate required transaction inputs before submission
- Automatically update:
  - total balance
  - total income
  - total expense
  - card balance
- Display transaction history entries with date and time
- Delete transactions and roll totals back instantly
- Group expenses by category and sync them to a doughnut chart
- Responsive layout for desktop and smaller screens

## Built With

- HTML5
- CSS3
- Vanilla JavaScript (ES modules)
- [Chart.js](https://www.chartjs.org/) via CDN
- [Font Awesome](https://fontawesome.com/) via CDN
- Google Fonts

## Project Structure

```text
Expense Tracker App/
├── assets/
│   ├── chipicon.png
│   └── Profil.png
├── styles/
│   └── style.css
├── chart.js
├── index.html
├── script.js
└── README.md
```

## How It Works

### Transaction Flow

When a user adds a transaction:

1. The app validates the form inputs.
2. A new transaction card is added to the history section.
3. Summary amounts are recalculated in the UI.
4. Expense data is grouped by category and the chart is refreshed.

### Expense Chart

The doughnut chart only tracks `expense` transactions. Income entries do not affect the chart. When an expense is added or removed, the chart rebuilds its category totals from the current transaction history.

## Validation Rules

The app currently enforces the following rules before a transaction is added:

- Amount must be a number greater than `0`
- Date is required
- Category is required
- Expense type is required when the transaction type is `expense`

## Getting Started

### Option 1: Open Directly

You can open `index.html` in a browser.

### Option 2: Run With a Local Server

Because the app uses JavaScript modules, running it through a local server is the most reliable option.

Then open:

```text
http://localhost:8000
```

## Usage

1. Choose a transaction type: `Income` or `Expense`
2. Enter the amount
3. Select a date
4. Add a category name
5. If the type is `Expense`, choose an expense type
6. Click `Add Transaction`
7. Review the updated totals and chart
8. Click the `×` icon on any history item to remove it

## Current UI State

The interface loads with pre-filled sample values and starter transaction entries so the dashboard is not empty on first load. New activity is appended to the existing history.

## Limitations

This version is a frontend prototype and has a few known limitations:

- No data persistence after page refresh
- No backend, authentication, or user accounts
- The `Log in` button is currently decorative
- The card details are static display content
- No filtering, editing, or transaction search
- No automated test suite is included

## Possible Improvements

- Save transactions with `localStorage` or a backend API
- Add transaction editing and filtering
- Support multiple accounts or cards
- Add monthly summaries and reports
- Export transactions to CSV or PDF
- Add authentication and profile management
- Improve accessibility and keyboard interactions

## Author Notes

This project is a good starting point for practicing:

- DOM manipulation
- form validation
- state updates in vanilla JavaScript
- dynamic chart rendering
- responsive dashboard layout design

## License

No license has been specified yet. If you plan to share or publish this project, consider adding a license such as `MIT`.
