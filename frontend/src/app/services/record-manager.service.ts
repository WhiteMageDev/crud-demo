import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Record } from '../components/add-record/record.model';
import { catchError, map, Observable, of } from 'rxjs';

const API = "http://localhost:8080/api/records";

@Injectable({
  providedIn: 'root'
})
export class RecordManager {

  constructor(private httpClient: HttpClient) { }

  getRecordById(id: number) {
    return this.httpClient.get<any>(`${API}/get/${id}`);
  }

  saveRecord(record: Record): Observable<Record> {
    return this.httpClient.post<Record>(`${API}/save`, record);
  }

  uploadFile(file: File): Observable<boolean> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.httpClient.post(`${API}/upload`, formData).pipe(
      map(() => true),
      catchError((error) => {
        throw error;
      })
    );
  }

  updateRecord(record: Record): Observable<Record> {
    return this.httpClient.put<Record>(`${API}/update/${record.id}`, record);
  }

  getRecords(page: number = 0, size: number = 5): Observable<any> {
    return this.httpClient.get<any>(`${API}?page=${page}&size=${size}`);
  }

  deleteRecord(index: number): Observable<boolean> {
    return this.httpClient.delete(`${API}/delete/${index}`).pipe(
      map(() => true),
      catchError((error) => {
        console.error(error);
        return [false];
      })
    );
  }

  deleteRecords(ids: number[]): Observable<boolean> {
    let params = new HttpParams();
    ids.forEach(id => {
      params = params.append('ids', id.toString());
    });
    console.log('Params:', params.toString());
    return this.httpClient.delete(`${API}/delete`, { params }).pipe(
      map(() => true),
      catchError((error) => {
        console.error(error);
        return [false];
      })
    );
  }

  getRecordsQuery(query: string, age: string, ageCondition: string, page: number, size: number): Observable<any> {
    let params = new HttpParams();
    if (query) {
      params = params.set('query', query.trim());
    }
    if (age) {
      params = params.set('age', age.trim());
    }
    if (ageCondition) {
      params = params.set('ageCondition', ageCondition);
    }
    if (page) {
      params = params.set('page', page);
    }
    if (size) {
      params = params.set('size', size);
    }
    return this.httpClient.get<any>(`${API}/search`, { params });
  }

}
