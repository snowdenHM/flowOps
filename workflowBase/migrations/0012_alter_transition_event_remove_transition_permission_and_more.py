# Generated by Django 4.1.4 on 2023-04-14 07:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("auth", "0012_alter_user_first_name_max_length"),
        ("workflowBase", "0011_alter_transition_event"),
    ]

    operations = [
        migrations.AlterField(
            model_name="transition",
            name="event",
            field=models.ManyToManyField(
                blank=True,
                null=True,
                related_name="transitionEvent",
                to="workflowBase.transitionevents",
            ),
        ),
        migrations.RemoveField(
            model_name="transition",
            name="permission",
        ),
        migrations.AddField(
            model_name="transition",
            name="permission",
            field=models.ManyToManyField(
                blank=True,
                null=True,
                related_name="transitionPermission",
                to="auth.group",
            ),
        ),
    ]
