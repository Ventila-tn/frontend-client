import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LogEntryRequest } from '../models/ecommerce.models';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { filter, retry } from 'rxjs';
import { environment } from '../../../environments/environment';

function isNavigationEnd(event: RouterEvent): event is NavigationEnd {
  return event instanceof NavigationEnd;
}

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private apiUrl = `${environment.apiUrl}/logs`;

  constructor(private http: HttpClient, private router: Router) {
    console.log('🚀 LogService initialisé');
    this.setupNavigationLogging();
    this.setupErrorLogging();
  }

  /**
   * Nettoie les données en enlevant les chaînes base64 volumineuses (comme les images)
   */
  private sanitizeData(data: any): any {
    if (data === null || data === undefined) {
      return data;
    }

    if (typeof data === 'string') {
      // Vérifie si c'est une chaîne base64 d'image
      if (data.startsWith('data:image')) {
        // Extrait juste le type et le nom si disponible, sinon indique que c'est une image
        return '[Image data]';
      }
      // Vérifie si c'est une longue chaîne base64 (généralement > 1000 caractères)
      if (data.length > 1000 && /^[A-Za-z0-9+/=]+$/.test(data)) {
        return '[Base64 data]';
      }
      return data;
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item));
    }

    if (typeof data === 'object') {
      const sanitized: any = {};
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          // Si la clé contient "image" ou "photo", on la traite spécialement
          if (key.toLowerCase().includes('image') || key.toLowerCase().includes('photo')) {
            const value = data[key];
            if (typeof value === 'string') {
              if (value.startsWith('data:image')) {
                sanitized[key] = '[Image data]';
              } else if (value.length > 1000) {
                sanitized[key] = '[Large data]';
              } else {
                sanitized[key] = value;
              }
            } else {
              sanitized[key] = this.sanitizeData(value);
            }
          } else {
            sanitized[key] = this.sanitizeData(data[key]);
          }
        }
      }
      return sanitized;
    }

    return data;
  }

  private setupNavigationLogging() {
    this.router.events.pipe(
      filter(isNavigationEnd)
    ).subscribe((event) => {
      console.log('📍 Navigation détectée:', event.url);
      this.log('PAGE_VIEW', `Page visitée: ${event.url}`, undefined, event.url);
    });
  }

  private setupErrorLogging() {
    const originalOnError = window.onerror;
    window.onerror = (message, source, lineno, colno, error) => {
      const errorDetails = {
        message: message as string,
        source,
        lineno,
        colno,
        stack: error?.stack
      };
      this.log('ERROR', `Erreur JavaScript: ${message}`, JSON.stringify(errorDetails, null, 2));
      if (originalOnError) {
        return originalOnError(message, source, lineno, colno, error);
      }
      return false;
    };

    window.addEventListener('unhandledrejection', (event) => {
      const errorDetails = {
        reason: event.reason?.toString(),
        stack: event.reason?.stack
      };
      this.log('ERROR', `Promise non gérée: ${event.reason}`, JSON.stringify(errorDetails, null, 2));
    });
  }

  log(logType: string, message: string, details?: any, pageUrl?: string) {
    let sanitizedDetails: string | undefined;
    if (details !== undefined) {
      const sanitized = this.sanitizeData(details);
      sanitizedDetails = typeof sanitized === 'string' ? sanitized : JSON.stringify(sanitized, null, 2);
    }

    const request: LogEntryRequest = {
      logType,
      message,
      details: sanitizedDetails,
      userAgent: navigator.userAgent,
      pageUrl: pageUrl || this.router.url
    };
    console.log('📤 Tentative d\'envoi du log:', request);
    
    this.http.post(this.apiUrl, request)
      .pipe(retry(2))
      .subscribe({
        next: (res) => console.log('✅ Log envoyé avec succès:', res),
        error: (err: HttpErrorResponse) => {
          console.error('❌ Erreur lors de l\'envoi du log:', err);
          console.error('Status:', err.status);
          console.error('Message:', err.message);
        }
      });
  }
}
