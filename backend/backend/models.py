from django.db import models

class User(models.Model):

    id = models.AutoField(primary_key=True)
    firstname = models.CharField(max_length=250, null=False)
    lastname = models.CharField(max_length=250, null=False)
    email = models.CharField(max_length=250, null=False, unique=True)
    password = models.CharField(max_length=250, null=False)
    session_id = models.CharField(max_length=250, null=True)
    reset_token = models.CharField(max_length=250, null=True)

    @property
    def fullname(self):
        return f'{self.firstname} {self.lastname}'

    def __str__(self):
        return self.fullname