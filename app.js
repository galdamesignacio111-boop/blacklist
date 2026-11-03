const STORAGE_KEY = 'aion2-party-manager-v2';
const THEME_KEY = 'aion2-party-theme';
const AUTH_ROLE_KEY = 'aion2-party-role';
const NC_API_BASE_KEY = 'aion2-party-nc-api-base';
const NC_REGION_KEY = 'aion2-party-nc-region';
const NC_DEFAULT_API_BASE = (window.BLACKLIST_APP_CONFIG?.ncApiBase || '').replace(/\/+$|\s+$/g, '');
const MARKET_DEFAULT_URL = 'https://aion2.exchange';
const STAFF_PASSWORD = 'blacklist2026';
const NC_REGIONS = ['la', 'nae', 'naw', 'eu', 'as'];
const MAX_MEMBERS_PER_PARTY = 5;
const MAX_PARTIES_PER_FORCE = 4;
const MAX_TOTAL_MEMBERS = 128;
const editingMemberId = { value: null };
const selectedMemberId = { value: null };
const draggedMemberId = { value: null };
const selectedClassFilter = { value: null };
const syncState = { busy: false };
const roleState = { value: 'viewer' };
const CLASSES = [
  'Templar',
  'Assassin',
  'Ranger',
  'Cleric',
  'Chanter',
  'Elementalist',
  'Sorcerer',
  'Gladiator',
];

const CLASS_META = {
  Templar: { icon: '🛡', color: '#9dc9ff', iconUrl: 'image/Templar-icon-aion2-wiki-guide.avif' },
  Assassin: { icon: '🗡', color: '#79f0b3', iconUrl: 'image/Assassin-icon-aion2-wiki-guide.avif' },
  Ranger: { icon: '🏹', color: '#4ade9a', iconUrl: 'image/Ranger-icon-aion2-wiki-guide.avif' },
  Cleric: { icon: '✚', color: '#f7d77f', iconUrl: 'image/Cleric-icon-aion2-wiki-guide.avif' },
  Chanter: { icon: '♫', color: '#ff9d4d', iconUrl: 'image/Chanter-icon-aion2-wiki-guide.avif' },
  Elementalist: { icon: '✦', color: '#b56cff', iconUrl: 'image/Elementalist-icon-aion2-wiki-guide.avif' },
  Sorcerer: { icon: '✧', color: '#b8a2ff', iconUrl: 'image/Sorcerer-icon-aion2-wiki-guide.avif' },
  Gladiator: { icon: '⚔', color: '#7dd3ff', iconUrl: 'image/Gladiator-icon-aion2-wiki-guide.avif' },
};

const TARGET_CLASS_COUNTS = {
  Templar: 13,
  Assassin: 19,
  Ranger: 14,
  Cleric: 23,
  Chanter: 13,
  Elementalist: 13,
  Sorcerer: 10,
  Gladiator: 13,
};

const NAME_ALIASES = {
  legolock: 'Legoblack',
};

const CLASS_OVERRIDES = {
  Anesa: 'Templar',
  Brazu: 'Templar',
  JohnConno: 'Templar',
  Mukombo: 'Templar',
  Murnier: 'Templar',
  Pikaboss: 'Templar',
  Ryohei: 'Templar',
  SaltyHead: 'Templar',
  Serenir: 'Templar',
  Tinta: 'Templar',
  Traxer: 'Templar',
  WACHINA: 'Templar',
  Celthy: 'Assassin',
  CrowXair: 'Assassin',
  Epsilon: 'Assassin',
  Ghohard: 'Assassin',
  Jore: 'Assassin',
  kacaguate: 'Assassin',
  Lyssara: 'Assassin',
  MeMe: 'Assassin',
  Milei: 'Assassin',
  SashaGrey: 'Assassin',
  Sattziel: 'Assassin',
  Saymoon: 'Assassin',
  SnowyWa: 'Assassin',
  Wazahh: 'Templar',
  Zeicro: 'Assassin',
  ZEICRO: 'Assassin',
  Squalt: 'Assassin',
  Tankesao: 'Assassin',
  Wizky: 'Assassin',
  Y3KA: 'Assassin',
  Yapur: 'Assassin',
  Bersa: 'Ranger',
  Bycrow: 'Ranger',
  BycroW: 'Ranger',
  CaioC: 'Ranger',
  Charutera: 'Ranger',
  FinalF: 'Ranger',
  FinaF: 'Ranger',
  Guytre: 'Ranger',
  Legoblack: 'Ranger',
  Legolock: 'Ranger',
  Lulith: 'Ranger',
  Nadia: 'Ranger',
  Paraibinho: 'Ranger',
  SanGra: 'Ranger',
  Semaga: 'Ranger',
  Seuz: 'Ranger',
  Western: 'Ranger',
  Ahime: 'Cleric',
  Betra: 'Cleric',
  CaeraDenoir: 'Cleric',
  Chokyz: 'Cleric',
  Cukicco: 'Cleric',
  Edran: 'Cleric',
  ElJuguetero: 'Cleric',
  ElMaly: 'Cleric',
  Frankleon: 'Cleric',
  FranX: 'Cleric',
  LeCat: 'Cleric',
  Lemonpie: 'Cleric',
  Less: 'Cleric',
  Lya: 'Cleric',
  Meymey: 'Cleric',
  MKHD: 'Cleric',
  Mysara: 'Cleric',
  Netanyahuxd: 'Cleric',
  Pirou: 'Cleric',
  Pirov: 'Cleric',
  ven7s: 'Cleric',
  Wig0: 'Cleric',
  WigO: 'Cleric',
  Yakira: 'Cleric',
  Zureth: 'Cleric',
  DarkLatioS: 'Chanter',
  DarKLatioS: 'Chanter',
  JozereFF: 'Chanter',
  Kraquita: 'Chanter',
  Lupor: 'Chanter',
  Luuqitas10: 'Chanter',
  Luquitas10: 'Chanter',
  martoo: 'Chanter',
  Orion: 'Chanter',
  Osakina: 'Chanter',
  Problemitas: 'Chanter',
  Seusha: 'Chanter',
  Sheremie: 'Chanter',
  tronatsu: 'Chanter',
  Zantanico: 'Chanter',
  Borkz: 'Elementalist',
  Crossier: 'Elementalist',
  Darkness: 'Elementalist',
  Hyzko: 'Elementalist',
  LaParcovich: 'Elementalist',
  LittleWolfie: 'Elementalist',
  Mathi: 'Elementalist',
  nuts: 'Elementalist',
  Scottyyy: 'Elementalist',
  Sneezy: 'Elementalist',
  spiritmance: 'Elementalist',
  Vasyr: 'Elementalist',
  Woodynator: 'Elementalist',
  Ayudita: 'Sorcerer',
  Blizzard: 'Sorcerer',
  Chris: 'Sorcerer',
  ClooW: 'Sorcerer',
  Grumpy: 'Sorcerer',
  kilefaa: 'Sorcerer',
  magordita: 'Sorcerer',
  Nirvesta: 'Sorcerer',
  Pix: 'Sorcerer',
  Valentina: 'Sorcerer',
  Asmundr: 'Gladiator',
  Bjorn: 'Gladiator',
  cliff: 'Gladiator',
  Dethrone: 'Gladiator',
  estresad: 'Gladiator',
  Galoc: 'Gladiator',
  Kaiser: 'Gladiator',
  Kipus: 'Gladiator',
  Luacrii: 'Gladiator',
  LucaRed: 'Gladiator',
  MrLucky: 'Gladiator',
  NOOBKING: 'Gladiator',
  Ronso: 'Gladiator',
  Legoblack: 'Ranger',
  Legolock: 'Ranger',
  Seusz: 'Ranger',
  BycroW: 'Ranger',
  Dethrone: 'Gladiator',
  Ghohard: 'Assassin',
  Kaiser: 'Gladiator',
  Cukicco: 'Cleric',
  Wig0: 'Cleric',
};

const SEED_MEMBERS = [
  { name: 'Ayudita', className: 'Templar' },
  { name: 'CaioC', className: 'Templar' },
  { name: 'CrowXair', className: 'Templar' },
  { name: 'estresad', className: 'Templar' },
  { name: 'Hyzko', className: 'Templar' },
  { name: 'Kraquita', className: 'Templar' },
  { name: 'Lulith', className: 'Templar' },
  { name: 'MeMe', className: 'Templar' },
  { name: 'Netanyahuxd', className: 'Templar' },
  { name: 'Pirou', className: 'Templar' },
  { name: 'Sattziel', className: 'Templar' },
  { name: 'SnowyWa', className: 'Templar' },
  { name: 'Vasyr', className: 'Templar' },
  { name: 'Y3KA', className: 'Cleric' },
  { name: 'Bersa', className: 'Assassin' },
  { name: 'CaeraDenoir', className: 'Assassin' },
  { name: 'Celthy', className: 'Assassin' },
  { name: 'Cukicco', className: 'Cleric' },
  { name: 'FinalF', className: 'Assassin' },
  { name: 'JohnConno', className: 'Assassin' },
  { name: 'LaParcovich', className: 'Assassin' },
  { name: 'Lupor', className: 'Assassin' },
  { name: 'Milei', className: 'Assassin' },
  { name: 'Nirvesta', className: 'Assassin' },
  { name: 'Pix', className: 'Assassin' },
  { name: 'Saymoon', className: 'Assassin' },
  { name: 'spiritmance', className: 'Assassin' },
  { name: 'ven7s', className: 'Assassin' },
  { name: 'Yakira', className: 'Assassin' },
  { name: 'Betra', className: 'Ranger' },
  { name: 'Charutera', className: 'Ranger' },
  { name: 'DarKLatioS', className: 'Ranger' },
  { name: 'Dethrone', className: 'Assassin' },
  { name: 'Frankleon', className: 'Ranger' },
  { name: 'Jore', className: 'Ranger' },
  { name: 'LeCat', className: 'Ranger' },
  { name: 'Legoblack', className: 'Ranger' },
  { name: 'Luuqitas10', className: 'Ranger' },
  { name: 'MKHD', className: 'Ranger' },
  { name: 'NOOBKING', className: 'Ranger' },
  { name: 'Problemitas', className: 'Ranger' },
  { name: 'Scottyyy', className: 'Ranger' },
  { name: 'Squalt', className: 'Ranger' },
  { name: 'WACHINA', className: 'Ranger' },
  { name: 'Yapur', className: 'Ranger' },
  { name: 'Ahime', className: 'Cleric' },
  { name: 'Bjorn', className: 'Cleric' },
  { name: 'Chokyz', className: 'Cleric' },
  { name: 'Darkness', className: 'Cleric' },
  { name: 'FranX', className: 'Cleric' },
  { name: 'JozereFF', className: 'Cleric' },
  { name: 'Lemonpie', className: 'Cleric' },
  { name: 'Lya', className: 'Cleric' },
  { name: 'Meymey', className: 'Cleric' },
  { name: 'Mukombo', className: 'Cleric' },
  { name: 'nuts', className: 'Cleric' },
  { name: 'Ronso', className: 'Cleric' },
  { name: 'Semaga', className: 'Cleric' },
  { name: 'Tankesao', className: 'Cleric' },
  { name: 'Wazahh', className: 'Templar' },
  { name: 'Zantanico', className: 'Cleric' },
  { name: 'Blizzard', className: 'Chanter' },
  { name: 'Chris', className: 'Chanter' },
  { name: 'Edran', className: 'Chanter' },
  { name: 'Galoc', className: 'Chanter' },
  { name: 'kacaguate', className: 'Chanter' },
  { name: 'Less', className: 'Chanter' },
  { name: 'Lyssara', className: 'Chanter' },
  { name: 'Murnier', className: 'Chanter' },
  { name: 'Orion', className: 'Chanter' },
  { name: 'Ryohei', className: 'Chanter' },
  { name: 'Serenir', className: 'Chanter' },
  { name: 'Seusz', className: 'Assassin' },
  { name: 'Tinta', className: 'Chanter' },
  { name: 'Western', className: 'Chanter' },
  { name: 'Zeicro', className: 'Assassin' },
  { name: 'ZEICRO', className: 'Assassin' },
  { name: 'Borkz', className: 'Elementalist' },
  { name: 'cliff', className: 'Elementalist' },
  { name: 'ElJuguetero', className: 'Elementalist' },
  { name: 'Ghohard', className: 'Cleric' },
  { name: 'Kaiser', className: 'Cleric' },
  { name: 'LittleWolfie', className: 'Elementalist' },
  { name: 'magordita', className: 'Elementalist' },
  { name: 'Mysara', className: 'Elementalist' },
  { name: 'Osakina', className: 'Elementalist' },
  { name: 'SaltyHead', className: 'Elementalist' },
  { name: 'Seusha', className: 'Elementalist' },
  { name: 'Traxer', className: 'Elementalist' },
  { name: 'Wig0', className: 'Elementalist' },
  { name: 'Zureth', className: 'Elementalist' },
  { name: 'Anesa', className: 'Sorcerer' },
  { name: 'Brazu', className: 'Sorcerer' },
  { name: 'ClooW', className: 'Sorcerer' },
  { name: 'ElMaly', className: 'Sorcerer' },
  { name: 'Grumpy', className: 'Sorcerer' },
  { name: 'kilefaa', className: 'Sorcerer' },
  { name: 'Luacrii', className: 'Sorcerer' },
  { name: 'martoo', className: 'Sorcerer' },
  { name: 'MrLucky', className: 'Sorcerer' },
  { name: 'Paraibinho', className: 'Sorcerer' },
  { name: 'SanGra', className: 'Gladiator' },
  { name: 'Sheremie', className: 'Gladiator' },
  { name: 'tronatsu', className: 'Gladiator' },
  { name: 'Wizky', className: 'Cleric' },
  { name: 'Asmundr', className: 'Gladiator' },
  { name: 'BycroW', className: 'Gladiator' },
  { name: 'Crossier', className: 'Gladiator' },
  { name: 'Epsilon', className: 'Gladiator' },
  { name: 'Guytre', className: 'Gladiator' },
  { name: 'Kipus', className: 'Gladiator' },
  { name: 'LucaRed', className: 'Gladiator' },
  { name: 'Mathi', className: 'Gladiator' },
  { name: 'Nadia', className: 'Gladiator' },
  { name: 'Pikaboss', className: 'Gladiator' },
  { name: 'SashaGrey', className: 'Gladiator' },
  { name: 'Sneezy', className: 'Gladiator' },
  { name: 'Valentina', className: 'Gladiator' },
  { name: 'Woodynator', className: 'Gladiator' },
];

function canonicalizeMemberName(value) {
  const raw = String(value ?? '').trim();
  const key = raw.toLowerCase();
  return NAME_ALIASES[key] || raw;
}

function resolveMemberClass(memberName, fallbackClassName) {
  const canonicalName = canonicalizeMemberName(memberName);
  const directOverride = CLASS_OVERRIDES[canonicalName] || CLASS_OVERRIDES[memberName];
  if (directOverride) {
    return directOverride;
  }

  const normalizedName = normalizeName(canonicalName);
  const aliasMatch = Object.entries(CLASS_OVERRIDES).find(([name]) => normalizeName(name) === normalizedName);
  if (aliasMatch) {
    return aliasMatch[1];
  }

  return fallbackClassName;
}

function applyExplicitMemberCorrections(members) {
  return members.map((member) => {
    const correctedClass = resolveMemberClass(member.name, member.className);
    return {
      ...member,
      className: correctedClass,
    };
  });
}

function buildDefaultData() {
  const forces = [];
  const defaultForceCount = 6;
  const normalizedMembers = applyExplicitMemberCorrections(SEED_MEMBERS.map((member) => ({ ...member })));

  for (let forceIndex = 1; forceIndex <= defaultForceCount; forceIndex += 1) {
    const parties = [];
    for (let partyIndex = 1; partyIndex <= MAX_PARTIES_PER_FORCE; partyIndex += 1) {
      parties.push({ id: `party-${forceIndex}-${partyIndex}`, name: `Party ${partyIndex}`, members: [] });
    }
    forces.push({ id: `force-${forceIndex}`, name: `Fuerza ${forceIndex}`, parties });
  }

  let cursor = 0;
  for (const force of forces) {
    for (const party of force.parties) {
      while (party.members.length < MAX_MEMBERS_PER_PARTY && cursor < normalizedMembers.length) {
        const member = normalizedMembers[cursor];
        const canonicalName = canonicalizeMemberName(member.name);
        const className = resolveMemberClass(canonicalName, member.className);
        party.members.push({
          id: `${force.id}-${party.id}-${cursor}`,
          name: canonicalName,
          className,
          ilevel: sanitizeStatValue(member.ilevel),
          cp: sanitizeStatValue(member.cp),
          ncRegion: '',
          ncServerId: '',
          ncCharacterId: '',
          ncServerName: '',
          ncLevel: null,
          lastSyncAt: '',
        });
        cursor += 1;
      }
    }
  }

  return { forces, unassignedMembers: [] };
}

const defaultData = buildDefaultData();

let state = loadData();

const forceSelect = document.getElementById('forceSelect');
const partySelect = document.getElementById('partySelect');
const memberForm = document.getElementById('memberForm');
const memberNameInput = document.getElementById('memberName');
const memberClassSelect = document.getElementById('memberClass');
const rosterContainer = document.getElementById('rosterContainer');
const globalMemberList = document.getElementById('globalMemberList');
const forceSummary = document.getElementById('forceSummary');
const summaryTotalMembersEl = document.getElementById('summaryTotalMembers');
const globalTotalMembersEl = document.getElementById('globalTotalMembers');
const viewButtons = document.querySelectorAll('.view-btn');
const forceManagerView = document.getElementById('forceManagerView');
const memberListView = document.getElementById('memberListView');
const marketView = document.getElementById('marketView');
const memberSearchInput = document.getElementById('memberSearchInput');
const memberSearchResults = document.getElementById('memberSearchResults');
const memberListSearchInput = document.getElementById('memberListSearchInput');
const moveForceSelect = document.getElementById('moveForceSelect');
const movePartySelect = document.getElementById('movePartySelect');
const moveMemberBtn = document.getElementById('moveMemberBtn');
const addForceBtn = document.getElementById('addForceBtn');
const addMemberModal = document.getElementById('addMemberModal');
const openAddMemberBtn = document.getElementById('openAddMemberBtn');
const closeAddMemberModalBtn = document.getElementById('closeAddMemberModal');
const memberIlevelInput = document.getElementById('memberIlevel');
const memberCpInput = document.getElementById('memberCp');
const memberListClassFilter = document.getElementById('memberListClassFilter');
const memberListForceFilter = document.getElementById('memberListForceFilter');
const memberListSort = document.getElementById('memberListSort');
const syncAllStatsBtn = document.getElementById('syncAllStatsBtn');
const ncApiBaseInput = document.getElementById('ncApiBaseInput');
const saveNcApiBaseBtn = document.getElementById('saveNcApiBaseBtn');
const syncStatusText = document.getElementById('syncStatusText');
const ncRegionSelect = document.getElementById('ncRegionSelect');
const currentRoleBadge = document.getElementById('currentRoleBadge');
const staffLoginBtn = document.getElementById('staffLoginBtn');
const staffLogoutBtn = document.getElementById('staffLogoutBtn');
const marketFrame = document.getElementById('marketFrame');

function applyTheme(themeName) {
  const safeTheme = themeName === 'market' ? 'market' : 'default';
  document.body.setAttribute('data-theme', safeTheme);
  localStorage.setItem(THEME_KEY, safeTheme);
}

function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  applyTheme(savedTheme || 'default');
}

function getNcApiBase() {
  const stored = localStorage.getItem(NC_API_BASE_KEY);
  const candidate = stored || NC_DEFAULT_API_BASE || window.BLACKLIST_APP_CONFIG?.ncApiBase || '';
  return candidate.replace(/\/+$/, '');
}

function setNcApiBase(url) {
  const normalized = (url || '').trim().replace(/\/+$/, '');
  localStorage.setItem(NC_API_BASE_KEY, normalized || '');
  if (ncApiBaseInput) {
    ncApiBaseInput.value = localStorage.getItem(NC_API_BASE_KEY) || NC_DEFAULT_API_BASE || '';
  }
}

function initNcApiBase() {
  if (ncApiBaseInput) {
    ncApiBaseInput.value = getNcApiBase();
  }

  if (ncRegionSelect) {
    ncRegionSelect.value = getNcPreferredRegion();
  }
}

function getNcPreferredRegion() {
  const region = localStorage.getItem(NC_REGION_KEY);
  if (!region) return 'all';
  return ['all', ...NC_REGIONS].includes(region) ? region : 'all';
}

function setNcPreferredRegion(region) {
  const safeRegion = ['all', ...NC_REGIONS].includes(region) ? region : 'all';
  localStorage.setItem(NC_REGION_KEY, safeRegion);
  if (ncRegionSelect) {
    ncRegionSelect.value = safeRegion;
  }
}

function setSyncStatus(message, type = '') {
  if (!syncStatusText) return;
  syncStatusText.textContent = message;
  syncStatusText.classList.remove('busy', 'ok', 'error');
  if (type) {
    syncStatusText.classList.add(type);
  }
}

function isStaffRole() {
  return roleState.value === 'staff';
}

function requireStaffAction() {
  if (isStaffRole()) {
    return true;
  }
  window.alert('Modo Viewer: esta acción requiere Staff.');
  return false;
}

function updateRoleUi() {
  const staffMode = isStaffRole();
  document.body.setAttribute('data-role', staffMode ? 'staff' : 'viewer');

  if (currentRoleBadge) {
    currentRoleBadge.textContent = staffMode ? 'Staff' : 'Viewer';
  }

  if (staffLoginBtn) {
    staffLoginBtn.style.display = staffMode ? 'none' : 'inline-flex';
  }

  if (staffLogoutBtn) {
    staffLogoutBtn.style.display = staffMode ? 'inline-flex' : 'none';
  }

  const disableWhenViewer = [
    addForceBtn,
    openAddMemberBtn,
    moveMemberBtn,
    syncAllStatsBtn,
    saveNcApiBaseBtn,
    ncApiBaseInput,
    ncRegionSelect,
  ].filter(Boolean);

  disableWhenViewer.forEach((element) => {
    element.disabled = !staffMode;
  });

  if (!staffMode) {
    editingMemberId.value = null;
  }
}

function setRole(nextRole) {
  roleState.value = nextRole === 'staff' ? 'staff' : 'viewer';
  localStorage.setItem(AUTH_ROLE_KEY, roleState.value);
  updateRoleUi();
  render();
}

function initRole() {
  const storedRole = localStorage.getItem(AUTH_ROLE_KEY);
  roleState.value = storedRole === 'staff' ? 'staff' : 'viewer';
  updateRoleUi();
}

function refreshMarketFrame() {
  if (!marketFrame) return;

  if (!marketFrame.src) {
    marketFrame.src = MARKET_DEFAULT_URL;
    return;
  }

  try {
    marketFrame.contentWindow?.location.reload();
  } catch (error) {
    marketFrame.src = marketFrame.src;
  }
}

function sanitizeStatValue(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) {
    return null;
  }

  return Math.round(number);
}

function normalizeMemberStats(member) {
  member.ilevel = sanitizeStatValue(member.ilevel);
  member.cp = sanitizeStatValue(member.cp);
}

function normalizeMemberSyncMeta(member) {
  member.ncRegion = typeof member.ncRegion === 'string' ? member.ncRegion : '';
  member.ncServerName = typeof member.ncServerName === 'string' ? member.ncServerName : '';
  member.ncCharacterId = typeof member.ncCharacterId === 'string' ? member.ncCharacterId : '';
  member.ncServerId = Number.isFinite(Number(member.ncServerId)) ? String(Math.round(Number(member.ncServerId))) : '';
  member.ncLevel = sanitizeStatValue(member.ncLevel);
  member.lastSyncAt = typeof member.lastSyncAt === 'string' ? member.lastSyncAt : '';
}

function mapNcClassToLocalClass(className, fallbackClassName) {
  const map = {
    Spiritmaster: 'Elementalist',
  };

  if (CLASSES.includes(className)) {
    return className;
  }

  if (map[className]) {
    return map[className];
  }

  return fallbackClassName;
}

async function fetchJsonWithTimeout(url, timeoutMs = 20000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

function findMemberRefById(memberId) {
  for (const force of state.forces) {
    for (const party of force.parties) {
      const member = party.members.find((item) => item.id === memberId);
      if (member) {
        return { member, force, party };
      }
    }
  }

  const member = (state.unassignedMembers || []).find((item) => item.id === memberId);
  return member ? { member, force: null, party: null } : null;
}

function buildNcProfileUrl(member) {
  const base = getNcApiBase();
  if (!base) {
    throw new Error('Configura la API NC Proxy antes de sincronizar.');
  }

  const params = new URLSearchParams({
    region: member.ncRegion,
    serverId: member.ncServerId,
    characterId: member.ncCharacterId,
  });
  return `${base}/api/nc/profile?${params.toString()}`;
}

function buildNcResolveUrl(memberName) {
  const base = getNcApiBase();
  if (!base) {
    throw new Error('Configura la API NC Proxy antes de sincronizar.');
  }

  const params = new URLSearchParams({ name: memberName });
  const region = getNcPreferredRegion();
  if (region !== 'all') {
    params.set('region', region);
  }
  return `${base}/api/nc/resolve?${params.toString()}`;
}

function applySyncedMemberData(member, payload) {
  const summary = payload?.summary || {};
  member.ilevel = sanitizeStatValue(summary.il ?? member.ilevel);
  member.cp = sanitizeStatValue(summary.cp ?? member.cp);
  member.className = mapNcClassToLocalClass(summary.className, member.className);
  member.ncRegion = String(summary.region || member.ncRegion || '');
  member.ncServerId = String(summary.serverId || member.ncServerId || '');
  member.ncCharacterId = String(summary.characterId || member.ncCharacterId || '');
  member.ncServerName = String(summary.serverName || member.ncServerName || '');
  member.ncLevel = sanitizeStatValue(summary.level ?? member.ncLevel);
  member.lastSyncAt = new Date().toISOString();
}

function formatSyncTime(member) {
  if (!member.lastSyncAt) {
    return 'Sin sync';
  }

  const date = new Date(member.lastSyncAt);
  if (Number.isNaN(date.getTime())) {
    return 'Sin sync';
  }

  return date.toLocaleString('es-ES', { hour12: false });
}

async function syncMemberFromNc(memberId, { quiet = false } = {}) {
  const ref = findMemberRefById(memberId);
  if (!ref) {
    throw new Error('Miembro no encontrado');
  }

  const { member } = ref;
  setSyncStatus(`Sincronizando ${member.name}...`, 'busy');

  let resolvedMember = member;
  if (!member.ncRegion || !member.ncServerId || !member.ncCharacterId) {
    const resolveUrl = `${buildNcResolveUrl(member.name)}&className=${encodeURIComponent(member.className || '')}`;
    const resolveResponse = await fetchJsonWithTimeout(resolveUrl);

    if (!resolveResponse?.summary) {
      throw new Error('No se encontró personaje en NC');
    }

    applySyncedMemberData(member, resolveResponse);
    resolvedMember = member;
  }

  const profileUrl = buildNcProfileUrl(resolvedMember);
  const profileResponse = await fetchJsonWithTimeout(profileUrl);
  if (!profileResponse?.summary) {
    throw new Error('La API no devolvió stats válidos');
  }

  applySyncedMemberData(member, profileResponse);
  saveData();
  if (!quiet) {
    render();
  }
  return member;
}

async function syncAllMembersFromNc() {
  if (syncState.busy) {
    return;
  }

  const members = getAllMembers();
  if (!members.length) {
    setSyncStatus('No hay miembros para sincronizar.', 'error');
    return;
  }

  syncState.busy = true;
  if (syncAllStatsBtn) {
    syncAllStatsBtn.disabled = true;
  }

  let success = 0;
  let failed = 0;

  for (const member of members) {
    try {
      await syncMemberFromNc(member.id, { quiet: true });
      success += 1;
    } catch (error) {
      failed += 1;
      console.warn('Sync falló para', member.name, error);
    }
  }

  syncState.busy = false;
  if (syncAllStatsBtn) {
    syncAllStatsBtn.disabled = false;
  }

  saveData();
  render();

  if (failed > 0) {
    setSyncStatus(`Sync completa: ${success} ok / ${failed} con error.`, 'error');
  } else {
    setSyncStatus(`Sync completa: ${success} miembros actualizados.`, 'ok');
  }
}

function formatStatValue(value) {
  return Number.isFinite(value) ? value.toLocaleString('es-ES') : '--';
}

function setActiveView(viewName) {
  const views = {
    force: forceManagerView,
    members: memberListView,
    market: marketView,
  };

  Object.entries(views).forEach(([name, element]) => {
    if (!element) {
      return;
    }
    element.classList.toggle('active', name === viewName);
  });

  viewButtons.forEach((button) => {
    const isActive = button.dataset.view === viewName;
    button.classList.toggle('active', isActive);
  });

  if (viewName === 'market') {
    refreshMarketFrame();
  }
}

function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return structuredClone(defaultData);
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.forces || !Array.isArray(parsed.forces)) {
      return structuredClone(defaultData);
    }

    parsed.unassignedMembers = Array.isArray(parsed.unassignedMembers) ? parsed.unassignedMembers : [];

    const rosterMembers = parsed.forces.flatMap((force) =>
      force.parties.flatMap((party) => party.members),
    );

    rosterMembers.forEach((member) => {
      member.name = canonicalizeMemberName(member.name);
      member.className = resolveMemberClass(member.name, member.className);
      normalizeMemberStats(member);
      normalizeMemberSyncMeta(member);
    });

    (parsed.unassignedMembers || []).forEach((member) => {
      member.name = canonicalizeMemberName(member.name);
      member.className = resolveMemberClass(member.name, member.className);
      normalizeMemberStats(member);
      normalizeMemberSyncMeta(member);
    });

    return parsed;
  } catch (error) {
    return structuredClone(defaultData);
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function normalizeName(value) {
  return canonicalizeMemberName(value).trim().toLowerCase();
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getAllMembers() {
  const assignedMembers = state.forces.flatMap((force) =>
    force.parties.flatMap((party) =>
      party.members.map((member) => ({
        ...member,
        forceId: force.id,
        forceName: force.name,
        partyId: party.id,
        partyName: party.name,
      })),
    ),
  );

  const unassignedMembers = (state.unassignedMembers || []).map((member) => ({
    ...member,
    forceId: null,
    forceName: 'Sin fuerza',
    partyId: null,
    partyName: 'Sin party',
  }));

  return [...assignedMembers, ...unassignedMembers];
}

function getForceOptions() {
  return state.forces.map((force) => ({
    id: force.id,
    name: force.name,
  }));
}

function addForce() {
  if (!requireStaffAction()) {
    return;
  }

  const totalCapacity = state.forces.length * MAX_PARTIES_PER_FORCE * MAX_MEMBERS_PER_PARTY;
  if (totalCapacity >= MAX_TOTAL_MEMBERS) {
    window.alert(`El guild ya alcanzó el máximo de ${MAX_TOTAL_MEMBERS} miembros.`);
    return;
  }

  const nextIndex = state.forces.length + 1;
  const newForce = {
    id: `force-${Date.now()}`,
    name: `Fuerza ${nextIndex}`,
    parties: Array.from({ length: MAX_PARTIES_PER_FORCE }, (_, index) => ({
      id: `party-${nextIndex}-${index + 1}`,
      name: `Party ${index + 1}`,
      members: [],
    })),
  };

  state.forces.push(newForce);
  saveData();
  render();
}

function renderForceSelect() {
  const options = getForceOptions();
  const targetSelects = [forceSelect, moveForceSelect].filter(Boolean);

  targetSelects.forEach((select) => {
    const choiceList = select === moveForceSelect
      ? [{ id: 'all', name: 'Todas las fuerzas' }, ...options]
      : options;

    select.innerHTML = choiceList
      .map((force) => `<option value="${force.id}">${force.name}</option>`)
      .join('');

    if (!options.length) {
      select.disabled = true;
      return;
    }

    select.disabled = false;
    const selectedForce = options[0];
    if (select === moveForceSelect && (!select.value || select.value === 'all' || !options.some((force) => force.id === select.value))) {
      select.value = 'all';
    } else {
      select.value = selectedForce.id;
    }
  });

  if (!options.length) {
    forceSelect.disabled = true;
    partySelect.disabled = true;
    moveForceSelect.disabled = true;
    movePartySelect.disabled = true;
    return;
  }

  renderPartySelect(forceSelect.value || options[0].id);
  renderMovePartySelect(moveForceSelect.value === 'all' ? options[0].id : (moveForceSelect.value || options[0].id));
}

function renderPartySelect(forceId) {
  const selectedForce = state.forces.find((force) => force.id === forceId);

  if (!selectedForce) {
    partySelect.innerHTML = '';
    partySelect.disabled = true;
    return;
  }

  partySelect.innerHTML = selectedForce.parties
    .map((party) => `<option value="${party.id}">${party.name}</option>`)
    .join('');
  partySelect.disabled = false;
  partySelect.value = selectedForce.parties[0]?.id || '';
}

function renderMovePartySelect(forceId) {
  if (!forceId || forceId === 'all') {
    movePartySelect.innerHTML = '<option value="">Selecciona una fuerza</option>';
    movePartySelect.disabled = true;
    return;
  }

  const selectedForce = state.forces.find((force) => force.id === forceId);

  if (!selectedForce) {
    movePartySelect.innerHTML = '';
    movePartySelect.disabled = true;
    return;
  }

  movePartySelect.innerHTML = selectedForce.parties
    .map((party) => `<option value="${party.id}">${party.name}</option>`)
    .join('');
  movePartySelect.disabled = false;
  movePartySelect.value = selectedForce.parties[0]?.id || '';
}

function updateSummary() {
  const allMembers = getAllMembers();
  const totalMembers = allMembers.length;
  summaryTotalMembersEl.textContent = totalMembers;
  globalTotalMembersEl.textContent = `${totalMembers}/${MAX_TOTAL_MEMBERS}`;

  forceSummary.innerHTML = state.forces
    .map((force) => {
      const membersCount = force.parties.reduce((sum, party) => sum + party.members.length, 0);
      return `
        <div class="force-badge">
          <h3>${force.name}</h3>
          <strong>${membersCount}</strong>
        </div>
      `;
    })
    .join('');
}

function renderMemberListFilters() {
  if (!memberListClassFilter || !memberListForceFilter) {
    return;
  }

  const classOptions = ['all', ...CLASSES];
  const nextClassValue = memberListClassFilter.value || 'all';
  memberListClassFilter.innerHTML = classOptions
    .map((className) => {
      const label = className === 'all' ? 'Todas las clases' : className;
      return `<option value="${className}">${label}</option>`;
    })
    .join('');
  memberListClassFilter.value = classOptions.includes(nextClassValue) ? nextClassValue : 'all';

  const forceOptions = ['all', ...state.forces.map((force) => force.id), 'none'];
  const nextForceValue = memberListForceFilter.value || 'all';
  memberListForceFilter.innerHTML = forceOptions
    .map((forceId) => {
      if (forceId === 'all') return '<option value="all">Todas las fuerzas</option>';
      if (forceId === 'none') return '<option value="none">Sin fuerza</option>';
      const force = state.forces.find((item) => item.id === forceId);
      if (!force) return '';
      return `<option value="${force.id}">${force.name}</option>`;
    })
    .join('');
  memberListForceFilter.value = forceOptions.includes(nextForceValue) ? nextForceValue : 'all';

  if (memberListSort && !memberListSort.value) {
    memberListSort.value = 'name-asc';
  }
}

function getClassMeta(className) {
  return CLASS_META[className] || { icon: '✦', color: '#dfe9ff' };
}

function getClassPriority(className) {
  const priority = {
    Templar: 0,
    Cleric: 1,
    Chanter: 2,
  };

  return priority[className] ?? 99;
}

function sortPartyMembers(party) {
  party.members.sort((a, b) => {
    const classDifference = getClassPriority(a.className) - getClassPriority(b.className);
    if (classDifference !== 0) return classDifference;
    return a.name.localeCompare(b.name);
  });
}

function createMemberCard(member) {
  const meta = getClassMeta(member.className);
  const staffMode = isStaffRole();

  return `
    <div class="member-slot">
      <div class="member-info">
        <span class="member-name">${escapeHtml(member.name)}</span>
        <span class="member-class" style="color: ${meta.color};"><img class="class-icon" src="${meta.iconUrl || ''}" alt="${member.className}" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-flex';" /><span class="class-icon-fallback" style="display:none; color: ${meta.color}">${meta.icon}</span> ${member.className}</span>
        <span class="member-class">iLvl: ${formatStatValue(member.ilevel)} / CP: ${formatStatValue(member.cp)}</span>
      </div>
      ${staffMode ? `<button class="member-delete" type="button" data-member-id="${member.id}">Borrar</button>` : '<span class="member-class">Solo lectura</span>'}
    </div>
  `;
}

function renderRoster() {
  rosterContainer.innerHTML = '';

  state.forces.forEach((force) => {
    const forceGroup = document.createElement('div');
    forceGroup.className = 'force-group';

    const forceHeader = document.createElement('div');
    forceHeader.className = 'force-group-header';
    forceHeader.innerHTML = `<h3>${force.name}</h3>`;
    forceGroup.appendChild(forceHeader);

    const partyGrid = document.createElement('div');
    partyGrid.className = 'force-party-grid';

    force.parties.forEach((party) => {
      const template = document.getElementById('partyTemplate');
      const fragment = template.content.cloneNode(true);
      const card = fragment.querySelector('.party-card');
      const forceLabel = fragment.querySelector('.party-force-label');
      const partyName = fragment.querySelector('.party-name');
      const memberList = fragment.querySelector('.member-list');
      const freeSlots = fragment.querySelector('.free-slots');
      const deletePartyBtn = fragment.querySelector('.delete-party-btn');

      forceLabel.textContent = force.name;
      partyName.textContent = party.name;

      if (party.members.length === 0) {
        memberList.innerHTML = '<div class="empty-slot">Sin miembros aún</div>';
      } else {
        memberList.innerHTML = party.members.map(createMemberCard).join('');
      }

      const remainingSlots = MAX_MEMBERS_PER_PARTY - party.members.length;
      freeSlots.textContent = remainingSlots;

      card.dataset.partyId = party.id;
      card.dataset.forceId = force.id;
      card.addEventListener('dragover', (event) => {
        event.preventDefault();
        card.classList.add('drag-over');
      });
      card.addEventListener('dragleave', () => card.classList.remove('drag-over'));
      card.addEventListener('drop', (event) => {
        if (!isStaffRole()) return;
        event.preventDefault();
        card.classList.remove('drag-over');
        if (!draggedMemberId.value) return;
        moveMemberToParty(draggedMemberId.value, force.id, party.id);
      });
      deletePartyBtn.disabled = !isStaffRole();
      deletePartyBtn.addEventListener('click', () => clearParty(force.id, party.id));

      memberList.querySelectorAll('.member-delete').forEach((button) => {
        button.addEventListener('click', () => deleteMember(force.id, party.id, button.dataset.memberId));
      });

      memberList.querySelectorAll('.member-slot').forEach((slot) => {
        if (!isStaffRole()) {
          slot.setAttribute('draggable', 'false');
          return;
        }

        const memberId = slot.querySelector('.member-delete')?.dataset.memberId;
        if (!memberId) return;
        slot.addEventListener('dragstart', (event) => {
          draggedMemberId.value = memberId;
          event.dataTransfer?.setData('text/plain', memberId);
          slot.classList.add('dragging');
        });
        slot.addEventListener('dragend', () => {
          draggedMemberId.value = null;
          slot.classList.remove('dragging');
        });
        slot.setAttribute('draggable', 'true');
      });

      partyGrid.appendChild(fragment);
    });

    forceGroup.appendChild(partyGrid);
    rosterContainer.appendChild(forceGroup);
  });
}

function renderMemberSearchResults() {
  const query = (memberSearchInput?.value || '').trim().toLowerCase();

  const matches = getAllMembers()
    .filter((member) => {
      if (!query) return true;
      return member.name.toLowerCase().includes(query);
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  if (!matches.length) {
    memberSearchResults.innerHTML = '<div class="empty-global">No hay coincidencias.</div>';
    return;
  }

  memberSearchResults.innerHTML = matches
    .map((member) => {
      const isActive = selectedMemberId.value === member.id;
      const meta = getClassMeta(member.className);
      return `
        <button class="member-search-result ${isActive ? 'active' : ''}" type="button" data-member-id="${member.id}">
          <div class="member-search-info">
            <img class="class-icon" src="${meta.iconUrl || ''}" alt="${member.className}" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-flex';" />
            <span class="class-icon-fallback" style="display:none; color: ${meta.color}">${meta.icon}</span>
            <div>
              <div class="member-search-name">${escapeHtml(member.name)}</div>
              <div class="member-search-class" style="color: ${meta.color};">${member.className} | iLvl ${formatStatValue(member.ilevel)} | CP ${formatStatValue(member.cp)}</div>
            </div>
          </div>
          <div class="member-search-location">${member.forceName} / ${member.partyName}</div>
        </button>
      `;
    })
    .join('');

  memberSearchResults.querySelectorAll('.member-search-result').forEach((button) => {
    button.addEventListener('click', () => {
      selectedMemberId.value = button.dataset.memberId;
      const selectedMember = getAllMembers().find((member) => member.id === selectedMemberId.value);
      if (!selectedMember) return;

      const currentForce = state.forces.find((force) => force.id === selectedMember.forceId);
      if (currentForce) {
        moveForceSelect.value = currentForce.id;
        renderMovePartySelect(currentForce.id);
        const currentParty = currentForce.parties.find((party) => party.id === selectedMember.partyId);
        if (currentParty) {
          movePartySelect.value = currentParty.id;
        }
      }

      renderMemberSearchResults();
    });

    button.addEventListener('dragstart', (event) => {
      if (!isStaffRole()) {
        event.preventDefault();
        return;
      }
      draggedMemberId.value = button.dataset.memberId;
      event.dataTransfer?.setData('text/plain', button.dataset.memberId || '');
      button.classList.add('dragging');
    });
    button.addEventListener('dragend', () => {
      draggedMemberId.value = null;
      button.classList.remove('dragging');
    });
    button.setAttribute('draggable', 'true');
  });
}

function syncClassFilterButtons() {
  document.querySelectorAll('.guild-class-chip').forEach((button) => {
    const isActive = button.dataset.class === selectedClassFilter.value;
    button.classList.toggle('active', isActive);
  });
}

function handleClassFilterClick(button) {
  const selectedClass = button.dataset.class;
  selectedClassFilter.value = selectedClassFilter.value === selectedClass ? null : selectedClass;
  renderGuildClassSummary();
  renderGlobalMembers();
}

function renderGuildClassSummary() {
  const classCounts = CLASSES.reduce((acc, className) => {
    acc[className] = 0;
    return acc;
  }, {});

  getAllMembers().forEach((member) => {
    if (classCounts[member.className] !== undefined) {
      classCounts[member.className] += 1;
    }
  });

  const containers = [
    document.getElementById('guildClassSummary'),
    document.getElementById('memberListClassSummary'),
  ].filter(Boolean);

  containers.forEach((container) => {
    container.innerHTML = CLASSES.map((className) => {
      const meta = getClassMeta(className);
      return `
        <button type="button" class="guild-class-chip ${selectedClassFilter.value === className ? 'active' : ''}" data-class="${className}">
          <img class="chip-icon" src="${meta.iconUrl || ''}" alt="${className}" style="filter: drop-shadow(0 0 10px ${meta.color}55);" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-flex';" />
          <span class="chip-fallback" style="display: none; color: ${meta.color}">${meta.icon}</span>
          <span>${className}</span>
          <strong>${classCounts[className]}</strong>
        </button>
      `;
    }).join('');

    container.querySelectorAll('.guild-class-chip').forEach((button) => {
      button.addEventListener('click', () => handleClassFilterClick(button));
    });
  });
}

function renderGlobalMembers() {
  const allMembers = getAllMembers();
  const query = (memberListSearchInput?.value || '').trim().toLowerCase();
  const classFilter = (memberListClassFilter?.value || 'all');
  const forceFilter = (memberListForceFilter?.value || 'all');
  const sortMode = (memberListSort?.value || 'name-asc');

  const visibleMembers = allMembers.filter((member) => {
    const matchesQuery = !query || member.name.toLowerCase().includes(query);
    const classFilterFromChip = selectedClassFilter.value;
    const matchesChipClass = !classFilterFromChip || member.className === classFilterFromChip;
    const matchesDropdownClass = classFilter === 'all' || member.className === classFilter;
    const matchesForce = forceFilter === 'all'
      || (forceFilter === 'none' ? !member.forceId : member.forceId === forceFilter);
    return matchesQuery && matchesChipClass && matchesDropdownClass && matchesForce;
  });

  visibleMembers.sort((a, b) => {
    if (sortMode === 'name-desc') return b.name.localeCompare(a.name);
    if (sortMode === 'ilevel-desc') return (b.ilevel || 0) - (a.ilevel || 0) || a.name.localeCompare(b.name);
    if (sortMode === 'cp-desc') return (b.cp || 0) - (a.cp || 0) || a.name.localeCompare(b.name);
    return a.name.localeCompare(b.name);
  });

  syncClassFilterButtons();

  if (!visibleMembers.length) {
    const emptyLabel = selectedClassFilter.value
      ? `No hay miembros de ${selectedClassFilter.value} con esta búsqueda.`
      : 'No hay coincidencias para esta búsqueda.';
    globalMemberList.innerHTML = `<div class="empty-global">${emptyLabel}</div>`;
    return;
  }

  globalMemberList.innerHTML = visibleMembers
    .map((member) => {
      const meta = getClassMeta(member.className);
      const isEditing = editingMemberId.value === member.id;
      const staffMode = isStaffRole();

      if (isEditing) {
        if (!staffMode) {
          return '';
        }

        return `
          <div class="global-member-row editing" data-member-id="${member.id}">
            <div class="global-member-main">
              <img class="class-icon" src="${meta.iconUrl || ''}" alt="${member.className}" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-flex';" />
              <span class="class-icon-fallback" style="display:none; color: ${meta.color}">${meta.icon}</span>
              <div class="global-member-edit-fields">
                <input class="member-edit-name" data-member-id="${member.id}" type="text" value="${escapeHtml(member.name)}" maxlength="20" />
                <select class="member-edit-class" data-member-id="${member.id}">
                  ${CLASSES.map((className) => `<option value="${className}" ${className === member.className ? 'selected' : ''}>${className}</option>`).join('')}
                </select>
              </div>
            </div>
            <div class="global-member-class" style="color: ${meta.color};">${member.className}</div>
            <div>${member.forceName}</div>
            <div>${member.partyName}</div>
            <div class="global-member-edit-fields">
              <input class="member-edit-ilevel" data-member-id="${member.id}" type="number" min="0" max="99999" value="${member.ilevel ?? ''}" placeholder="iLvl" />
              <input class="member-edit-cp" data-member-id="${member.id}" type="number" min="0" max="999999" value="${member.cp ?? ''}" placeholder="CP" />
            </div>
            <div class="global-member-meta">
              <button class="global-member-save" data-member-id="${member.id}" type="button">Guardar</button>
              <button class="global-member-cancel" data-member-id="${member.id}" type="button">Cancelar</button>
            </div>
          </div>
        `;
      }

      return `
        <div class="global-member-row">
          <div class="global-member-main">
            <img class="class-icon" src="${meta.iconUrl || ''}" alt="${member.className}" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-flex';" />
            <span class="class-icon-fallback" style="display:none; color: ${meta.color}">${meta.icon}</span>
            <div>
                <strong style="color: ${meta.color};">${escapeHtml(member.name)}</strong>
                <small>${member.partyName}</small>
            </div>
          </div>
            <div class="global-member-class" style="color: ${meta.color};">${member.className}</div>
            <div>${member.forceName}</div>
            <div>${member.partyName}</div>
            <div class="global-member-stat">
              <span class="stat-chip">iLvl: ${formatStatValue(member.ilevel)}</span>
              <span class="stat-chip">CP: ${formatStatValue(member.cp)}</span>
              <span class="stat-chip">Sync: ${escapeHtml(formatSyncTime(member))}</span>
            </div>
          <div class="global-member-meta">
              ${staffMode ? `<button class="global-member-sync" data-member-id="${member.id}" type="button">Sync NC</button>
            <button class="global-member-edit" data-member-id="${member.id}" type="button">Editar</button>
            <button class="global-member-delete" data-member-id="${member.id}" type="button">Borrar</button>` : '<span class="member-class">Viewer</span>'}
          </div>
        </div>
      `;
    })
    .join('');

  globalMemberList.querySelectorAll('.global-member-delete').forEach((button) => {
    button.addEventListener('click', () => deleteMemberById(button.dataset.memberId));
  });

  globalMemberList.querySelectorAll('.global-member-edit').forEach((button) => {
    button.addEventListener('click', () => {
      editingMemberId.value = button.dataset.memberId;
      renderGlobalMembers();
    });
  });

  globalMemberList.querySelectorAll('.global-member-save').forEach((button) => {
    button.addEventListener('click', () => {
      const row = button.closest('.global-member-row');
      const input = row?.querySelector('.member-edit-name');
      const select = row?.querySelector('.member-edit-class');
      const ilevelInput = row?.querySelector('.member-edit-ilevel');
      const cpInput = row?.querySelector('.member-edit-cp');

      if (!input || !select || !ilevelInput || !cpInput) return;

      updateMemberById(button.dataset.memberId, input.value, select.value, ilevelInput.value, cpInput.value);
    });
  });

  globalMemberList.querySelectorAll('.global-member-cancel').forEach((button) => {
    button.addEventListener('click', () => {
      editingMemberId.value = null;
      renderGlobalMembers();
    });
  });

  globalMemberList.querySelectorAll('.global-member-sync').forEach((button) => {
    button.addEventListener('click', async () => {
      if (!requireStaffAction()) {
        return;
      }

      if (syncState.busy) {
        return;
      }

      try {
        syncState.busy = true;
        await syncMemberFromNc(button.dataset.memberId);
        setSyncStatus('Miembro sincronizado con NC.', 'ok');
      } catch (error) {
        setSyncStatus(`Error al sincronizar: ${error?.message || 'desconocido'}`, 'error');
      } finally {
        syncState.busy = false;
        render();
      }
    });
  });
}

function clearParty(forceId, partyId) {
  if (!requireStaffAction()) {
    return;
  }

  const force = state.forces.find((item) => item.id === forceId);
  if (!force) return;

  const party = force.parties.find((item) => item.id === partyId);
  if (!party) return;

  party.members = [];
  saveData();
  render();
}

function deleteMember(forceId, partyId, memberId) {
  if (!requireStaffAction()) {
    return;
  }

  const force = state.forces.find((item) => item.id === forceId);
  if (!force) return;

  const party = force.parties.find((item) => item.id === partyId);
  if (!party) return;

  const memberIndex = party.members.findIndex((member) => member.id === memberId);
  if (memberIndex < 0) return;

  const [removedMember] = party.members.splice(memberIndex, 1);
  const existing = state.unassignedMembers || [];
  if (!existing.some((item) => item.id === removedMember.id)) {
    state.unassignedMembers = [...existing, {
      id: removedMember.id,
      name: removedMember.name,
      className: removedMember.className,
      ilevel: removedMember.ilevel ?? null,
      cp: removedMember.cp ?? null,
      ncRegion: removedMember.ncRegion || '',
      ncServerId: removedMember.ncServerId || '',
      ncCharacterId: removedMember.ncCharacterId || '',
      ncServerName: removedMember.ncServerName || '',
      ncLevel: removedMember.ncLevel ?? null,
      lastSyncAt: removedMember.lastSyncAt || '',
    }];
  }
  saveData();
  render();
}

function deleteMemberById(memberId) {
  if (!requireStaffAction()) {
    return;
  }

  if (editingMemberId.value === memberId) {
    editingMemberId.value = null;
  }

  if (selectedMemberId.value === memberId) {
    selectedMemberId.value = null;
  }

  for (const force of state.forces) {
    for (const party of force.parties) {
      const index = party.members.findIndex((member) => member.id === memberId);
      if (index >= 0) {
        const [removedMember] = party.members.splice(index, 1);
        const existing = state.unassignedMembers || [];
        if (!existing.some((item) => item.id === removedMember.id)) {
          state.unassignedMembers = [...existing, {
            id: removedMember.id,
            name: removedMember.name,
            className: removedMember.className,
            ilevel: removedMember.ilevel ?? null,
            cp: removedMember.cp ?? null,
            ncRegion: removedMember.ncRegion || '',
            ncServerId: removedMember.ncServerId || '',
            ncCharacterId: removedMember.ncCharacterId || '',
            ncServerName: removedMember.ncServerName || '',
            ncLevel: removedMember.ncLevel ?? null,
            lastSyncAt: removedMember.lastSyncAt || '',
          }];
        }
        saveData();
        render();
        return;
      }
    }
  }

  state.unassignedMembers = (state.unassignedMembers || []).filter((member) => member.id !== memberId);
  saveData();
  render();
}

function moveMemberToParty(memberId, targetForceId, targetPartyId) {
  if (!requireStaffAction()) {
    return;
  }

  if (!memberId || !targetForceId || !targetPartyId) {
    return;
  }

  const targetForce = state.forces.find((force) => force.id === targetForceId);
  const targetParty = targetForce?.parties.find((party) => party.id === targetPartyId);
  if (!targetForce || !targetParty) return;

  let member = null;
  let currentForceId = null;
  let currentPartyId = null;

  for (const force of state.forces) {
    for (const party of force.parties) {
      const index = party.members.findIndex((item) => item.id === memberId);
      if (index >= 0) {
        member = party.members.splice(index, 1)[0];
        currentForceId = force.id;
        currentPartyId = party.id;
        break;
      }
    }
    if (member) break;
  }

  if (!member) {
    const unassignedIndex = (state.unassignedMembers || []).findIndex((item) => item.id === memberId);
    if (unassignedIndex >= 0) {
      member = state.unassignedMembers.splice(unassignedIndex, 1)[0];
    }
  }

  if (!member) return;

  if (targetParty.members.length >= MAX_MEMBERS_PER_PARTY) {
    window.alert(`Ese party ya tiene ${MAX_MEMBERS_PER_PARTY} miembros. Elige otro antes de moverlo.`);
    if (currentForceId && currentPartyId) {
      const currentForce = state.forces.find((force) => force.id === currentForceId);
      const currentParty = currentForce?.parties.find((party) => party.id === currentPartyId);
      if (currentParty) {
        currentParty.members.push(member);
        sortPartyMembers(currentParty);
      }
    } else if (member && !state.unassignedMembers.some((item) => item.id === member.id)) {
      state.unassignedMembers = [...(state.unassignedMembers || []), member];
    }
    return;
  }

  targetParty.members.push(member);
  sortPartyMembers(targetParty);
  selectedMemberId.value = member.id;
  saveData();
  render();
}

function isDuplicateName(name, ignoreMemberId = null) {
  const normalized = normalizeName(name);
  return getAllMembers().some((member) => {
    const isSameMember = ignoreMemberId && member.id === ignoreMemberId;
    return !isSameMember && normalizeName(member.name) === normalized;
  });
}

function updateMemberById(memberId, nextName, nextClassName, nextIlevel, nextCp) {
  if (!requireStaffAction()) {
    return;
  }

  const cleanedName = nextName.trim();

  if (!cleanedName) {
    window.alert('El nombre no puede estar vacío.');
    return;
  }

  if (isDuplicateName(cleanedName, memberId)) {
    window.alert('Ese nombre ya existe en la lista. No se puede repetir.');
    return;
  }

  for (const force of state.forces) {
    for (const party of force.parties) {
      const member = party.members.find((item) => item.id === memberId);
      if (!member) continue;

      member.name = cleanedName;
      member.className = nextClassName;
      member.ilevel = sanitizeStatValue(nextIlevel);
      member.cp = sanitizeStatValue(nextCp);
      editingMemberId.value = null;
      saveData();
      render();
      return;
    }
  }

  const unassignedMember = (state.unassignedMembers || []).find((item) => item.id === memberId);
  if (unassignedMember) {
    unassignedMember.name = cleanedName;
    unassignedMember.className = nextClassName;
    unassignedMember.ilevel = sanitizeStatValue(nextIlevel);
    unassignedMember.cp = sanitizeStatValue(nextCp);
    editingMemberId.value = null;
    saveData();
    render();
  }
}

function toggleMemberModal(isVisible) {
  if (isVisible && !requireStaffAction()) {
    return;
  }

  if (!addMemberModal) return;
  addMemberModal.classList.toggle('active', isVisible);
  addMemberModal.setAttribute('aria-hidden', String(!isVisible));

  if (isVisible) {
    setTimeout(() => {
      if (memberNameInput) memberNameInput.focus();
    }, 50);
  }
}

function addMember(event) {
  event.preventDefault();

  if (!requireStaffAction()) {
    return;
  }

  const forceId = forceSelect.value;
  const partyId = partySelect.value;
  const name = memberNameInput.value.trim();
  const className = memberClassSelect.value;
  const ilevel = sanitizeStatValue(memberIlevelInput?.value);
  const cp = sanitizeStatValue(memberCpInput?.value);

  if (!forceId || !partyId || !name) {
    return;
  }

  if (getAllMembers().length >= MAX_TOTAL_MEMBERS) {
    window.alert(`Ya has ${MAX_TOTAL_MEMBERS} miembros en el roster. Elimina alguno antes de añadir más.`);
    return;
  }

  if (isDuplicateName(name)) {
    window.alert('Ese nombre ya existe en la lista. No se puede repetir.');
    return;
  }

  const force = state.forces.find((item) => item.id === forceId);
  const party = force?.parties.find((item) => item.id === partyId);

  if (!force || !party) {
    return;
  }

  if (party.members.length >= MAX_MEMBERS_PER_PARTY) {
    window.alert(`Esta party ya tiene ${MAX_MEMBERS_PER_PARTY} miembros. Borra uno antes de añadir otro.`);
    return;
  }

  party.members.push({
    id: crypto.randomUUID ? crypto.randomUUID() : `member-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name,
    className,
    ilevel,
    cp,
    ncRegion: '',
    ncServerId: '',
    ncCharacterId: '',
    ncServerName: '',
    ncLevel: null,
    lastSyncAt: '',
  });
  sortPartyMembers(party);

  memberNameInput.value = '';
  memberClassSelect.value = CLASSES[0];
  if (memberIlevelInput) memberIlevelInput.value = '';
  if (memberCpInput) memberCpInput.value = '';
  toggleMemberModal(false);
  saveData();
  render();
}

function render() {
  renderForceSelect();
  renderMemberListFilters();
  updateSummary();
  renderGuildClassSummary();
  renderGlobalMembers();
  renderMemberSearchResults();
  renderRoster();
}

forceSelect.addEventListener('change', (event) => {
  renderPartySelect(event.target.value);
});

moveForceSelect.addEventListener('change', (event) => {
  if (event.target.value === 'all') {
    movePartySelect.value = '';
    movePartySelect.disabled = true;
  } else {
    renderMovePartySelect(event.target.value);
  }
  renderMemberSearchResults();
});

memberSearchInput.addEventListener('input', renderMemberSearchResults);
memberListSearchInput.addEventListener('input', renderGlobalMembers);
memberListClassFilter?.addEventListener('change', renderGlobalMembers);
memberListForceFilter?.addEventListener('change', renderGlobalMembers);
memberListSort?.addEventListener('change', renderGlobalMembers);
openAddMemberBtn.addEventListener('click', () => toggleMemberModal(true));
if (addForceBtn) {
  addForceBtn.addEventListener('click', addForce);
}
closeAddMemberModalBtn.addEventListener('click', () => toggleMemberModal(false));
window.addEventListener('dragover', (event) => event.preventDefault());
addMemberModal.addEventListener('click', (event) => {
  if (event.target instanceof HTMLElement && event.target.dataset.closeModal === 'true') {
    toggleMemberModal(false);
  }
});
moveMemberBtn.addEventListener('click', () => {
  if (!selectedMemberId.value) {
    window.alert('Busca y selecciona una persona antes de moverla.');
    return;
  }

  if (!moveForceSelect.value || moveForceSelect.value === 'all') {
    window.alert('Primero selecciona una fuerza de destino.');
    return;
  }

  moveMemberToParty(selectedMemberId.value, moveForceSelect.value, movePartySelect.value);
});

memberForm.addEventListener('submit', addMember);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && addMemberModal.classList.contains('active')) {
    toggleMemberModal(false);
  }
});
memberClassSelect.innerHTML = CLASSES.map((cls) => `<option value="${cls}">${cls}</option>`).join('');
memberClassSelect.value = CLASSES[0];
viewButtons.forEach((button) => {
  button.addEventListener('click', () => setActiveView(button.dataset.view));
});

saveNcApiBaseBtn?.addEventListener('click', () => {
  if (!requireStaffAction()) {
    return;
  }
  setNcApiBase(ncApiBaseInput?.value || NC_DEFAULT_API_BASE);
  setSyncStatus(`API guardada: ${getNcApiBase()}`, 'ok');
});

ncRegionSelect?.addEventListener('change', (event) => {
  if (!requireStaffAction()) {
    ncRegionSelect.value = getNcPreferredRegion();
    return;
  }
  setNcPreferredRegion(event.target.value);
  setSyncStatus(`Región preferida: ${event.target.value.toUpperCase()}`, 'ok');
});

ncApiBaseInput?.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter') return;
  event.preventDefault();
  if (!requireStaffAction()) {
    return;
  }
  setNcApiBase(ncApiBaseInput.value || NC_DEFAULT_API_BASE);
  setSyncStatus(`API guardada: ${getNcApiBase()}`, 'ok');
});

syncAllStatsBtn?.addEventListener('click', () => {
  if (!requireStaffAction()) {
    return;
  }
  syncAllMembersFromNc();
});

staffLoginBtn?.addEventListener('click', () => {
  const password = window.prompt('Ingresa password de Staff:');
  if (password === null) {
    return;
  }

  if (password !== STAFF_PASSWORD) {
    window.alert('Password incorrecto.');
    return;
  }

  setRole('staff');
  setSyncStatus('Sesión Staff activa.', 'ok');
});

staffLogoutBtn?.addEventListener('click', () => {
  setRole('viewer');
  setSyncStatus('Sesión en modo Viewer.', 'ok');
});

initTheme();
initNcApiBase();
initRole();
setSyncStatus(`API NC: ${getNcApiBase()}`);
setActiveView('force');
render();
