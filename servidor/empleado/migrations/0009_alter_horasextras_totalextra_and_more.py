# Generated by Django 5.0.6 on 2024-06-24 19:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('empleado', '0008_alter_contrato_documento'),
    ]

    operations = [
        migrations.AlterField(
            model_name='horasextras',
            name='totalExtra',
            field=models.IntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='horasextras',
            name='totalHoras',
            field=models.IntegerField(null=True),
        ),
    ]
