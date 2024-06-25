from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.exceptions import ValidationError
from .models import HorasExtras, Contrato, Empleado, Devengado, Nomina, Deducciones, NovedadDevengado, NovedadDeducciones
from datetime import date, timedelta
from calendar import monthrange

@receiver(post_save, sender=HorasExtras)
def calcular_totales(sender, instance, created, **kwargs):
    if created:
        try:
            contrato = Contrato.objects.get(documento=instance.empleado)
            salario = contrato.salario
            jornadaLaboral = contrato.jornadaLaboral

            # Calcular totalHoras
            totalHoras = (
                instance.diurna +
                instance.nocturna +
                instance.diurnaDominical +
                instance.nocturnaDominical +
                instance.recargoDiurna +
                instance.recargoNocturna
            )
            
            # Calcular totalExtra
            horasMes = jornadaLaboral * 5
            valorhora = round(salario / horasMes)
            horaD = round((valorhora * 0.35) * instance.diurna + valorhora)
            hExtraNocturna = round((valorhora * 0.75) * instance.nocturna + valorhora)
            hExtraDDominical = round((valorhora * 2) * instance.diurnaDominical + valorhora)
            hExtraNDominical = round((valorhora * 2.5) * instance.nocturnaDominical + valorhora)
            hRecargoDominical = round((valorhora * 0.75) * instance.recargoDiurna + valorhora)
            hRecargoNDominical = round((valorhora * 2.1) * instance.recargoNocturna + valorhora)
            totalExtra = (
                horaD + hExtraNocturna + hExtraNDominical +
                hExtraDDominical + hRecargoDominical + hRecargoNDominical
            )

            # Asignar los valores calculados a los campos totalHoras y totalExtra
            instance.totalHoras = totalHoras
            instance.totalExtra = totalExtra
            instance.save()

        except Contrato.DoesNotExist:
            raise ValidationError(f"No existe un contrato para el empleado {instance.empleado}")

@receiver(post_save, sender=Nomina)
def actualizar_devengado_deducciones(sender, instance, created, **kwargs):
    if created:
        contrato = Contrato.objects.get(documento=instance.documento)
        salario = contrato.salario
        periodo_pago = contrato.periodoPago
        subsidioT = 0
        totalSalario = 0
        # Calcular el periodo según el contrato.periodoPago
        if periodo_pago == 15 or periodo_pago == 30:
            # Obtener el mes y año actual
            now = date.today()
            year = now.year
            month = now.month
            
            # Establecer el día del periodo
            if periodo_pago == 15:
                totalSalario = round((salario / 30) * 15)
                day = 15
            elif periodo_pago == 30:
                # Obtener el último día del mes actual
                totalSalario = salario
                day = monthrange(year, month)[1]    
        # Crear Devengado
        if salario > 2600000:
            subsidioT = 0
        else:
            if periodo_pago == 15:
                totalSalario = round((salario / 30) * 15)
                subsidioT = round(162000 / 2)
            elif periodo_pago == 30:
                totalSalario = salario
                subsidioT = 162000
        totalDevengado = totalSalario + subsidioT
        
        devengado = Devengado.objects.create(
            documento=instance.documento,
            totalDevengado=totalSalario + subsidioT,
            totalDevengadoIBC = totalSalario,
            periodo=date(year, month, day)
        )
        salud = totalSalario * 0.04
        pesion = totalSalario * 0.04
        totalDeducciones = salud + pesion
        
        # Crear Deducciones (si es necesario)
        deducciones = Deducciones.objects.create(
            documento = instance.documento,
            total =  salud + pesion,
            periodo = date(year, month, day),
            salud = salud,
            pension = pesion
        )
        # Actualizar codDevengado y codDeducciones en la instancia de Nomina
        instance.codDevengado = devengado
        instance.codDeducciones = deducciones
        instance.total = totalDevengado -totalDeducciones 
        instance.periodo = date(year, month, day)
        instance.save()

@receiver(post_save, sender=HorasExtras)
def actualizar_total_devengado(sender, instance, created, **kwargs):
    if created:
        # Obtener el devengado asociado al empleado de las HorasExtra
        devengado = Devengado.objects.filter(documento=instance.empleado).latest('id')
        # Sumar el totalExtra al totalDevengado
        devengado.totalDevengadoIBC += instance.totalExtra
        devengado.totalDevengado += instance.totalExtra
        
        devengado.save()
        
@receiver(post_save, sender=Devengado)
def actualizar_deducciones(sender, instance, created, **kwargs):
    if not created:  # Solo actualizar si no es la primera creación
        # Obtener la instancia de Deducciones asociada al Empleado y periodo del Devengado
        deducciones = Deducciones.objects.get(documento=instance.documento, periodo=instance.periodo)
        salud = instance.totalDevengadoIBC * 0.04 
        pension = instance.totalDevengadoIBC * 0.04
        # Realizar los cálculos para deducciones basadas en totalDevengadoIBC
        deducciones.salud = instance.totalDevengadoIBC * 0.04  # Ejemplo de cálculo
        deducciones.pension = instance.totalDevengadoIBC * 0.04  # Ejemplo de cálculo
        deducciones.total =  salud + pension # Ejemplo de cálculo
        deducciones.save()
        
        
@receiver(post_save, sender=NovedadDevengado)
def actualizar_total_devengado(sender, instance, created, **kwargs):
    if created:
        devengado = instance.codDevengado  # Obtener el Devengado asociado a la NovedadDevengado
        devengado.totalDevengado += instance.total
        devengado.totalDevengadoIBC += instance.total  # Aumentar el totalDevengado con el total de la novedad
        # Aumentar el totalDevengado con el total de la novedad
        devengado.save()  # Guardar el Devengado actualizado

@receiver(post_save, sender=NovedadDeducciones)
def actualizar_total_devengado(sender, instance, created, **kwargs):
    if created:
        deducciones = instance.codDeducciones  # Obtener el Devengado asociado a la NovedadDevengado
        deducciones.total += instance.total 
        # Aumentar el totalDeducciones con el total de la novedad
        deducciones.save()  # Guardar el Devengado actualizado
        

@receiver(post_save, sender=Deducciones)
@receiver(post_save, sender=Devengado)
def actualizar_nomina(sender, instance, created, **kwargs):
    if not created:  # Solo proceder si no es una creación
        # Obtener el total de devengado y deducciones para ese periodo
        devengado = Devengado.objects.filter(documento=instance.documento, periodo=instance.periodo).first()
        deduccion = Deducciones.objects.filter(documento=instance.documento, periodo=instance.periodo).first()

        if devengado and deduccion:
            # Tratar de obtener la nomina asociada al documento (empleado) y periodo de la instancia modificada
            try:
                nomina = Nomina.objects.get(documento=instance.documento, periodo=instance.periodo)
                # Calcular la nueva total de la nomina como la resta entre devengado y deducciones
                nomina.total = devengado.totalDevengado - deduccion.total
                nomina.codDevengado = devengado
                nomina.codDeducciones = deduccion
                nomina.save()
            except Nomina.DoesNotExist:
                # Si no existe una nomina para ese periodo y documento, no hacer nada
                pass