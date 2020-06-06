from django.shortcuts import render,redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import UserPassesTestMixin
from .models import Post
from django.views.generic import DetailView,UpdateView,CreateView,DeleteView,ListView
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.db.models import Q
#from django.urls import reverse_lazy
#from django.core.paginator import Paginator
# Create your views here.

@login_required
def blog(request):
    if(request.user.username!=''):
        print(request.user.username)
        #print(request.user.email)
        message='welcome lorem lorejnfnn njhdk nndckjdcn cndndk ncndkc njcdcn njcdicjdcnkdjcokdcn kcjdnckdnckdkcn dc cndcjndkckdn c'
        post=Post.objects.get_queryset().order_by('-date_posted')
        content={
            'message':message,
            'post':post,
            
        }
        return render(request,'blog/blog.html',content)
    else:
        return redirect('login')
 
def search(request):
        template='blog/post_detail.html'

        query=request.GET.get('q')

        result=Post.objects.filter(Q(title__icontains=query) | Q(author__username__icontains=query) | Q(content__icontains=query))
        #paginate_by=2
        ids=result[0].id
        context={ 'posts':ids }
        print(context)
        print(result)
        return redirect('Post_View', result[0].id)
        #return render(request,template,ids)
    
 
    
class PostDetailView(DetailView):
    model=Post
    template_name = 'blog/post_detail.html'
    
class PostUpdateView(UserPassesTestMixin,UpdateView):
    model = Post
    template_name = 'blog/post_form.html'
    fields = ['title', 'content', 'file']

    def form_valid(self, form):
        form.instance.author = self.request.user
        return super().form_valid(form)
    
    def test_func(self):
        post = self.get_object()
        if self.request.user == post.author:
            return True
        return False
    
class PostCreateView(CreateView):
    model = Post
    template_name = 'blog/post_form.html'
    fields = ['title', 'content', 'file']

    def form_valid(self, form):
        form.instance.author = self.request.user
        return super().form_valid(form)
    
    
class PostDeleteView(UserPassesTestMixin, DeleteView):
    model = Post
    success_url = '/blog'
    template_name = 'blog/post_confirm_delete.html'

    def test_func(self):
        post = self.get_object()
        if self.request.user == post.author:
            return True
        return False

class UserPostListView(ListView):
    model = Post
    template_name = 'blog/user_posts.html'  # <app>/<model>_<viewtype>.html
    context_object_name = 'posts'
    paginate_by = 2

    def get_queryset(self):
        user = get_object_or_404(User, username=self.kwargs.get('username'))
        return Post.objects.filter(author=user).order_by('-date_posted')
    
    
    
    