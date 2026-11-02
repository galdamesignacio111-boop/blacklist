const http = require('http');
const { URL } = require('url');

const PORT = Number(process.env.PORT || 8787);
const NC_REGIONS = ['la', 'nae', 'naw', 'eu', 'as'];

const NC_CLASS_MAP = [
  [5, 'Gladiator'],
  [9, 'Templar'],
  [13, 'Ranger'],
  [17, 'Assassin'],
  [21, 'Spiritmaster'],
  [25, 'Sorcerer'],
  [29, 'Cleric'],
  [33, 'Chanter'],
];

function json(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(body);
}

function noContent(res) {
  res.writeHead(204, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end();
}

function parseNumber(value, fallback = null) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function sanitizeText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function stripHtml(value) {
  return sanitizeText(String(value || '').replace(/<[^>]*>/g, ''));
}

function decodeIfEncoded(value) {
  const raw = sanitizeText(value);
  if (!raw) return '';
  try {
    return raw.includes('%') ? decodeURIComponent(raw) : raw;
  } catch (error) {
    return raw;
  }
}

function ncClassFromPcId(pcId) {
  const numericPcId = Number(pcId);
  const found = NC_CLASS_MAP.find(([base]) => numericPcId >= base && numericPcId < base + 4);
  return found ? found[1] : '';
}

function inferRegionFromServerId(serverId) {
  const map = { 1: 'nae', 2: 'naw', 3: 'eu', 4: 'la', 5: 'as' };
  const numericServerId = Number(serverId);
  const prefix = Math.floor(numericServerId / 100) % 10;
  return map[prefix] || '';
}

function buildSearchUrl(name, region, locale = 'es-ES') {
  const params = new URLSearchParams({
    keyword: name,
    region,
    localeInfo: locale,
    page: '1',
    size: '20',
  });
  return `https://api-search.plaync.com/aion2global/search/v2/character?${params.toString()}`;
}

function buildInfoUrl({ region, serverId, characterId }, locale = 'es-ES') {
  const params = new URLSearchParams({
    lang: locale,
    region,
    serverId: String(serverId),
    characterId,
  });
  return `https://aion2.plaync.com/api/character/info?${params.toString()}`;
}

function buildEquipUrl({ region, serverId, characterId }, locale = 'es-ES') {
  const params = new URLSearchParams({
    lang: locale,
    region,
    serverId: String(serverId),
    characterId,
  });
  return `https://aion2.plaync.com/api/character/equipment?${params.toString()}`;
}

async function fetchJson(url, timeoutMs = 15000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Blacklist-NC-Proxy/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const text = await response.text();
    const parsed = JSON.parse(text);

    if (parsed && typeof parsed.contents === 'string' && !parsed.list && !parsed.profile) {
      return JSON.parse(parsed.contents);
    }

    return parsed;
  } finally {
    clearTimeout(timeoutId);
  }
}

function extractSearchList(payload) {
  if (Array.isArray(payload?.list)) return payload.list;
  if (Array.isArray(payload?.data?.list)) return payload.data.list;
  if (Array.isArray(payload?.characters)) return payload.characters;
  if (Array.isArray(payload?.result?.list)) return payload.result.list;
  return [];
}

function mapSearchCandidate(raw, region) {
  const characterId = decodeIfEncoded(raw.characterId || raw.cid || raw.id || raw.nameId);
  const serverId = parseNumber(raw.serverId || raw.sid || raw.worldId || raw.serverNo);
  const characterName = stripHtml(raw.characterName || raw.name || raw.keyword || '');
  const className = sanitizeText(raw.className || raw.jobName || ncClassFromPcId(raw.pcId));
  const level = parseNumber(raw.characterLevel || raw.level);
  const cp = parseNumber(raw.combatPower || raw.cp || raw.power);
  const il = parseNumber(raw.itemLevel || raw.il);
  const serverName = sanitizeText(raw.serverName || raw.worldName || '');

  if (!characterId || !serverId || !characterName) {
    return null;
  }

  return {
    region,
    characterId,
    serverId,
    characterName,
    className,
    level,
    cp,
    il,
    serverName,
  };
}

function pickBestCandidate(candidates, targetName) {
  if (!candidates.length) return null;
  const normalizedName = String(targetName || '').trim().toLowerCase();
  const exact = candidates.filter((item) => item.characterName.trim().toLowerCase() === normalizedName);
  const list = exact.length ? exact : candidates;
  return [...list].sort((a, b) => {
    const cpDiff = (b.cp || 0) - (a.cp || 0);
    if (cpDiff !== 0) return cpDiff;

    const levelDiff = (b.level || 0) - (a.level || 0);
    if (levelDiff !== 0) return levelDiff;

    return (a.serverName || '').localeCompare(b.serverName || '');
  })[0];
}

function pickBestCandidateWithHints(candidates, targetName, { className = '', serverName = '' } = {}) {
  const desiredClass = sanitizeText(className).toLowerCase();
  const desiredServer = sanitizeText(serverName).toLowerCase();
  let pool = candidates;

  if (desiredClass) {
    const classMatches = pool.filter((item) => (item.className || '').toLowerCase() === desiredClass);
    if (classMatches.length) {
      pool = classMatches;
    }
  }

  if (desiredServer) {
    const serverMatches = pool.filter((item) => (item.serverName || '').toLowerCase() === desiredServer);
    if (serverMatches.length) {
      pool = serverMatches;
    }
  }

  return pickBestCandidate(pool, targetName);
}

function extractItemLevel(infoPayload) {
  const profile = infoPayload?.profile || {};
  const direct = parseNumber(profile.itemLevel);
  if (direct && direct > 0) return direct;

  const statList = Array.isArray(infoPayload?.stat?.statList) ? infoPayload.stat.statList : [];
  const itemLevelStat = statList.find((item) => item?.type === 'ItemLevel');
  return parseNumber(itemLevelStat?.value);
}

function buildProfileSummary(infoPayload, equipPayload, fallbackRegion) {
  const profile = infoPayload?.profile;
  if (!profile) return null;

  const region = inferRegionFromServerId(profile.serverId) || fallbackRegion;

  return {
    region,
    serverId: Number(profile.serverId),
    characterId: sanitizeText(profile.characterId),
    characterName: sanitizeText(profile.characterName),
    className: sanitizeText(profile.className || ncClassFromPcId(profile.pcId)),
    level: parseNumber(profile.characterLevel),
    cp: parseNumber(profile.combatPower),
    il: extractItemLevel(infoPayload),
    serverName: sanitizeText(profile.serverName),
    legion: sanitizeText(profile.regionName),
    race: sanitizeText(profile.raceName),
    updatedAt: new Date().toISOString(),
    hasEquipment: Array.isArray(equipPayload?.equipment?.equipmentList),
  };
}

async function handleSearch(reqUrl, res) {
  const name = sanitizeText(reqUrl.searchParams.get('name'));
  const locale = sanitizeText(reqUrl.searchParams.get('locale')) || 'es-ES';
  const regionParam = sanitizeText(reqUrl.searchParams.get('region'));

  if (!name) {
    return json(res, 400, { error: 'Missing query param: name' });
  }

  const targetRegions = regionParam && NC_REGIONS.includes(regionParam) ? [regionParam] : NC_REGIONS;
  const results = [];

  for (const region of targetRegions) {
    try {
      const payload = await fetchJson(buildSearchUrl(name, region, locale));
      const list = extractSearchList(payload)
        .map((item) => mapSearchCandidate(item, region))
        .filter(Boolean);
      results.push(...list);
    } catch (error) {
      // Skip failed regions and continue with the rest.
    }
  }

  return json(res, 200, {
    query: name,
    count: results.length,
    candidates: results,
  });
}

async function handleResolve(reqUrl, res) {
  const name = sanitizeText(reqUrl.searchParams.get('name'));
  if (!name) {
    return json(res, 400, { error: 'Missing query param: name' });
  }

  const locale = sanitizeText(reqUrl.searchParams.get('locale')) || 'es-ES';
  const regionParam = sanitizeText(reqUrl.searchParams.get('region'));
  const className = sanitizeText(reqUrl.searchParams.get('className'));
  const serverName = sanitizeText(reqUrl.searchParams.get('serverName'));
  const targetRegions = regionParam && NC_REGIONS.includes(regionParam) ? [regionParam] : NC_REGIONS;

  const candidates = [];
  for (const region of targetRegions) {
    try {
      const payload = await fetchJson(buildSearchUrl(name, region, locale));
      const list = extractSearchList(payload)
        .map((item) => mapSearchCandidate(item, region))
        .filter(Boolean);
      candidates.push(...list);
    } catch (error) {
      // Ignore failed regions.
    }
  }

  const best = pickBestCandidateWithHints(candidates, name, { className, serverName });
  if (!best) {
    return json(res, 404, { error: 'Character not found', query: name, candidates: [] });
  }

  return json(res, 200, {
    query: name,
    hints: { className, serverName, region: regionParam || 'all' },
    summary: best,
    candidates,
  });
}

async function handleProfile(reqUrl, res) {
  const region = sanitizeText(reqUrl.searchParams.get('region'));
  const characterId = sanitizeText(reqUrl.searchParams.get('characterId'));
  const serverId = parseNumber(reqUrl.searchParams.get('serverId'));
  const locale = sanitizeText(reqUrl.searchParams.get('locale')) || 'es-ES';

  if (!region || !characterId || !serverId) {
    return json(res, 400, {
      error: 'Missing query params: region, serverId, characterId',
    });
  }

  try {
    const args = { region, serverId, characterId };
    const [infoPayload, equipPayload] = await Promise.all([
      fetchJson(buildInfoUrl(args, locale)),
      fetchJson(buildEquipUrl(args, locale)),
    ]);

    const summary = buildProfileSummary(infoPayload, equipPayload, region);
    if (!summary) {
      return json(res, 502, { error: 'Invalid response from NC info endpoint' });
    }

    return json(res, 200, {
      summary,
      info: infoPayload,
      equip: equipPayload,
    });
  } catch (error) {
    return json(res, 502, {
      error: 'Unable to fetch NC profile',
      details: error?.message || 'unknown',
    });
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    return noContent(res);
  }

  if (req.method !== 'GET') {
    return json(res, 405, { error: 'Method not allowed' });
  }

  let reqUrl;
  try {
    reqUrl = new URL(req.url, `http://${req.headers.host}`);
  } catch (error) {
    return json(res, 400, { error: 'Invalid URL' });
  }

  if (reqUrl.pathname === '/health') {
    return json(res, 200, { ok: true, service: 'nc-proxy', now: new Date().toISOString() });
  }

  if (reqUrl.pathname === '/api/nc/search') {
    return handleSearch(reqUrl, res);
  }

  if (reqUrl.pathname === '/api/nc/resolve') {
    return handleResolve(reqUrl, res);
  }

  if (reqUrl.pathname === '/api/nc/profile') {
    return handleProfile(reqUrl, res);
  }

  return json(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => {
  console.log(`NC proxy running on http://localhost:${PORT}`);
});
