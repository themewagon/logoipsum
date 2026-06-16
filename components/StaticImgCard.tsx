import React, { ImgHTMLAttributes } from 'react';
import styled from 'styled-components';

export type StaticImageProps = ImgHTMLAttributes<HTMLImageElement>;

export default function StaticImage(props: StaticImageProps) {
  return <StyledImage {...props} />;
}

const StyledImage = styled.img`
  display: block;
  height: auto;
  width: 40%;
  object-fit: cover;
`;
