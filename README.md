# Event Calendar Application


## Overview

This is a full-stack Event Calendar Application that allows users to manage their events through a user-friendly interface. The application consists of a Django-based backend providing RESTful API endpoints and a React-based frontend for the user interface.

## Features

- User authentication (login and registration)
- Calendar view of events
- List view of events
- Create, edit, and delete events
- Set reminders for events
- Responsive design using Material-UI
- Token-based authentication
- RESTful API for event management

## Technology Stack

- Backend: Python, Django, Django REST Framework
- Frontend: React, Material-UI, react-big-calendar
- Database: PostgreSQL (production) / SQLite (development)
- Authentication: Token-based authentication

## Project Structure

```
event-calendar/
├── backend/
│   ├── calendar_backend/
│   │   ├── __init__.py
│   │   ├── asgi.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── calendar_api/
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── tests.py
│   │   └── views.py
│   ├── .env
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── ...
│   ├── package.json
│   └── README.md
└── README.md
```

## LocalSetup and Installation 

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Create a virtual environment:
   ```
   python -m venv venv
   ```
3. Activate the virtual environment:
   - Windows:
     ```
     venv\Scripts\activate
     ```
   - Unix or MacOS:
     ```
     source venv/bin/activate
     ```
4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
5. Create a `.env` file in the backend directory with:
   ```
   DJANGO_SECRET_KEY=your_secret_key_here
   DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,your_domain.com
   ```
6. Run migrations:
   ```
   python manage.py migrate
   ```
7. Create a superuser:
   ```
   python manage.py createsuperuser
   ```
8. Run the development server:
   ```
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Update the API base URL in `src/services/api.js` if necessary
4. Run the application:
   ```
   npm start
   ```

## API Endpoints

- `/admin/`: Django admin interface
- `/api/events/`: List and create events (GET, POST)
- `/api/events/<id>/`: Retrieve, update, or delete an event (GET, PUT, DELETE)
- `/api/register/`: Register a new user (POST)
- `/api/login/`: Obtain an auth token (POST)
- `/api/logout/`: Logout (invalidate token) (POST)

## Models

### Event
- `user`: ForeignKey to User model
- `title`: CharField
- `description`: TextField (optional)
- `start_time`: DateTimeField
- `end_time`: DateTimeField

## Authentication

Token-based authentication is used. Include the token in the Authorization header for API requests:

```
Authorization: Token <your_token_here>
```

## Frontend Components

- `App.js`: The main component that handles routing and overall application state.
- `Login.js`: Handles user login functionality.
- `Register.js`: Manages user registration.
- `Calendar.js`: Displays events in a calendar view using react-big-calendar.
- `EventList.js`: Shows events in a list format.
- `EventForm.js`: Provides a form for creating and editing events.

## Environment Variables

### Backend:
- `DJANGO_SECRET_KEY`: Secret key for Django
- `DJANGO_ALLOWED_HOSTS`: Comma-separated list of allowed hosts

### Frontend:
- Update the API base URL in `src/services/api.js` if necessary


## CORS

CORS is enabled for all origins in development. For production, update the `CORS_ALLOWED_ORIGINS` setting in `settings.py`.

