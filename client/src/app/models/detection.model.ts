import ReponseUser from './respose.model';

interface FaceDetectionResponse {
  attendance: ReponseUser[];
  image_base64: string;
  attendanceTime: string;
}

export default FaceDetectionResponse;
