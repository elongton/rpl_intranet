"""reference URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls import url, include
from django.contrib import admin
from django.views.generic.base import TemplateView
from rest_framework_jwt.views import obtain_jwt_token
from rest_framework_jwt.views import refresh_jwt_token
from ang.views import (AngularTemplateView,
                      ReferenceTemplateView,
                      UserTemplateView,
                      HomeTemplateView,
                      LibcalTemplateView)

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^api/auth/token/', obtain_jwt_token),
    url(r'^api/auth/token/refresh/', refresh_jwt_token),
    url(r'^api/reference/', include('reference_stats.api.urls', namespace='questions-api' )),
    url(r'^api/users/', include('accounts.api.urls', namespace='users-api' )),
    url(r'^api/templates/(?P<appname>[A-Za-z0-9\_\-\.\/]+)/(?P<item>[A-Za-z0-9\_\-\.\/]+)\.html$', AngularTemplateView.as_view())
]


if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += [
    # url(r'', TemplateView.as_view(template_name='ang/home.html'))
    url(r'^users',UserTemplateView.as_view()),
    url(r'^reference', ReferenceTemplateView.as_view()),
    url(r'^libcal', LibcalTemplateView.as_view()),
    url(r'', HomeTemplateView.as_view()),
]
