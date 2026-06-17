import React from 'react';
import styled from 'styled-components';

import playIcon from '../public/play-icon.svg';

interface YoutubeVideoProps {
  title?: string;
  url: string;
}

export default function YoutubeVideo(props: YoutubeVideoProps) {
  const { title, url } = props;
  const videoHash = extractVideoHashFromUrl(url);
  const srcDoc = `<style>
  * {
    padding: 0;
    margin: 0;
    overflow: hidden;
  }
  
  html,
  body {
    height: 100%;
    width: 100%;
    background: #000;
  }
  
  .thumbnail {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    object-fit: cover;
    opacity: 0.8;
    transition: opacity 0.2s ease-in-out;
  }
  
  a:hover .thumbnail {
    opacity: 0.9;
  }

  .play {
    position: absolute;
    width: 64px;
    height: 64px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: transform 0.2s ease-in-out;
    filter: drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.5));
  }
  
  a:hover .play {
    transform: translate(-50%, -50%) scale(1.15);
  }
  </style>
  <a href="https://www.youtube.com/embed/${videoHash}?autoplay=1">
    <img class="thumbnail" src="https://img.youtube.com/vi/${videoHash}/hqdefault.jpg" alt="${title || ''}">
    <img class="play" src="${playIcon}" alt="Play the video">
  </a>`;
  return (
    <VideoContainer>
      <VideoFrame
        className=""
        width="100%"
        height="100%"
        src=""
        srcDoc={srcDoc}
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={title}
        loading="lazy"
      />
    </VideoContainer>
  );
}

function extractVideoHashFromUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname === 'youtu.be') {
      return parsedUrl.pathname.substring(1);
    }
    return parsedUrl.searchParams.get('v') || '';
  } catch (error) {
    return '';
  }
}

export const VideoContainer = styled.div`
  display: flex;
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  -webkit-mask-image: -webkit-radial-gradient(white, black);

  &:before {
    display: block;
    content: '';
    width: 100%;
    padding-top: 56.25%; /* 16:9 Aspect Ratio */
  }
`;

const VideoFrame = styled.iframe`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

