import NextImage, { type ImageProps } from "next/image";

const DEFAULT_IMAGE_QUALITY = 85;

export default function OptimizedImage(props: ImageProps) {
  return <NextImage quality={DEFAULT_IMAGE_QUALITY} {...props} />;
}
