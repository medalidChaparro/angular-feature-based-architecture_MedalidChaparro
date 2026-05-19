import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-estudiantes',
  standalone: false,
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.component.css']
})
export class EstudiantesComponent {

  /* PASOS DEL FORMULARIO */
  paso = 1;

  /* FORMULARIO */
  estudianteForm: FormGroup;

  /* LISTA */
  estudiantes: any[] = [];

  /* MODAL DETALLES */
  estudianteSeleccionado: any = null;

  /* EDITAR */
  editando = false;

  indiceEditando: number | null = null;

  constructor(private fb: FormBuilder) {

    this.estudianteForm = this.fb.group({

      nombre: new FormControl('', [Validators.required, Validators.minLength(2)]),
      apellido: new FormControl('', [Validators.required]),
      correo: new FormControl('', [Validators.required, Validators.email]),
      telefono: new FormControl('', [Validators.required, Validators.pattern(/^\+?\d{7,15}$/)]),
      edad: new FormControl('', [Validators.required, Validators.min(16), Validators.max(120)]),
      carrera: new FormControl('', [Validators.required]),
      codigo: new FormControl('', [Validators.required, Validators.minLength(4)]),
      fechaNacimiento: new FormControl(''),
      genero: new FormControl(''),
      direccion: new FormControl('', [Validators.required, Validators.minLength(10)])

    });

  }

  /* Shortcut to controls */
  control(name: string): FormControl {
    return this.estudianteForm.get(name) as FormControl;
  }

  isInvalid(name: string) {
    const c = this.estudianteForm.get(name);
    return !!(c && c.invalid && (c.touched || c.dirty));
  }

  getErrorMessage(name: string) {
    const c = this.estudianteForm.get(name);
    if (!c || !c.errors) return null;

    if (c.errors['required']) return 'Este campo es obligatorio.';
    if (c.errors['minlength']) return `Mínimo ${c.errors['minlength'].requiredLength} caracteres.`;
    if (c.errors['email']) return 'Ingrese un correo válido.';
    if (c.errors['pattern']) return 'Formato inválido.';
    if (c.errors['min']) return `Valor mínimo ${c.errors['min'].min}.`;
    if (c.errors['max']) return `Valor máximo ${c.errors['max'].max}.`;

    return 'Campo inválido.';
  }

  nextStep() {
    const controlsStep1 = ['nombre', 'apellido', 'correo', 'telefono', 'edad', 'codigo'];
    controlsStep1.forEach(c => this.estudianteForm.get(c)?.markAsTouched());

    const allValid = controlsStep1.every(c => this.estudianteForm.get(c)?.valid);
    if (allValid) this.paso = 2;
  }

  /* GUARDAR */
  guardarEstudiante() {
    if (this.estudianteForm.invalid) {
      this.estudianteForm.markAllAsTouched();
      return;
    }

    if (this.editando) {

      this.estudiantes[this.indiceEditando!] = this.estudianteForm.value;

      this.editando = false;

      this.indiceEditando = null;

    } else {

      this.estudiantes.push(this.estudianteForm.value);

    }

    /* RESET */
    this.estudianteForm.reset();
    this.estudianteForm.markAsPristine();

    /* VOLVER AL PASO 1 */
    this.paso = 1;

  }

  /* EDITAR */
  editarEstudiante(estudiante: any, index: number) {

    this.estudianteForm.patchValue(estudiante);

    this.editando = true;

    this.indiceEditando = index;

    /* IR AL PASO 1 */
    this.paso = 1;

  }

  /* ELIMINAR */
  eliminarEstudiante(index: number) {

    this.estudiantes.splice(index, 1);

  }

}