import os
from django.conf import settings
from django.http import HttpResponse, Http404

from django.views.generic import View
from django.views.generic import TemplateView


from django.shortcuts import render


class HomeTemplateView(TemplateView):
    template_name='ang/home_app/home_index.html'

    def get_context_data(self, **kwargs):
        ctx = super(HomeTemplateView, self).get_context_data(**kwargs)
        ctx['STATIC_URL'] = settings.STATIC_URL
        return ctx

class LibcalTemplateView(TemplateView):
    template_name='ang/libcal_app/libcal_index.html'

    def get_context_data(self, **kwargs):
        ctx = super(LibcalTemplateView, self).get_context_data(**kwargs)
        ctx['STATIC_URL'] = settings.STATIC_URL
        return ctx

class TileviewTemplateView(TemplateView):
    template_name='ang/tileview_app/tileview_index.html'

    def get_context_data(self, **kwargs):
        ctx = super(TileviewTemplateView, self).get_context_data(**kwargs)
        ctx['STATIC_URL'] = settings.STATIC_URL
        return ctx


class ReferenceTemplateView(TemplateView):
    template_name='ang/reference_app/reference_index.html'

    def get_context_data(self, **kwargs):
        ctx = super(ReferenceTemplateView, self).get_context_data(**kwargs)
        ctx['STATIC_URL'] = settings.STATIC_URL
        return ctx

class UserTemplateView(TemplateView):
    template_name='ang/users_app/user_index.html'

    def get_context_data(self, **kwargs):
        ctx = super(UserTemplateView, self).get_context_data(**kwargs)
        ctx['STATIC_URL'] = settings.STATIC_URL
        return ctx


class AngularTemplateView(View):
    def get(self, request, appname=None, item=None,  *args, **kwargs):
        template_dir_path = settings.TEMPLATES[0]["DIRS"][0]
        final_path = os.path.join(template_dir_path, "ang", appname, item + ".html")
        try:
            html = open(final_path)
            return HttpResponse(html)
        except:
            raise Http404
