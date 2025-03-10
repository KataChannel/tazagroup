import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import * as faceapi from 'face-api.js';
@Component({
  selector: 'app-facecomparison',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './facecomparison.component.html',
  styleUrl: './facecomparison.component.scss'
})
export class FacecomparisonComponent {
  comparisonResult!: string;
  image1:any
  image2:any
  detections1:any
  detections2:any
  isShowImage2:boolean=false
  ngOnInit() {
    Promise.all([
      faceapi.nets.faceRecognitionNet.loadFromUri('/assets/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models'),
      faceapi.nets.ssdMobilenetv1.loadFromUri('/assets/models'),
    ]);
  }

  async onImageUpload1(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
          this.image1 = await faceapi.bufferToImage(input.files[0]);   
          this.detections1 = await faceapi
          .detectSingleFace(this.image1)
          .withFaceLandmarks().withFaceDescriptor();
          console.log(this.detections1);   
          if(this.detections1?.hasOwnProperty('detection')){
            console.log("load finish");
            
            this.isShowImage2 = true
          }
    } else {
      console.error('No file selected');
    }
  }
  async onImageUpload2(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      console.log(input.files);
          this.image2 = await faceapi.bufferToImage(input.files[0]);   
          this.detections2 = await faceapi
          .detectSingleFace(this.image2)
          .withFaceLandmarks()
          .withFaceDescriptor();
          console.log(this.detections2);
    } else {
      console.error('No file selected');
    }
  }

  async onImageUpload(event: any) {
    const imageElement = this.image1.nativeElement;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];      
      if (file) {
       const reader = new FileReader();
        reader.onload = (e: any) => {
          imageElement.src = e.target.result as string;
        };
        reader.readAsDataURL(file);        
      }
    } else {
      console.error('No file selected');
    }
  }

  async compareFaces() {
    const descriptions1 = await faceapi
      .detectAllFaces(this.image1.nativeElement)
      .withFaceLandmarks()
      .withFaceDescriptors();
    const descriptions2 = await faceapi
      .detectAllFaces(this.image2.nativeElement)
      .withFaceLandmarks()
      .withFaceDescriptors();
      console.log(descriptions1);
      console.log(descriptions2);
    if (descriptions1.length == 0 || descriptions2.length == 0) {
      this.comparisonResult = 'Không tìm thấy khuôn mặt trong một hoặc cả hai ảnh';
      return;
    }

    // const bestMatch = faceapi.FaceMatcher.findBestMatch(descriptions1[0].descriptor, descriptions2);
    // Create a FaceMatcher instance
    const labeledFaceDescriptors = [
      new faceapi.LabeledFaceDescriptors('person1', [this.detections1[0].descriptor]) // Assuming the first face in image1 is the reference
    ];
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

    const bestMatch = faceMatcher.findBestMatch(this.detections2[0].descriptor); // Assuming the first face in image2 is the one to compare
    if (bestMatch.distance < 0.6) {
      this.comparisonResult = 'Faces match!';
    } else {
      this.comparisonResult = 'Faces do not match.';
    }
  }
}