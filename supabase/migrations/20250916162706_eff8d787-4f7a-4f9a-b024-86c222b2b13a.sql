-- Remove all default POIs from the database
DELETE FROM pois WHERE id IN (
  'covao-mezaranhos',
  'covao-musaranhos', 
  'observatorio-das-salinas',
  'sapal-vau',
  'vista-lagoa'
);