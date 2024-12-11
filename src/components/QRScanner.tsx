import React from 'react';
import Webcam from 'react-webcam';
import QrCode from 'react-qr-code';

interface QRScannerProps {
  onScan: (data: string) => void;
  onError?: (error: string) => void;
}

export function QRScanner({ onScan, onError }: QRScannerProps) {
  const webcamRef = React.useRef<Webcam>(null);
  const [isScanning, setIsScanning] = React.useState(true);

  React.useEffect(() => {
    let animationFrame: number;

    const scan = async () => {
      if (!isScanning || !webcamRef.current) return;

      try {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          // In a real implementation, we would use a QR code detection library
          // For now, we'll simulate scanning with a timeout
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Simulate successful scan
          const mockQRData = JSON.stringify({
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
          });
          
          onScan(mockQRData);
          setIsScanning(false);
        }
      } catch (error) {
        onError?.(error instanceof Error ? error.message : 'Failed to scan QR code');
      }

      animationFrame = requestAnimationFrame(scan);
    };

    scan();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isScanning, onScan, onError]);

  return (
    <div className="relative">
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="w-full rounded-lg"
        videoConstraints={{
          facingMode: 'environment',
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-48 h-48 border-2 border-white rounded-lg" />
      </div>
    </div>
  );
}