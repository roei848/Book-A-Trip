import styled from 'styled-components';
import { AttractionCategory } from '../../types/enums';
import type { Attraction } from '../../types/models';
import { theme } from '../../styles/theme';

const categoryLabels: Record<AttractionCategory, string> = {
  [AttractionCategory.Nature]: 'Nature',
  [AttractionCategory.Museum]: 'Museum',
  [AttractionCategory.Food]: 'Food',
  [AttractionCategory.Shopping]: 'Shopping',
  [AttractionCategory.Hotel]: 'Hotel',
  [AttractionCategory.Other]: 'Other',
};

const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

interface AttractionItemProps {
  attraction: Attraction;
}

export const AttractionItem = ({ attraction }: AttractionItemProps) => {
  const label = categoryLabels[attraction.category] ?? categoryLabels[AttractionCategory.Other];

  return (
    <AttractionItemWrapper>
      <div className="attraction-header">
        <span className="attraction-name">{attraction.name}</span>
        <div className="attraction-meta">
          <span className="category-badge" data-category={attraction.category}>
            {label}
          </span>
          <span className="duration">⏱ {formatDuration(attraction.durationInMinutes)}</span>
        </div>
      </div>
      <p className="attraction-description">{attraction.description}</p>
    </AttractionItemWrapper>
  );
};

const AttractionItemWrapper = styled.div`
  padding: ${theme.spacing.md} 0;
  border-bottom: 1px solid ${theme.colors.border};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .attraction-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.spacing.sm};
    margin-bottom: ${theme.spacing.xs};
    flex-wrap: wrap;
  }

  .attraction-name {
    font-size: 15px;
    font-weight: 600;
    color: ${theme.colors.text};
  }

  .attraction-meta {
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
    flex-shrink: 0;
  }

  .category-badge {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    font-weight: 500;
    color: ${theme.colors.textLight};
    background: ${theme.colors.background};
    border: 1px solid ${theme.colors.border};
    border-radius: 20px;
    padding: 2px 10px;

    &::before {
      content: '';
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: ${theme.colors.secondary};
      flex-shrink: 0;
    }

    &[data-category='nature']::before {
      background: #22c55e;
    }
    &[data-category='museum']::before {
      background: #8b5cf6;
    }
    &[data-category='food']::before {
      background: #f97316;
    }
    &[data-category='shopping']::before {
      background: #ec4899;
    }
    &[data-category='hotel']::before {
      background: ${theme.colors.primary};
    }
  }

  .duration {
    font-size: 12px;
    color: ${theme.colors.textLight};
    white-space: nowrap;
  }

  .attraction-description {
    font-size: 13px;
    color: ${theme.colors.textLight};
    margin: 0;
    line-height: 1.55;
  }
`;
