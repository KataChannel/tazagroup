import { Injectable } from '@angular/core';
import { Observable, finalize } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { environment } from '../../../environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class UploadService {
  constructor(private storage: AngularFireStorage) { }
  async DeleteuploadDriver(data: any) {
    console.log(data);
    try {
      const response = await fetch(environment.APIURL + `/upload/${data.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json' // Assuming the API expects JSON data
        },
        body: JSON.stringify(data) 
       }) 
       if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();         
      return result;
      } catch (error) {
          return console.error(error);
      }
    // return this.http.delete(environment.APIURL + `/upload/${data.id}`,{ body: data }).pipe(
    //   map((res: any) => {
    //     if (res) {
    //       console.log(res);
    //       return res;
    //     }
    //   })
    // );
  }
  async uploadlocal(file: any,type:any="local",folder:any="unknown") {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = currentDate.getFullYear();
        const formattedDate = `${day}_${month}_${year}`;
        const requestOptions = {
          method: "POST",
          body: formData,
        };    
        const response = await fetch(environment.APIURL + `/upload/${folder}`,requestOptions) 
           if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
          const data = await response.json(); 
          console.log(data);            
          return data;
        } catch (error) {
            return console.error(error);
        }
  

    }







  async uploadDriver(file: any,type:any="googledrive") {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const currentDate = new Date();
      const day = String(currentDate.getDate()).padStart(2, '0');
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const year = currentDate.getFullYear();
      const formattedDate = `${day}_${month}_${year}`;
      if(type=="googledrive"){
        const response = await fetch(environment.APIURL + `/upload/googledrive?folderId=1aAvPsWRhjwgDjYulHkHLdEgXlk6694bc`, {
          method: 'POST',
          body: formData
         }) 
         if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();         
        return data;
      }else{
        return false;
        // const response = await fetch(environment.APIURL + `/upload/local?folder=${environment.pathServer}/${formattedDate}`, {
        //   method: 'POST',
        //   body: formData
        //  }) 
        //  if (!response.ok) {
        //   throw new Error(`HTTP error! status: ${response.status}`);
        // }
        // const data = await response.json();         
        // return data;
      }
      } catch (error) {
          return console.error(error);
      }

    // return this.http.post(environment.APIURL + `/upload/local?folder=${formattedDate}`, formData).pipe(
    //   map((data: any) => {
    //     if (data) {
    //       return data;
    //     }
    //   })
    // );
  }
  async uploadDonhang(file: any) {
    try {
      // const formData = new FormData();
      // formData.append('image', file);
      // console.log(formData);
      const response = await fetch(environment.APIURL + `/upload/image`, {
        method: 'POST',
        body: file
       }) 
       if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();         
      return data;
      } catch (error) {
          return console.error(error);
      }

    // return this.http.post(environment.APIURL + `/upload/local?folder=${formattedDate}`, formData).pipe(
    //   map((data: any) => {
    //     if (data) {
    //       return data;
    //     }
    //   })
    // );
  }


  // async uploadFirebase(file: File) {
  //   try {
  //     const filePath = `uploads/${file.name}`;
  //     const fileRef = this.storage.ref(filePath);
  //     const task = this.storage.upload(filePath, file);

  //     // Return the download URL
  //     return task.snapshotChanges().pipe(
  //     finalize(() => fileRef.getDownloadURL())
  //     );
  //   } catch (error) {
  //     console.error('Error uploading file to Firebase:', error);
  //     throw error;
  //   }
  // }
  async uploadFirebase(image: File, path: string='uploads'): Promise<any> {
    const storageRef = this.storage.ref(path);
    const uploadTask = this.storage.upload(path, image);
   return new Promise((resolve, reject) => {
     uploadTask.snapshotChanges().pipe(
       finalize(() => {
         storageRef.getMetadata().subscribe((result:any) => {
          console.log(result);
         }, (error:any) => {
           reject(error);
         });
         storageRef.getDownloadURL().subscribe((downloadURL:any) => {
           resolve({ url: downloadURL });
         }, (error:any) => {
           reject(error);
         });
       })
     ).subscribe();
   });
 }
  
}
