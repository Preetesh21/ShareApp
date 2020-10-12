from django.urls import path,include
from . import views
from django.conf.urls import url


urlpatterns=[
    path('',views.register,name='register'),
   # path('success',views.success,name='success'),
    path('profile',views.profile,name='profile'),
    #path('make_profile',views.make_profile,name='make_profile'),
    # url(r'^activate/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
    #     views.activate, name='activate'),
]