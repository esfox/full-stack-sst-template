import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-base-form',
  standalone: true,
  imports: [CommonModule],
  template: '',
})
export class BaseFormComponent {
  @ViewChild('form') form!: NgForm;

  @Input('loading') isLoading = false;

  @Output('save') onSave = new EventEmitter();

  setValues<T extends { [key: string]: any } = any>(defaultData: Partial<T>) {
    this.form.reset();
    this.form.setValue(defaultData);
  }

  reset() {
    this.form.reset();
  }

  save() {
    this.onSave.emit(this.form.value);
  }
}
