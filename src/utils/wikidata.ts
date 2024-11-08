import axios from 'axios';

interface WikidataEntity {
  id: string;
  label: string;
  description: string;
  relations: Array<{
    type: string;
    entity: string;
  }>;
}

export async function getWikidataEntities(topic: string): Promise<WikidataEntity[]> {
  try {
    // First, search for the topic to get Wikidata IDs
    const searchUrl = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(topic)}&language=en&format=json&origin=*`;
    const searchResponse = await axios.get(searchUrl);
    
    if (!searchResponse.data.search?.length) {
      return [];
    }

    // Get the first few relevant entities
    const entityIds = searchResponse.data.search
      .slice(0, 3)
      .map((result: any) => result.id);

    // Fetch detailed information for each entity
    const entities = await Promise.all(entityIds.map(async (id: string) => {
      const entityUrl = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${id}&languages=en&format=json&origin=*`;
      const entityResponse = await axios.get(entityUrl);
      const entity = entityResponse.data.entities[id];

      if (!entity) return null;

      const label = entity.labels?.en?.value || id;
      const description = entity.descriptions?.en?.value || '';
      const relations: Array<{ type: string; entity: string }> = [];

      // Extract relations from claims
      if (entity.claims) {
        for (const [propId, claims] of Object.entries(entity.claims)) {
          if (Array.isArray(claims)) {
            claims.forEach((claim: any) => {
              if (claim.mainsnak?.datavalue?.value?.id) {
                relations.push({
                  type: propId,
                  entity: claim.mainsnak.datavalue.value.id
                });
              }
            });
          }
        }
      }

      return {
        id,
        label,
        description,
        relations: relations.slice(0, 5) // Limit to top 5 relations
      };
    }));

    return entities.filter((e): e is WikidataEntity => e !== null);
  } catch (error) {
    console.error('Wikidata API error:', error);
    return [];
  }
}