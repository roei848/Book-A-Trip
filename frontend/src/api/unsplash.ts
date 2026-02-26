import axios from 'axios';

const unsplashClient = axios.create({
  baseURL: 'https://api.unsplash.com',
  headers: {
    Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`,
  },
});

export interface UnsplashPhoto {
  id: string;
  description: string | null;
  urls: {
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    name: string;
    links: {
      html: string;
    };
  };
  links: {
    download_location: string;
  };
}

export const searchUnsplashPhotos = async (query: string): Promise<UnsplashPhoto[]> => {
  const res = await unsplashClient.get<{ results: UnsplashPhoto[] }>('/search/photos', {
    params: { query, per_page: 12, orientation: 'landscape' },
  });
  return res.data.results;
};

export const trackUnsplashDownload = async (downloadLocation: string): Promise<void> => {
  await unsplashClient.get(downloadLocation);
};
