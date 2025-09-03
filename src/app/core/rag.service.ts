import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../../enviroment'

interface AskResponse {
  answer: string;
}

@Injectable({
  providedIn: 'root'
})
export class RagService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  ask(question: string): Observable<AskResponse> {
    return this.http.post<AskResponse>(`${this.api}/chat/ask`, { question });
  }

  improveText(question: string): Observable<AskResponse> {
    return this.http.post<AskResponse>(`${this.api}/chat/improve`, { question });
  }
}
