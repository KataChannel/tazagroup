import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, map, Observable, of, switchMap, take } from 'rxjs';
import { environment } from '../../environments/environment';
import { io, Socket } from 'socket.io-client';
@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  private _conversations: BehaviorSubject<any[] | null> = new BehaviorSubject<any[] | null>(null);
  private _conversation: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  private _totalCount: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  get conversations$(): Observable<any[] | null> {
    return this._conversations.asObservable();
  }
  get conversation$(): Observable<any | null> {
    return this._conversation.asObservable();
  }
  get totalCount$(): Observable<any | null> {
    return this._totalCount.asObservable();
  }
  private socket: Socket;
  constructor() {
    this.socket = io(environment.APIURL);
  }

  conversations = signal<any[]>([]);

  joinChat(idConversation: string) {
    this.socket.emit('joinChat', idConversation);
  }

  sendMessage(data:any) {
    this.socket.emit('sendMessage', data);
  }

  onMessage(callback: (message: any) => void) {
    this.socket.on('receiveMessage', callback);
  }

  async getDrive() {
    try {
      const options = {
        method:'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/1sofaJI5e9s6TMIvDTk57HktSsumlXPjFSqmwkGD-9zU/values/Thang1?key=AIzaSyCWh10EgrjVBm8qKpnsGOgXrIsT5uqroMc`,options);
    const data = await response.json();
          //this._conversations.next(data)
    return data;
      } catch (error) {
          return console.error(error);
      }
  }
  async getAllConversation() {
    try {
      const options = {
        method:'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };
          const response = await fetch(`${environment.APIURL}/conversation`,options);
          const data = await response.json();
          this._conversations.next(data)
          return data;
      } catch (error) {
          return console.error(error);
      }
  }
  async getConversationBySlug(Slug:any) {
    try {
      const options = {
        method:'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };
          const response = await fetch(`${environment.APIURL}/conversation/findslug/${Slug}`,options);
          const data = await response.json();
          this._conversation.next(data)
          return data;
      } catch (error) {
          return console.error(error);
      }
  }
  async getConversationByid(id:any) {
    try {
      const options = {
        method:'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };
          const response = await fetch(`${environment.APIURL}/conversation/findid/${id}`,options);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          this._conversation.next(data)
          return data;
      } catch (error) {
          return console.error(error);
      }
  }
  async SearchConversation(SearchParams:any) {
    try {
      const options = {
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(SearchParams),
      };
          const response = await fetch(`${environment.APIURL}/conversation/search`,options);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          this._conversations.next(data.items)
          this._totalCount.next(data.totalCount)
          return data;
      } catch (error) {
          return console.error(error);
      }
  }
  async CreateConversation(item:any) {
    try {
        const options = {
            method:'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(item),
          };
          const response = await fetch(`${environment.APIURL}/conversation`, options);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          console.log(data);

          return data
      } catch (error) {
          return console.error(error);
      }
  }
  async SyncConversation(item:any) {
    try {
        const options = {
            method:'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(item),
          };
          const response = await fetch(`${environment.APIURL}/conversation/sync`, options);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          console.log(data);

          return data
      } catch (error) {
          return console.error(error);
      }
  }
  async UpdateConversation(item:any) {
    const conversations:any = await this.conversations$.pipe(take(1)).toPromise();
    try {
        const options = {
            method:'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(item),
          };
          const response = await fetch(`${environment.APIURL}/conversation/${item.id}`, options);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          this._conversation.next(data)
          const updateConversations = conversations.map((v:any) =>
            v.id === data.id ? data : v
          );
          this._conversations.next(updateConversations);
          return data;
      } catch (error) {
          return console.error(error);
      }
  }

  async DeleteConversation(item:any) {
    try {
        const options = {
            method:'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          };
          const response = await fetch(`${environment.APIURL}/conversation/${item.id}`, options);
          return await response.json();
      } catch (error) {
          return console.error(error);
      }
  }
}
