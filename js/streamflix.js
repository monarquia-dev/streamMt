// ===============================================
// Fichier : streamflix.js
// Gestion globale de l'application Streamflix
// ===============================================

class StreamflixApp {
    constructor() {
        this.currentUser = null;
        this.isInitialized = false;
        this.init();
    }

    async init() {
        await this.checkAuthentication();
        this.setupEventListeners();
        this.isInitialized = true;
        console.log('🎬 Streamflix App Initialized');
    }

    // Authentification
    async checkAuthentication() {
        const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
        if (isLoggedIn) {
            this.currentUser = {
                id: localStorage.getItem('userId'),
                name: localStorage.getItem('userName'),
                email: localStorage.getItem('userEmail'),
                role: localStorage.getItem('userRole')
            };
        }
        this.updateUI();
    }

    // Navigation
    navigateTo(page) {
        window.location.href = page;
    }

    // Gestion des composants
    async loadComponent(url, containerId) {
        try {
            const response = await fetch(url);
            const html = await response.text();
            document.getElementById(containerId).innerHTML = html;
            
            // Ré-initialiser les icônes Lucide
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        } catch (error) {
            console.error('Erreur chargement composant:', error);
        }
    }

    // Mise à jour UI
    updateUI() {
        // Mettre à jour l'interface en fonction de l'état de connexion
        const userElements = document.querySelectorAll('[data-user]');
        userElements.forEach(el => {
            if (this.currentUser) {
                el.style.display = 'block';
                if (el.dataset.user === 'name') {
                    el.textContent = this.currentUser.name;
                }
            } else {
                el.style.display = 'none';
            }
        });
    }

    // Configuration des événements
    setupEventListeners() {
        // Navigation globale
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-nav]')) {
                e.preventDefault();
                this.navigateTo(e.target.href);
            }
        });

        // Gestion recherche
        const searchInput = document.getElementById('globalSearch');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(this.handleSearch, 300));
        }
    }

    // Recherche avec debounce
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    handleSearch(event) {
        const query = event.target.value.toLowerCase();
        // Implémenter la recherche globale
        console.log('Recherche:', query);
    }
}

// Fonctions globales
function openDetailsModal(contentId, contentType) {
    if (window.streamflixUI) {
        window.streamflixUI.openDetailsModal(contentId, contentType);
    }
}

function addToMyList(contentId, contentType) {
    if (window.streamflixUI) {
        window.streamflixUI.addToMyListQuick(contentId, contentType);
    }
}

function showNotification(message, type = 'info') {
    if (window.streamflixUI) {
        window.streamflixUI.showMessage(message, 3000);
    } else {
        // Fallback simple
        alert(message);
    }
}

// Initialisation globale
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Créer l'instance principale
    window.streamflixApp = new StreamflixApp();
    
    // Initialiser l'UI si disponible
    if (typeof StreamflixUI !== 'undefined') {
        window.streamflixUI = new StreamflixUI();
    }
});

// Fonction utilitaire pour charger les composants
function loadComponent(url, containerId) {
    if (window.streamflixApp) {
        window.streamflixApp.loadComponent(url, containerId);
    } else {
        // Fallback simple
        fetch(url)
            .then(response => response.text())
            .then(html => {
                document.getElementById(containerId).innerHTML = html;
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            });
    }
}