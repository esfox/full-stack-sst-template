// TODO: HANDLE ERRORS!
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
    if (options?.method && ['POST', 'PATCH'].includes(options.method)) {
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

  async get(id?: string) {
    this.isLoading.set(true);

    try {
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
    } catch (error) {
      //  TODO: handle error
      console.error(error);
    }
  }

  async create(data: Partial<DataType>) {
    const formData = this.mapToApi(data);

    this.isSaving.set(true);
    try {
      const response = await this.fetch(this.url, {
        method: 'POST',
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
      const response = await this.fetch(url, {
        method: 'PATCH',
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
      const response = await this.fetch(url, { method: 'DELETE' });
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

  protected mapFromApi(data: any) {
    const mappedData: any = {};
    for (const { apiField, mappedField } of this.dataMapping) {
      if (data[apiField]) {
        mappedData[mappedField] = data[apiField];
      }
    }

    return mappedData as DataType;
  }

  protected mapToApi(data: Partial<DataType>) {
    const mappedData: any = {};
    for (const { apiField, mappedField } of this.dataMapping) {
      if (data[mappedField]) {
        mappedData[apiField] = data[mappedField];
      }
    }

    return mappedData;
  }
}
