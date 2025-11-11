import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { collaboratorsService } from '../../services/collaboratorsService';
import { positionsService } from '../../services/positionsService';
import { teamsService } from '../../services/teamsService';
import { Position, Team, CreateCollaboratorRequest } from '../../types';

interface CollaboratorFormData {
  firstName: string;
  lastName: string;
  position: string; // Este será el positionId
  teamId: string;
  tags: string[];
}

interface UseCollaboratorFormReturn {
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

export const useCollaboratorForm = (): UseCollaboratorFormReturn => {
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
  const [collaboratorLoaded, setCollaboratorLoaded] = useState(false);
  const [referencesLoaded, setReferencesLoaded] = useState(false); // Flag para evitar recargas
  const isLoadingRef = useRef(false); // Para evitar múltiples cargas simultáneas

  useEffect(() => {
    if (!referencesLoaded) {
      loadReferences();
    }
  }, [referencesLoaded]);

  useEffect(() => {
    if (id && referencesLoaded && positions.length > 0 && teams.length > 0 && !collaboratorLoaded && !isLoadingRef.current) {
      loadCollaborator(id);
    }
  }, [id, referencesLoaded, positions, teams, collaboratorLoaded]);

  // Debug: Verificar que los valores se mantienen
  /*
  useEffect(() => {
    console.log('🔄 Form state check:', {
      collaboratorLoaded,
      hasPosition: !!formData.position,
      hasTeam: !!formData.teamId,
      formData,
      positionsCount: positions.length,
      teamsCount: teams.length
    });
  }, [formData, collaboratorLoaded, positions, teams]);
  */

  const loadReferences = async () => {
    if (referencesLoaded || isLoadingRef.current) {
      console.log('🔄 Skipping reference load (already loaded or loading)');
      return;
    }
    
    try {
      isLoadingRef.current = true;
      
      const posData = await positionsService.getAllForDropdown();
      
      const teamData = await teamsService.getAllForDropdown();
      
      setPositions(posData || []);
      setTeams(teamData.data || []);
      setReferencesLoaded(true);
      
    } catch (err) {
      console.error('❌ Error loading references:', err);
      setError(err instanceof Error ? err.message : 'Error loading references');
    } finally {
      isLoadingRef.current = false;
    }
  };

  const loadCollaborator = async (collaboratorId: string) => {
    if (isLoadingRef.current) {
      console.log('🔄 Skipping collaborator load (already loading)');
      return; // Evitar múltiples cargas simultáneas
    }
    
    try {
      isLoadingRef.current = true;
      setLoading(true);
      console.log('🔄 Loading collaborator...');
      
      const data = await collaboratorsService.getById(collaboratorId);
      
      console.log('🔍 Raw collaborator data:', data);
      console.log('🔍 Available positions:', positions.map(p => ({ id: p.id, name: p.name })));
      console.log('🔍 Available teams:', teams.map(t => ({ id: t.id, name: t.name })));
      
      // Find position ID by position name
      const position = positions.find(p => p.id === data.position.id);
      const positionId = position?.id || '';
      
      // Find team by team id (data.team.id should match)
      const team = teams.find(t => t.id === data.team.id);
      const teamId = team?.id || data.team.id; // Fallback to original ID
      
      console.log('🔍 Position mapping:', {
        searchingFor: data.position,
        found: position,
        resultId: positionId
      });
      console.log('🔍 Team mapping:', {
        searchingFor: data.team.id,
        found: team,
        resultId: teamId
      });
      
      const newFormData = {
        firstName: data.firstName,
        lastName: data.lastName,
        position: positionId, // Store position ID
        teamId: teamId,
        tags: data.tags,
      };
      
      console.log('🔍 Setting form data:', newFormData);
      
      setFormData(newFormData);
      setCollaboratorLoaded(true); // Marcar como cargado para evitar re-ejecuciones
    } catch (err) {
      console.error('❌ Error loading collaborator:', err);
      setError(err instanceof Error ? err.message : 'Error loading collaborator');
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  };

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

      // Find selected position and team
      const selectedPosition = positions.find(p => p.id === formData.position);
      const selectedTeam = teams.find(t => t.id === formData.teamId);
      
      if (!selectedPosition) {
        throw new Error('Selected position not found');
      }
      if (!selectedTeam) {
        throw new Error('Selected team not found');
      }

      // Convert form data to API format
      const apiData: CreateCollaboratorRequest = {
        id: uuidv4(), // Generate UUID for collaborator
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        positionId: formData.position, // Send position ID
        teamId: formData.teamId, // Send team ID directly
        tags: formData.tags.filter(tag => tag.trim() !== ''), // Filter empty tags
      };

      console.log('Sending collaborator data:', JSON.stringify(apiData, null, 2));

      if (isEditing && id) {
        // For updates, we can use the same data structure but remove the id field
        const { id: _, ...updateData } = apiData;
        await collaboratorsService.update(id, updateData);
      } else {
        await collaboratorsService.create(apiData);
      }

      navigate('/collaborators');
    } catch (err) {
      console.error('Error saving collaborator:', err);
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
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
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