import { Component, ElementRef, ViewChild } from '@angular/core';
import { FaceService } from '../../services/face.service';

@Component({
  selector: 'app-webcam',
  templateUrl: './webcam.component.html',
  styleUrl: './webcam.component.css',
})
export class WebcamComponent {
  @ViewChild('video', { static: true })
  videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('response', { static: true })
  responseElement!: ElementRef<HTMLDivElement>;
  constructor(private faceService: FaceService) {}

  private stream: MediaStream | null = null;
  userId: number = 0;
  ngOnInit(): void {
    // this.initializeWebcam();
    let myUser = localStorage.getItem('user');
    if (myUser) {
      this.userId = JSON.parse(myUser).userId;
    }
    console.log(this.userId);
  }

  ngOnDestroy(): void {
    this.stopWebcam();
  }

  private initializeWebcam(): void {
    const video: HTMLVideoElement | null = document.getElementById(
      'video'
    ) as HTMLVideoElement;

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream: MediaStream) => {
          if (video) {
            video.srcObject = stream;
            this.stream = stream;
          }
        })
        .catch((error: any) => {
          console.error('Error accessing webcam: ', error);
        });
    } else {
      console.error('getUserMedia not supported in this browser.');
    }
  }

  private stopWebcam(): void {
    if (this.stream) {
      const tracks = this.stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
  }
  // user: User;

  // userId: number = this.user.userId;

  async captureImage(): Promise<void> {
    const video = this.videoElement.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageBlob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/jpeg')
      );

      if (imageBlob) {
        const formData = new FormData();
        formData.append('file', imageBlob, 'capture.jpg');
        formData.append('employee_id', this.userId.toString());
        this.faceService.captureImage(formData).subscribe(
          (data) => {
            console.log(data)
            this.responseElement.nativeElement.innerText = data.status;
          },
          (error) => {
            console.error('Error capturing image:', error);
          }
        );
      }
    }
  }

  async saveEncodings(): Promise<void> {
    const formData = new FormData();
    formData.append('employee_id', this.userId.toString());

    this.faceService.saveEncodings(formData).subscribe(
      (data) => {
        this.responseElement.nativeElement.innerText = data.status;
      },
      (error) => {
        console.error('Error saving encodings:', error);
      }
    );
  }
}
