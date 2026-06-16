import React, { ImgHTMLAttributes } from 'react';
import styled from 'styled-components';

export type StaticImageProps = ImgHTMLAttributes<HTMLImageElement>;

export default function StaticImage(props: StaticImageProps) {
  return <StyledImage {...props} />;
}

const StyledImage = styled.img`
  display: block;
  width: 100%;
  height: auto;
  object-fit: cover;
`;
