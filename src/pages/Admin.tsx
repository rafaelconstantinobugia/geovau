import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface AnalyticsData {
  totalHits: number;
  hitsByKind: Record<string, number>;
  topPOIs: { poi_title: string; count: number }[];
  recentHits: {
    poi_title: string;
    kind: string;
    created_at: string;
    dist_m: number | null;
  }[];
}

const Admin = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Total hits
        const { data: totalData, error: totalError } = await supabase
          .from('hits')
          .select('*', { count: 'exact', head: true });

        if (totalError) throw totalError;

        // Hits by kind
        const { data: kindData, error: kindError } = await supabase
          .from('hits')
          .select('kind');

        if (kindError) throw kindError;

        const hitsByKind = kindData.reduce((acc, hit) => {
          acc[hit.kind] = (acc[hit.kind] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        // Top POIs with hits
        const { data: topPOIsData, error: topPOIsError } = await supabase
          .from('hits')
          .select(`
            poi_id,
            pois!inner(title)
          `);

        if (topPOIsError) throw topPOIsError;

        const poiCounts = topPOIsData.reduce((acc, hit) => {
          const title = hit.pois?.title || 'Unknown POI';
          acc[title] = (acc[title] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const topPOIs = Object.entries(poiCounts)
          .map(([poi_title, count]) => ({ poi_title, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        // Recent hits
        const { data: recentData, error: recentError } = await supabase
          .from('hits')
          .select(`
            kind,
            dist_m,
            created_at,
            pois!inner(title)
          `)
          .order('created_at', { ascending: false })
          .limit(20);

        if (recentError) throw recentError;

        const recentHits = recentData.map(hit => ({
          poi_title: hit.pois?.title || 'Unknown POI',
          kind: hit.kind,
          created_at: hit.created_at,
          dist_m: hit.dist_m
        }));

        setAnalytics({
          totalHits: totalData?.length || 0,
          hitsByKind,
          topPOIs,
          recentHits
        });

      } catch (err) {
        console.error('Failed to fetch analytics:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'production') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Acesso Restrito</h1>
          <p className="text-muted-foreground">Esta página só está disponível em modo de desenvolvimento.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">A carregar dados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Erro</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Vau Explorer - Admin</h1>
          <p className="text-muted-foreground">Painel de controlo e analytics</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Total Hits */}
          <Card>
            <CardHeader>
              <CardTitle>Total de Eventos</CardTitle>
              <CardDescription>Todos os hits registados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {analytics?.totalHits || 0}
              </div>
            </CardContent>
          </Card>

          {/* Hits by Kind */}
          <Card>
            <CardHeader>
              <CardTitle>Eventos por Tipo</CardTitle>
              <CardDescription>Distribuição de interações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(analytics?.hitsByKind || {}).map(([kind, count]) => (
                <div key={kind} className="flex justify-between items-center">
                  <Badge variant="outline">{kind}</Badge>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Average Cards per Session */}
          <Card>
            <CardHeader>
              <CardTitle>Cartões por Sessão</CardTitle>
              <CardDescription>Métrica principal de engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {analytics?.hitsByKind?.open_card 
                  ? (analytics.hitsByKind.open_card / (analytics.hitsByKind.enter_radius || 1)).toFixed(1)
                  : '0.0'
                }
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Objetivo: ≥ 3.0
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Top POIs */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>POIs Mais Populares</CardTitle>
            <CardDescription>Pontos de interesse com mais interações</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics?.topPOIs.map((poi, index) => (
                <div key={poi.poi_title} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="font-medium">{poi.poi_title}</span>
                  </div>
                  <Badge>{poi.count} hits</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Hits */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Eventos Recentes</CardTitle>
            <CardDescription>Últimas 20 interações</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics?.recentHits.map((hit, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      {hit.kind}
                    </Badge>
                    <span className="text-sm font-medium">{hit.poi_title}</span>
                    {hit.dist_m !== null && (
                      <span className="text-xs text-muted-foreground">
                        {hit.dist_m}m
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(hit.created_at).toLocaleString('pt-PT')}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;