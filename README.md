# event-booking-app
```django-admin startproject backend```
* Run commands
    * ```python manage.py makemigrations```
    * ```python manage.py migrate```
    * ```python manage.py runserver```

* New app creation
    * ```python manage.py startapp events```

* To check get requests from terminal ```curl -H "Authorization: Bearer <access_token>" http://127.0.0.1:8000/api/<url>```

User App
---
* Based on **CustomUser** model. There are the 3 roles (attendee, organizer, admin)
* Register Serializer validates password and roles (a user cannot regsiter as admin). If username already exists an error is raised. Also creates new python object user and saves it.
* MyProfile is for users profile info
* UsersList is so that admin can see a list of all the users
* UserInfo is to see info of a specific user
* UserApproval is so that admin can approve or reject a pending request
* PendingUsers is so that admin can see a list of all pending users

Event App
---
Σχεσιακή Βάση Δεδομένων:
* event - category M-N
* event - tickettype 1-N (1 event έχει πολλά είδη εισιτηρίων)
* custom user - booking 1-N (ενας χρήστης κάνει πολλές κρατήσεις)
* event - booking 1-N (ένα event έχει πολλές κρατήσεις)
* ticketType - booking 1-N

Για τις εικόνες: έγινε χρήση του Pillow (πηγή: https://medium.com/@prashantmaharjan5/complete-guide-to-image-uploads-in-django-4f24e0422708)
