(() => {
  const LAB_ID = 'docker-networking';
  const CORE_COUNT = 17;
  const progress = () => window.AyoLabProgress;

  const currentChapter = () => {
    const current = document.querySelector('.chapter-rail-link.is-current[data-chapter-id]');
    if (!current) return null;
    const id = current.dataset.chapterId;
    const title = current.querySelector('strong')?.textContent.trim() || document.querySelector('.chapter-hero h1')?.textContent.trim() || `Chapter ${id}`;
    const parts = location.pathname.split('/').filter(Boolean);
    return { id, title, slug: parts.at(-1) || '', path: location.pathname };
  };

  const completedCoreIds = (lab) => Object.keys(lab.completedChapters || {}).filter((id) => /^\d{2}$/.test(id));

  const copyButtons = (scope = document) => scope.querySelectorAll('[data-copy-command]').forEach((btn) => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = '1';
    btn.addEventListener('click', async () => {
      const old = btn.textContent;
      try {
        await navigator.clipboard.writeText(btn.dataset.copyCommand);
        btn.textContent = 'Copied';
      } catch {
        btn.textContent = 'Select text';
      }
      setTimeout(() => { btn.textContent = old; }, 1300);
    });
  });

  const enhanceCode = () => document.querySelectorAll('[data-static-notes] pre').forEach((pre) => {
    if (pre.closest('.lesson-code-wrap')) return;
    const code = pre.querySelector('code');
    if (!code) return;
    const wrap = document.createElement('div');
    wrap.className = 'lesson-code-wrap';
    pre.parentNode.insertBefore(wrap, pre);
    wrap.appendChild(pre);
    const controls = document.createElement('div');
    controls.className = 'lesson-code-controls';
    const context = document.createElement('span');
    context.textContent = 'REFERENCE / RUN IN THE CONTEXT DESCRIBED ABOVE';
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Copy';
    button.dataset.copyCommand = code.textContent.trim();
    controls.append(context, button);
    wrap.insertBefore(controls, pre);
  });

  const chapterStateLabel = (lab, id) => {
    if (lab.completedChapters?.[id]) return 'Complete';
    if (lab.chapterState?.[id]?.visited) return 'In progress';
    return 'Not started';
  };

  const updateChapterMarkers = () => {
    if (!progress()) return;
    const lab = progress().getLab(LAB_ID);
    const completed = new Set(Object.keys(lab.completedChapters || {}));
    const visited = new Set(Object.entries(lab.chapterState || {}).filter(([, value]) => value?.visited).map(([id]) => id));

    document.querySelectorAll('[data-chapter-id]').forEach((el) => {
      const id = el.dataset.chapterId;
      el.classList.toggle('is-complete', completed.has(id));
      el.classList.toggle('is-in-progress', !completed.has(id) && visited.has(id));
      if (el.classList.contains('chapter-card')) {
        let state = el.querySelector('.chapter-card-state');
        if (!state) {
          state = document.createElement('b');
          state.className = 'chapter-card-state';
          el.querySelector('.chapter-card-top')?.appendChild(state);
        }
        state.textContent = chapterStateLabel(lab, id);
      }
    });

    const count = completedCoreIds(lab).length;
    document.querySelectorAll('[data-course-progress]').forEach((el) => {
      el.textContent = `${count} / ${CORE_COUNT} core chapters complete on this browser.`;
    });
    document.querySelectorAll('[data-progress-count]').forEach((el) => {
      el.textContent = `${count} / ${CORE_COUNT}`;
    });
    document.querySelectorAll('[data-progress-percent]').forEach((el) => {
      el.textContent = `${Math.round((count / CORE_COUNT) * 100)}%`;
    });
    document.querySelectorAll('[data-progress-fill], .chapter-rail-progress > span').forEach((el) => {
      el.style.width = `${Math.round((count / CORE_COUNT) * 100)}%`;
    });

    updateResumeUI(lab);
  };

  const catalogChapters = () => [...document.querySelectorAll('.chapter-card[data-chapter-id]')]
    .filter((card) => /^\d{2}$/.test(card.dataset.chapterId))
    .map((card) => ({
      id: card.dataset.chapterId,
      title: card.querySelector('h3')?.textContent.trim() || `Chapter ${card.dataset.chapterId}`,
      path: card.getAttribute('href')
    }));

  const resumeTarget = (lab) => {
    const chapters = catalogChapters();
    const completed = lab.completedChapters || {};
    const last = lab.lastVisited;
    if (last && !completed[last.id]) {
      return {
        title: last.title || `Chapter ${last.id}`,
        path: `${last.path || ''}${last.sectionId ? `#${last.sectionId}` : ''}`,
        detail: last.sectionLabel ? `Resume at ${last.sectionLabel}` : `Continue chapter ${last.id}`
      };
    }
    if (last) {
      const index = chapters.findIndex((item) => item.id === String(last.id));
      const later = chapters.slice(Math.max(index + 1, 0)).find((item) => !completed[item.id]);
      if (later) return { ...later, detail: `Continue with chapter ${later.id}` };
    }
    const firstIncomplete = chapters.find((item) => !completed[item.id]);
    if (firstIncomplete) return { ...firstIncomplete, detail: `Start chapter ${firstIncomplete.id}` };
    return { title: 'Course map', path: '/labs/docker-networking/', detail: 'All 17 core chapters are complete. Review any chapter.' };
  };

  const updateResumeUI = (lab) => {
    const target = resumeTarget(lab);
    document.querySelectorAll('[data-resume-link]').forEach((link) => {
      link.href = target.path;
      link.hidden = false;
      const label = link.querySelector('[data-resume-label]');
      const detail = link.querySelector('[data-resume-detail]');
      if (label) label.textContent = target.title;
      if (detail) detail.textContent = target.detail;
    });
    document.querySelectorAll('[data-last-location]').forEach((el) => {
      if (!lab.lastVisited) {
        el.textContent = 'No chapter activity yet.';
        return;
      }
      el.textContent = lab.lastVisited.sectionLabel
        ? `${lab.lastVisited.title} · ${lab.lastVisited.sectionLabel}`
        : lab.lastVisited.title;
    });
  };

  const setupView = () => {
    const catalog = document.querySelector('[data-chapter-catalog]');
    if (!catalog || !progress()) return;
    const buttons = [...catalog.querySelectorAll('[data-chapter-view]')];
    const apply = (view, persist = true) => {
      const safeView = view === 'list' ? 'list' : 'grid';
      catalog.dataset.view = safeView;
      catalog.classList.toggle('catalog-view-list', safeView === 'list');
      buttons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.chapterView === safeView)));
      if (persist) progress().setPreference(LAB_ID, 'catalogView', safeView);
    };
    apply(progress().getLab(LAB_ID).preferences?.catalogView || 'grid', false);
    buttons.forEach((button) => button.addEventListener('click', () => apply(button.dataset.chapterView)));
  };

  const renderQuestionState = (card, selectedChoice, answer, explanation) => {
    card.querySelectorAll('[data-question-choice]').forEach((button) => {
      const index = Number(button.dataset.questionChoice);
      button.classList.toggle('is-correct', index === answer);
      button.classList.toggle('is-wrong', index === Number(selectedChoice) && index !== answer);
      button.setAttribute('aria-pressed', String(index === Number(selectedChoice)));
    });
    const feedback = card.querySelector('.prediction-feedback');
    if (feedback) {
      feedback.hidden = false;
      feedback.innerHTML = `<strong>${Number(selectedChoice) === answer ? 'Your answer matches the model.' : 'Review this concept before moving on.'}</strong><p>${explanation}</p>`;
    }
  };

  const setupQuestion = () => {
    if (!progress()) return;
    const card = document.querySelector('[data-question-card]');
    const complete = document.querySelector('[data-complete-chapter]');
    const checkpoint = document.querySelector('[data-checkpoint-answer]');
    const reveal = document.querySelector('[data-reveal-checkpoint]');
    if (!complete) return;

    const id = complete.dataset.completeChapter;
    const lab = progress().getLab(LAB_ID);
    const saved = lab.chapterState?.[id]?.checkpoint || {};
    const alreadyComplete = Boolean(lab.completedChapters?.[id]);
    let answered = Boolean(saved.answered || alreadyComplete);
    let reviewed = Boolean(saved.reviewed || alreadyComplete);

    if (reviewed && checkpoint) {
      checkpoint.hidden = false;
      if (reveal) reveal.textContent = 'Expected observation revealed';
    }

    const update = () => {
      complete.disabled = !(answered && reviewed);
      if (alreadyComplete || progress().getLab(LAB_ID).completedChapters?.[id]) {
        complete.disabled = false;
        complete.textContent = 'Completed ✓';
        complete.classList.add('is-complete');
      }
    };

    if (reveal && checkpoint) {
      reveal.addEventListener('click', () => {
        checkpoint.hidden = false;
        reviewed = true;
        reveal.textContent = 'Expected observation revealed';
        progress().setCheckpoint(LAB_ID, id, { reviewed: true });
        update();
      });
    }

    if (card) {
      const answer = Number(card.dataset.answerIndex);
      const explanation = card.dataset.explanation;
      if (saved.answered && Number.isInteger(Number(saved.selectedChoice))) {
        renderQuestionState(card, Number(saved.selectedChoice), answer, explanation);
      }
      card.querySelectorAll('[data-question-choice]').forEach((button) => button.addEventListener('click', () => {
        answered = true;
        const selectedChoice = Number(button.dataset.questionChoice);
        renderQuestionState(card, selectedChoice, answer, explanation);
        progress().setCheckpoint(LAB_ID, id, { answered: true, selectedChoice });
        update();
      }));
    }

    complete.addEventListener('click', () => {
      if (complete.disabled) return;
      progress().markComplete(LAB_ID, id, true);
      complete.textContent = 'Completed ✓';
      complete.classList.add('is-complete');
      updateChapterMarkers();
    });

    update();
  };

  const setupCurrentChapterTracking = () => {
    if (!progress()) return;
    const chapter = currentChapter();
    if (!chapter) return;
    progress().visitChapter(LAB_ID, chapter);

    const candidates = [];
    const add = (node, id, label) => {
      if (!node || !id) return;
      if (!node.id) node.id = id;
      candidates.push({ node, id: node.id, label });
    };

    add(document.querySelector('.chapter-diagram-section'), 'topology', 'Topology');
    add(document.querySelector('.chapter-steps-section'), 'guided-run', 'Guided run');
    add(document.querySelector('.chapter-break'), 'break-and-restore', 'Break and restore');
    add(document.querySelector('#full-notes'), 'full-notes', 'Full lesson notes');
    add(document.querySelector('.chapter-checkpoint'), 'review-checkpoint', 'Review checkpoint');
    add(document.querySelector('[data-question-card]'), 'chapter-questions', 'Chapter questions');
    document.querySelectorAll('.lesson-notes h3[id], .lesson-notes h4[id]').forEach((heading) => candidates.push({ node: heading, id: heading.id, label: heading.textContent.trim() }));

    let lastSaved = '';
    let timer = null;
    const save = (item) => {
      const key = `${chapter.id}:${item.id}`;
      if (key === lastSaved) return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        lastSaved = key;
        progress().updateSection(LAB_ID, chapter.id, item.id, item.label);
      }, 450);
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (!visible.length) return;
        const item = candidates.find((candidate) => candidate.node === visible[0].target);
        if (item) save(item);
      }, { rootMargin: '-15% 0px -68% 0px', threshold: 0 });
      candidates.forEach((item) => observer.observe(item.node));
    }
  };

  const setupProgressTools = () => {
    if (!progress()) return;
    const importInput = document.querySelector('[data-import-progress-input]');
    const status = document.querySelector('[data-progress-tools-status]');
    const announce = (message) => { if (status) status.textContent = message; };

    document.querySelectorAll('[data-export-progress]').forEach((button) => button.addEventListener('click', () => {
      progress().exportProgress();
      announce('Progress exported as JSON.');
    }));

    document.querySelectorAll('[data-import-progress]').forEach((button) => button.addEventListener('click', () => importInput?.click()));
    importInput?.addEventListener('change', async () => {
      const [file] = importInput.files || [];
      if (!file) return;
      try {
        await progress().importProgress(file);
        announce('Progress imported. Refreshing the course state…');
        setTimeout(() => location.reload(), 350);
      } catch (error) {
        announce(error.message || 'Could not import that progress file.');
      } finally {
        importInput.value = '';
      }
    });

    document.querySelectorAll('[data-reset-lab]').forEach((button) => button.addEventListener('click', () => {
      if (!confirm('Reset Docker Networking progress stored in this browser? This cannot be undone unless you exported it first.')) return;
      progress().resetLab(LAB_ID);
      location.reload();
    }));

    document.querySelectorAll('[data-clear-learning-data]').forEach((button) => button.addEventListener('click', () => {
      if (!confirm('Clear progress for every Ayo Labs course stored in this browser?')) return;
      progress().clearAll();
      location.reload();
    }));
  };

  document.addEventListener('DOMContentLoaded', () => {
    enhanceCode();
    copyButtons();
    setupView();
    setupCurrentChapterTracking();
    setupQuestion();
    setupProgressTools();
    updateChapterMarkers();
  });

  window.addEventListener('ayo:lab-progress-changed', (event) => {
    if (!event.detail?.labId || event.detail.labId === LAB_ID) updateChapterMarkers();
  });
})();
