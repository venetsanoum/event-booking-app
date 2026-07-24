# event-booking-app
```django-admin startproject backend```
* Run commands
    * ```python manage.py makemigrations```
    * ```python manage.py migrate```
    * ```python manage.py runserver```

* New app creation
    * ```python manage.py startapp events```

User App
---
* Based on **CustomUser** model. There are the 3 roles (attendee, organizer, admin)
* Register Serializer validates password and roles (a user cannot regsiter as admin). If username already exists an error is raised. Also creates new python object user and saves it.
* MyProfile is for users profile info
* UsersList is so that admin can see a list of all the users
* UserInfo is to see info of a specific user
* UserApproval is so that admin can approve or reject a pending request
* PendingUsers is so that admin can see a list of all pending users
* Endpoints
    * POST api/users/register
    * POST api/users/login
    * GET api/users/profile
    * GET api/admin/users
    * GET api/admin/users/{id}
    * PATCH api/admin/users/{id}/approval
    * GET api/admin/users/pending

Event App
---
* Relational Database
    * event - category M-N
    * event - tickettype 1-N (1 event has different types of tickets)
    * custom user - booking 1-N (1 user has many bookings)
    * event - booking 1-N (1 event has many bookings)
    * ticketType - booking 1-N
* Endpoints
    * POST events/
    * POST events/{id}/ticket-types
    * POST events/{id}/images
    * GET events/my-events
    * GET events/{id}/bookings
    * PUT/PATCH/DELETE events/{id}/edit

For images: We are using Pillow (source: https://medium.com/@prashantmaharjan5/complete-guide-to-image-uploads-in-django-4f24e0422708)

Search
---
* django-filter
* All the query parameters that the endpoint accepts are defined in EventFilter class in file events/filters.py.
