# Generated by Django 4.1.4 on 2023-04-10 14:23

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("auth", "0012_alter_user_first_name_max_length"),
        ("workflowBase", "0005_workflowgraph"),
    ]

    operations = [
        migrations.AddField(
            model_name="transition",
            name="event",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="transitionEvent",
                to="workflowBase.transitionevents",
            ),
        ),
        migrations.AddField(
            model_name="transition",
            name="permission",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="transitionPermission",
                to="auth.permission",
            ),
        ),
        migrations.AlterField(
            model_name="workflowgraph",
            name="graph",
            field=models.FileField(blank=True, null=True, upload_to="workflow/"),
        ),
    ]