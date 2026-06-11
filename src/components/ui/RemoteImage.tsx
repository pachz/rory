"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import {
  ImagePlaceholder,
  type PlaceholderVariant,
} from "./ImagePlaceholder";

interface RemoteImageProps {
  src?: string | null;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
  containerClassName?: string;
  objectFit?: "cover" | "contain";
  variant?: PlaceholderVariant;
  overlay?: ReactNode;
}

export function RemoteImage({
  src,
  alt,
  fill = false,
  width,
  height,
  sizes,
  priority,
  className = "",
  containerClassName = "",
  objectFit = "cover",
  variant = "item",
  overlay,
}: RemoteImageProps) {
  const [failed, setFailed] = useState(false);
  const hasSrc = Boolean(src?.trim());
  const showPlaceholder = !hasSrc || failed;

  const fitClass = objectFit === "contain" ? "object-contain" : "object-cover";
  const imageClassName = `${fitClass} ${className}`.trim();

  if (showPlaceholder) {
    return (
      <div className={`relative ${containerClassName}`}>
        <ImagePlaceholder
          variant={variant}
          label={alt}
          className={fill ? "absolute inset-0 h-full w-full" : "h-full w-full"}
        />
        {overlay}
      </div>
    );
  }

  return (
    <div className={`relative ${containerClassName}`}>
      <Image
        src={src!}
        alt={alt}
        fill={fill}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        sizes={sizes}
        priority={priority}
        className={imageClassName}
        onError={() => setFailed(true)}
      />
      {overlay}
    </div>
  );
}
