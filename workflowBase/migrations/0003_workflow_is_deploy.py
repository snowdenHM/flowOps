# Generated by Django 4.1.7 on 2023-04-03 07:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workflowBase', '0002_workflowinstance'),
    ]

    operations = [
        migrations.AddField(
            model_name='workflow',
            name='is_deploy',
            field=models.BooleanField(default=False),
        ),
    ]