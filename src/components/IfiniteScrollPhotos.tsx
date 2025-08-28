import React, { useEffect, useState, useCallback } from 'react';
import './Scroll.css';

interface UnsplashPhoto {
  id: string;
  urls: {
    regular: string;
  };
  links: {
    html: string;
  };
  alt_description: string;
}

const apiKey: string = import.meta.env.VITE_UNSPLASH_KEY;
//const apiKey: string = '2IB4X221AzKwQaLRP2HgxjI5jUEIs-YbpRQTesqyNQo';
console.log('REACT_APP_UNSPLASH_KEY value is:', JSON.stringify(apiKey));
console.log(
  'Fetching URL:',
  `https://api.unsplash.com/photos/random/?client_id=${
    import.meta.env.REACT_APP_UNSPLASH_KEY
  }&count=30`
);
const initialCount = 5;

const InfiniteScrollPhotos: React.FC = () => {
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [ready, setReady] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const [, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(true);

  const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=30`;

  // Check if images were loaded
  const handleImageLoaded = useCallback(() => {
    setImagesLoaded((prev) => {
      const newCount = prev + 1;
      if (newCount === totalImages) {
        setReady(true);
        setLoading(false);
        setCount(30); // After first load, fetch more
      }
      return newCount;
    });
  }, [totalImages]);

  // Fetch photos
  const getPhotos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(
          `Unsplash API error: ${response.status} ${response.statusText}`
        );
      }

      const data = (await response.json()) as UnsplashPhoto[];

      if (!Array.isArray(data)) {
        throw new Error('Unexpected API response format');
      }

      console.log('Fetched photos:', data);

      setImagesLoaded(0);
      setTotalImages(data.length);
      setPhotos((prev) => [...prev, ...data]);
    } catch (error) {
      console.error('Error fetching photos:', error);
      setLoading(false);
    }
  }, [apiUrl]);

  // Infinite scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 1000 &&
        ready
      ) {
        setReady(false);
        getPhotos();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ready, getPhotos]);

  // Initial fetch
  useEffect(() => {
    getPhotos();
  }, [getPhotos]);

  return (
    <div style={{ textAlign: 'center' }}>
      {loading && <p>Loading new photos...</p>}
      {imagesLoaded > 0 && (
        <p>
          {imagesLoaded} / {totalImages} images loaded
        </p>
      )}
      <div
        id="image-container"
        style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
      >
        {photos.map((photo) => (
          <a
            key={photo.id}
            href={photo.links.html}
            target="_blank"
            rel="noopener noreferrer"
            style={{ margin: '10px' }}
          >
            <img
              src={photo.urls.regular}
              alt={photo.alt_description}
              title={photo.alt_description}
              onLoad={handleImageLoaded}
              style={{ maxWidth: '300px', borderRadius: '8px' }}
            />
          </a>
        ))}
      </div>
    </div>
  );
};

export default InfiniteScrollPhotos;
