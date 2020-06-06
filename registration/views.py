from django.shortcuts import render,redirect
from django.shortcuts import get_object_or_404
from .forms import RegisterForm,UserUpdatForm,ProfileUpdate
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib import messages
from .models import Profile
from django.http import HttpResponse
from django.contrib.auth import login, authenticate
from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
from .tokens import account_activation_token
from django.core.mail import EmailMessage
# Create your views here.
def register(request):
    if request.method =='POST':
        form=RegisterForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.is_active = False
            user.save()
            current_site = get_current_site(request)
            mail_subject = 'Activate your blog account.'
            message = render_to_string('registration/acc_active_email.html', {
                'user': user,
                'domain': current_site.domain,
                'uid':urlsafe_base64_encode(force_bytes(user.pk)),
                'token':account_activation_token.make_token(user),
            })
            to_email = form.cleaned_data.get('email')
            email = EmailMessage(
                        mail_subject, message, to=[to_email]
            )
            email.send()
            return HttpResponse('<h1>Please confirm your email address to complete the registration.</h1>')
            #return render(request,'registration/confirm.html')
    else:
        form=RegisterForm()
    return render(request,'registration/registration.html',{'form':form})



def activate(request, uidb64, token):
    try:
        uid = force_text(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = True
        user.save()
        #login(request, user)
        return redirect('login')
        #return HttpResponse('<h1>Thank you for your email confirmation. Now you can login your account.')
    else:
        return HttpResponse('<h1>Activation link is invalid!</h1>')


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
