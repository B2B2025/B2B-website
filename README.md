# Bharat2Business Website

Digital infrastructure platform for India's MSMEs.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

### Features

- **Newsletter Subscription**: Backend API to capture and store email subscriptions
- **SQLite Database**: Lightweight database for storing subscriber emails
- **Static Website**: Serves all HTML, CSS, and JS files

### API Endpoints

#### Subscribe to Newsletter
- **URL**: `/api/subscribe`
- **Method**: POST
- **Body**: `{ "email": "user@example.com" }`
- **Success Response**: `{ "success": true, "message": "Thank you for subscribing!" }`
- **Error Response**: `{ "success": false, "message": "Error message" }`

### Database

The application uses SQLite with a single table:

**subscribers**
- `id` - Auto-incrementing primary key
- `email` - Unique email address
- `subscribed_at` - Timestamp of subscription

### Technologies Used

- Node.js & Express
- SQLite (better-sqlite3)
- Vanilla HTML/CSS/JavaScript
