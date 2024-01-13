import { CommonModule, Location } from '@angular/common';
import {
  AfterViewInit,
  Component,
  InjectionToken,
  Input,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ResourceService } from '../../services/resource.service';

export const injectionTokens = {
  service: new InjectionToken<ResourceService<unknown>>('service'),
};

@Component({
  selector: 'app-base-form',
  standalone: true,
  imports: [CommonModule],
  template: '',
})
export class BaseFormComponent<DataType = unknown> implements OnInit, AfterViewInit {
  @ViewChild('form') form!: NgForm;

  @Input() id!: string;

  service = inject<ResourceService<DataType>>(injectionTokens.service);
  location = inject(Location);
  activatedRoute = inject(ActivatedRoute);

  isSaving = this.service.isSaving;
  isLoading = this.service.isLoadingRecordToEdit;
  recordToEdit = this.service.recordToEdit;

  error!: string;

  navTitle!: string;

  getRecordId(record: Partial<DataType>) {
    return (record as any).id;
  }

  ngOnInit() {
    this.navTitle = this.activatedRoute.snapshot.data?.['navTitle'] ?? 'Add';
  }

  async ngAfterViewInit() {
    await this.service.initEditRecordForm(this.id);
    this.setValues();
  }

  setValues() {
    const record = this.recordToEdit();
    if (!record) {
      return;
    }

    const data: any = {};
    for (const field in this.form.controls) {
      const key = field as keyof DataType;
      const defaultDataValue = record[key];
      data[field] = defaultDataValue ?? '';
    }

    this.form.reset();
    this.form.setValue(data);
  }

  async save() {
    const data: Partial<DataType> = this.form.value;
    const { error } = await this.service.saveRecord(data);
    if (!error) {
      this.location.back();
      await this.service.loadRecords();
    }

    if (error?.status === 403) {
      this.error = 'Not allowed to save';
    }
  }

  cancel() {
    this.location.back();
  }
}
