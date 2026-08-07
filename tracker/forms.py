from django.forms import  ModelForm

from django.db import models

from tracker.models import Case


class CaseForm(ModelForm):
    class Meta:
        model = Case
        fields = ['case_number','description']


    def __init__(self, *args, **kwargs):
        super(CaseForm, self).__init__(*args, **kwargs)
        for field_name, field in self.fields.items():
            field.widget.attrs['class'] = 'form-control'
