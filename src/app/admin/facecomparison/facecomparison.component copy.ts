// import { Component, ElementRef, ViewChild } from '@angular/core';
// import { MatButtonModule } from '@angular/material/button';
// import { MatInputModule } from '@angular/material/input';
// import * as faceapi from 'face-api.js';
// @Component({
//   selector: 'app-facecomparison',
//   standalone: true,
//   imports: [
//     MatInputModule,
//     MatButtonModule
//   ],
//   templateUrl: './facecomparison.component.html',
//   styleUrl: './facecomparison.component.scss'
// })
// export class FacecomparisonComponent {
//   @ViewChild('image1') image1!: ElementRef<HTMLImageElement>;
//   @ViewChild('image2') image2!: ElementRef<HTMLImageElement>;
//   comparisonResult!: string;
//   detections1:any
//   detections2:any
//   ngOnInit() {
//     Promise.all([
//       faceapi.nets.faceRecognitionNet.loadFromUri('/assets/models'),
//       faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models'),
//       faceapi.nets.ssdMobilenetv1.loadFromUri('/assets/models')
//     ]).then(() => {
//       // Models are loaded and ready
//     });
//   }

//   async onImageUpload1(event: any) {
//     const input = event.target as HTMLInputElement;
//     if (input.files && input.files.length > 0) {
//           const image1 = await faceapi.bufferToImage(input.files[0]);   
//           this.detections1 = await faceapi
//           .detectAllFaces(image1)
//           .withFaceLandmarks()
//           .withFaceDescriptors();
//           console.log(this.detections1);
//     } else {
//       console.error('No file selected');
//     }
//   }
//   async onImageUpload2(event: any) {
//     const input = event.target as HTMLInputElement;
//     if (input.files && input.files.length > 0) {
//       console.log(input.files);
      
//           const image2 = await faceapi.bufferToImage(input.files[0]);   
//           this.detections2 = await faceapi
//           .detectAllFaces(image2)
//           .withFaceLandmarks()
//           .withFaceDescriptors();
//           console.log(this.detections2);
//     } else {
//       console.error('No file selected');
//     }
//   }
//   // async onImageUpload(event: any, imageRef: 'image1' | 'image2') {
//   //   if (this.reader) {
//   //     this.reader.abort(); // Cancel the previous read if it's still ongoing
//   //   }
//   //   const imageElement = this[imageRef].nativeElement;
//   //   const input = event.target as HTMLInputElement;
//   //   if (input.files && input.files.length > 0) {
//   //     const file = input.files[0];      
//   //     if (file) {
//   //       this.reader = new FileReader();
//   //       this.reader.onload = (e: any) => {
//   //         imageElement.src = e.target.result as string;
//   //         this.reader = null;
//   //       };
//   //       this.reader.readAsDataURL(file);        
//   //     }
//   //   } else {
//   //     console.error('No file selected');
//   //   }
//   // }

//   async compareFaces() {
//     // const descriptions1 = await faceapi
//     //   .detectAllFaces(this.image1.nativeElement)
//     //   .withFaceLandmarks()
//     //   .withFaceDescriptors();
//     // const descriptions2 = await faceapi
//     //   .detectAllFaces(this.image2.nativeElement)
//     //   .withFaceLandmarks()
//     //   .withFaceDescriptors();
//       console.log(this.detections1);
//       console.log(this.detections2);
//     if (this.detections1.length == 0 || this.detections2.length == 0) {
//       this.comparisonResult = 'Không tìm thấy khuôn mặt trong một hoặc cả hai ảnh';
//       return;
//     }

//     // const bestMatch = faceapi.FaceMatcher.findBestMatch(descriptions1[0].descriptor, descriptions2);
//     // Create a FaceMatcher instance
//     const labeledFaceDescriptors = [
//       new faceapi.LabeledFaceDescriptors('person1', [this.detections1[0].descriptor]) // Assuming the first face in image1 is the reference
//     ];
//     const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

//     const bestMatch = faceMatcher.findBestMatch(this.detections2[0].descriptor); // Assuming the first face in image2 is the one to compare
//     if (bestMatch.distance < 0.6) {
//       this.comparisonResult = 'Faces match!';
//     } else {
//       this.comparisonResult = 'Faces do not match.';
//     }
//   }
// }