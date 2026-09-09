// ─── State ───────────────────────────────────────────────────────────────────
let selectedCategory  = '';
let currentFilter     = 'all';
let hiddenUnlocked    = false;          // session flag — resets on page refresh
let _afterUnlockAction = null;          // one-time callback after successful unlock
const PWD_KEY         = 'notesHiddenPwdHash';

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initCategorySelectors();
    initFilterButtons();
    initPasswordModals();
    loadDraft();
    showNotes();
    initCharCounter();
});

// ─── Category Selectors ───────────────────────────────────────────────────────
function initCategorySelectors() {
    // Add-note form chips
    document.querySelectorAll('#categorySelector .chip').forEach(chip => {
        chip.addEventListener('click', function () {
            const cat = this.dataset.category;
            const alreadySelected = selectedCategory === cat;

            // Deselect all
            document.querySelectorAll('#categorySelector .chip').forEach(c => {
                c.className = 'chip';
            });

            if (alreadySelected) {
                selectedCategory = '';
            } else {
                selectedCategory = cat;
                this.classList.add(`selected-${cat}`);
            }
            document.getElementById('selectedCategory').value = selectedCategory;
        });
    });

    // Edit-modal chips
    document.querySelectorAll('#editCategorySelector .chip').forEach(chip => {
        chip.addEventListener('click', function () {
            const cat = this.dataset.category;
            const current = document.getElementById('editSelectedCategory').value;
            const alreadySelected = current === cat;

            document.querySelectorAll('#editCategorySelector .chip').forEach(c => {
                c.className = 'chip';
            });

            if (alreadySelected) {
                document.getElementById('editSelectedCategory').value = '';
            } else {
                document.getElementById('editSelectedCategory').value = cat;
                this.classList.add(`selected-${cat}`);
            }
        });
    });
}

// ─── Filter Buttons ───────────────────────────────────────────────────────────
function initFilterButtons() {
    document.querySelectorAll('#filterButtons .filter-item').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('#filterButtons .filter-item').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            filterNotes(currentFilter);
        });
    });
}

// ─── Password Module ──────────────────────────────────────────────────────────

// SHA-256 hash via Web Crypto API
async function hashPassword(password) {
    const encoded = new TextEncoder().encode(password);
    const buffer  = await crypto.subtle.digest('SHA-256', encoded);
    return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function getStoredHash()    { return localStorage.getItem(PWD_KEY); }
function hasPassword()      { return !!getStoredHash(); }
function clearPassword()    { localStorage.removeItem(PWD_KEY); }
async function verifyPassword(input) {
    return (await hashPassword(input)) === getStoredHash();
}

// Toggle show/hide password input
function togglePwdVisibility(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon  = document.getElementById(iconId);
    if (!input || !icon) return;
    const isHidden = input.type === 'password';
    input.type     = isHidden ? 'text' : 'password';
    icon.className = isHidden ? 'bi bi-eye-slash' : 'bi bi-eye';
}

// ── Set Password Modal ────────────────────────────────────────────────────────
let _setPwdCallback = null;   // called after password is successfully set

function showSetPasswordModal(callback) {
    _setPwdCallback = callback;
    document.getElementById('newPassword').value     = '';
    document.getElementById('confirmPassword').value = '';
    document.getElementById('setPwdError').textContent = '';
    // Reset eye icons
    ['newPassword','confirmPassword'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.type = 'password';
    });
    document.getElementById('toggleNewPwdIcon').className    = 'bi bi-eye';
    document.getElementById('toggleConfirmPwdIcon').className = 'bi bi-eye';
    new bootstrap.Modal(document.getElementById('setPasswordModal')).show();
    setTimeout(() => document.getElementById('newPassword').focus(), 350);
}

function initPasswordModals() {
    // ── Set Password confirm
    document.getElementById('confirmSetPwd').addEventListener('click', async () => {
        const pwd  = document.getElementById('newPassword').value;
        const conf = document.getElementById('confirmPassword').value;
        const err  = document.getElementById('setPwdError');

        if (pwd.length < 4) { err.textContent = 'Password must be at least 4 characters.'; return; }
        if (pwd !== conf)   { err.textContent = 'Passwords do not match.'; return; }

        const hash = await hashPassword(pwd);
        localStorage.setItem(PWD_KEY, hash);
        hiddenUnlocked = true;

        const modal = bootstrap.Modal.getInstance(document.getElementById('setPasswordModal'));
        if (modal) modal.hide();

        showToast('Password set! Hidden notes are now protected.', 'success');
        if (_setPwdCallback) { _setPwdCallback(); _setPwdCallback = null; }
    });

    // Cancel Set Password — if triggered during a hide action, abort that action
    document.getElementById('cancelSetPwd').addEventListener('click', () => {
        const modal = bootstrap.Modal.getInstance(document.getElementById('setPasswordModal'));
        if (modal) modal.hide();
        _setPwdCallback = null;
    });

    // Enter key support in set-password modal
    ['newPassword', 'confirmPassword'].forEach(id => {
        document.getElementById(id).addEventListener('keydown', e => {
            if (e.key === 'Enter') document.getElementById('confirmSetPwd').click();
        });
    });

    // ── Unlock Hidden Modal confirm
    document.getElementById('confirmUnlockBtn').addEventListener('click', async () => {
        const input = document.getElementById('unlockPassword').value;
        const err   = document.getElementById('unlockPwdError');

        if (!input) { err.textContent = 'Please enter your password.'; return; }

        const ok = await verifyPassword(input);
        if (!ok) {
            err.textContent = 'Incorrect password. Please try again.';
            document.getElementById('unlockPassword').value = '';
            document.getElementById('unlockPassword').focus();
            return;
        }

        hiddenUnlocked = true;
        const modal = bootstrap.Modal.getInstance(document.getElementById('unlockHiddenModal'));
        if (modal) modal.hide();

        showToast('Hidden notes unlocked for this session.', 'success');

        // Run any pending post-unlock action (e.g. navigate after hide), otherwise default
        if (_afterUnlockAction) {
            const action = _afterUnlockAction;
            _afterUnlockAction = null;
            action();
        } else {
            // Default: switch to hidden view
            currentFilter = 'hidden';
            document.querySelectorAll('#filterButtons .filter-item').forEach(b => {
                b.classList.toggle('active', b.dataset.filter === 'hidden');
            });
            showNotes();
        }
    });

    // Enter key in unlock modal
    document.getElementById('unlockPassword').addEventListener('keydown', e => {
        if (e.key === 'Enter') document.getElementById('confirmUnlockBtn').click();
    });

    // Reset error when unlock modal opens
    document.getElementById('unlockHiddenModal').addEventListener('show.bs.modal', () => {
        document.getElementById('unlockPassword').value       = '';
        document.getElementById('unlockPwdError').textContent = '';
        document.getElementById('unlockPassword').type        = 'password';
        document.getElementById('toggleUnlockPwdIcon').className = 'bi bi-eye';
        setTimeout(() => document.getElementById('unlockPassword').focus(), 350);
    });

    // Clear pending action if user closes modal without unlocking
    document.getElementById('unlockHiddenModal').addEventListener('hidden.bs.modal', () => {
        _afterUnlockAction = null;
    });

    // Change Password button inside unlock modal
    document.getElementById('changePwdBtn').addEventListener('click', () => {
        const modal = bootstrap.Modal.getInstance(document.getElementById('unlockHiddenModal'));
        if (modal) modal.hide();
        setTimeout(() => {
            showSetPasswordModal(() => {
                showToast('Password changed successfully!', 'success');
            });
        }, 300);
    });

    // Remove Password button inside unlock modal
    document.getElementById('removePwdBtn').addEventListener('click', async () => {
        const input = document.getElementById('unlockPassword').value;
        const err   = document.getElementById('unlockPwdError');

        if (!input) { err.textContent = 'Enter your current password first to remove it.'; return; }
        const ok = await verifyPassword(input);
        if (!ok) { err.textContent = 'Incorrect password.'; return; }

        clearPassword();
        hiddenUnlocked = true;
        const modal = bootstrap.Modal.getInstance(document.getElementById('unlockHiddenModal'));
        if (modal) modal.hide();
        showToast('Password removed. Hidden notes are no longer protected.', 'success');

        currentFilter = 'hidden';
        document.querySelectorAll('#filterButtons .filter-item').forEach(b => {
            b.classList.toggle('active', b.dataset.filter === 'hidden');
        });
        showNotes();
    });
}

// Show lock banner when viewing hidden notes
function renderLockBanner() {
    const banner = document.getElementById('lockBanner');
    if (!banner) return;
    if (currentFilter !== 'hidden') { banner.style.display = 'none'; return; }

    banner.style.display = 'block';
    banner.innerHTML = `
        <div class="lock-banner">
            <span class="lock-banner-left">
                <i class="bi bi-unlock-fill"></i>
                Hidden notes unlocked for this session.
            </span>
            <button class="btn-lock" onclick="lockHiddenNotes()">
                <i class="bi bi-lock-fill"></i> Lock Now
            </button>
        </div>`;
}

function lockHiddenNotes() {
    hiddenUnlocked = false;
    currentFilter  = 'all';
    document.querySelectorAll('#filterButtons .filter-item').forEach(b => {
        b.classList.toggle('active', b.dataset.filter === 'all');
    });
    showNotes();
    showToast('Hidden notes locked.', 'success');
}

// ─── Add Note ─────────────────────────────────────────────────────────────────
document.getElementById('addbtn').addEventListener('click', () => {
    const titleEl   = document.getElementById('addtitle');
    const contentEl = document.getElementById('addtxt');

    if (!titleEl.value.trim()) {
        showToast('Please enter a title for your note!', 'warning');
        titleEl.focus();
        return;
    }
    if (!contentEl.value.trim()) {
        showToast('Please enter some content for your note!', 'warning');
        contentEl.focus();
        return;
    }

    const notes    = getNotesFromStorage();
    const category = selectedCategory || '';

    notes.push({
        title:     titleEl.value.trim(),
        text:      contentEl.value.trim(),
        timestamp: new Date().toLocaleString(),
        id:        Date.now(),
        category
    });

    saveNotesToStorage(notes);

    // Clear form
    titleEl.value   = '';
    contentEl.value = '';
    selectedCategory = '';
    document.getElementById('selectedCategory').value = '';
    document.querySelectorAll('#categorySelector .chip').forEach(c => c.className = 'chip');
    localStorage.removeItem('noteDraft');

    showToast('Note saved successfully!', 'success');
    showNotes();
});

// ─── Show Notes ───────────────────────────────────────────────────────────────
function showNotes() {
    const allNotes = getNotesFromStorage();
    const grid     = document.getElementById('notes');

    updateCountBadges(allNotes);
    updateNotesCountLabel(allNotes);
    renderStatsStrip(allNotes);
    updateHiddenFilterItem(allNotes);
    renderLockBanner();

    // Decide which notes to display based on current filter
    const viewingHidden = currentFilter === 'hidden';
    const notes = viewingHidden
        ? allNotes.filter(n => n.hidden)
        : allNotes.filter(n => !n.hidden);

    if (notes.length === 0) {
        grid.innerHTML = viewingHidden
            ? `<div class="empty-state">
                <div class="empty-state-icon"><i class="bi bi-eye-slash"></i></div>
                <h5>No hidden notes</h5>
                <p>Notes you hide will appear here.</p>
               </div>`
            : `<div class="empty-state">
                <div class="empty-state-icon"><i class="bi bi-journal-x"></i></div>
                <h5>No notes yet</h5>
                <p>Create your first note using the form on the left to get started.</p>
               </div>`;
        return;
    }

    grid.innerHTML = notes.map(note => buildNoteCard(note, allNotes.indexOf(note))).join('');

    // Stagger animations
    grid.querySelectorAll('.note-card').forEach((card, i) => {
        card.style.animationDelay = `${i * 0.05}s`;
    });

    // Apply category filter (skip for 'hidden' and 'all')
    if (currentFilter !== 'all' && currentFilter !== 'hidden') filterNotes(currentFilter);
}

// ─── Build Note Card ──────────────────────────────────────────────────────────
function buildNoteCard(note, index) {
    const cat        = note.category || '';
    const catClass   = cat ? `cat-${cat}` : '';
    const pillHtml   = cat ? `<span class="note-category-pill pill-${cat}">${getCategoryIcon(cat)} ${capitalize(cat)}</span>` : '';
    const timeHtml   = note.timestamp
        ? `<span class="note-timestamp"><i class="bi bi-clock"></i>${note.timestamp}</span>`
        : '';
    const isHidden   = !!note.hidden;
    const hiddenClass = isHidden ? ' note-card-hidden' : '';
    const hideTitle  = isHidden ? 'Unhide note' : 'Hide note';
    const hideIcon   = isHidden ? 'bi-eye' : 'bi-eye-slash';
    const hideBtnClass = isHidden ? 'btn-icon unhide' : 'btn-icon hide';

    return `
    <div class="note-card ${catClass}${hiddenClass}" data-category="${cat || 'none'}" style="animation-delay:0s">
        <div class="note-card-top">
            ${pillHtml}
            ${isHidden ? '<span class="hidden-badge"><i class="bi bi-eye-slash-fill"></i> Hidden</span>' : ''}
        </div>
        <h5 class="note-title">${escapeHtml(note.title)}</h5>
        <p class="note-text">${escapeHtml(note.text)}</p>
        <div class="note-footer">
            ${timeHtml}
            <div class="note-actions">
                <button class="${hideBtnClass}" onclick="toggleHideNote(${index})" title="${hideTitle}">
                    <i class="bi ${hideIcon}"></i>
                </button>
                <button class="btn-icon edit" onclick="editNote(${index})" title="Edit note">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn-icon delete" onclick="deleteNote(${index})" title="Delete note">
                    <i class="bi bi-trash3"></i>
                </button>
            </div>
        </div>
    </div>`;
}

// ─── Delete Note ──────────────────────────────────────────────────────────────
function deleteNote(index) {
    if (!confirm('Delete this note? This action cannot be undone.')) return;

    const notes = getNotesFromStorage();
    notes.splice(index, 1);
    saveNotesToStorage(notes);

    showToast('Note deleted.', 'success');
    showNotes();
}

// ─── Hide / Unhide Note ───────────────────────────────────────────────────────
function toggleHideNote(index) {
    const notes = getNotesFromStorage();
    if (!notes[index]) return;

    const wasHidden = !!notes[index].hidden;

    if (wasHidden) {
        // ── Unhiding ─────────────────────────────────────────
        // Require password unlock first (can only reach this from hidden view anyway)
        if (hasPassword() && !hiddenUnlocked) {
            new bootstrap.Modal(document.getElementById('unlockHiddenModal')).show();
            return;
        }
        notes[index].hidden = false;
        saveNotesToStorage(notes);
        showToast('Note is now visible.', 'success');
        showNotes();

    } else {
        // ── Hiding ────────────────────────────────────────────
        if (!hasPassword()) {
            // No password yet → prompt to set one, then hide + navigate
            showSetPasswordModal(() => {
                const freshNotes = getNotesFromStorage();
                if (freshNotes[index]) {
                    freshNotes[index].hidden = true;
                    saveNotesToStorage(freshNotes);
                    showToast('Note hidden and protected with a password.', 'success');
                    switchToHiddenView();
                }
            });
            return;
        }

        // Password exists → hide the note immediately
        notes[index].hidden = true;
        saveNotesToStorage(notes);
        showToast('Note hidden.', 'success');

        // Navigate to hidden section
        if (hiddenUnlocked) {
            // Already unlocked this session — go straight there
            switchToHiddenView();
        } else {
            // Not unlocked yet — show unlock modal; on success it will switch view
            // But first register a one-time post-unlock action
            _afterUnlockAction = () => switchToHiddenView();
            new bootstrap.Modal(document.getElementById('unlockHiddenModal')).show();
        }
    }
}

// Navigate to hidden notes view
function switchToHiddenView() {
    currentFilter = 'hidden';
    document.querySelectorAll('#filterButtons .filter-item').forEach(b => {
        b.classList.toggle('active', b.dataset.filter === 'hidden');
    });
    showNotes();
}


// ─── Update Hidden Filter Item ────────────────────────────────────────────────
function updateHiddenFilterItem(allNotes) {
    const hiddenCount = allNotes.filter(n => n.hidden).length;
    let item = document.getElementById('filter-hidden');

    if (hiddenCount === 0) {
        if (item) item.remove();
        // If we were viewing hidden and they're all gone, reset to 'all'
        if (currentFilter === 'hidden') {
            currentFilter = 'all';
            document.querySelectorAll('#filterButtons .filter-item').forEach(b => {
                b.classList.toggle('active', b.dataset.filter === 'all');
            });
        }
        return;
    }

    if (!item) {
        item = document.createElement('button');
        item.id = 'filter-hidden';
        item.className = 'filter-item';
        item.dataset.filter = 'hidden';
        item.innerHTML = `
            <span class="dot" style="background:#7c3aed"></span>
            <i class="bi bi-lock-fill" style="font-size:.65rem;opacity:.7"></i>
            Hidden
            <span class="count-badge" id="cnt-hidden">0</span>`;
        item.addEventListener('click', function () {
            // If a password is set and not yet unlocked this session → show unlock modal
            if (hasPassword() && !hiddenUnlocked) {
                new bootstrap.Modal(document.getElementById('unlockHiddenModal')).show();
                return;
            }
            // No password or already unlocked → go straight to hidden view
            document.querySelectorAll('#filterButtons .filter-item').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = 'hidden';
            showNotes();
        });
        document.getElementById('filterButtons').appendChild(item);
    }

    item.classList.toggle('active', currentFilter === 'hidden');
    const badge = document.getElementById('cnt-hidden');
    if (badge) badge.textContent = hiddenCount;
}

// ─── Edit Note ────────────────────────────────────────────────────────────────
function editNote(index) {
    const notes = getNotesFromStorage();
    if (!notes[index]) { showToast('Note not found!', 'warning'); return; }

    const note = notes[index];
    document.getElementById('editTitle').value            = note.title;
    document.getElementById('editText').value             = note.text;
    document.getElementById('editIndex').value            = index;
    document.getElementById('editSelectedCategory').value = note.category || '';

    // Update chip UI
    document.querySelectorAll('#editCategorySelector .chip').forEach(c => {
        c.className = 'chip';
        if (c.dataset.category === note.category) c.classList.add(`selected-${note.category}`);
    });

    new bootstrap.Modal(document.getElementById('editNoteModal')).show();
}

// ─── Save Edited Note ─────────────────────────────────────────────────────────
function saveEditedNote() {
    const index   = document.getElementById('editIndex').value;
    const title   = document.getElementById('editTitle').value.trim();
    const text    = document.getElementById('editText').value.trim();

    if (!title) { showToast('Please enter a title!', 'warning'); return; }
    if (!text)  { showToast('Please enter some content!', 'warning'); return; }

    const notes = getNotesFromStorage();
    if (!notes[index]) { showToast('Note not found!', 'warning'); return; }

    notes[index] = {
        ...notes[index],
        title,
        text,
        category:  document.getElementById('editSelectedCategory').value || '',
        timestamp: new Date().toLocaleString() + ' (edited)'
    };

    saveNotesToStorage(notes);

    const modalEl  = document.getElementById('editNoteModal');
    const instance = bootstrap.Modal.getInstance(modalEl);
    if (instance) instance.hide();

    showToast('Note updated successfully!', 'success');
    showNotes();
}

document.getElementById('saveEditBtn').addEventListener('click', saveEditedNote);

document.getElementById('editNoteModal').addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); saveEditedNote(); }
    if (e.key === 'Escape') {
        const inst = bootstrap.Modal.getInstance(document.getElementById('editNoteModal'));
        if (inst) inst.hide();
    }
});

// ─── Filter ───────────────────────────────────────────────────────────────────
function filterNotes(category) {
    const cards = document.querySelectorAll('#notes .note-card');
    let visible = 0;

    cards.forEach(card => {
        const cardCat = card.dataset.category;
        const show    = category === 'all' || cardCat === category;
        card.style.display = show ? '' : 'none';
        if (show) visible++;
    });

    // Remove old "no results in category" message
    const existing = document.getElementById('filterEmptyState');
    if (existing) existing.remove();

    if (visible === 0 && cards.length > 0) {
        const div     = document.createElement('div');
        div.id        = 'filterEmptyState';
        div.className = 'empty-state';
        div.innerHTML = `
            <div class="empty-state-icon"><i class="bi bi-inbox"></i></div>
            <h5>No notes in this category</h5>
            <p>Switch to a different filter or add a note with this category.</p>`;
        document.getElementById('notes').appendChild(div);
    }
}

// ─── Search ───────────────────────────────────────────────────────────────────
document.getElementById('searchtxt').addEventListener('input', function () {
    const q     = this.value.toLowerCase().trim();
    const cards = document.querySelectorAll('#notes .note-card');
    let visible = 0;

    // Remove old no-results message
    const existing = document.getElementById('searchEmptyState');
    if (existing) existing.remove();

    cards.forEach(card => {
        const title = (card.querySelector('.note-title')?.innerText || '').toLowerCase();
        const text  = (card.querySelector('.note-text')?.innerText  || '').toLowerCase();
        const cat   = (card.querySelector('.note-category-pill')?.innerText || '').toLowerCase();
        const show  = !q || title.includes(q) || text.includes(q) || cat.includes(q);
        card.style.display = show ? '' : 'none';
        if (show) visible++;
    });

    if (q && visible === 0 && cards.length > 0) {
        const div     = document.createElement('div');
        div.id        = 'searchEmptyState';
        div.className = 'empty-state';
        div.innerHTML = `
            <div class="empty-state-icon"><i class="bi bi-search"></i></div>
            <h5>No results found</h5>
            <p>Try different keywords or clear the search.</p>`;
        document.getElementById('notes').appendChild(div);
    }
});

// ─── Keyboard Shortcuts ───────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        document.getElementById('addbtn').click();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        document.getElementById('searchtxt').focus();
    }
});

// ─── Auto-save Draft ─────────────────────────────────────────────────────────
let autoSaveTimeout;
['addtitle', 'addtxt'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
        clearTimeout(autoSaveTimeout);
        autoSaveTimeout = setTimeout(autoSave, 1000);
    });
});

function autoSave() {
    const title = document.getElementById('addtitle').value;
    const text  = document.getElementById('addtxt').value;
    if (title || text) {
        localStorage.setItem('noteDraft', JSON.stringify({ title, text, ts: Date.now() }));
    } else {
        localStorage.removeItem('noteDraft');
    }
}

function loadDraft() {
    const raw = localStorage.getItem('noteDraft');
    if (!raw) return;
    try {
        const draft = JSON.parse(raw);
        if (draft.title) document.getElementById('addtitle').value = draft.title;
        if (draft.text)  document.getElementById('addtxt').value   = draft.text;
        if (draft.title || draft.text) showToast('Draft restored', 'success');
    } catch (_) {}
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const icon      = type === 'success' ? 'check-circle-fill' : 'exclamation-triangle-fill';

    const toast     = document.createElement('div');
    toast.className = `toast-item ${type}`;
    toast.innerHTML = `<i class="bi bi-${icon} toast-icon"></i>${message}`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ─── Count Badges ─────────────────────────────────────────────────────────────
function updateCountBadges(allNotes) {
    const visible = allNotes.filter(n => !n.hidden);
    const counts  = { all: visible.length, work: 0, personal: 0, ideas: 0, important: 0, study: 0, other: 0 };
    visible.forEach(n => { if (n.category && counts[n.category] !== undefined) counts[n.category]++; });
    Object.entries(counts).forEach(([key, val]) => {
        const el = document.getElementById(`cnt-${key}`);
        if (el) el.textContent = val;
    });
}

function updateNotesCountLabel(allNotes) {
    const count = allNotes.filter(n => !n.hidden).length;
    const label = document.getElementById('notesCountLabel');
    if (label) label.textContent = `${count} ${count === 1 ? 'note' : 'notes'}`;
}

// ─── Char Counter ─────────────────────────────────────────────────────────────
function initCharCounter() {
    const textarea = document.getElementById('addtxt');
    const counter  = document.getElementById('charCounter');
    if (!textarea || !counter) return;

    textarea.addEventListener('input', () => {
        const len = textarea.value.length;
        counter.textContent = `${len} character${len !== 1 ? 's' : ''}`;
        counter.classList.toggle('warn', len > 500);
    });
}

// ─── Stats Strip ──────────────────────────────────────────────────────────────
function renderStatsStrip(notes) {
    const strip = document.getElementById('statsStrip');
    if (!strip) return;

    const cats = ['work', 'personal', 'ideas', 'important', 'study', 'other'];
    const colors = {
        work: 'var(--work)', personal: 'var(--personal)', ideas: 'var(--ideas)',
        important: 'var(--important)', study: 'var(--study)', other: 'var(--other)'
    };

    const counts = {};
    cats.forEach(c => counts[c] = 0);
    notes.forEach(n => { if (n.category && counts[n.category] !== undefined) counts[n.category]++; });

    // Only show categories with notes
    const activeCats = cats.filter(c => counts[c] > 0);

    if (activeCats.length === 0) {
        strip.innerHTML = '';
        return;
    }

    strip.innerHTML = activeCats.map(cat => `
        <button class="stat-pill${currentFilter === cat ? ' active-filter' : ''}" data-filter="${cat}">
            <span class="stat-dot" style="background:${colors[cat]}"></span>
            ${capitalize(cat)}
            <strong>${counts[cat]}</strong>
        </button>
    `).join('');

    // Wire up click handlers
    strip.querySelectorAll('.stat-pill').forEach(pill => {
        pill.addEventListener('click', function () {
            const filter = this.dataset.filter;
            if (currentFilter === filter) {
                // Toggle off — show all
                currentFilter = 'all';
                document.querySelectorAll('#filterButtons .filter-item').forEach(b => {
                    b.classList.toggle('active', b.dataset.filter === 'all');
                });
                filterNotes('all');
            } else {
                currentFilter = filter;
                document.querySelectorAll('#filterButtons .filter-item').forEach(b => {
                    b.classList.toggle('active', b.dataset.filter === filter);
                });
                filterNotes(filter);
            }
            // Re-render strip to update active state
            renderStatsStrip(getNotesFromStorage());
        });
    });
}

// ─── Storage Helpers ──────────────────────────────────────────────────────────
function getNotesFromStorage() {
    try { return JSON.parse(localStorage.getItem('notes')) || []; }
    catch (_) { return []; }
}

function saveNotesToStorage(notes) {
    localStorage.setItem('notes', JSON.stringify(notes));
}

// ─── Utility ─────────────────────────────────────────────────────────────────
function getCategoryIcon(cat) {
    return {
        work:      '<i class="bi bi-briefcase-fill"></i>',
        personal:  '<i class="bi bi-person-fill"></i>',
        ideas:     '<i class="bi bi-lightbulb-fill"></i>',
        important: '<i class="bi bi-exclamation-circle-fill"></i>',
        study:     '<i class="bi bi-book-fill"></i>',
        other:     '<i class="bi bi-folder-fill"></i>'
    }[cat] || '';
}

function capitalize(str) { return str.charAt(0).toUpperCase() + str.slice(1); }

function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

console.log('Magic Notes App Ready! 📝✨');