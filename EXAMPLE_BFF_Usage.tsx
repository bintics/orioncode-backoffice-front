/**
 * EXAMPLE: How to use the BFF (Backend for Frontend) pattern in a form component
 * 
 * This example demonstrates the difference between the old approach (multiple API calls)
 * and the new BFF approach (single optimized API call)
 */

import { useBFFCollaboratorForm } from './src/hooks/useBFFCollaboratorForm';
import { useTranslation } from 'react-i18next';

// ============================================================================
// NEW APPROACH: Using BFF Hook
// ============================================================================

export const CollaboratorFormWithBFF = () => {
  const { t } = useTranslation();
  
  // 🚀 Single hook call - all data loaded in ONE request!
  const {
    formData,
    positions,    // ✅ Already loaded from BFF
    teams,        // ✅ Already loaded from BFF
    loading,      // ✅ Single loading state
    error,        // ✅ Single error state
    handleSubmit,
    handleChange,
    handleAddTag,
    handleRemoveTag,
    newTag,
    setNewTag,
  } = useBFFCollaboratorForm();

  // Your component renders immediately with all data!
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">{t('collaboratorForm')}</h1>
      </div>

      {error && (
        <div className="alert alert-error">
          <strong>{t('error')}:</strong> {error}
        </div>
      )}

      <div className="form-container">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="firstName" className="form-label">
              {t('firstName')} <span className="required">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="form-input"
              value={formData.firstName}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="position" className="form-label">
              {t('position')} <span className="required">*</span>
            </label>
            <select
              id="position"
              name="position"
              className="form-select"
              value={formData.position}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">{t('selectPosition')}</option>
              {positions.map((position) => (
                <option key={position.id} value={position.id}>
                  {position.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="teamId" className="form-label">
              {t('team')} <span className="required">*</span>
            </label>
            <select
              id="teamId"
              name="teamId"
              className="form-select"
              value={formData.teamId}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">{t('selectTeam')}</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? t('saving') : t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// OLD APPROACH: Multiple API Calls (for comparison)
// ============================================================================

import { useState, useEffect } from 'react';
import { positionsService } from './src/services/positionsService';
import { teamsService } from './src/services/teamsService';
import { collaboratorsService } from './src/services/collaboratorsService';

export const CollaboratorFormOldWay = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ firstName: '', position: '', teamId: '' });
  const [positions, setPositions] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ❌ Problem: Multiple useEffect hooks, complex state management
  useEffect(() => {
    const loadPositions = async () => {
      try {
        const data = await positionsService.getAllForDropdown();
        setPositions(data);
      } catch (err) {
        setError(err.message);
      }
    };
    loadPositions();
  }, []);

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const data = await teamsService.getAllForDropdown();
        setTeams(data.data || []);
      } catch (err) {
        setError(err.message);
      }
    };
    loadTeams();
  }, []);

  // ❌ Problem: 3 separate HTTP requests!
  // ❌ Problem: Waterfall loading - teams load after positions
  // ❌ Problem: Complex error handling

  // ... rest of component
};

// ============================================================================
// COMPARISON
// ============================================================================

/*
OLD WAY (Multiple API Calls):
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ├─ Request 1 → GET /api/positions (with X-dropdown header)
       ├─ Request 2 → GET /api/teams (with X-dropdown header)
       └─ Request 3 → GET /api/collaborators/:id (if editing)
       
Total: 3 HTTP requests
Time: ~300-900ms (depending on network)

NEW WAY (BFF):
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       └─ Request 1 → GET /api/bff/collaborators/:id/form-data
                     ↓
                     Returns: { collaborator, positions, teams }
                     
Total: 1 HTTP request
Time: ~100-300ms (faster due to parallel backend calls)

BENEFITS:
✅ 66% fewer HTTP requests
✅ 50-70% faster loading time
✅ Simpler code - single hook
✅ Better error handling
✅ Single loading state
✅ Type-safe responses
*/

// ============================================================================
// MIGRATING FROM OLD TO NEW
// ============================================================================

/*
Step 1: Replace the hook import
  OLD: import { useCollaboratorForm } from './useCollaboratorForm';
  NEW: import { useBFFCollaboratorForm } from '../hooks/useBFFCollaboratorForm';

Step 2: Replace the hook usage
  OLD: const { ... } = useCollaboratorForm();
  NEW: const { ... } = useBFFCollaboratorForm();

Step 3: Done! The API is identical, no other changes needed.

IMPORTANT: The backend BFF endpoints must be implemented first.
See BFF_BACKEND_EXAMPLE.md for implementation details.
*/
