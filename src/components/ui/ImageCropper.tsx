import React, { useState, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedImage: File) => void; // This will be File eventually
  onClose: () => void;
  aspectRatio: number;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  imageSrc,
  onCropComplete,
  onClose,
  aspectRatio,
}) => {
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropChange = useCallback((location: { x: number; y: number }) => {
    setCrop(location);
  }, []);

  const onZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  const onCropCompleteInternal = useCallback((croppedArea: Area, currentCroppedAreaPixels: Area) => {
    setCroppedAreaPixels(currentCroppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    // For now, just log the pixels.
    // Later, we'll use a utility function here to get the File object.
    console.log('Cropped Area Pixels:', croppedAreaPixels);
    if (croppedAreaPixels) {
      // Placeholder for calling the actual onCropComplete prop
      // For example:
      // const croppedImageFile = await cropImageUtility(imageSrc, croppedAreaPixels);
      // if (croppedImageFile) {
      //   onCropComplete(croppedImageFile);
      // }
    }
  }, [croppedAreaPixels, imageSrc, onCropComplete]);

  // Callbacks and UI will be added in the next steps

  return (
    <div className="image-cropper-overlay">
      <div className="cropper-container">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspectRatio}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropCompleteInternal}
        />
      </div>
      <div className="controls">
        <input
          type="range"
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          aria-labelledby="Zoom"
          onChange={(e) => {
            onZoomChange(Number(e.target.value));
          }}
          className="zoom-range"
        />
        <button onClick={showCroppedImage}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
      <style jsx>{`
        .image-cropper-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.75);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .cropper-container {
          position: relative;
          width: 90vw; /* Use viewport units for responsiveness */
          height: 70vh; /* Use viewport units for responsiveness */
          max-width: 500px;  /* Max size for larger screens */
          max-height: 400px; /* Max size for larger screens */
          background-color: #333;
        }
        .controls {
          display: flex;
          flex-direction: row; /* Align buttons side-by-side */
          align-items: center;
          padding: 10px;
          background-color: rgba(25,25,25,0.8); /* Darker, slightly transparent */
          border-radius: 8px;
          margin-top: 15px;
        }
        .controls input[type="range"] {
          width: 150px; /* Fixed width for slider */
          margin-right: 15px; /* Spacing between slider and buttons */
        }
        .controls button {
          margin: 0 5px; /* Margin between buttons */
          padding: 8px 15px;
          background-color: #007bff; /* Example primary color */
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
        }
        .controls button:hover {
          background-color: #0056b3; /* Darker shade on hover */
        }
        .controls button:last-child {
          background-color: #6c757d; /* Example secondary/cancel color */
        }
        .controls button:last-child:hover {
          background-color: #545b62; /* Darker shade for cancel on hover */
        }
      `}</style>
    </div>
  );
};

export default ImageCropper;
