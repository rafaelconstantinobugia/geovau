-- Add translations for existing POIs

-- Covão dos Mezaranhos • Avifauna
UPDATE pois SET 
  title_en = 'Covão dos Mezaranhos • Birdlife',
  title_es = 'Covão dos Mezaranhos • Avifauna', 
  title_fr = 'Covão dos Mezaranhos • Avifaune',
  text_en = 'Herons and waders. Avoid noise.',
  text_es = 'Garzas y limícolas. Evita ruido.',
  text_fr = 'Hérons et limicoles. Évitez le bruit.',
  tags_en = ARRAY['wildlife'],
  tags_es = ARRAY['fauna'],
  tags_fr = ARRAY['faune']
WHERE id = 'covao-mezaranhos';

-- Sapal do Vau • Flora halófita  
UPDATE pois SET
  title_en = 'Vau Salt Marsh • Halophytic Flora',
  title_es = 'Sapal del Vau • Flora halófita',
  title_fr = 'Marais salé du Vau • Flore halophyte',
  text_en = 'Glasswort and cordgrass. Do not harvest.',
  text_es = 'Salicornia y spartina. No cosechar.',
  text_fr = 'Salicorne et spartine. Ne pas récolter.',
  tags_en = ARRAY['flora'],
  tags_es = ARRAY['flora'], 
  tags_fr = ARRAY['flore']
WHERE id = 'sapal-vau';

-- Vista para a Lagoa • História
UPDATE pois SET
  title_en = 'Lagoon View • History',
  title_es = 'Vista a la Laguna • Historia', 
  title_fr = 'Vue sur la Lagune • Histoire',
  text_en = 'Largest coastal lagoon in PT. Sea openings shape fishing.',
  text_es = 'Mayor laguna costera de PT. Aberturas al mar moldean la pesca.',
  text_fr = 'Plus grande lagune côtière du PT. Les ouvertures marines façonnent la pêche.',
  tags_en = ARRAY['history'],
  tags_es = ARRAY['historia'],
  tags_fr = ARRAY['histoire']
WHERE id = 'vista-lagoa';