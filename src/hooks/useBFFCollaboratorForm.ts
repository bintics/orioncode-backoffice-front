import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { collaboratorsBFFService } from '../services/bff';
import { Position, Team } from '../types';

interface CollaboratorFormData {
  firstName: string;
  lastName: string;
  position: string; // Este será el positionId
  teamId: string;
  tags: string[];
}

interface UseBFFCollaboratorFormReturn {
  // Form data
  formData: CollaboratorFormData;
  setFormData: React.Dispatch<React.SetStateAction<CollaboratorFormData>>;
  
  // Reference data
  positions: Position[];
  teams: Team[];
  
  // Tag management
  newTag: string;
  setNewTag: React.Dispatch<React.SetStateAction<string>>;
  
  // States
  loading: boolean;
  error: string | null;
  isEditing: boolean;
  
  // Handlers
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleAddTag: () => void;
  handleRemoveTag: (tagToRemove: string) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  handleCancel: () => void;
}

/**
 * Custom hook for Collaborator Form using BFF service
 * 
 * This hook uses the Backend for Frontend (BFF) layer to fetch all necessary
 * data in a single request instead of multiple separate API calls.
 * 
 * Benefits:
 * - Single API call to get collaborator + positions + teams
 * - Reduced loading time
 * - Simpler state management
 * - Better error handling
 */
export const useBFFCollaboratorForm = (): UseBFFCollaboratorFormReturn => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<CollaboratorFormData>({
    firstName: '',
    lastName: '',
    position: '',
    teamId: '',
    tags: [],
  });
  
  const [positions, setPositions] = useState<Position[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isLoadingRef = useRef(false);

  // Load form data using BFF - single request for everything
  useEffect(() => {
    const loadFormData = async () => {
      if (isLoadingRef.current) {
        return;
      }

      try {
        isLoadingRef.current = true;
        setLoading(true);
        setError(null);

        console.log('🚀 Loading form data from BFF...');
        
        // Single BFF call gets collaborator (if editing) + positions + teams
        const bffData = await collaboratorsBFFService.getFormData(id);
        
        console.log('✅ BFF data received:', bffData);

        // Set reference data
        setPositions(bffData.positions);
        setTeams(bffData.teams);

        // If editing, populate form with collaborator data
        if (bffData.collaborator) {
          setFormData({
            firstName: bffData.collaborator.firstName,
            lastName: bffData.collaborator.lastName,
            position: bffData.collaborator.position.id,
            teamId: bffData.collaborator.team.id,
            tags: bffData.collaborator.tags,
          });
        }

        setLoading(false);
      } catch (err) {
        console.error('❌ Error loading form data from BFF:', err);
        setError(err instanceof Error ? err.message : 'Error loading form data');
        setLoading(false);
      } finally {
        isLoadingRef.current = false;
      }
    };

    loadFormData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      // Validate required fields
      if (!formData.firstName.trim()) {
        throw new Error('First name is required');
      }
      if (!formData.lastName.trim()) {
        throw new Error('Last name is required');
      }
      if (!formData.position.trim()) {
        throw new Error('Position is required');
      }
      if (!formData.teamId.trim()) {
        throw new Error('Team is required');
      }

      // Prepare data for BFF
      const bffData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        positionId: formData.position,
        teamId: formData.teamId,
        tags: formData.tags.filter(tag => tag.trim() !== ''),
      };

      console.log('📤 Sending collaborator data through BFF:', JSON.stringify(bffData, null, 2));

      if (isEditing && id) {
        await collaboratorsBFFService.update(id, bffData);
      } else {
        // For create, we still need to generate UUID on the client
        // (or the BFF can handle this on the backend)
        await collaboratorsBFFService.create({
          ...bffData,
        });
      }

      navigate('/collaborators');
    } catch (err) {
      console.error('❌ Error saving collaborator through BFF:', err);
      setError(err instanceof Error ? err.message : 'Error saving collaborator');
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleCancel = () => {
    navigate('/collaborators');
  };

  return {
    formData,
    setFormData,
    positions,
    teams,
    newTag,
    setNewTag,
    loading,
    error,
    isEditing,
    handleSubmit,
    handleChange,
    handleAddTag,
    handleRemoveTag,
    handleKeyPress,
    handleCancel,
  };
};
