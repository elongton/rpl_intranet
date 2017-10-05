import os
from django.conf import settings
from django.http import HttpResponse, Http404

from django.views.generic import View
from django.views.generic import TemplateView


from django.shortcuts import render


# def get_angular_template(request, item=None):
#     print(item)
#     return render(request, "ang/app/stats.html", {})

class MainTemplateView(TemplateView):
    template_name='ang/reference_app/home.html'

    def get_context_data(self, **kwargs):
        ctx = super(MainTemplateView, self).get_context_data(**kwargs)
        ctx['STATIC_URL'] = settings.STATIC_URL
        return ctx


class AngularTemplateView(View):
    def get(self, request, item=None, *args, **kwargs):
        template_dir_path = settings.TEMPLATES[0]["DIRS"][0]
        final_path = os.path.join(template_dir_path, "ang", "reference_app", item + ".html")
        try:
            html = open(final_path)
            return HttpResponse(html)
        except:
            raise Http404
