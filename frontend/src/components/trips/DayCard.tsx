import styled from 'styled-components';
import type { TripDay } from '../../types/models';
import { theme } from '../../styles/theme';
import { AttractionItem } from './AttractionItem';

interface DayCardProps {
  day: TripDay;
}

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

export const DayCard = ({ day }: DayCardProps) => (
  <DayCardWrapper>
    <div className="day-header">
      <div className="day-number">Day {day.dayNumber}</div>
      <div className="day-detail">
        {day.date && <span className="day-date">{formatDate(day.date)}</span>}
        {day.startLocation && (
          <span className="day-location">
            <span className="pin">📍</span>
            {day.startLocation}
          </span>
        )}
      </div>
    </div>
    <div className="attractions">
      {day.attractions.map((attraction) => (
        <AttractionItem key={attraction.id} attraction={attraction} />
      ))}
    </div>
  </DayCardWrapper>
);

const DayCardWrapper = styled.div`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius};
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);

  .day-header {
    display: flex;
    align-items: center;
    gap: ${theme.spacing.md};
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    background: ${theme.colors.background};
    border-bottom: 1px solid ${theme.colors.border};
  }

  .day-number {
    font-size: 14px;
    font-weight: 700;
    color: ${theme.colors.surface};
    background: ${theme.colors.primary};
    border-radius: 20px;
    padding: 3px 12px;
    white-space: nowrap;
  }

  .day-detail {
    display: flex;
    align-items: center;
    gap: ${theme.spacing.md};
    flex-wrap: wrap;
  }

  .day-date {
    font-size: 13px;
    font-weight: 500;
    color: ${theme.colors.text};
  }

  .day-location {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    color: ${theme.colors.textLight};
  }

  .pin {
    font-size: 13px;
  }

  .attractions {
    padding: 0 ${theme.spacing.lg};
  }
`;
