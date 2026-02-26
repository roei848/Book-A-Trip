import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { searchUnsplashPhotos } from '../../api/unsplash';
import type { UnsplashPhoto } from '../../api/unsplash';
import { Button } from '../sharedComponents/Button';
import { Input } from '../sharedComponents/Input';
import { theme } from '../../styles/theme';

interface UnsplashImagePickerProps {
  initialQuery: string;
  onSelect: (photo: UnsplashPhoto) => void;
  onClose: () => void;
}

export const UnsplashImagePicker = ({
  initialQuery,
  onSelect,
  onClose,
}: UnsplashImagePickerProps) => {
  const [query, setQuery] = useState(initialQuery);
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const runSearch = (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setError(false);
    searchUnsplashPhotos(q)
      .then(setPhotos)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    runSearch(initialQuery);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') runSearch(query);
  };

  return (
    <UnsplashImagePickerWrapper onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Choose a photo</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="search-bar">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search photos..."
          />
          <Button onClick={() => runSearch(query)}>Search</Button>
        </div>

        {loading && <p className="status-text">Loading...</p>}
        {!loading && error && <p className="status-text">Something went wrong. Try again.</p>}
        {!loading && !error && photos.length === 0 && (
          <p className="status-text">No photos found.</p>
        )}

        {!loading && !error && photos.length > 0 && (
          <div className="photo-grid">
            {photos.map((photo) => (
              <img
                key={photo.id}
                className="photo-thumb"
                src={photo.urls.small}
                alt={photo.description ?? photo.user.name}
                onClick={() => onSelect(photo)}
              />
            ))}
          </div>
        )}

        <p className="attribution">
          Photos by{' '}
          <a
            href="https://unsplash.com?utm_source=book_a_trip&utm_medium=referral"
            target="_blank"
            rel="noreferrer"
          >
            Unsplash
          </a>
        </p>
      </div>
    </UnsplashImagePickerWrapper>
  );
};

const UnsplashImagePickerWrapper = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  .modal {
    background: ${theme.colors.surface};
    border-radius: ${theme.borderRadius};
    width: 680px;
    max-width: 90vw;
    max-height: 80vh;
    overflow-y: auto;
    padding: ${theme.spacing.xl};
  }

  .modal-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${theme.spacing.md};
  }

  .modal-title {
    font-size: 18px;
    font-weight: 700;
    color: ${theme.colors.text};
    margin: 0;
  }

  .close-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 20px;
    color: ${theme.colors.text};
  }

  .search-bar {
    display: flex;
    flex-direction: row;
    gap: ${theme.spacing.sm};
    align-items: flex-end;
    margin-bottom: ${theme.spacing.lg};

    > :first-child {
      flex: 1;
    }
  }

  .photo-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: ${theme.spacing.sm};
    margin-bottom: ${theme.spacing.lg};
  }

  .photo-thumb {
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    cursor: pointer;
    border-radius: ${theme.borderRadius};
    border: 2px solid transparent;
    transition: border-color 0.15s;

    &:hover {
      border-color: ${theme.colors.primary};
    }
  }

  .status-text {
    text-align: center;
    color: ${theme.colors.textLight};
    padding: ${theme.spacing.xl};
    margin: 0;
  }

  .attribution {
    font-size: 12px;
    color: ${theme.colors.textLight};
    margin-top: ${theme.spacing.md};
    text-align: center;

    a {
      color: ${theme.colors.primary};
    }
  }
`;
