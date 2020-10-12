from django.urls import path,include
from .views import PostDetailView,PostUpdateView,PostCreateView,PostDeleteView,UserPostListView
from . import views



urlpatterns=[
    path('',views.blog,name='blog'),
    path('user/<str:username>', UserPostListView.as_view(), name='user-posts'),
    path('post/<int:pk>',views.PostDetailView.as_view(),name='Post_View'),
    path('post/<int:pk>/update/', PostUpdateView.as_view(), name='post-update'),
    path('post/new/', PostCreateView.as_view(), name='post-create'),
    path('post/<int:pk>/delete/', PostDeleteView.as_view(), name='post-delete'),
    path('search/',views.search,name='search' ),
]