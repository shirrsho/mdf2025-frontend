'use client';
import React, { createContext, useContext, useState } from 'react';

type VideoModalContextType = {
  isVideoModalOpen: boolean;
  videoId: string;
  openVideoModal: (videoLink: string) => void;
  closeVideoModal: () => void;
};

const VideoModalContext = createContext<VideoModalContextType>({
  isVideoModalOpen: false,
  videoId: '',
  openVideoModal: () => {},
  closeVideoModal: () => {},
});

export const useVideoModal = () => useContext(VideoModalContext);

type VideoModalProviderProps = {
  children: React.ReactNode;
};

export const VideoModalProvider: React.FC<VideoModalProviderProps> = ({
  children,
}) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoId, setVideoId] = useState('');

  const extractYouTubeId = (url: string): string | null => {
    const regExp =
      /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match ? match[1] || null : null; // Improved null handling
  };

  const openVideoModal = (link: string) => {
    setVideoId(extractYouTubeId(link) || '');
    setIsVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    setVideoId('');
  };

  return (
    <VideoModalContext.Provider
      value={{ isVideoModalOpen, videoId, openVideoModal, closeVideoModal }}
    >
      {children}
    </VideoModalContext.Provider>
  );
};
