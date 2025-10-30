// src/hooks/useIPFS.ts
import { useState } from 'react';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

interface IPFSResult {
  status: UploadStatus;
  error: string | null;
  ipfsHash: string | null;
  uploadFile: (file: File) => Promise<string | null>;
}

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_API_SECRET = import.meta.env.VITE_PINATA_API_SECRET;

export const useIPFS = (): IPFSResult => {
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [ipfsHash, setIpfsHash] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<string | null> => {
    setStatus('uploading');
    setError(null);
    setIpfsHash(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_API_SECRET,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload to Pinata: ${response.statusText}`);
      }

      const result = await response.json();
      const hash = result.IpfsHash;

      setIpfsHash(hash);
      setStatus('success');
      return hash;

    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred during IPFS upload.";
      console.error(errorMessage);
      setError(errorMessage);
      setStatus('error');
      return null;
    }
  };

  return { status, error, ipfsHash, uploadFile };
};