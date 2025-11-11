import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { positionsService } from '../../services/positionsService';
import { CreatePositionRequest } from '../../types';

interface PositionFormData {
  name: string;
  description?: string;
}

interface UsePositionFormReturn {
  // Form data
  formData: PositionFormData;
  setFormData: React.Dispatch<React.SetStateAction<PositionFormData>>;
  
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

export const usePositionForm = (): UsePositionFormReturn => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<PositionFormData>({
    name: '',
    description: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadPosition(id);
    }
  }, [id]);

  const loadPosition = async (positionId: string) => {
    try {
      setLoading(true);
      const data = await positionsService.getById(positionId);
      setFormData({
        name: data.name,
        description: data.description || '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading position');
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
        throw new Error('Position name is required');
      }

      // Convert form data to API format
      const apiData: CreatePositionRequest = {
        id: uuidv4(), // Generate UUID for position
        name: formData.name.trim(),
        description: formData.description?.trim() || undefined,
      };

      console.log('Sending position data:', JSON.stringify(apiData, null, 2));

      if (isEditing && id) {
        // For updates, we can use the same data structure but remove the id field
        const { id: _, ...updateData } = apiData;
        await positionsService.update(id, updateData);
      } else {
        await positionsService.create(apiData);
      }

      navigate('/positions');
    } catch (err) {
      console.error('Error saving position:', err);
      setError(err instanceof Error ? err.message : 'Error saving position');
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
    navigate('/positions');
  };

  return {
    formData,
    setFormData,
    loading,
    error,
    isEditing,
    handleSubmit,
    handleChange,
    handleTextAreaChange,
    handleCancel,
  };
};