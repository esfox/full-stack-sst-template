import { signal } from '@angular/core';
import { environment } from '../../environments/environment';

const baseUrl = environment.apiUrl;

export type RecordsResponse = { records: unknown[]; totalRecords: number };
export type RecordResponse = { record: unknown };

export class ApiService<DataType = unknown> {
  protected url = new URL('', baseUrl).toString();
  protected baseUrl = this.url;
  private dataMapping: { apiField: string; mappedField: keyof DataType }[] = [];

  records = signal<DataType[]>([]);
  record = signal<DataType | undefined>(undefined);
  totalRecords = signal(0);
  isLoading = signal(false);

  recordToSave = signal<Partial<DataType> | undefined>(undefined);
  savedRecord = signal<DataType | undefined>(undefined);
  isSaving = signal(false);

  recordToDelete = signal<DataType | undefined>(undefined);
  deletedRecord = signal<DataType | undefined>(undefined);
  isDeleting = signal(false);

  constructor(options?: {
    basePath?: string;
    dataMapping?: { apiField: string; mappedField: keyof DataType }[];
  }) {
    const { basePath, dataMapping } = options ?? {};

    let path = '/';
    if (basePath) {
      path = basePath.startsWith('/') ? basePath.substring(1) : basePath;
    }

    this.url = new URL(path, baseUrl).toString();
    this.dataMapping = dataMapping ?? [];
  }

  protected async fetch(url: string, options?: RequestInit) {
    if (options?.method && ['POST', 'PATCH', 'PUT'].includes(options.method)) {
      options.headers = {
        'Content-Type': 'application/json',
        ...(options?.headers ?? {}),
      };
    }

    const inputUrl = new URL(url, baseUrl).toString();
    const response = await fetch(inputUrl, {
      credentials: 'include',
      ...options,
    });

    if (response.status === 401) {
      const siteUrl = new URL(window.location.href).origin;
      window.location.replace(new URL('/login', siteUrl));
    }

    return response;
  }

  protected async fetchWithBody(url: string, method: string, body: unknown) {
    return this.fetch(url, {
      method,
      body: JSON.stringify(body),
    });
  }

  async get(id?: string) {
    this.isLoading.set(true);

    if (id) {
      const response = await this.fetch(`${this.url}/id`);
      const { record }: RecordResponse = await response.json();
      const data = this.mapFromApi(record);
      this.record.set(data);
    } else {
      const response = await this.fetch(this.url);
      const { records, totalRecords }: RecordsResponse = await response.json();
      const data = records.map(data => this.mapFromApi(data));
      this.records.set(data);
      this.totalRecords.set(totalRecords);
    }

    this.isLoading.set(false);
  }

  async create(data: Partial<DataType>) {
    const formData = this.mapToApi(data);

    this.isSaving.set(true);

    const response = await this.fetch(this.url, {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    const { record }: RecordResponse = await response.json();
    const createdRecord = record;

    const mappedData = this.mapFromApi(createdRecord);
    this.isSaving.set(false);
    this.savedRecord.set(mappedData);

    return mappedData;
  }

  async edit(id: string, data: Partial<DataType>) {
    const url = `${this.url}/${id}`;
    const formData = this.mapToApi(data);

    this.isSaving.set(true);

    const response = await this.fetch(url, {
      method: 'PATCH',
      body: JSON.stringify(formData),
    });
    const { record }: RecordResponse = await response.json();
    const editedRecord = record;

    const mappedData = this.mapFromApi(editedRecord);

    this.isSaving.set(false);
    this.savedRecord.set(mappedData);

    return mappedData;
  }

  async delete(id: string) {
    const url = `${this.url}/${id}`;

    this.isDeleting.set(true);

    const response = await this.fetch(url, { method: 'DELETE' });
    const { record }: RecordResponse = await response.json();
    const mappedData = this.mapFromApi(record);

    this.isDeleting.set(false);
    this.deletedRecord.set(mappedData);

    return mappedData;
  }

  mapFromApi(data: any) {
    const mappedData: any = {};
    for (const { apiField, mappedField } of this.dataMapping) {
      if (data[apiField]) {
        mappedData[mappedField] = data[apiField];
      }
    }

    return mappedData as DataType;
  }

  mapToApi(data: Partial<DataType>) {
    const mappedData: any = {};
    for (const { apiField, mappedField } of this.dataMapping) {
      if (data[mappedField]) {
        mappedData[apiField] = data[mappedField];
      }
    }

    return mappedData;
  }
}
