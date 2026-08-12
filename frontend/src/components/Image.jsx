import { IKImage } from "imagekitio-react";

const Image = ({ src, className, w, h, alt = "" }) => {
  // IKImage renders a broken <img> when `path` is empty - skip it entirely.
  if (!src) return null;

  // Absolute URLs can't go through the ImageKit path transform.
  if (/^https?:\/\//i.test(src)) {
    return (
      <img src={src} className={className} loading="lazy" alt={alt} width={w} height={h} />
    );
  }

  return (
    <IKImage
      urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
      path={src}
      className={className}
      loading="lazy"
      lqip={{ active: true, quality: 20 }}
      alt={alt}
      width={w}
      height={h}
      transformation={[
        {
          width: w,
          height: h,
        },
      ]}
    />
  );
};

export default Image;
