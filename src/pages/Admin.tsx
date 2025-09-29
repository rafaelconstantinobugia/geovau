import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Edit, RefreshCw, Eye, EyeOff, AlertCircle, MapPin } from 'lucide-react';
import BackofficeMap from '@/components/BackofficeMap';

interface POI {
  id: string;
  title: string;
  lat: number;
  lng: number;
  radius_m: number;
  text?: string;
  image_url?: string;
  audio_url?: string;
  tags: string[];
  color?: string;
  published: boolean;
  updated_at: string;
  title_en?: string;
  title_es?: string;
  title_fr?: string;
  text_en?: string;
  text_es?: string;
  text_fr?: string;
  tags_en?: string[];
  tags_es?: string[];
  tags_fr?: string[];
}

const API_URL = 'https://ruivacnxajjtywreghpl.supabase.co/functions/v1/admin-poi';

// Initial form state
const getInitialFormState = (): Partial<POI> => ({
  id: '',
  title: '',
  lat: 0,
  lng: 0,
  radius_m: 60,
  text: '',
  image_url: '',
  audio_url: '',
  tags: [],
  color: '#FF6A00',
  published: true,
  title_en: '',
  title_es: '',
  title_fr: '',
  text_en: '',
  text_es: '',
  text_fr: '',
  tags_en: [],
  tags_es: [],
  tags_fr: []
});

export default function Backoffice() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authPassword, setAuthPassword] = useState('');
  const [pois, setPois] = useState<POI[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingPoi, setEditingPoi] = useState<POI | null>(null);
  const [formData, setFormData] = useState<Partial<POI>>(getInitialFormState());
  const [formKey, setFormKey] = useState(0); // For forcing re-render
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showMap, setShowMap] = useState(false);
  const { toast } = useToast();

  // Store auth header securely
  const authHeader = useMemo(() => 
    isAuthenticated ? `Basic ${btoa(`admin:${authPassword}`)}` : ''
  , [isAuthenticated, authPassword]);

  const apiCall = useCallback(async (method: string, body?: any) => {
    const response = await fetch(API_URL, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: method === 'GET' ? null : JSON.stringify(body || {}),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Erro na operação');
    }
    return data;
  }, [authHeader]);

  const handleLogin = useCallback(async () => {
    try {
      setLoading(true);
      // Test authentication by making a simple GET request
      const tempAuthHeader = `Basic ${btoa(`admin:${authPassword}`)}`;
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': tempAuthHeader,
        },
      });

      if (response.ok) {
        setIsAuthenticated(true);
        // Clear password from login form but keep for auth
        await loadPOIs();
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao backoffice do GeoVau",
        });
      } else {
        throw new Error('Password incorreta');
      }
    } catch (error) {
      toast({
        title: "Erro de autenticação",
        description: error instanceof Error ? error.message : "Password incorreta",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [authPassword]);

  const loadPOIs = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await apiCall('GET');
      setPois(data || []);
    } catch (error) {
      toast({
        title: "Erro ao carregar POIs",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [apiCall, toast]);

  // Helper function to process tags
  const processTags = useCallback((tagString: string): string[] => {
    if (!tagString) return [];
    return tagString.split(',').map(s => s.trim()).filter(Boolean);
  }, []);

  // Form validation
  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.title?.trim()) {
      errors.title = 'Título é obrigatório';
    }
    
    if (!formData.lat || isNaN(formData.lat)) {
      errors.lat = 'Latitude deve ser um número válido';
    }
    
    if (!formData.lng || isNaN(formData.lng)) {
      errors.lng = 'Longitude deve ser um número válido';
    }
    
    if (formData.radius_m && (isNaN(formData.radius_m) || formData.radius_m <= 0)) {
      errors.radius_m = 'Raio deve ser um número positivo';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setEditingPoi(null);
    setFormData(getInitialFormState());
    setValidationErrors({});
    setFormKey(prev => prev + 1); // Force re-render
  }, []);

  const handleSavePoi = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os erros no formulário",
        variant: "destructive",
      });
      return;
    }

    const payload: Partial<POI> = {
      id: formData.id || undefined,
      title: formData.title!,
      lat: formData.lat!,
      lng: formData.lng!,
      radius_m: formData.radius_m || 60,
      text: formData.text || null,
      image_url: formData.image_url || null,
      audio_url: formData.audio_url || null,
      tags: processTags((formData.tags || []).join(',')),
      published: formData.published !== false,
      title_en: formData.title_en || null,
      title_es: formData.title_es || null,
      title_fr: formData.title_fr || null,
      text_en: formData.text_en || null,
      text_es: formData.text_es || null,
      text_fr: formData.text_fr || null,
      tags_en: processTags((formData.tags_en || []).join(',')) || null,
      tags_es: processTags((formData.tags_es || []).join(',')) || null,
      tags_fr: processTags((formData.tags_fr || []).join(',')) || null,
    };

    try {
      setSaving(true);
      const method = editingPoi ? 'PATCH' : 'POST';
      await apiCall(method, payload);
      
      toast({
        title: editingPoi ? "POI atualizado" : "POI criado",
        description: `${payload.title} foi ${editingPoi ? 'atualizado' : 'criado'} com sucesso`,
      });
      
      resetForm();
      await loadPOIs();
    } catch (error) {
      toast({
        title: "Erro ao salvar POI",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }, [formData, editingPoi, validateForm, processTags, apiCall, toast, loadPOIs, resetForm]);

  const handleDeletePoi = useCallback(async (poi: POI) => {
    if (!confirm(`Apagar "${poi.title}"?`)) return;
    
    try {
      setLoading(true);
      await apiCall('DELETE', { id: poi.id });
      toast({
        title: "POI apagado",
        description: `${poi.title} foi removido com sucesso`,
      });
      
      // If we're editing the deleted POI, clear the form
      if (editingPoi?.id === poi.id) {
        resetForm();
      }
      
      await loadPOIs();
    } catch (error) {
      toast({
        title: "Erro ao apagar POI",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [apiCall, toast, loadPOIs, editingPoi, resetForm]);

  // Fill form with POI data for editing
  const fillForm = useCallback((poi: POI) => {
    setEditingPoi(poi);
    setFormData({
      id: poi.id,
      title: poi.title,
      lat: poi.lat,
      lng: poi.lng,
      radius_m: poi.radius_m,
      text: poi.text || '',
      image_url: poi.image_url || '',
      audio_url: poi.audio_url || '',
      tags: poi.tags || [],
      published: poi.published,
      title_en: poi.title_en || '',
      title_es: poi.title_es || '',
      title_fr: poi.title_fr || '',
      text_en: poi.text_en || '',
      text_es: poi.text_es || '',
      text_fr: poi.text_fr || '',
      tags_en: poi.tags_en || [],
      tags_es: poi.tags_es || [],
      tags_fr: poi.tags_fr || []
    });
    setValidationErrors({});
    setFormKey(prev => prev + 1); // Force re-render
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Update form field
  const updateFormField = useCallback((field: keyof POI, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [validationErrors]);

  // Handle coordinates change from map
  const handleCoordinatesChange = useCallback((lat: number, lng: number) => {
    setFormData(prev => ({ ...prev, lat, lng }));
    // Clear validation errors for coordinates
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.lat;
      delete newErrors.lng;
      return newErrors;
    });
  }, []);

  // Load POIs on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadPOIs();
    }
  }, [isAuthenticated, loadPOIs]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Backoffice • GeoVau</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="Digite a password"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <Button 
              onClick={handleLogin} 
              className="w-full" 
              disabled={loading || !authPassword}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Proteção básica. A password não é guardada no browser.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Backoffice • GeoVau</h1>
          <Button onClick={loadPOIs} disabled={loading} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Recarregar
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{editingPoi ? 'Editar POI' : 'Criar POI'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form key={formKey} onSubmit={handleSavePoi} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="id">ID</Label>
                  <Input
                    id="id"
                    name="id"
                    value={formData.id || ''}
                    onChange={(e) => updateFormField('id', e.target.value)}
                    placeholder="Auto-gerado se vazio"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title" className="flex items-center gap-1">
                    Título *
                    {validationErrors.title && (
                      <AlertCircle className="w-4 h-4 text-destructive" />
                    )}
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title || ''}
                    onChange={(e) => updateFormField('title', e.target.value)}
                    placeholder="Título do POI"
                    className={validationErrors.title ? 'border-destructive' : ''}
                  />
                  {validationErrors.title && (
                    <p className="text-sm text-destructive">{validationErrors.title}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2 pt-8">
                  <Checkbox
                    id="published"
                    name="published"
                    checked={formData.published !== false}
                    onCheckedChange={(checked) => updateFormField('published', checked)}
                  />
                  <Label htmlFor="published">Publicado</Label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lat" className="flex items-center gap-1">
                    Latitude *
                    {validationErrors.lat && (
                      <AlertCircle className="w-4 h-4 text-destructive" />
                    )}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="lat"
                      name="lat"
                      type="number"
                      step="any"
                      value={formData.lat || ''}
                      onChange={(e) => updateFormField('lat', Number(e.target.value))}
                      placeholder="ex: 39.4035"
                      className={validationErrors.lat ? 'border-destructive' : ''}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowMap(!showMap)}
                      className="flex-shrink-0"
                    >
                      <MapPin className="w-4 h-4" />
                    </Button>
                  </div>
                  {validationErrors.lat && (
                    <p className="text-sm text-destructive">{validationErrors.lat}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lng" className="flex items-center gap-1">
                    Longitude *
                    {validationErrors.lng && (
                      <AlertCircle className="w-4 h-4 text-destructive" />
                    )}
                  </Label>
                  <Input
                    id="lng"
                    name="lng"
                    type="number"
                    step="any"
                    value={formData.lng || ''}
                    onChange={(e) => updateFormField('lng', Number(e.target.value))}
                    placeholder="ex: -9.2067"
                    className={validationErrors.lng ? 'border-destructive' : ''}
                  />
                  {validationErrors.lng && (
                    <p className="text-sm text-destructive">{validationErrors.lng}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="radius_m" className="flex items-center gap-1">
                    Raio (metros)
                    {validationErrors.radius_m && (
                      <AlertCircle className="w-4 h-4 text-destructive" />
                    )}
                  </Label>
                  <Input
                    id="radius_m"
                    name="radius_m"
                    type="number"
                    value={formData.radius_m || 60}
                    onChange={(e) => updateFormField('radius_m', Number(e.target.value))}
                    placeholder="60"
                    className={validationErrors.radius_m ? 'border-destructive' : ''}
                  />
                  {validationErrors.radius_m && (
                    <p className="text-sm text-destructive">{validationErrors.radius_m}</p>
                  )}
                </div>
              </div>

              {/* Map for coordinate selection */}
              {showMap && (
                <div className="space-y-2">
                  <Label>Selecionar Coordenadas no Mapa</Label>
                  <BackofficeMap
                    lat={formData.lat || 39.4070}
                    lng={formData.lng || -9.2200}
                    onCoordinatesChange={handleCoordinatesChange}
                    isOpen={showMap}
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowMap(false)}
                    >
                      Fechar Mapa
                    </Button>
                    {formData.lat && formData.lng && (
                      <p className="text-sm text-muted-foreground flex items-center">
                        Coordenadas: {formData.lat.toFixed(5)}, {formData.lng.toFixed(5)}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="image_url">URL da Imagem</Label>
                  <Input
                    id="image_url"
                    name="image_url"
                    value={formData.image_url || ''}
                    onChange={(e) => updateFormField('image_url', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="audio_url">URL do Áudio</Label>
                  <Input
                    id="audio_url"
                    name="audio_url"
                    value={formData.audio_url || ''}
                    onChange={(e) => updateFormField('audio_url', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="text">Descrição</Label>
                <Textarea
                  id="text"
                  name="text"
                  value={formData.text || ''}
                  onChange={(e) => updateFormField('text', e.target.value)}
                  placeholder="Descrição do POI"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (separadas por vírgulas)</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={(formData.tags || []).join(', ')}
                  onChange={(e) => updateFormField('tags', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  placeholder="fauna, flora, história"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Cor do POI</Label>
                <div className="flex gap-2">
                  <Input
                    id="color"
                    name="color"
                    type="color"
                    value={formData.color || '#FF6A00'}
                    onChange={(e) => updateFormField('color', e.target.value)}
                    className="w-20 h-10 p-1 rounded cursor-pointer"
                  />
                  <Input
                    value={formData.color || '#FF6A00'}
                    onChange={(e) => updateFormField('color', e.target.value)}
                    placeholder="#FF6A00"
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Translations */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold">Traduções</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title_en">Título (EN)</Label>
                    <Input
                      id="title_en"
                      name="title_en"
                      value={formData.title_en || ''}
                      onChange={(e) => updateFormField('title_en', e.target.value)}
                      placeholder="English title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title_es">Título (ES)</Label>
                    <Input
                      id="title_es"
                      name="title_es"
                      value={formData.title_es || ''}
                      onChange={(e) => updateFormField('title_es', e.target.value)}
                      placeholder="Título en español"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title_fr">Título (FR)</Label>
                    <Input
                      id="title_fr"
                      name="title_fr"
                      value={formData.title_fr || ''}
                      onChange={(e) => updateFormField('title_fr', e.target.value)}
                      placeholder="Titre en français"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="text_en">Descrição (EN)</Label>
                    <Textarea
                      id="text_en"
                      name="text_en"
                      value={formData.text_en || ''}
                      onChange={(e) => updateFormField('text_en', e.target.value)}
                      placeholder="English description"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="text_es">Descrição (ES)</Label>
                    <Textarea
                      id="text_es"
                      name="text_es"
                      value={formData.text_es || ''}
                      onChange={(e) => updateFormField('text_es', e.target.value)}
                      placeholder="Descripción en español"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="text_fr">Descrição (FR)</Label>
                    <Textarea
                      id="text_fr"
                      name="text_fr"
                      value={formData.text_fr || ''}
                      onChange={(e) => updateFormField('text_fr', e.target.value)}
                      placeholder="Description en français"
                      rows={2}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tags_en">Tags (EN)</Label>
                    <Input
                      id="tags_en"
                      name="tags_en"
                      value={(formData.tags_en || []).join(', ')}
                      onChange={(e) => updateFormField('tags_en', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                      placeholder="wildlife, nature"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags_es">Tags (ES)</Label>
                    <Input
                      id="tags_es"
                      name="tags_es"
                      value={(formData.tags_es || []).join(', ')}
                      onChange={(e) => updateFormField('tags_es', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                      placeholder="fauna, naturaleza"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags_fr">Tags (FR)</Label>
                    <Input
                      id="tags_fr"
                      name="tags_fr"
                      value={(formData.tags_fr || []).join(', ')}
                      onChange={(e) => updateFormField('tags_fr', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                      placeholder="faune, nature"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={saving || loading}>
                  {saving ? "Guardando..." : editingPoi ? "Atualizar" : "Criar"}
                </Button>
                {editingPoi && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    disabled={saving || loading}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>POIs Existentes ({pois.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Coordenadas</TableHead>
                    <TableHead>Raio</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pois.map((poi) => (
                    <TableRow key={poi.id}>
                      <TableCell className="font-mono text-sm">{poi.id}</TableCell>
                      <TableCell className="font-medium">{poi.title}</TableCell>
                      <TableCell className="text-sm">
                        {poi.lat.toFixed(5)}, {poi.lng.toFixed(5)}
                      </TableCell>
                      <TableCell>{poi.radius_m}m</TableCell>
                      <TableCell>
                        {poi.published ? (
                          <span className="flex items-center text-green-600">
                            <Eye className="w-4 h-4 mr-1" />
                            Público
                          </span>
                        ) : (
                          <span className="flex items-center text-gray-500">
                            <EyeOff className="w-4 h-4 mr-1" />
                            Privado
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => fillForm(poi)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeletePoi(poi)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}