import { CommonModule } from '@angular/common';
import { Component, InjectionToken, ViewChild, effect, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { DialogComponent } from '../dialog/dialog.component';
import { PromptDialogComponent } from '../prompt-dialog/prompt-dialog.component';

export const injectionTokens = {
  service: new InjectionToken<ApiService>('service'),
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

  private service = inject<ApiService<DataType>>(injectionTokens.service);
  private getId = inject<(record: Partial<DataType>) => string>(injectionTokens.getId);

  records = this.service.records;
  isLoading = this.service.isLoading;

  recordToSave = this.service.recordToSave;
  isSaving = this.service.isSaving;

  recordToDelete = this.service.recordToDelete;
  isDeleting = this.service.isDeleting;

  constructor() {
    effect(() => {
      const savedRecord = this.service.savedRecord();
      if (this.recordFormDialog.shown && savedRecord) {
        this.recordFormDialog.hide();
      }

      const deletedRecord = this.service.deletedRecord();
      if (this.deletePromptDialog.shown && deletedRecord) {
        this.deletePromptDialog.hide();
      }
    });
  }

  async ngOnInit() {
    await this.service.get();
  }

  showRecordForm(record?: Partial<DataType>) {
    this.recordToSave.set(record);
    this.recordFormDialog.show();
  }

  showDeletePrompt(record: DataType) {
    this.recordToDelete.set(record);
    this.deletePromptDialog.show();
  }

  async saveRecord(data: DataType) {
    const recordToSave = this.recordToSave();
    if (recordToSave) {
      const id = this.getId(recordToSave);
      await this.service.edit(id, data);
    } else {
      await this.service.create(data);
    }
  }

  async deleteRecord() {
    const record = this.recordToDelete();
    if (!record) {
      return;
    }

    const id = this.getId(record);
    if (id) {
      await this.service.delete(id);
    }
  }
}
