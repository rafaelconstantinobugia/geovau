# Geo Vau - Test Script

## 2-Minute Quick Test

### Prerequisites
1. Configure Mapbox public token in Supabase Edge Function secrets
2. Ensure Supabase database is migrated with POIs and RLS policies
3. Deploy Edge Functions (automatic with Lovable)

### Test Steps

**Step 1: Landing Page**
1. Open `/` → verify landing page loads with "Geo Vau" title
2. Click "Abrir aplicação" → should navigate to `/app`

**Step 2: Main App Flow**
1. On `/app` → click "Ativar localização" 
2. Accept browser location permission prompt
3. Map should load with 3 POI markers (orange dots)
4. User location marker should appear (green pulsing dot)

**Step 3: Geofencing Test**
- **Option A (Field Test):** Walk within 60m of any POI → POI card should auto-open
- **Option B (Demo Mode):** Click "Demo Mode" button → simulates location at Covão dos Mezaranhos

**Step 4: Manual Interaction**
1. Click any orange marker on map → POI card should open
2. Close card and reopen via different marker
3. Try tag filters (fauna, flora, história) → markers should filter

**Step 5: Verify Analytics**
1. Go to `/admin` (dev mode only)
2. Check counters: total hits should be > 0
3. Recent events should show your interactions

### Edge Function Test (cURL)

```bash
curl -X POST "https://ruivacnxajjtywreghpl.supabase.co/functions/v1/log-hit" \
  -H "content-type: application/json" \
  -H "authorization: Bearer <SUPABASE_ANON_KEY>" \
  -d '{
    "poi_id": "<POI_UUID_FROM_DATABASE>",
    "kind": "manual_click",
    "lat": 39.4087,
    "lng": -9.2256,
    "dist_m": 10,
    "tz": "Europe/Lisbon",
    "ua": "test-client"
  }'
```

### Expected Results
- ✅ Location permission granted
- ✅ 3 POI markers visible on map
- ✅ Geofencing triggers POI cards automatically
- ✅ Manual marker clicks open cards
- ✅ Edge function logs hits to database
- ✅ Admin shows analytics data
- ✅ Rate limiting prevents spam (>60 hits/min/IP)

### Troubleshooting
- **Map not loading:** Check MAPBOX_PUBLIC_TOKEN in Supabase secrets
- **No POIs:** Verify database migration and seeded data
- **Geofencing not working:** Check browser location permissions
- **Edge function errors:** Check Supabase function logs

### Success Metrics
Primary metric: **Average cards opened per session ≥ 3.0**
- Monitor via Admin dashboard: `open_card` events / `enter_radius` events
- Target: Users opening multiple POI cards per visit

### Database Verification
```sql
-- Check POIs are seeded
SELECT count(*) FROM pois_public;

-- Check hits are being logged
SELECT count(*), kind FROM hits GROUP BY kind;

-- Check recent activity
SELECT poi_id, kind, created_at FROM hits ORDER BY created_at DESC LIMIT 10;
```