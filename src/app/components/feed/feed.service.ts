import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class FeedService {
  constructor(private http: HttpClient) { }

  getPosts(
    pageNumber = 1, 
    pageSize = 9,
    sortBy?: string,
    searchQuery?: string
  ): Observable<any> {
    let params: any = new HttpParams();
    params = params.append('currentPage', pageNumber);
    params = params.append('pageSize', pageSize);

    if (sortBy) {
      params = params.append('sortBy', sortBy);
      params = params.append('sortOrder', 'asc');
    }
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.http.get(`${environment.baseUrl}/api/post`, { observe: 'response', params: params });
  }
}