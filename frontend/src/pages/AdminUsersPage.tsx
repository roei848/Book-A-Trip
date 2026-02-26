import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getUsers, updateUserRole } from '../api/users';
import { Card } from '../components/sharedComponents/Card';
import { Button } from '../components/sharedComponents/Button';
import type { AdminUser } from '../types/models';
import { UserRole } from '../types/auth';
import { theme } from '../styles/theme';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pendingRoles, setPendingRoles] = useState<Record<string, UserRole>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [saveErrors, setSaveErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch(() => setError('שגיאה בטעינת המשתמשים'));
  }, []);

  const handleRoleChange = (id: string, role: UserRole) => {
    setPendingRoles((prev) => ({ ...prev, [id]: role }));
  };

  const handleSave = async (user: AdminUser) => {
    const newRole = pendingRoles[user.id];
    if (!newRole) return;
    setSaving((prev) => ({ ...prev, [user.id]: true }));
    setSaveErrors((prev) => ({ ...prev, [user.id]: '' }));
    try {
      await updateUserRole(user.id, newRole);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u)));
      setSaved((prev) => ({ ...prev, [user.id]: true }));
      setPendingRoles((prev) => { const next = { ...prev }; delete next[user.id]; return next; });
      setTimeout(() => setSaved((prev) => ({ ...prev, [user.id]: false })), 2000);
    } catch {
      setSaveErrors((prev) => ({ ...prev, [user.id]: 'שגיאה בשמירה' }));
    } finally {
      setSaving((prev) => ({ ...prev, [user.id]: false }));
    }
  };

  const isAdmin = (user: AdminUser) => user.role === UserRole.Admin;

  return (
    <AdminUsersPageWrapper>
      <h1 className="title">ניהול משתמשים</h1>
      {error && <p className="page-error">{error}</p>}
      <Card>
        <table className="users-table">
          <thead>
            <tr>
              <th>אימייל</th>
              <th>שם</th>
              <th>תפקיד</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.name}</td>
                <td>
                  {isAdmin(user) ? (
                    <span className="role-badge admin">Admin</span>
                  ) : (
                    <select
                      className="role-select"
                      value={pendingRoles[user.id] ?? user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                    >
                      <option value={UserRole.Free}>Free</option>
                      <option value={UserRole.Premium}>Premium</option>
                    </select>
                  )}
                </td>
                <td>
                  {!isAdmin(user) && (
                    <span className="action-cell">
                      <Button
                        onClick={() => handleSave(user)}
                        disabled={saving[user.id] || !pendingRoles[user.id]}
                      >
                        {saving[user.id] ? '...' : 'שמור'}
                      </Button>
                      {saved[user.id] && <span className="feedback success">✓</span>}
                      {saveErrors[user.id] && <span className="feedback error">{saveErrors[user.id]}</span>}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </AdminUsersPageWrapper>
  );
};

const AdminUsersPageWrapper = styled.div`
  padding: ${theme.spacing.xl};
  max-width: 900px;
  margin: 0 auto;
  direction: rtl;
  font-family: ${theme.fonts.body};

  .title {
    font-size: 24px;
    font-weight: 700;
    color: ${theme.colors.text};
    margin-bottom: ${theme.spacing.lg};
  }

  .page-error {
    color: ${theme.colors.error};
    margin-bottom: ${theme.spacing.md};
  }

  .users-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;

    th, td {
      padding: ${theme.spacing.sm} ${theme.spacing.md};
      text-align: right;
      border-bottom: 1px solid ${theme.colors.border};
      color: ${theme.colors.text};
    }

    th {
      font-weight: 600;
      color: ${theme.colors.textLight};
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    tr:last-child td {
      border-bottom: none;
    }
  }

  .role-badge {
    display: inline-block;
    padding: 2px ${theme.spacing.sm};
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;

    &.admin {
      background: ${theme.colors.accent};
      color: white;
    }
  }

  .role-select {
    padding: 4px ${theme.spacing.sm};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius};
    background: ${theme.colors.surface};
    color: ${theme.colors.text};
    font-family: ${theme.fonts.body};
    font-size: 14px;
    cursor: pointer;
  }

  .action-cell {
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
  }

  .feedback {
    font-size: 13px;

    &.success {
      color: #22c55e;
    }

    &.error {
      color: ${theme.colors.error};
    }
  }
`;
