import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import User from '../../models/user.model';
import { FaceService } from '../../services/face.service';
import Toast from '../../models/toast.model';
// import * as canvas from 'canvas';
import * as faceapi from 'face-api.js';

@Component({
  selector: 'app-enrol',
  templateUrl: './enrol.component.html',
  styleUrl: './enrol.component.css',
})
export class EnrolComponent {
  detectedFace: number = 0;
  constructor(private router: Router, private faceService: FaceService) {}
  isClose: boolean = false;
  isEncodingDisabled: boolean = false;
  isCapturedDisabled: boolean = false;
  @ViewChild('video', { static: true })
  videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('response', { static: true })
  responseElement!: ElementRef<HTMLDivElement>;
  @Output() closeToast = new EventEmitter();
  private stream: MediaStream | null = null;

  res: string = '';
  toast: Toast = {
    position: 'top',
    message: '',
    type: 'success',
  };
  user: User = {
    userId: 0,
    firstName: '',
    lastName: '',
    designationName: '',
    email: '',
    profilePic: '',
  };
  private loadUser(): void {
    const userString = localStorage.getItem('user');
    if (!userString) {
      this.router.navigate(['/']);
      return;
    }
    try {
      const user = JSON.parse(userString) as User;
      this.user = user;
      console.log(this.user);
    } catch (e) {
      console.error('Error parsing user data from localStorage:', e);
      this.router.navigate(['/']);
    }
  }

  async ngOnInit() {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('assets/models'),
    ]).then((v) => {
      console.log(v);
      this.loadUser();
      this.initializeWebcam();
    });
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

            setInterval(async () => {
              const detections = await faceapi.detectAllFaces(
                video,
                new faceapi.TinyFaceDetectorOptions()
              );
              this.detectedFace = detections.length;
            }, 100);
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

  async captureImage(): Promise<void> {
    const video = this.videoElement.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    this.isCapturedDisabled = true;
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageBlob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/jpeg')
      );

      if (imageBlob) {
        const formData = new FormData();
        formData.append('file', imageBlob, 'capture.jpg');
        formData.append('employee_id', this.user.userId.toString());

        this.faceService.captureImage(formData).subscribe(
          (data) => {
            this.isClose = true;
            this.toast.message = 'Face captured';
            this.toast.position = 'top';
            this.toast.type = 'success';
            this.isCapturedDisabled = false;
            setTimeout(() => {
              this.isClose = false;
            }, 4000);
          },
          (error) => {
            console.error('Error capturing image:', error);
            this.isCapturedDisabled = false;
          }
        );
      }
    }
  }

  onClose = () => {
    this.isClose = false;
  };

  async saveEncodings(): Promise<void> {
    this.isEncodingDisabled = true;
    this.isCapturedDisabled = true;
    const formData = new FormData();
    formData.append('employee_id', this.user.userId.toString());

    this.faceService.saveEncodings(formData).subscribe(
      (data) => {
        this.isClose = true;
        this.toast.message = 'Encodings saved';
        this.toast.position = 'top';
        this.toast.type = 'success';
        console.log(this.toast);
        this.isCapturedDisabled = false;
        this.router.navigate(['/detect']);
        setTimeout(() => {
          this.isClose = false;
        }, 4000);
      },
      (error) => {
        console.error('Error saving encodings:', error);
        this.isCapturedDisabled = false;
      }
    );
  }
}
