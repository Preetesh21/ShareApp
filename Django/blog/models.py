from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from django.urls import reverse
from ckeditor.fields import RichTextField 
import os

class Post(models.Model):
	title = models.CharField(max_length=100)
	file = models.FileField(null=True,blank=True,upload_to='Files')
	content = RichTextField()
	date_posted = models.DateTimeField(default=timezone.now)
	author = models.ForeignKey(User, on_delete=models.CASCADE)

	def __str__(self):
		return self.title


	def get_absolute_url(self):
		return reverse('Post_View', kwargs={'pk': self.pk})