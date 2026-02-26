import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { generateTrip } from '../api/trips';
import { Button } from '../components/sharedComponents/Button';
import { Card } from '../components/sharedComponents/Card';
import { Input } from '../components/sharedComponents/Input';
import { useLanguage } from '../context/LanguageContext';
import { theme } from '../styles/theme';
import { AttractionCategory, BudgetLevel, FoodPreference, TransportType, TravelPace } from '../types/enums';
import type { GenerateTripRequest } from '../types/models';

interface TripFormState {
  destination: string;
  startDate: string;
  endDate: string;
  adults: number;
  teens: number;
  children: number;
  infants: number;
  interests: string[];
  style: TravelPace;
  budget: number;
  accommodation: string;
  food: FoodPreference;
  transport: TransportType;
  notes: string;
}

const INTEREST_KEYS = [
  'theater',
  'museums',
  'history',
  'sports',
  'nature',
  'art',
  'shopping',
  'nightlife',
] as const;

const interestToCategory: Record<string, AttractionCategory> = {
  museums: AttractionCategory.Museum,
  nature: AttractionCategory.Nature,
  shopping: AttractionCategory.Shopping,
  theater: AttractionCategory.Other,
  history: AttractionCategory.Museum,
  sports: AttractionCategory.Other,
  art: AttractionCategory.Other,
  nightlife: AttractionCategory.Other,
};

const initialFormState: TripFormState = {
  destination: '',
  startDate: '',
  endDate: '',
  adults: 2,
  teens: 0,
  children: 0,
  infants: 0,
  interests: [],
  style: TravelPace.Medium,
  budget: 15000,
  accommodation: 'hotel',
  food: FoodPreference.None,
  transport: TransportType.PublicTransport,
  notes: '',
};

export const CreateTrip = () => {
  const navigate = useNavigate();
  const { t, isRtl, toggleLang, lang } = useLanguage();
  const [form, setForm] = useState<TripFormState>(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setField = <K extends keyof TripFormState>(key: K, value: TripFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const stepTraveler = (key: 'adults' | 'teens' | 'children' | 'infants', delta: number) => {
    setForm((prev) => ({
      ...prev,
      [key]: Math.max(0, prev[key] + delta),
    }));
  };

  const toggleInterest = (interest: string) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const buildRequest = (): GenerateTripRequest => {
    const budget =
      form.budget <= 15000 ? BudgetLevel.Minimal
      : form.budget <= 25000 ? BudgetLevel.Medium
      : form.budget <= 37500 ? BudgetLevel.Luxury
      : BudgetLevel.Elite;

    return {
      destination: form.destination,
      startDate: form.startDate,
      endDate: form.endDate,
      budget,
      transport: form.transport,
      pace: form.style,
      food: form.food,
      pointsOfInterest: form.interests.map((i) => interestToCategory[i] ?? AttractionCategory.Other),
      travelersCount: form.adults + form.teens + form.children + form.infants,
      note: form.notes,
    };
  };

  const handleSubmit = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await generateTrip(buildRequest());
      navigate('/');
    } catch {
      setError(t('createTrip', 'errorMessage'));
    } finally {
      setIsLoading(false);
    }
  };

  const travelerFields: { key: 'adults' | 'teens' | 'children' | 'infants'; labelKey: string }[] = [
    { key: 'adults', labelKey: 'adults' },
    { key: 'teens', labelKey: 'teens' },
    { key: 'children', labelKey: 'children' },
    { key: 'infants', labelKey: 'infants' },
  ];

  return (
    <CreateTripWrapper dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="page-content">
        <div className="lang-bar">
          <button className="lang-toggle" onClick={toggleLang}>
            🌐 {lang === 'he' ? 'EN' : 'עב'}
          </button>
        </div>

        <div className="header">
          <h1 className="page-title">{t('createTrip', 'pageTitle')}</h1>
          <p className="page-subtitle">{t('createTrip', 'pageSubtitle')}</p>
        </div>

        {/* Section: Destination */}
        <Card className="section-card">
          <div className="section-header">
            <span className="section-icon">📍</span>
            <div>
              <h2 className="section-title">{t('createTrip', 'destinationTitle')}</h2>
              <p className="section-subtitle">{t('createTrip', 'destinationSubtitle')}</p>
            </div>
          </div>
          <div className="destination-fields">
            <Input
              label={t('createTrip', 'destinationLabel')}
              placeholder={t('createTrip', 'destinationPlaceholder')}
              value={form.destination}
              onChange={(e) => setField('destination', e.target.value)}
            />
            <div className="date-row">
              <div className="date-field">
                <label className="field-label">{t('createTrip', 'startDate')}</label>
                <div className="date-input-wrapper">
                  <input
                    className="date-input"
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setField('startDate', e.target.value)}
                  />
                </div>
              </div>
              <div className="date-field">
                <label className="field-label">{t('createTrip', 'endDate')}</label>
                <div className="date-input-wrapper">
                  <input
                    className="date-input"
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setField('endDate', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Section: Travelers */}
        <Card className="section-card">
          <div className="section-header">
            <span className="section-icon">👥</span>
            <h2 className="section-title">{t('createTrip', 'travelersTitle')}</h2>
          </div>
          <div className="traveler-row">
            {travelerFields.map(({ key, labelKey }) => (
              <div key={key} className="traveler-stepper">
                <span className="traveler-label">{t('createTrip', labelKey)}</span>
                <div className="stepper-controls">
                  <button className="stepper-btn" onClick={() => stepTraveler(key, -1)}>−</button>
                  <span className="stepper-value">{form[key]}</span>
                  <button className="stepper-btn" onClick={() => stepTraveler(key, 1)}>+</button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Section: Interests */}
        <Card className="section-card">
          <div className="section-header">
            <span className="section-icon">✨</span>
            <div>
              <h2 className="section-title">{t('createTrip', 'interestsTitle')}</h2>
              <p className="section-subtitle">{t('createTrip', 'interestsSubtitle')}</p>
            </div>
          </div>
          <div className="interests-grid">
            {INTEREST_KEYS.map((key) => (
              <label key={key} className="interest-item">
                <input
                  className="interest-checkbox"
                  type="checkbox"
                  checked={form.interests.includes(key)}
                  onChange={() => toggleInterest(key)}
                />
                <span className="interest-label">
                  {t('createTrip', `interest${key.charAt(0).toUpperCase() + key.slice(1)}`)}
                </span>
              </label>
            ))}
          </div>
        </Card>

        {/* Section: Trip Style */}
        <Card className="section-card">
          <div className="section-header">
            <h2 className="section-title">{t('createTrip', 'styleTitle')}</h2>
          </div>
          <div className="select-field">
            <label className="field-label">{t('createTrip', 'styleLabel')}</label>
            <select
              className="styled-select"
              value={form.style}
              onChange={(e) => setField('style', e.target.value as TravelPace)}
            >
              <option value={TravelPace.Medium}>{t('createTrip', 'styleBalanced')}</option>
              <option value={TravelPace.Intensive}>{t('createTrip', 'styleAdventure')}</option>
              <option value={TravelPace.Light}>{t('createTrip', 'styleRomantic')}</option>
              <option value={TravelPace.Medium}>{t('createTrip', 'styleCultural')}</option>
              <option value={TravelPace.Intensive}>{t('createTrip', 'styleSporty')}</option>
            </select>
          </div>
        </Card>

        {/* Section: Budget */}
        <Card className="section-card">
          <div className="section-header">
            <span className="section-icon">💲</span>
            <h2 className="section-title">{t('createTrip', 'budgetTitle')}</h2>
          </div>
          <label className="field-label">{t('createTrip', 'budgetPerPerson')}</label>
          <p className="budget-value">₪{form.budget.toLocaleString('he-IL')}</p>
          <input
            className="budget-slider"
            type="range"
            min={5000}
            max={50000}
            step={500}
            value={form.budget}
            onChange={(e) => setField('budget', Number(e.target.value))}
          />
          <div className="budget-range-labels">
            <span className="range-label">₪50,000</span>
            <span className="range-label">₪5,000</span>
          </div>
        </Card>

        {/* Section: Accommodation */}
        <Card className="section-card">
          <div className="section-header">
            <span className="section-icon">🏨</span>
            <h2 className="section-title">{t('createTrip', 'accommodationTitle')}</h2>
          </div>
          <div className="select-field">
            <label className="field-label">{t('createTrip', 'accommodationLabel')}</label>
            <select
              className="styled-select"
              value={form.accommodation}
              onChange={(e) => setField('accommodation', e.target.value)}
            >
              <option value="hotel">{t('createTrip', 'accommodationHotel')}</option>
              <option value="hostel">{t('createTrip', 'accommodationHostel')}</option>
              <option value="airbnb">{t('createTrip', 'accommodationAirbnb')}</option>
              <option value="camping">{t('createTrip', 'accommodationCamping')}</option>
            </select>
          </div>
        </Card>

        {/* Section: Food */}
        <Card className="section-card">
          <div className="section-header">
            <span className="section-icon">🍴</span>
            <h2 className="section-title">{t('createTrip', 'foodTitle')}</h2>
          </div>
          <div className="select-field">
            <label className="field-label">{t('createTrip', 'foodLabel')}</label>
            <select
              className="styled-select"
              value={form.food}
              onChange={(e) => setField('food', e.target.value as FoodPreference)}
            >
              <option value={FoodPreference.None}>{t('createTrip', 'foodNone')}</option>
              <option value={FoodPreference.Vegan}>{t('createTrip', 'foodVegan')}</option>
              <option value={FoodPreference.Vegetarian}>{t('createTrip', 'foodVegetarian')}</option>
              <option value={FoodPreference.None}>{t('createTrip', 'foodGlutenFree')}</option>
              <option value={FoodPreference.Kosher}>{t('createTrip', 'foodKosher')}</option>
              <option value={FoodPreference.Halal}>{t('createTrip', 'foodHalal')}</option>
            </select>
          </div>
        </Card>

        {/* Section: Transport */}
        <Card className="section-card">
          <div className="section-header">
            <span className="section-icon">🚗</span>
            <h2 className="section-title">{t('createTrip', 'transportTitle')}</h2>
          </div>
          <div className="select-field">
            <label className="field-label">{t('createTrip', 'transportLabel')}</label>
            <select
              className="styled-select"
              value={form.transport}
              onChange={(e) => setField('transport', e.target.value as TransportType)}
            >
              <option value={TransportType.PublicTransport}>{t('createTrip', 'transportPublic')}</option>
              <option value={TransportType.CarRental}>{t('createTrip', 'transportCar')}</option>
              <option value={TransportType.CarRental}>{t('createTrip', 'transportTaxi')}</option>
              <option value={TransportType.Walking}>{t('createTrip', 'transportWalking')}</option>
            </select>
          </div>
        </Card>

        {/* Section: Notes */}
        <Card className="section-card">
          <div className="section-header">
            <h2 className="section-title">{t('createTrip', 'notesTitle')}</h2>
          </div>
          <p className="section-subtitle">{t('createTrip', 'notesSubtitle')}</p>
          <textarea
            className="notes-textarea"
            placeholder={t('createTrip', 'notesPlaceholder')}
            value={form.notes}
            onChange={(e) => setField('notes', e.target.value)}
            rows={4}
          />
        </Card>

        {error && <p className="error-message">{error}</p>}

        {/* Action Bar */}
        <div className="action-bar">
          <div className="action-submit">
            <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? t('createTrip', 'submitLoading') : t('createTrip', 'submitButton')}
            </Button>
          </div>
          <div className="action-cancel">
            <Button variant="secondary" onClick={() => navigate('/')}>
              {t('createTrip', 'cancelButton')}
            </Button>
          </div>
        </div>
      </div>
    </CreateTripWrapper>
  );
};

const CreateTripWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    ${theme.colors.background} 0%,
    ${theme.colors.surface} 50%,
    ${theme.colors.background} 100%
  );
  font-family: ${theme.fonts.body};
  padding: ${theme.spacing.xl} ${theme.spacing.md};

  .page-content {
    max-width: 720px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.lg};
  }

  .lang-bar {
    display: flex;
    justify-content: flex-end;
  }

  .lang-toggle {
    background: ${theme.colors.border};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius};
    color: ${theme.colors.text};
    font-family: ${theme.fonts.body};
    font-size: 13px;
    font-weight: 600;
    padding: ${theme.spacing.xs} ${theme.spacing.md};
    cursor: pointer;
    transition: background 0.15s;

    &:hover {
      background: ${theme.colors.secondary};
      color: ${theme.colors.surface};
    }
  }

  .header {
    text-align: center;
    padding: ${theme.spacing.lg} 0;
  }

  .page-title {
    font-size: 32px;
    font-weight: 700;
    color: ${theme.colors.gradientEnd};
    margin: 0 0 ${theme.spacing.sm};
  }

  .page-subtitle {
    font-size: 15px;
    color: ${theme.colors.textLight};
    margin: 0;
  }

  .section-card {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.md};
  }

  .section-header {
    display: flex;
    align-items: flex-start;
    gap: ${theme.spacing.sm};
  }

  .section-icon {
    font-size: 20px;
    margin-top: 2px;
  }

  .section-title {
    font-size: 17px;
    font-weight: 600;
    color: ${theme.colors.text};
    margin: 0;
  }

  .section-subtitle {
    font-size: 13px;
    color: ${theme.colors.textLight};
    margin: 0;
  }

  .destination-fields {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.md};
  }

  .date-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: ${theme.spacing.md};
  }

  .date-field {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.xs};
  }

  .field-label {
    font-size: 14px;
    font-weight: 500;
    color: ${theme.colors.text};
  }

  .date-input-wrapper {
    position: relative;
  }

  .date-input {
    width: 100%;
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius};
    font-family: ${theme.fonts.body};
    font-size: 14px;
    color: ${theme.colors.text};
    outline: none;
    box-sizing: border-box;
    background: ${theme.colors.surface};

    &:focus {
      border-color: ${theme.colors.primary};
    }
  }

  .traveler-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: ${theme.spacing.md};
  }

  .traveler-stepper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${theme.spacing.sm};
  }

  .traveler-label {
    font-size: 13px;
    font-weight: 500;
    color: ${theme.colors.text};
  }

  .stepper-controls {
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius};
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    background: ${theme.colors.background};
  }

  .stepper-btn {
    background: none;
    border: none;
    font-size: 16px;
    font-weight: 600;
    color: ${theme.colors.primary};
    cursor: pointer;
    padding: 0 ${theme.spacing.xs};
    line-height: 1;

    &:hover {
      color: ${theme.colors.primaryHover};
    }
  }

  .stepper-value {
    font-size: 16px;
    font-weight: 600;
    color: ${theme.colors.text};
    min-width: 20px;
    text-align: center;
  }

  .interests-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: ${theme.spacing.sm};
  }

  .interest-item {
    display: flex;
    align-items: center;
    gap: ${theme.spacing.xs};
    cursor: pointer;
    font-size: 14px;
    color: ${theme.colors.text};
  }

  .interest-checkbox {
    width: 16px;
    height: 16px;
    accent-color: ${theme.colors.primary};
    cursor: pointer;
  }

  .interest-label {
    font-size: 14px;
  }

  .select-field {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.xs};
  }

  .styled-select {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius};
    font-family: ${theme.fonts.body};
    font-size: 14px;
    color: ${theme.colors.text};
    background: ${theme.colors.surface};
    outline: none;
    cursor: pointer;

    &:focus {
      border-color: ${theme.colors.primary};
    }
  }

  .budget-value {
    font-size: 28px;
    font-weight: 700;
    color: ${theme.colors.primary};
    margin: 0;
  }

  .budget-slider {
    width: 100%;
    accent-color: ${theme.colors.primary};
    cursor: pointer;
  }

  .budget-range-labels {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: ${theme.colors.textLight};
  }

  .range-label {
    font-size: 12px;
    color: ${theme.colors.textLight};
  }

  .notes-textarea {
    width: 100%;
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius};
    font-family: ${theme.fonts.body};
    font-size: 14px;
    color: ${theme.colors.text};
    resize: vertical;
    outline: none;
    box-sizing: border-box;
    background: ${theme.colors.surface};

    &:focus {
      border-color: ${theme.colors.primary};
    }
  }

  .error-message {
    color: ${theme.colors.error};
    font-size: 14px;
    text-align: center;
    margin: 0;
  }

  .action-bar {
    display: flex;
    gap: ${theme.spacing.md};
    padding: ${theme.spacing.lg} 0 ${theme.spacing.xxl};
  }

  .action-submit {
    flex: 2;

    button {
      width: 100%;
      padding: ${theme.spacing.md};
      font-size: 16px;
      font-weight: 600;
      background: linear-gradient(135deg, ${theme.colors.gradientMid}, ${theme.colors.gradientEnd});
      border-radius: ${theme.borderRadius};

      &:hover {
        background: linear-gradient(
          135deg,
          ${theme.colors.gradientEnd},
          ${theme.colors.gradientStart}
        );
      }
    }
  }

  .action-cancel {
    flex: 1;

    button {
      width: 100%;
      padding: ${theme.spacing.md};
      font-size: 15px;
    }
  }
`;
