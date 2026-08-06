# event-booking-app
```django-admin startproject backend```
* Run commands
    * ```source venv/bin/activate```
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
    * POST users/register
    * POST users/login
    * GET users/profile
    * GET admin/users
    * GET admin/users/{id}
    * PATCH admin/users/{id}/approval
    * GET admin/users/pending

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
    * GET events/my-drafted-events
    * GET events/my-cancelled-events
    * GET events/my-completed-events
    * PUT/PATCH/DELETE events/{id}/edit
    * GET events/search/<query_params>
    * POST events/category : admin can add new categories to the app
    * GET events/category-list
    * GET events/all : get a list of all kinds of events (published, cancelled, completed, drafted)
    * GET events/active : get a list of all published events (currently active)
    * GET events/details/{id}
    ***ticket types endpoints***
    * GET events/all-ticket-types : see all kinds of ticket types exists in all events
    * GET events/<int:pk>/event-ticket-types/ : get all ticket types of a specific event
    * PATCH events/<int:pk>/ticket-types/<int:ticket_type_id>/ : edit price, name and quantity of a ticket type of a specific event
* Search

    * django-filter
    * All the query parameters that the endpoint accepts are defined in EventFilter class in file events/filters.py.


**For images: We are using Pillow (source: https://medium.com/@prashantmaharjan5/complete-guide-to-image-uploads-in-django-4f24e0422708)**

Booking App
---
* Relational Database
    * attendee - booking 1-N
    * event - booking 1-N

* Endpoints
    * POST booking/create/{event_id}
    * GET booking/my-bookings
    * GET booking/my-cancelled-bookings
    * GET booking/my-upcoming-bookings
    * GET booking/my-completed-bookings
    * GET booking/{booking_id}
    * GET booking/event/{event_id} -> all bookings for a specific event
Messaging App
---
* Relational Database
    * sender - message 1-N
    * receiver - message 1-N
* Endpoints
    * POST /messages/{eventid} : create a message based on an event
    * GET /messages/inbox
    * GET /messages/sent
    * GET /messages/unread
    * GET /messages/unread-count : number of new messages
    * GET /messages/{id}
    * PATCH /messages/inbox/{id} : delete a message from inbox. Delete here is not deletion from the database. Its just that the message will not be shown in the lists, since a message can be "deleted" by someone from inbox but the other person might not have deleted the message from sent.
    * PATCH /messages/sent/{id} : delete a message from sent


TODO:
* periodikh ergasia gia na ginontai completed ta events otan perasei h hmeromhnia
* delete ticket types checks
