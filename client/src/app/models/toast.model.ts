interface Toast {
  position: 'top' | 'bottom';
  message: string;
  type: 'success' | 'error' | 'info';
}

export default Toast;
