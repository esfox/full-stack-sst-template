// TODO: HANDLE ERRORS!
import { CommonModule } from '@angular/common';
import { Component, InjectionToken, ViewChild, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { BaseFormComponent } from '../base-form/base-form.component';
import { DialogComponent } from '../dialog/dialog.component';
import { PromptDialogComponent } from '../prompt-dialog/prompt-dialog.component';

export const injectionTokens = {
  service: new InjectionToken<ApiService<unknown>>('service'),
  getId: new InjectionToken('getId'),
};

@Component({
  selector: 'app-base-resource',
  standalone: true,
  imports: [CommonModule],
  template: '',
})
export class BaseResourceComponent<DataType = any> {
  @ViewChild('recordFormDialog') recordFormDialog!: DialogComponent;
  @ViewChild('deletePromptDialog') deletePromptDialog!: PromptDialogComponent;
  @ViewChild('recordForm') recordForm!: BaseFormComponent;

  protected service = inject<ApiService<DataType>>(injectionTokens.service);
  protected getId = inject<(record: Partial<DataType>) => string>(injectionTokens.getId);

  records = this.service.records;
  isLoading = this.service.isLoading;

  recordToSave = this.service.recordToSave;
  isSaving = this.service.isSaving;

  recordToDelete = this.service.recordToDelete;
  isDeleting = this.service.isDeleting;

  async ngOnInit() {
    try {
      await this.service.get();
    } catch (error) {
      //  TODO: handle error
      console.error(error);
    }
  }

  showRecordForm(record?: Partial<DataType>) {
    if (record) {
      this.recordForm.setValues(record);
    } else {
      this.recordForm.reset();
    }

    this.recordToSave.set(record);
    this.recordFormDialog.show();
  }

  showDeletePrompt(record: DataType) {
    this.recordToDelete.set(record);
    this.deletePromptDialog.show();
  }

  async saveRecord(data: Partial<DataType>) {
    const recordToSave = this.recordToSave();

    let savedRecord;
    try {
      if (recordToSave) {
        const id = this.getId(recordToSave);
        savedRecord = await this.service.edit(id, data);
      } else {
        savedRecord = await this.service.create(data);
      }
    } catch (error) {
      //  TODO: handle error
      console.error(error);
      return;
    }

    this.recordFormDialog.hide();
    this.recordForm.reset();
    this.service.get();

    return savedRecord;
  }

  async deleteRecord() {
    const record = this.recordToDelete();
    if (!record) {
      return;
    }

    const id = this.getId(record);
    if (!id) {
      return;
    }

    try {
      await this.service.delete(id);
    } catch (error) {
      //  TODO: handle error
      console.error(error);
      return;
    }

    this.deletePromptDialog.hide();
    this.service.get();
  }
}
