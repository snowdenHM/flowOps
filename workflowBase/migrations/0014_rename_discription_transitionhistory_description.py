# Generated by Django 4.1.4 on 2023-05-16 09:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("workflowBase", "0013_transitionhistory"),
    ]

    operations = [
        migrations.RenameField(
            model_name="transitionhistory",
            old_name="discription",
            new_name="description",
        ),
    ]
