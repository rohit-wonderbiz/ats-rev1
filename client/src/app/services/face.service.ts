import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import FaceDetectionResponse from '../models/detection.model';

@Injectable({
  providedIn: 'root',
})
export class FaceService {
  private baseURI = 'http://192.168.29.191:8000';

  constructor(private http: HttpClient) {}

  captureImage(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseURI}/capture-image/`, formData);
  }

  saveEncodings(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseURI}/save-encoding/`, formData);
  }

  getCameraType(): Observable<'IN' | 'OUT'> {
    return this.http.get<'IN' | 'OUT'>(`${this.baseURI}/camera-type`);
  }

  markAttendance(imageBlob: Blob): Observable<FaceDetectionResponse> {
    const formData = new FormData();
    formData.append('file', imageBlob, 'capture.jpg');
    return this.http.post<FaceDetectionResponse>(
      `${this.baseURI}/mark-attendance/`,
      formData,
      {
        responseType: 'json' as 'json',
      }
    );
  }
}
