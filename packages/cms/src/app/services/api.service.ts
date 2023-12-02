// TODO: HANDLE ERRORS!
import { signal } from '@angular/core';
import { environment } from '../../environments/environment';

const jsonContentType = { 'Content-Type': 'application/json' };

const baseUrl = environment.apiUrl;

type RecordsResponse = { records: unknown[]; totalRecords: number };
type RecordResponse = { record: unknown };

export class ApiService<DataType = unknown> {
  private url = new URL('', baseUrl).toString();
  private dataMapping: { apiField: string; mappedField: keyof DataType }[] = [];

  records = signal<DataType[]>([]);
  totalRecords = signal(0);
  isLoading = signal(false);

  savedRecord = signal<DataType | undefined>(undefined);
  isSaving = signal(false);

  deletedRecord = signal<DataType | undefined>(undefined);
  isDeleting = signal(false);

  constructor(options: {
    basePath: string;
    dataMapping?: { apiField: string; mappedField: keyof DataType }[];
  }) {
    const { basePath, dataMapping } = options;

    const _path = basePath.startsWith('/') ? basePath.substring(1) : basePath;
    this.url = new URL(_path, baseUrl).toString();

    if (dataMapping) {
      this.dataMapping = dataMapping;
    }
  }

  async get() {
    this.isLoading.set(true);
    try {
      const response = await fetch(this.url);
      const { records, totalRecords }: RecordsResponse = await response.json();
      const data = records.map(data => this.mapFromApi(data));

      this.isLoading.set(false);
      this.records.set(data);
      this.totalRecords.set(totalRecords);
    } catch (error) {
      //  TODO: handle error
      console.error(error);
    }
  }

  async create(data: Partial<DataType>) {
    const formData = this.mapToApi(data);

    this.isSaving.set(true);
    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: {
          ...jsonContentType,
        },
        body: JSON.stringify(formData),
      });
      const { record }: RecordResponse = await response.json();
      const data = this.mapFromApi(record);

      this.isSaving.set(false);
      this.savedRecord.set(data);
      this.get();
    } catch (error) {
      //  TODO: handle error
      console.error(error);
    }
  }

  async edit(id: string, data: Partial<DataType>) {
    const url = `${this.url}/${id}`;
    const formData = this.mapToApi(data);

    this.isSaving.set(true);
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          ...jsonContentType,
        },
        body: JSON.stringify(formData),
      });
      const { record }: RecordResponse = await response.json();
      const data = this.mapFromApi(record);

      this.isSaving.set(false);
      this.savedRecord.set(data);
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
      const { record }: RecordResponse = await response.json();
      const data = this.mapFromApi(record);

      this.isDeleting.set(false);
      this.deletedRecord.set(data);
      this.get();
    } catch (error) {
      // TODO: handle error
      console.error(error);
    }
  }

  private mapFromApi(data: any) {
    const mappedData: any = {};
    for (const { apiField, mappedField } of this.dataMapping) {
      if (data[apiField]) {
        mappedData[mappedField] = data[apiField];
      }
    }

    return mappedData as DataType;
  }

  private mapToApi(data: Partial<DataType>) {
    const mappedData: any = {};
    for (const { apiField, mappedField } of this.dataMapping) {
      if (data[mappedField]) {
        mappedData[apiField] = data[mappedField];
      }
    }

    return mappedData;
  }
}
