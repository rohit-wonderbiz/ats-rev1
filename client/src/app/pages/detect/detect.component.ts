import { Component, ElementRef, viewChild, ViewChild } from '@angular/core';
import { FaceService } from '../../services/face.service';

@Component({
  selector: 'app-detect',
  templateUrl: './detect.component.html',
  styleUrl: './detect.component.css',
})
export class DetectComponent {
  constructor(private attendanceService: FaceService) {}
  isDetected: boolean = false;
  isMarkAttendanceDisabled: boolean = false;
  private stream: MediaStream | null = null;
  @ViewChild('video', { static: true })
  videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('res', { static: true })
  resElement!: ElementRef<HTMLImageElement>;

  @ViewChild('display', { static: true })
  displayElement!: ElementRef<HTMLParagraphElement>;

  ngOnInit(): void {
    this.initializeWebcam();
    console.log('test');
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

  async markAttendance(): Promise<void> {
    const video: HTMLVideoElement = this.videoElement.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    this.isMarkAttendanceDisabled = true;
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageBlob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/jpeg')
      );
      if (imageBlob) {
        this.attendanceService.markAttendance(imageBlob).subscribe({
          next: (data) => {
            const imageUrl = `data:image/jpeg;base64,${data.image_base64}`;
            const image = new Image();
            image.src = imageUrl;
            if (this.resElement) {
              this.resElement.nativeElement.innerHTML = ''; // Clear previous content
              this.resElement.nativeElement.appendChild(image);
  
              // Include all names, including "Unknown"
              const attendedNames = data.face_names;
  
              this.displayElement.nativeElement.innerText = `Marked Attendance for ${attendedNames.join(
                ', '
              )} at ${data.attendanceTime}`;
              this.isDetected = true;
              setTimeout(() => {
                this.isDetected = false;
                this.isMarkAttendanceDisabled = false;
                this.displayElement.nativeElement.innerText = '';
              }, 4000);
            }
            console.log('Detected Faces:', data.face_names);
          },
          error: (error) => {
            console.error('Error marking attendance:', error);
          },
        });
      }
    }
  }
}