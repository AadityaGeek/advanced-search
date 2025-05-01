document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('advanced-search-form');
    const imageFiltersSection = document.getElementById('image-filters');
    const filetypeSection = document.getElementById('filetype-section');
    const searchTypeRadios = document.getElementsByName('search-type');
    
    // Toggle image filters and filetype sections based on search type
    searchTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'image') {
                imageFiltersSection.classList.remove('hidden');
                filetypeSection.classList.add('hidden');
            } else {
                imageFiltersSection.classList.add('hidden');
                filetypeSection.classList.remove('hidden');
            }
        });
    });
    
    // Handle exclusive checkboxes
    const exclusiveCheckboxes = document.querySelectorAll('.exclusive-checkbox');
    
    exclusiveCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                // Uncheck other checkboxes
                exclusiveCheckboxes.forEach(otherCheckbox => {
                    if (otherCheckbox !== this) {
                        otherCheckbox.checked = false;
                    }
                });
            }
        });
    });

    // Handle clear input buttons and input fields
    const clearButtons = document.querySelectorAll('.clear-input');
    
    // Function to toggle clear button visibility
    const toggleClearButton = (inputField, clearButton) => {
        if (inputField.value.length > 0) {
            clearButton.style.display = 'block';
        } else {
            clearButton.style.display = 'none';
        }
    };

    // Set up clear button functionality and input monitoring for each input field
    clearButtons.forEach(button => {
        const targetId = button.getAttribute('data-target');
        const inputField = document.getElementById(targetId);

        // Initial state
        toggleClearButton(inputField, button);

        // Monitor input changes
        inputField.addEventListener('input', () => {
            toggleClearButton(inputField, button);
        });

        // Clear button click handler
        button.addEventListener('click', () => {
            inputField.value = '';
            toggleClearButton(inputField, button);
            inputField.focus();
        });
    });

    // Form submission logic
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const searchQuery = document.getElementById('search-query').value.trim();
        const exactMatch = document.getElementById('exact-match').checked;
        const defineSearch = document.getElementById('define-search').checked;
        const siteSearch = document.getElementById('site-search').value.trim();
        const excludeWords = document.getElementById('exclude-words').value.trim();
        const filetype = document.getElementById('filetype').value;
        
        // Get search type (web or image)
        const searchType = document.querySelector('input[name="search-type"]:checked').value;
        
        // Build Google search query
        let finalQuery = searchQuery;
        
        if (exactMatch && searchQuery !== '') {
            finalQuery = `"${searchQuery}"`;
        }
        
        if (defineSearch && searchQuery !== '') {
            finalQuery = `define:${searchQuery}`;
        }
        
        if (siteSearch !== '') {
            finalQuery += ` site:${siteSearch}`;
        }
        
        if (excludeWords !== '') {
            const excludedTerms = excludeWords.split(' ')
                .filter(word => word.trim() !== '')
                .map(word => `-${word}`)
                .join(' ');
            
            finalQuery += ` ${excludedTerms}`;
        }
        
        if (filetype !== '' && searchType === 'web') {
            finalQuery += ` filetype:${filetype}`;
        }

        // Prepare image search parameters
        let imageTypeParams = [];
        
        if (searchType === 'image') {
            // Construct image search URL and parameters
            if (document.getElementById('img-clipart').checked) {
                imageTypeParams.push('itp:clipart');
            }
            if (document.getElementById('img-drawing').checked) {
                imageTypeParams.push('itp:lineart');
            }
            if (document.getElementById('img-transparent').checked) {
                imageTypeParams.push('ic:trans');
            }
            if (document.getElementById('img-vector').checked) {
                imageTypeParams.push('itp:animated');
            }
            if (document.getElementById('img-photo').checked) {
                imageTypeParams.push('itp:photo');
            }
            if (document.getElementById('img-lineart').checked) {
                imageTypeParams.push('itp:lineart');
            }
            if (document.getElementById('img-face').checked) {
                imageTypeParams.push('itp:face');
            }
            if (document.getElementById('img-animated').checked) {
                imageTypeParams.push('itp:animated');
            }
        }
        
        // Encode the query
        const encodedQuery = encodeURIComponent(finalQuery);
        
        // Determine destination URL based on search type
        let searchUrl;
        if (searchType === 'image') {
            searchUrl = `https://www.google.com/search?q=${encodedQuery}&tbm=isch`;
            
            // Add image type filters if any are selected
            if (imageTypeParams.length > 0) {
                searchUrl += `&tbs=${imageTypeParams.join(',')}`;
            }
        } else {
            searchUrl = `https://www.google.com/search?q=${encodedQuery}`;
        }
        
        // Redirect to the search URL
        window.open(searchUrl, '_blank');
    });
});
