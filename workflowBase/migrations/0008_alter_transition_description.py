# Generated by Django 4.1.4 on 2023-04-13 08:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("workflowBase", "0007_alter_transition_permission"),
    ]

    operations = [
        migrations.AlterField(
            model_name="transition",
            name="description",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
