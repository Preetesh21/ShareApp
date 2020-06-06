from django.shortcuts import render,redirect
from django.shortcuts import get_object_or_404
from .forms import RegisterForm,UserUpdatForm,ProfileUpdate
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib import messages
from .models import Profile

# Create your views here.
def register(request):
    if request.method =='POST':
        form=RegisterForm(request.POST)
        if form.is_valid():
            form.save()
            print('Correct')
            request.user.profile=Profile()
            return redirect('login')
        print('Rewrite')
    else:
        form=RegisterForm()
    return render(request,'registration/registration.html',{'form':form})


@login_required
def profile(request):
    if request.method == 'POST':
        u_form=UserUpdatForm(request.POST,instance=request.user)
        try:
            p_form=ProfileUpdate(request.POST,instance=request.user.profile)
        except:
            p_form=ProfileUpdate(request.POST)
        if u_form.is_valid() and p_form.is_valid():
            u_form.save()
            p_form.save()
            message='Your account has been updated!'
            return render(request,'registration/profile.html',{'message':message,'p':p_form})

    u_form=UserUpdatForm(instance=request.user)
    print("GG")
    print(request.user)
    #if(request.user.profile==None):
    try: 
        request.user.profile
    except:
        request.user.profile=Profile()
    p_form=ProfileUpdate(instance=request.user.profile)
    #p_form=ProfileUpdate()
    context= {
        'u': u_form,
        'p':p_form
    }
    #print(context['u'])
    return render(request,'registration/profile.html',context=context)
