from django.urls import path,include
from . import views
 
urlpatterns=[
    path('',views.register,name='register'),
   # path('success',views.success,name='success'),
    path('profile',views.profile,name='profile'),
    #path('make_profile',views.make_profile,name='make_profile'),
    
]