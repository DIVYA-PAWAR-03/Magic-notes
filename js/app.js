// Category Management
let selectedCategory = '';
let currentFilter = 'all';

// Initialize category selectors
function initCategorySelectors() {
    console.log('Initializing category selectors...');
    
    // Main form category selector
    const categoryOptions = document.querySelectorAll('#categorySelector .category-option');
    console.log('Found category options:', categoryOptions.length);
    
    categoryOptions.forEach(option => {
        option.addEventListener('click', function() {
            console.log('Category clicked:', this.dataset.category);
            
            // Remove selected class from all
            categoryOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Toggle selection
            if (selectedCategory === this.dataset.category) {
                selectedCategory = '';
            } else {
                this.classList.add('selected');
                selectedCategory = this.dataset.category;
            }
            
            document.getElementById('selectedCategory').value = selectedCategory;
            console.log('Selected category:', selectedCategory);
        });
    });
    
    // Edit modal category selector
    const editCategoryOptions = document.querySelectorAll('#editCategorySelector .category-option');
    editCategoryOptions.forEach(option => {
        option.addEventListener('click', function() {
            console.log('Edit category clicked:', this.dataset.category);
            
            // Remove selected class from all
            editCategoryOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Toggle selection
            const currentSelected = document.getElementById('editSelectedCategory').value;
            if (currentSelected === this.dataset.category) {
                document.getElementById('editSelectedCategory').value = '';
            } else {
                this.classList.add('selected');
                document.getElementById('editSelectedCategory').value = this.dataset.category;
            }
        });
    });
}

// Initialize filter buttons
function initFilterButtons() {
    console.log('Initializing filter buttons...');
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    console.log('Found filter buttons:', filterButtons.length);
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Filter clicked:', this.dataset.filter);
            
            // Remove active class from all
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active to clicked
            this.classList.add('active');
            
            // Set current filter
            currentFilter = this.dataset.filter;
            
            // Filter notes
            filterNotes(currentFilter);
        });
    });
}

// Wait for DOM to be fully loaded before initializing
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM Content Loaded - Initializing...');
        initCategorySelectors();
        initFilterButtons();
        showNotes();
    });
} else {
    // DOM is already loaded
    console.log('DOM already loaded - Initializing...');
    initCategorySelectors();
    initFilterButtons();
    showNotes();
}

console.log('Magic Notes App Initialized');

let addbtn = document.getElementById('addbtn');

addbtn.addEventListener('click', function (event) {
    let addtxt = document.getElementById('addtxt');
    let addtitle = document.getElementById('addtitle');

    // Validation
    if (!addtitle.value.trim()) {
        showAlert('Please enter a title for your note!', 'warning');
        return;
    }
    if (!addtxt.value.trim()) {
        showAlert('Please enter some content for your note!', 'warning');
        return;
    }

    let notes = localStorage.getItem('notes');
    let notesObj;

    if (notes == null) {
        notesObj = [];
    } else {
        notesObj = JSON.parse(notes);
    }

    let myObj = {
        title: addtitle.value.trim(),
        text: addtxt.value.trim(),
        timestamp: new Date().toLocaleString(),
        id: Date.now(),
        category: selectedCategory || ''
    };

    notesObj.push(myObj);
    localStorage.setItem('notes', JSON.stringify(notesObj));

    // Clear inputs
    addtxt.value = '';
    addtitle.value = '';
    
    // Reset category selection
    selectedCategory = '';
    document.getElementById('selectedCategory').value = '';
    document.querySelectorAll('#categorySelector .category-option').forEach(opt => {
        opt.classList.remove('selected');
    });

    // Show success message
    showAlert('Note saved successfully!', 'success');

    console.log(notesObj);
    showNotes();
});

// Function to show alert messages
function showAlert(message, type) {
    // Remove existing alerts
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        <i class="bi bi-${type === 'success' ? 'check-circle-fill' : 'exclamation-triangle-fill'} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    document.body.appendChild(alertDiv);

    // Auto remove after 3 seconds
    setTimeout(() => {
        if (alertDiv && alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 3000);
}
//function to show the notes
function showNotes() {
    let notes = localStorage.getItem('notes');
    let notesObj;

    if (notes == null) {
        notesObj = [];
    } else {
        notesObj = JSON.parse(notes);
    }

    let html = '';
    let notesEls = document.getElementById('notes');

    if (notesObj.length === 0) {
        notesEls.innerHTML = `
            <div class="col-12">
                <div class="empty-state fade-in">
                    <i class="bi bi-journal-x"></i>
                    <h4>No notes yet!</h4>
                    <p class="mb-0">Create your first note using the form above to get started.</p>
                </div>
            </div>
        `;
        return;
    }

    notesObj.forEach(function (element, index) {
        const truncatedText = element.text.length > 150 ?
            element.text.substring(0, 150) + '...' : element.text;
        
        const categoryBadge = element.category ? 
            `<span class="tag-badge ${element.category}">
                ${getCategoryIcon(element.category)} ${capitalizeFirst(element.category)}
            </span>` : '';

        html += `
            <div class="col-lg-4 col-md-6 col-sm-12" data-category="${element.category || 'none'}">
                <div class="card note-card noteCard fade-in" data-index="${index}">
                    <div class="card-body">
                        ${categoryBadge}
                        <h5 class="note-title">${element.title}</h5>
                        <p class="note-text">${truncatedText}</p>
                        ${element.timestamp ? `<small class="text-muted mb-2 d-block">
                            <i class="bi bi-clock me-1"></i>${element.timestamp}
                        </small>` : ''}
                        <div class="d-flex gap-2">
                            <button 
                                id="edit-${index}" 
                                onclick="editNote(${index})" 
                                class="btn btn-custom btn-sm flex-grow-1"
                                title="Edit this note"
                                style="background: var(--primary-gradient);"
                            >
                                <i class="bi bi-pencil-square me-1"></i>Edit
                            </button>
                            <button 
                                id="${index}" 
                                onclick="deleteNote(this.id)" 
                                class="btn btn-delete btn-sm flex-grow-1"
                                title="Delete this note"
                            >
                                <i class="bi bi-trash3-fill me-1"></i>Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    notesEls.innerHTML = html;

    // Add staggered animation
    const cards = document.querySelectorAll('.note-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Apply current filter after rendering
    if (currentFilter !== 'all') {
        filterNotes(currentFilter);
    }
}

// Helper function to get category icon
function getCategoryIcon(category) {
    const icons = {
        work: '<i class="bi bi-briefcase-fill"></i>',
        personal: '<i class="bi bi-person-fill"></i>',
        ideas: '<i class="bi bi-lightbulb-fill"></i>',
        important: '<i class="bi bi-exclamation-circle-fill"></i>',
        study: '<i class="bi bi-book-fill"></i>',
        other: '<i class="bi bi-folder-fill"></i>'
    };
    return icons[category] || '';
}

// Helper function to capitalize first letter
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

//function to delete the note
function deleteNote(index) {
    console.log('Deleting note at index:', index);

    // Show confirmation dialog
    if (!confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
        return;
    }

    let notes = localStorage.getItem('notes');
    let notesObj;

    if (notes == null) {
        notesObj = [];
    } else {
        notesObj = JSON.parse(notes);
    }

    // Remove the note
    notesObj.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notesObj));

    // Show success message
    showAlert('Note deleted successfully!', 'success');

    // Refresh the display
    showNotes();
}

// Function to edit a note
function editNote(index) {
    console.log('Editing note at index:', index);

    let notes = localStorage.getItem('notes');
    let notesObj;

    if (notes == null) {
        notesObj = [];
    } else {
        notesObj = JSON.parse(notes);
    }

    // Check if note exists
    if (!notesObj[index]) {
        showAlert('Note not found!', 'warning');
        return;
    }

    // Populate modal with note data
    document.getElementById('editTitle').value = notesObj[index].title;
    document.getElementById('editText').value = notesObj[index].text;
    document.getElementById('editIndex').value = index;
    
    // Set category selection
    const noteCategory = notesObj[index].category || '';
    document.getElementById('editSelectedCategory').value = noteCategory;
    
    // Update UI to show selected category
    const editCategoryOptions = document.querySelectorAll('#editCategorySelector .category-option');
    editCategoryOptions.forEach(opt => {
        opt.classList.remove('selected');
        if (opt.dataset.category === noteCategory) {
            opt.classList.add('selected');
        }
    });

    // Show the modal
    const editModal = new bootstrap.Modal(document.getElementById('editNoteModal'));
    editModal.show();
}

// Function to save edited note
function saveEditedNote() {
    const index = document.getElementById('editIndex').value;
    const editTitle = document.getElementById('editTitle').value.trim();
    const editText = document.getElementById('editText').value.trim();

    // Validation
    if (!editTitle) {
        showAlert('Please enter a title for your note!', 'warning');
        return;
    }
    if (!editText) {
        showAlert('Please enter some content for your note!', 'warning');
        return;
    }

    let notes = localStorage.getItem('notes');
    let notesObj;

    if (notes == null) {
        notesObj = [];
    } else {
        notesObj = JSON.parse(notes);
    }

    // Update the note
    if (notesObj[index]) {
        notesObj[index].title = editTitle;
        notesObj[index].text = editText;
        notesObj[index].timestamp = new Date().toLocaleString() + ' (edited)';
        notesObj[index].category = document.getElementById('editSelectedCategory').value || '';
        
        localStorage.setItem('notes', JSON.stringify(notesObj));
        
        // Hide the modal
        const editModal = bootstrap.Modal.getInstance(document.getElementById('editNoteModal'));
        editModal.hide();
        
        // Show success message
        showAlert('Note updated successfully!', 'success');
        
        // Refresh display
        showNotes();
    } else {
        showAlert('Error updating note!', 'warning');
    }
}

// Add event listener for save edit button
document.getElementById('saveEditBtn').addEventListener('click', saveEditedNote);

// Add Enter key support in edit modal
document.getElementById('editNoteModal').addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        saveEditedNote();
    }
    if (e.key === 'Escape') {
        const editModal = bootstrap.Modal.getInstance(document.getElementById('editNoteModal'));
        if (editModal) editModal.hide();
    }
});

// Function to filter notes by category
function filterNotes(category) {
    const noteCards = document.querySelectorAll('#notes > div[data-category]');
    let visibleCount = 0;
    
    noteCards.forEach(function(card) {
        const noteCategory = card.dataset.category;
        
        if (category === 'all' || noteCategory === category) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show message if no notes in this category
    const notesContainer = document.getElementById('notes');
    const existingMessage = document.querySelector('.category-empty-state');
    
    if (existingMessage) {
        existingMessage.remove();
    }
    
    if (visibleCount === 0 && noteCards.length > 0) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'col-12 category-empty-state';
        emptyDiv.innerHTML = `
            <div class="empty-state fade-in">
                <i class="bi bi-inbox"></i>
                <h4>No notes in this category</h4>
                <p class="mb-0">Try selecting a different category or create a new note.</p>
            </div>
        `;
        notesContainer.appendChild(emptyDiv);
    }
}

//for searching the notes 
let search = document.getElementById('searchtxt');
search.addEventListener('input', function () {
    let inputVal = search.value.toLowerCase().trim();
    console.log('Search input:', inputVal);

    let noteCards = document.getElementsByClassName('noteCard');
    let visibleCount = 0;

    Array.from(noteCards).forEach(function (element) {
        let cardTitle = element.getElementsByTagName('h5')[0].innerText.toLowerCase();
        let cardText = element.getElementsByTagName('p')[0].innerText.toLowerCase();
        
        // Get category badge if exists
        let categoryText = '';
        const categoryBadge = element.getElementsByClassName('tag-badge')[0];
        if (categoryBadge) {
            categoryText = categoryBadge.innerText.toLowerCase();
        }

        // Search in title, content, and category
        if (cardTitle.includes(inputVal) || cardText.includes(inputVal) || categoryText.includes(inputVal)) {
            element.style.display = 'block';
            element.parentElement.style.display = 'block';
            visibleCount++;
        } else {
            element.style.display = 'none';
            element.parentElement.style.display = 'none';
        }
    });

    // Show "no results" message if search has input but no matches
    const notesContainer = document.getElementById('notes');
    const existingNoResults = document.querySelector('.no-results');

    if (existingNoResults) {
        existingNoResults.remove();
    }

    if (inputVal && visibleCount === 0 && noteCards.length > 0) {
        const noResultsDiv = document.createElement('div');
        noResultsDiv.className = 'col-12 no-results';
        noResultsDiv.innerHTML = `
            <div class="empty-state fade-in">
                <i class="bi bi-search"></i>
                <h4>No matching notes found</h4>
                <p class="mb-0">Try searching with different keywords or check your spelling.</p>
            </div>
        `;
        notesContainer.appendChild(noResultsDiv);
    }
});

// Add keyboard shortcuts
document.addEventListener('keydown', function (e) {
    // Ctrl/Cmd + S to save note
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        document.getElementById('addbtn').click();
    }

    // Ctrl/Cmd + F to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        document.getElementById('searchtxt').focus();
    }
});

// Add auto-save functionality (save to localStorage on input)
let autoSaveTimeout;
const titleInput = document.getElementById('addtitle');
const textInput = document.getElementById('addtxt');

function autoSave() {
    const draftData = {
        title: titleInput.value,
        text: textInput.value,
        timestamp: Date.now()
    };

    if (draftData.title || draftData.text) {
        localStorage.setItem('noteDraft', JSON.stringify(draftData));
    } else {
        localStorage.removeItem('noteDraft');
    }
}

function loadDraft() {
    const draft = localStorage.getItem('noteDraft');
    if (draft) {
        const draftData = JSON.parse(draft);
        titleInput.value = draftData.title || '';
        textInput.value = draftData.text || '';

        if (draftData.title || draftData.text) {
            showAlert('Draft restored!', 'success');
        }
    }
}

titleInput.addEventListener('input', function () {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(autoSave, 1000);
});

textInput.addEventListener('input', function () {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(autoSave, 1000);
});

// Clear draft when note is saved
const originalAddBtn = addbtn.onclick;
addbtn.addEventListener('click', function () {
    localStorage.removeItem('noteDraft');
});

// Load draft on page load
document.addEventListener('DOMContentLoaded', function () {
    loadDraft();
});

// Initialize the app
console.log('Magic Notes App Ready! 📝✨');
//         name:"chetan",
//         age:22
//     }
//  ]

//  /////////////////////////////////////////

// Initialize the app
console.log('Magic Notes App Ready! 📝✨');