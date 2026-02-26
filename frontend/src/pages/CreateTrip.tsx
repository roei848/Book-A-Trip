import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { generateTrip } from '../api/trips';
import { Button } from '../components/sharedComponents/Button';
import { Card } from '../components/sharedComponents/Card';
import { Input } from '../components/sharedComponents/Input';
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
  style: string;
  budget: number;
  accommodation: string;
  food: string;
  transport: string;
  notes: string;
}

const INTERESTS = [
  'תיאטרון',
  'מוזיאונים',
  'היסטוריה',
  'ספורט',
  'טבע',
  'אומנות',
  'קניות',
  'חיי לילה',
];

const initialFormState: TripFormState = {
  destination: '',
  startDate: '',
  endDate: '',
  adults: 2,
  teens: 0,
  children: 0,
  infants: 0,
  interests: [],
  style: 'מאוזן',
  budget: 15000,
  accommodation: 'מלון',
  food: 'ללא העדפה מיוחדת',
  transport: 'תחבורה ציבורית',
  notes: '',
};

export const CreateTrip = () => {
  const navigate = useNavigate();
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

    const transportMap: Record<string, TransportType> = {
      'תחבורה ציבורית': TransportType.PublicTransport,
      'מכונית שכורה': TransportType.CarRental,
      'מונית': TransportType.CarRental,
      'רגלי': TransportType.Walking,
    };

    const paceMap: Record<string, TravelPace> = {
      'מאוזן': TravelPace.Medium,
      'הרפתקאות': TravelPace.Intensive,
      'רומנטי': TravelPace.Light,
      'תרבותי': TravelPace.Medium,
      'ספורטיבי': TravelPace.Intensive,
    };

    const foodMap: Record<string, FoodPreference> = {
      'ללא העדפה מיוחדת': FoodPreference.None,
      'טבעוני': FoodPreference.Vegan,
      'צמחוני': FoodPreference.Vegetarian,
      'ללא גלוטן': FoodPreference.None,
      'כשר': FoodPreference.Kosher,
      'חלאל': FoodPreference.Halal,
    };

    const interestMap: Record<string, AttractionCategory> = {
      'מוזיאונים': AttractionCategory.Museum,
      'טבע': AttractionCategory.Nature,
      'קניות': AttractionCategory.Shopping,
      'תיאטרון': AttractionCategory.Other,
      'היסטוריה': AttractionCategory.Museum,
      'ספורט': AttractionCategory.Other,
      'אומנות': AttractionCategory.Other,
      'חיי לילה': AttractionCategory.Other,
    };

    return {
      destination: form.destination,
      startDate: form.startDate,
      endDate: form.endDate,
      budget,
      transport: transportMap[form.transport] ?? TransportType.PublicTransport,
      pace: paceMap[form.style] ?? TravelPace.Medium,
      food: foodMap[form.food] ?? FoodPreference.None,
      pointsOfInterest: form.interests.map((i) => interestMap[i] ?? AttractionCategory.Other),
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
      setError('שגיאה ביצירת הטיול. אנא נסה שוב.');
    } finally {
      setIsLoading(false);
    }
  };

  const travelerFields: { key: 'adults' | 'teens' | 'children' | 'infants'; label: string }[] = [
    { key: 'adults', label: 'מבוגרים' },
    { key: 'teens', label: 'בני נוער' },
    { key: 'children', label: 'ילדים' },
    { key: 'infants', label: 'תינוקות' },
  ];

  return (
    <CreateTripWrapper dir="rtl">
      <div className="page-content">
        <div className="header">
          <h1 className="page-title">צור טיול חדש</h1>
          <p className="page-subtitle">ספר לנו על הטיול שלך ונתכנן עבורך מסלול מושלם</p>
        </div>

        {/* Section: Destination */}
        <Card className="section-card">
          <div className="section-header">
            <span className="section-icon">📍</span>
            <div>
              <h2 className="section-title">פרטי יעד</h2>
              <p className="section-subtitle">לאן אתה רוצה לנסוע?</p>
            </div>
          </div>
          <div className="destination-fields">
            <Input
              label="יעד"
              placeholder="לדוגמה: טוקיו, יפן"
              value={form.destination}
              onChange={(e) => setField('destination', e.target.value)}
            />
            <div className="date-row">
              <div className="date-field">
                <label className="field-label">תאריך התחלה</label>
                <div className="date-input-wrapper">
                  <input
                    className="date-input"
                    type="date"
                    placeholder="בחר תאריך"
                    value={form.startDate}
                    onChange={(e) => setField('startDate', e.target.value)}
                  />
                </div>
              </div>
              <div className="date-field">
                <label className="field-label">תאריך סיום</label>
                <div className="date-input-wrapper">
                  <input
                    className="date-input"
                    type="date"
                    placeholder="בחר תאריך"
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
            <h2 className="section-title">מי מטייל?</h2>
          </div>
          <div className="traveler-row">
            {travelerFields.map(({ key, label }) => (
              <div key={key} className="traveler-stepper">
                <span className="traveler-label">{label}</span>
                <div className="stepper-controls">
                  <button className="stepper-btn" onClick={() => stepTraveler(key, -1)}>
                    −
                  </button>
                  <span className="stepper-value">{form[key]}</span>
                  <button className="stepper-btn" onClick={() => stepTraveler(key, 1)}>
                    +
                  </button>
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
              <h2 className="section-title">נקודות עניין</h2>
              <p className="section-subtitle">מה מעניין אותך?</p>
            </div>
          </div>
          <div className="interests-grid">
            {INTERESTS.map((interest) => (
              <label key={interest} className="interest-item">
                <input
                  className="interest-checkbox"
                  type="checkbox"
                  checked={form.interests.includes(interest)}
                  onChange={() => toggleInterest(interest)}
                />
                <span className="interest-label">{interest}</span>
              </label>
            ))}
          </div>
        </Card>

        {/* Section: Trip Style */}
        <Card className="section-card">
          <div className="section-header">
            <h2 className="section-title">אופי הטיול</h2>
          </div>
          <div className="select-field">
            <label className="field-label">סגנון</label>
            <select
              className="styled-select"
              value={form.style}
              onChange={(e) => setField('style', e.target.value)}
            >
              <option>מאוזן</option>
              <option>הרפתקאות</option>
              <option>רומנטי</option>
              <option>תרבותי</option>
              <option>ספורטיבי</option>
            </select>
          </div>
        </Card>

        {/* Section: Budget */}
        <Card className="section-card">
          <div className="section-header">
            <span className="section-icon">💲</span>
            <h2 className="section-title">תקציב</h2>
          </div>
          <label className="field-label">לאדם</label>
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
            <h2 className="section-title">לינה</h2>
          </div>
          <div className="select-field">
            <label className="field-label">סוג לינה</label>
            <select
              className="styled-select"
              value={form.accommodation}
              onChange={(e) => setField('accommodation', e.target.value)}
            >
              <option>מלון</option>
              <option>הוסטל</option>
              <option>Airbnb</option>
              <option>קמפינג</option>
            </select>
          </div>
        </Card>

        {/* Section: Food */}
        <Card className="section-card">
          <div className="section-header">
            <span className="section-icon">🍴</span>
            <h2 className="section-title">העדפות אוכל</h2>
          </div>
          <div className="select-field">
            <label className="field-label">העדפה</label>
            <select
              className="styled-select"
              value={form.food}
              onChange={(e) => setField('food', e.target.value)}
            >
              <option>ללא העדפה מיוחדת</option>
              <option>טבעוני</option>
              <option>צמחוני</option>
              <option>ללא גלוטן</option>
              <option>כשר</option>
              <option>חלאל</option>
            </select>
          </div>
        </Card>

        {/* Section: Transport */}
        <Card className="section-card">
          <div className="section-header">
            <span className="section-icon">🚗</span>
            <h2 className="section-title">תחבורה</h2>
          </div>
          <div className="select-field">
            <label className="field-label">העדפת תנועה</label>
            <select
              className="styled-select"
              value={form.transport}
              onChange={(e) => setField('transport', e.target.value)}
            >
              <option>תחבורה ציבורית</option>
              <option>מכונית שכורה</option>
              <option>מונית</option>
              <option>רגלי</option>
            </select>
          </div>
        </Card>

        {/* Section: Notes */}
        <Card className="section-card">
          <div className="section-header">
            <h2 className="section-title">הערות נוספות</h2>
          </div>
          <p className="section-subtitle">ספר לנו עוד משהו שחשוב לך</p>
          <textarea
            className="notes-textarea"
            placeholder="לדוגמה: אנחנו אוהבים להתעורר מאוחר, מעדיפים מסעדות מקומיות על פני רשתות, רוצים להימנע מקניונים..."
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
              {isLoading ? 'יוצר טיול...' : 'צור טיול עם AI ✨'}
            </Button>
          </div>
          <div className="action-cancel">
            <Button variant="secondary" onClick={() => navigate('/')}>
              ביטול
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
