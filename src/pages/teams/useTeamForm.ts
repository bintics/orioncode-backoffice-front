import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { teamsService } from '../../services/teamsService';
import { CreateTeamRequest } from '../../types';

interface TeamFormData {
  name: string;
  description: string;
}

interface UseTeamFormReturn {
  // Form data
  formData: TeamFormData;
  setFormData: React.Dispatch<React.SetStateAction<TeamFormData>>;
  
  // Tag management
  newTag: string;
  setNewTag: React.Dispatch<React.SetStateAction<string>>;
  
  // States
  loading: boolean;
  error: string | null;
  isEditing: boolean;
  
  // Handlers
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTextAreaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleCancel: () => void;
}

export const useTeamForm = (): UseTeamFormReturn => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<TeamFormData>({
    name: '',
    description: '',
  });
  
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadTeam(id);
    }
  }, [id]);

  const loadTeam = async (teamId: string) => {
    try {
      setLoading(true);
      const response = await teamsService.getById(teamId);
      console.log('Loaded team data:', response);
      setFormData({
        name: response.name,
        description: response.description || '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading team');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error('Team name is required');
      }

      // Convert form data to API format
      const apiData: CreateTeamRequest = {
        id: uuidv4(), // Generate UUID for team
        name: formData.name.trim(),
        description: formData.description.trim() || ''
      };

      console.log('Sending team data:', JSON.stringify(apiData, null, 2));

      if (isEditing && id) {
        // For updates, we can use the same data structure but remove the id field
        const { id: _, ...updateData } = apiData;
        await teamsService.update(id, updateData);
      } else {
        await teamsService.create(apiData);
      }

      navigate('/teams');
    } catch (err) {
      console.error('Error saving team:', err);
      setError(err instanceof Error ? err.message : 'Error saving team');
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCancel = () => {
    navigate('/teams');
  };

  return {
    formData,
    setFormData,
    newTag,
    setNewTag,
    loading,
    error,
    isEditing,
    handleSubmit,
    handleChange,
    handleTextAreaChange,
    handleCancel,
  };
};