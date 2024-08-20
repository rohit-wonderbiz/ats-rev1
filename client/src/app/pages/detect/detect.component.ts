import { Component, ElementRef, viewChild, ViewChild } from '@angular/core';
import { FaceService } from '../../services/face.service';
import Toast from '../../models/toast.model';
import User from '../../models/user.model';
import ReponseUser from '../../models/respose.model';

// patch nodejs environment, we need to provide an implementation of
// HTMLCanvasElement and HTMLImageElement
@Component({
  selector: 'app-detect',
  templateUrl: './detect.component.html',
  styleUrl: './detect.component.css',
})
export class DetectComponent {
  constructor(private attendanceService: FaceService) {}
  isClose: boolean = false;
  isDetected: boolean = false;
  isMarkAttendanceDisabled: boolean = false;
  private stream: MediaStream | null = null;
  @ViewChild('video', { static: true })
  videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('res', { static: true })
  resElement!: ElementRef<HTMLImageElement>;

  @ViewChild('display', { static: true })
  displayElement!: ElementRef<HTMLParagraphElement>;
  users: ReponseUser[] = [];
  toast: Toast = {
    position: 'top',
    message: '',
    type: 'success',
  };

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
  onClose = () => {
    this.isClose = false;
  };
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
            console.log(data);
            const imageUrl = `data:image/jpeg;base64,${data.image_base64}`;
            const image = new Image();
            image.src = imageUrl;
            if (this.resElement) {
              this.resElement.nativeElement.innerHTML = '';
              this.resElement.nativeElement.appendChild(image);
              const attendedNames = data.attendance.map((a) => a.firstName);
              this.displayElement.nativeElement.innerText =
                attendedNames.length > 0
                  ? `Marked Attendance for ${attendedNames.join(', ')} at ${
                      data.attendance[0].attendanceLogTime
                    }`
                  : 'No attendance marked';
              this.isClose = true;
              this.toast.message =
                attendedNames.length > 0
                  ? `Marked Attendance for ${attendedNames.join(', ')} at ${
                      data.attendance[0].attendanceLogTime
                    }`
                  : 'No attendance marked';
              this.toast.position = 'top';
              this.toast.type = attendedNames.length > 0 ? 'success' : 'info';
              this.isDetected = true;
              this.isMarkAttendanceDisabled = false;
              this.users = data.attendance.map((d) => {
                return {
                  userId: d.userId,
                  firstName: d.firstName,
                  lastName: d.lastName,
                  email: d.email,
                  profilePic: d.profilePic,
                  designationName: '',
                  checkType: d.checkType,
                  attendanceLogTime: d.attendanceLogTime,
                  id: d.id,
                };
              });
              setTimeout(() => {
                this.isClose = false;
                this.isDetected = false;
                this.displayElement.nativeElement.innerText = '';
                this.users = [];
              }, 4000);
            }
          },
          error: (error) => {
            console.error('Error marking attendance:', error);
            this.isMarkAttendanceDisabled = false;
          },
        });
      }
    }
  }
}
