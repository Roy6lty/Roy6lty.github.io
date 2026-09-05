(() => {
  const STORAGE_KEY = 'ayo-labs-progress-v1';
  const LEGACY_COMPLETION_KEY = 'docker-networking-completed-v3';
  const LEGACY_VIEW_KEY = 'docker-networking-catalog-view-v1';

  const emptyState = () => ({
    version: 1,
    updatedAt: new Date().toISOString(),
    labs: {}
  });

  const clone = (value) => JSON.parse(JSON.stringify(value));

  const safeRead = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (!parsed || typeof parsed !== 'object' || parsed.version !== 1 || typeof parsed.labs !== 'object') return emptyState();
      return parsed;
    } catch {
      return emptyState();
    }
  };

  const safeWrite = (state) => {
    state.version = 1;
    state.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch {
      return false;
    }
  };

  const ensureLab = (state, labId) => {
    if (!state.labs[labId] || typeof state.labs[labId] !== 'object') {
      state.labs[labId] = {
        completedChapters: {},
        chapterState: {},
        lastVisited: null,
        preferences: {}
      };
    }
    const lab = state.labs[labId];
    lab.completedChapters ||= {};
    lab.chapterState ||= {};
    lab.preferences ||= {};
    if (!('lastVisited' in lab)) lab.lastVisited = null;
    return lab;
  };

  const migrateLegacy = () => {
    const state = safeRead();
    const lab = ensureLab(state, 'docker-networking');
    let changed = false;

    try {
      const legacy = JSON.parse(localStorage.getItem(LEGACY_COMPLETION_KEY) || '{}');
      Object.entries(legacy).forEach(([chapterId, completed]) => {
        if (completed && !lab.completedChapters[chapterId]) {
          lab.completedChapters[chapterId] = { completedAt: new Date().toISOString(), migrated: true };
          changed = true;
        }
      });
      if (Object.keys(legacy).length) localStorage.removeItem(LEGACY_COMPLETION_KEY);
    } catch {}

    try {
      const view = localStorage.getItem(LEGACY_VIEW_KEY);
      if (view && !lab.preferences.catalogView) {
        lab.preferences.catalogView = view;
        changed = true;
      }
      if (view) localStorage.removeItem(LEGACY_VIEW_KEY);
    } catch {}

    if (changed) safeWrite(state);
  };

  const getLab = (labId) => {
    const state = safeRead();
    return clone(ensureLab(state, labId));
  };

  const mutateLab = (labId, mutator) => {
    const state = safeRead();
    const lab = ensureLab(state, labId);
    mutator(lab, state);
    safeWrite(state);
    window.dispatchEvent(new CustomEvent('ayo:lab-progress-changed', { detail: { labId } }));
    return clone(lab);
  };

  const visitChapter = (labId, chapter) => mutateLab(labId, (lab) => {
    const id = String(chapter.id);
    const existing = lab.chapterState[id] || {};
    const visitedAt = new Date().toISOString();
    lab.chapterState[id] = {
      ...existing,
      visited: true,
      title: chapter.title || existing.title || '',
      slug: chapter.slug || existing.slug || '',
      path: chapter.path || existing.path || location.pathname,
      lastVisitedAt: visitedAt
    };
    lab.lastVisited = {
      id,
      title: chapter.title || existing.title || '',
      slug: chapter.slug || existing.slug || '',
      path: chapter.path || existing.path || location.pathname,
      sectionId: existing.lastSectionId || null,
      sectionLabel: existing.lastSectionLabel || null,
      visitedAt
    };
  });

  const updateSection = (labId, chapterId, sectionId, sectionLabel) => mutateLab(labId, (lab) => {
    const id = String(chapterId);
    const existing = lab.chapterState[id] || {};
    lab.chapterState[id] = {
      ...existing,
      visited: true,
      lastSectionId: sectionId || null,
      lastSectionLabel: sectionLabel || null,
      lastVisitedAt: new Date().toISOString()
    };
    if (lab.lastVisited && String(lab.lastVisited.id) === id) {
      lab.lastVisited.sectionId = sectionId || null;
      lab.lastVisited.sectionLabel = sectionLabel || null;
      lab.lastVisited.visitedAt = new Date().toISOString();
    }
  });

  const setCheckpoint = (labId, chapterId, patch) => mutateLab(labId, (lab) => {
    const id = String(chapterId);
    const existing = lab.chapterState[id] || {};
    lab.chapterState[id] = {
      ...existing,
      checkpoint: {
        ...(existing.checkpoint || {}),
        ...patch,
        updatedAt: new Date().toISOString()
      }
    };
  });

  const markComplete = (labId, chapterId, completed = true) => mutateLab(labId, (lab) => {
    const id = String(chapterId);
    if (completed) {
      lab.completedChapters[id] = { completedAt: new Date().toISOString() };
      const existing = lab.chapterState[id] || {};
      lab.chapterState[id] = { ...existing, visited: true, completed: true };
    } else {
      delete lab.completedChapters[id];
      if (lab.chapterState[id]) lab.chapterState[id].completed = false;
    }
  });

  const setPreference = (labId, key, value) => mutateLab(labId, (lab) => {
    lab.preferences[key] = value;
  });

  const resetLab = (labId) => {
    const state = safeRead();
    delete state.labs[labId];
    safeWrite(state);
    window.dispatchEvent(new CustomEvent('ayo:lab-progress-changed', { detail: { labId } }));
  };

  const clearAll = () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    window.dispatchEvent(new CustomEvent('ayo:lab-progress-changed', { detail: { labId: null } }));
  };

  const exportProgress = () => {
    const state = safeRead();
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `ayo-labs-progress-${date}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const importProgress = async (file) => {
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== 'object' || parsed.version !== 1 || !parsed.labs || typeof parsed.labs !== 'object') {
      throw new Error('This does not look like an Ayo Labs progress export.');
    }
    safeWrite(parsed);
    window.dispatchEvent(new CustomEvent('ayo:lab-progress-changed', { detail: { labId: null } }));
    return clone(parsed);
  };


  const updateLibrarySummaries = () => {
    document.querySelectorAll('[data-lab-progress-summary]').forEach((root) => {
      const labId = root.dataset.labId;
      if (!labId) return;
      const lab = getLab(labId);
      const completed = Object.keys(lab.completedChapters || {}).filter((id) => /^\d{2}$/.test(id)).length;
      const total = Number(root.dataset.labTotal || 0) || 17;
      const count = root.querySelector('[data-lab-progress-count]');
      const fill = root.querySelector('[data-lab-progress-fill]');
      const last = root.querySelector('[data-lab-progress-last]');
      const resume = root.querySelector('[data-lab-resume-link]');
      if (count) count.textContent = `${completed} / ${total} complete`;
      if (fill) fill.style.width = `${Math.round((completed / total) * 100)}%`;
      if (last) last.textContent = lab.lastVisited ? `Last: ${lab.lastVisited.title}` : 'Progress starts when you open a chapter.';
      if (resume) {
        if (lab.lastVisited) {
          resume.hidden = false;
          if (completed >= total) {
            resume.href = labId === 'docker-networking' ? '/labs/docker-networking/' : '/labs/';
            resume.textContent = 'Review course →';
          } else {
            resume.href = `${lab.lastVisited.path || '/labs/docker-networking/'}${lab.lastVisited.sectionId ? `#${lab.lastVisited.sectionId}` : ''}`;
            resume.textContent = 'Resume learning →';
          }
        } else {
          resume.hidden = true;
        }
      }
    });
  };

  migrateLegacy();

  document.addEventListener('DOMContentLoaded', updateLibrarySummaries);
  window.addEventListener('ayo:lab-progress-changed', updateLibrarySummaries);

  window.AyoLabProgress = {
    storageKey: STORAGE_KEY,
    read: () => clone(safeRead()),
    getLab,
    visitChapter,
    updateSection,
    setCheckpoint,
    markComplete,
    setPreference,
    resetLab,
    clearAll,
    exportProgress,
    importProgress
  };
})();
