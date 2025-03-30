import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SplitwiseService {
  private token: string | null = null;

  constructor(private http: HttpClient) {}

  // Step 1: Redirect user to Splitwise authorization URL
  splitwiseAuthorization(): void {
    const clientId = environment.splitWiseClientId;
    const redirectUri = 'http://localhost:8100/profile/'; // Ensure this matches your Splitwise redirect URI
    const authUrl = `https://secure.splitwise.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}`;

    window.location.href = authUrl; // Redirect the user to Splitwise OAuth URL
  }

  // Step 2: Exchange authorization code for access token
  async exchangeCodeForToken(authCode: string): Promise<any> {
    try {
      const tokenUrl = 'https://secure.splitwise.com/oauth/token';
      const body = new URLSearchParams({
        code: authCode,
        client_id: environment.splitWiseClientId,
        client_secret: environment.splitWiseClientSecret,
        redirect_uri: 'http://localhost:8100/profile/',
        grant_type: 'authorization_code',
      }).toString();

      const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      });

      // Log the details to inspect
      console.log(tokenUrl, body, headers, 'Checking details -----------');

      // Make the HTTP POST request
      const response = await lastValueFrom(
        this.http.post(tokenUrl, body, { headers })
      );

      console.log('Token Response:', response);

      return response;
    } catch (err) {
      console.error('Error exchanging code for token:', err);
      throw new Error('Failed to exchange code for token');
    }
  }

  async fetchUserExpenses(): Promise<any> {
    try {
      const token = this.getToken(); // Get the access token stored in your service

      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      const response = await lastValueFrom(
        this.http.get('https://secure.splitwise.com/api/v3.0/get_expenses', {
          headers,
        })
      );

      console.log('User Expenses:', response);

      return response;
    } catch (err) {
      console.error('Error fetching expenses:', err);
      throw new Error('Failed to fetch user expenses');
    }
  }
  // Step 4: Set the token in the service
  setToken(token: string): void {
    this.token = token;
  }

  // Step 5: Get the token (for internal usage)
  getToken(): string | null {
    return this.token;
  }
}
