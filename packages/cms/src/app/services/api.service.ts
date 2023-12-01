// TODO: HANDLE ERRORS!

import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';

const jsonContentType = { 'Content-Type': 'application/json' };

const baseUrl = environment.apiUrl;

type RecordsResponse<T = unknown> = { records: T[]; totalRecords: number };
type RecordResponse<T = unknown> = { record: T };

@Injectable({
  providedIn: 'root',
})
export class ApiService<RecordType = unknown, FormDataType = unknown> {
  private url = new URL('', baseUrl).toString();

  records = signal<RecordType[]>([]);
  totalRecords = signal(0);
  isLoading = signal(false);

  savedRecord = signal<RecordType | undefined>(undefined);
  isSaving = signal(false);

  deletedRecord = signal<RecordType | undefined>(undefined);
  isDeleting = signal(false);

  setBasePath(path: string) {
    const _path = path.startsWith('/') ? path.substring(1) : path;
    this.url = new URL(_path, baseUrl).toString();
  }

  async get() {
    this.isLoading.set(true);
    try {
      const response = await fetch(this.url);
      const { records, totalRecords }: RecordsResponse<RecordType> = await response.json();
      this.isLoading.set(false);
      this.records.set(records);
      this.totalRecords.set(totalRecords);
    } catch (error) {
      //  TODO: handle error
      console.error(error);
    }
  }

  async create(data: FormDataType) {
    const formData = this.mapFormData(data);

    this.isSaving.set(true);
    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: {
          ...jsonContentType,
        },
        body: JSON.stringify(formData),
      });
      const { record }: RecordResponse<RecordType> = await response.json();
      this.isSaving.set(false);
      this.savedRecord.set(record);
      this.get();
    } catch (error) {
      //  TODO: handle error
      console.error(error);
    }
  }

  async edit(id: string, data: FormDataType) {
    const url = `${this.url}/${id}`;
    const formData = this.mapFormData(data);

    this.isSaving.set(true);
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          ...jsonContentType,
        },
        body: JSON.stringify(formData),
      });
      const { record }: RecordResponse<RecordType> = await response.json();
      this.isSaving.set(false);
      this.savedRecord.set(record);
      this.get();
    } catch (error) {
      // TODO: handle error
      console.error(error);
    }
  }

  async delete(id: string) {
    const url = `${this.url}/${id}`;

    this.isDeleting.set(true);
    try {
      const response = await fetch(url, { method: 'DELETE' });
      const { record }: RecordResponse<RecordType> = await response.json();
      this.isDeleting.set(false);
      this.deletedRecord.set(record);
      this.get();
    } catch (error) {
      // TODO: handle error
      console.error(error);
    }
  }

  /* This is meant to be overridden by child classes */
  protected mapFormData(data: unknown) {
    return data;
  }
}
