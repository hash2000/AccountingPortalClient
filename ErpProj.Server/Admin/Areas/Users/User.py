
from __future__ import unicode_literals
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import (
    AbstractBaseUser, PermissionsMixin
)
 
class User(AbstractBaseUser, PermissionsMixin):
    """
    An abstract base class implementing a fully featured User model with
    admin-compliant permissions.
 
    """
    Email = models.EmailField(max_length=40, unique=True)
    FirstName = models.CharField(max_length=30, blank=True)
    LastName = models.CharField(max_length=30, blank=True)
    IsActive = models.BooleanField(default=True)
    IsStaff = models.BooleanField(default=False)
    DateJoined = models.DateTimeField(default=timezone.now)
 
    objects = UserManager()
 
    USERNAME_FIELD = 'Email'
    REQUIRED_FIELDS = ['FirstName', 'LastName']
 
    def save(self, *args, **kwargs):
        super(User, self).save(*args, **kwargs)
        return self

