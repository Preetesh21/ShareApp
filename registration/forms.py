from django.contrib.auth import login,authenticate
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django import forms
from .models import Profile

class RegisterForm(UserCreationForm):
    email=forms.EmailField()
    
    class Meta:
        model=User
        fields=['username','password1','password2','email']


class UserUpdatForm(forms.ModelForm):
    email = forms.EmailField()

    class Meta:
        model=User
        fields=['username','email']
        
        
class ProfileUpdate(forms.ModelForm):
    class Meta:
        model= Profile
        fields = '__all__'
    
