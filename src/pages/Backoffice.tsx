import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Edit, RefreshCw, Eye, EyeOff } from 'lucide-react';

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

export default function Backoffice() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [pois, setPois] = useState<POI[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingPoi, setEditingPoi] = useState<POI | null>(null);
  const { toast } = useToast();

  const authHeader = isAuthenticated ? `Basic ${btoa(`admin:${password}`)}` : '';

  const apiCall = async (method: string, body?: any) => {
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
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      // Test authentication by making a simple GET request
      const tempAuthHeader = `Basic ${btoa(`admin:${password}`)}`;
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': tempAuthHeader,
        },
      });

      if (response.ok) {
        setIsAuthenticated(true);
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
  };

  const loadPOIs = async () => {
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
  };

  const handleSavePoi = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const payload: Partial<POI> = {
      id: formData.get('id') as string || undefined,
      title: formData.get('title') as string,
      lat: Number(formData.get('lat')),
      lng: Number(formData.get('lng')),
      radius_m: Number(formData.get('radius_m') || 60),
      text: formData.get('text') as string || null,
      image_url: formData.get('image_url') as string || null,
      audio_url: formData.get('audio_url') as string || null,
      tags: (formData.get('tags') as string || '').split(',').map(s => s.trim()).filter(Boolean),
      published: formData.get('published') === 'on',
      title_en: formData.get('title_en') as string || null,
      title_es: formData.get('title_es') as string || null,
      title_fr: formData.get('title_fr') as string || null,
      text_en: formData.get('text_en') as string || null,
      text_es: formData.get('text_es') as string || null,
      text_fr: formData.get('text_fr') as string || null,
      tags_en: (formData.get('tags_en') as string || '').split(',').map(s => s.trim()).filter(Boolean) || null,
      tags_es: (formData.get('tags_es') as string || '').split(',').map(s => s.trim()).filter(Boolean) || null,
      tags_fr: (formData.get('tags_fr') as string || '').split(',').map(s => s.trim()).filter(Boolean) || null,
    };

    try {
      setLoading(true);
      const method = editingPoi ? 'PATCH' : 'POST';
      await apiCall(method, payload);
      
      toast({
        title: editingPoi ? "POI atualizado" : "POI criado",
        description: `${payload.title} foi ${editingPoi ? 'atualizado' : 'criado'} com sucesso`,
      });
      
      setEditingPoi(null);
      const form = e.currentTarget;
      if (form) {
        form.reset();
      }
      await loadPOIs();
    } catch (error) {
      toast({
        title: "Erro ao salvar POI",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePoi = async (poi: POI) => {
    if (!confirm(`Apagar "${poi.title}"?`)) return;
    
    try {
      setLoading(true);
      await apiCall('DELETE', { id: poi.id });
      toast({
        title: "POI apagado",
        description: `${poi.title} foi removido com sucesso`,
      });
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
  };

  const fillForm = (poi: POI) => {
    setEditingPoi(poi);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a password"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <Button 
              onClick={handleLogin} 
              className="w-full" 
              disabled={loading || !password}
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
            <form onSubmit={handleSavePoi} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="id">ID</Label>
                  <Input
                    id="id"
                    name="id"
                    defaultValue={editingPoi?.id || ''}
                    placeholder="Auto-gerado se vazio"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={editingPoi?.title || ''}
                    placeholder="Título do POI"
                    required
                  />
                </div>
                <div className="flex items-center space-x-2 pt-8">
                  <Checkbox
                    id="published"
                    name="published"
                    defaultChecked={editingPoi?.published ?? true}
                  />
                  <Label htmlFor="published">Publicado</Label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lat">Latitude *</Label>
                  <Input
                    id="lat"
                    name="lat"
                    type="number"
                    step="any"
                    defaultValue={editingPoi?.lat || ''}
                    placeholder="ex: 39.4035"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lng">Longitude *</Label>
                  <Input
                    id="lng"
                    name="lng"
                    type="number"
                    step="any"
                    defaultValue={editingPoi?.lng || ''}
                    placeholder="ex: -9.2067"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="radius_m">Raio (metros)</Label>
                  <Input
                    id="radius_m"
                    name="radius_m"
                    type="number"
                    defaultValue={editingPoi?.radius_m || 60}
                    placeholder="60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="image_url">URL da Imagem</Label>
                  <Input
                    id="image_url"
                    name="image_url"
                    defaultValue={editingPoi?.image_url || ''}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="audio_url">URL do Áudio</Label>
                  <Input
                    id="audio_url"
                    name="audio_url"
                    defaultValue={editingPoi?.audio_url || ''}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="text">Descrição</Label>
                <Textarea
                  id="text"
                  name="text"
                  defaultValue={editingPoi?.text || ''}
                  placeholder="Descrição do POI"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (separadas por vírgulas)</Label>
                <Input
                  id="tags"
                  name="tags"
                  defaultValue={(editingPoi?.tags || []).join(', ')}
                  placeholder="fauna, flora, história"
                />
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
                      defaultValue={editingPoi?.title_en || ''}
                      placeholder="English title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title_es">Título (ES)</Label>
                    <Input
                      id="title_es"
                      name="title_es"
                      defaultValue={editingPoi?.title_es || ''}
                      placeholder="Título en español"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title_fr">Título (FR)</Label>
                    <Input
                      id="title_fr"
                      name="title_fr"
                      defaultValue={editingPoi?.title_fr || ''}
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
                      defaultValue={editingPoi?.text_en || ''}
                      placeholder="English description"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="text_es">Descrição (ES)</Label>
                    <Textarea
                      id="text_es"
                      name="text_es"
                      defaultValue={editingPoi?.text_es || ''}
                      placeholder="Descripción en español"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="text_fr">Descrição (FR)</Label>
                    <Textarea
                      id="text_fr"
                      name="text_fr"
                      defaultValue={editingPoi?.text_fr || ''}
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
                      defaultValue={(editingPoi?.tags_en || []).join(', ')}
                      placeholder="wildlife, nature"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags_es">Tags (ES)</Label>
                    <Input
                      id="tags_es"
                      name="tags_es"
                      defaultValue={(editingPoi?.tags_es || []).join(', ')}
                      placeholder="fauna, naturaleza"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags_fr">Tags (FR)</Label>
                    <Input
                      id="tags_fr"
                      name="tags_fr"
                      defaultValue={(editingPoi?.tags_fr || []).join(', ')}
                      placeholder="faune, nature"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Guardando..." : editingPoi ? "Atualizar" : "Criar"}
                </Button>
                {editingPoi && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingPoi(null);
                      const form = document.querySelector('form') as HTMLFormElement;
                      form?.reset();
                    }}
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