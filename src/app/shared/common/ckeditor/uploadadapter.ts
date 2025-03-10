import { UploadService } from "../../uploadfile/uploadfile.service";
import { GetImage } from "../../utils/shared.utils";
export class MyUploadAdapter {
  private loader: any;
  private type: any='local';
  private uploadService: UploadService;

  constructor(loader: any,type: any, uploadService: UploadService) {
    this.loader = loader;
    this.type = type;
    this.uploadService = uploadService;
  }

  upload() {
    return this.loader.file
      .then((file: File) => new Promise((resolve, reject) => {
        switch (this.type) {
          case 'local':
            this.uploadLocal(file, resolve, reject);
            break;
          case 'googledrive':
            this.uploadGoogleDrive(file, resolve, reject);
            break;
          default:
            reject('Invalid upload type');
            break;
        }
      }));
  }
  uploadLocal(file: File, resolve: any, reject: any) {
    this.uploadService.uploadlocal(file).then(
      (response) => {
        console.log(response);
        if (response && response.Lienket) {
          resolve({
            default: GetImage(response.Lienket),
            alt: 'Mô tả hình ảnh',
          });
        } else {
          reject(response.data);
        }
      },
      (error) => {
        reject(error);
      }
    );
  }
  uploadGoogleDrive(file: File, resolve: any, reject: any) {
    this.uploadService.uploadDriver(file).then(
      (response) => {
        if (response && response.Type == 'googledrive') {
          resolve({
            default: `https://drive.google.com/thumbnail?id=${response.fileId}`
            // default: `https://drive.google.com/uc?id=${response.fileId}`
          });
          
        } else {
          reject('No URL returned from server.');
        }
      },
      (error) => {
        reject(error);
      }
    );
  }

  abort() {
    // Handle abort if necessary
  }
}