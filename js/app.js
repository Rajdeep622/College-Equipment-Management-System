/**
 * College Event & Campus Management System - Master Controller Engine
 * Developed for Software Engineering & Web Development Lab Manual
 */

class ERPApp {
    constructor() {
        this.state = this.loadState();
        this.failedAttempts = 0;
        this.isLockedOut = false;
        this.lockoutTimer = null;
        this.loginRole = 'Student';
        this.selectedEventCategory = 'All';
        this.init();
    }

    loadState() {
        const saved = localStorage.getItem('campus_erp_state');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse saved state:", e);
            }
        }
        return JSON.parse(JSON.stringify(INITIAL_DATA));
    }

    saveState() {
        localStorage.setItem('campus_erp_state', JSON.stringify(this.state));
    }

    getCurrentUser() {
        const userJson = sessionStorage.getItem('currentUser');
        if (userJson) {
            try {
                return JSON.parse(userJson);
            } catch (e) {
                return null;
            }
        }
        return null;
    }

    init() {
        this.currentView = 'login';
        this.selectedFilterCategory = 'All';
        this.searchQuery = '';

        this.bindEvents();

        const currentUser = this.getCurrentUser();
        if (currentUser) {
            this.updateUserUI(currentUser);
            this.switchView('dashboard');
        } else {
            this.switchView('login');
        }
    }

    setLoginRole(role) {
        this.loginRole = role;
        const btnStudent = document.getElementById('btn-tab-student');
        const btnOrganizer = document.getElementById('btn-tab-organizer');
        const idLabel = document.getElementById('login-id-label');
        const idInput = document.getElementById('login-college-id');

        if (role === 'Student') {
            if (btnStudent) { btnStudent.style.background = 'var(--primary)'; btnStudent.style.color = 'white'; }
            if (btnOrganizer) { btnOrganizer.style.background = 'transparent'; btnOrganizer.style.color = 'var(--text-secondary)'; }
            if (idLabel) idLabel.textContent = 'College Student ID *';
            if (idInput) idInput.value = '24102C0043';
        } else {
            if (btnOrganizer) { btnOrganizer.style.background = 'var(--primary)'; btnOrganizer.style.color = 'white'; }
            if (btnStudent) { btnStudent.style.background = 'transparent'; btnStudent.style.color = 'var(--text-secondary)'; }
            if (idLabel) idLabel.textContent = 'Organizer Username / ID *';
            if (idInput) idInput.value = 'ORG-2024-001';
        }
    }

    bindEvents() {
        // Nav items click handler
        document.querySelectorAll('[data-view-target]').forEach(element => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                const targetView = element.getAttribute('data-view-target');
                this.switchView(targetView);
            });
        });

        // Login Form Submission & Live Input Error Clears
        const loginForm = document.getElementById('login-form');
        const collegeIdInput = document.getElementById('login-college-id');
        const passwordInput = document.getElementById('login-password');
        const errorAlert = document.getElementById('login-error-alert');

        if (collegeIdInput) {
            collegeIdInput.addEventListener('input', () => {
                collegeIdInput.classList.remove('is-invalid');
                if (errorAlert) errorAlert.style.display = 'none';
            });
        }

        if (passwordInput) {
            passwordInput.addEventListener('input', () => {
                passwordInput.classList.remove('is-invalid');
                if (errorAlert) errorAlert.style.display = 'none';
            });
        }

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Registration Form Submission (Lab Practical #3)
        const regForm = document.getElementById('registration-form');
        if (regForm) {
            regForm.addEventListener('submit', (e) => this.handleRegistration(e));
            
            ['reg-first-name', 'reg-last-name', 'reg-email', 'reg-mobile', 'reg-address', 'reg-password'].forEach(id => {
                const inputEl = document.getElementById(id);
                if (inputEl) {
                    inputEl.addEventListener('input', () => {
                        inputEl.classList.remove('is-invalid');
                        const regAlert = document.getElementById('reg-error-alert');
                        if (regAlert) regAlert.style.display = 'none';
                    });
                }
            });
        }

        // Event Registration Form Submission (Feature 2)
        const eventBookingForm = document.getElementById('event-booking-form');
        if (eventBookingForm) {
            eventBookingForm.addEventListener('submit', (e) => this.handleEventRegistration(e));
        }

        // Event Filters
        const eventFilterContainer = document.getElementById('event-category-filters');
        if (eventFilterContainer) {
            eventFilterContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('filter-chip')) {
                    document.querySelectorAll('#event-category-filters .filter-chip').forEach(c => c.classList.remove('active'));
                    e.target.classList.add('active');
                    this.selectedEventCategory = e.target.getAttribute('data-event-category');
                    this.renderEventsGrid();
                }
            });
        }

        // Global Search Input
        const searchInput = document.getElementById('global-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase().trim();
                if (this.currentView === 'equipment') this.renderEquipmentGrid();
                if (this.currentView === 'events') this.renderEventsGrid();
            });
        }

        // Filter chips handler for equipment
        const filterContainer = document.getElementById('category-filters');
        if (filterContainer) {
            filterContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('filter-chip')) {
                    document.querySelectorAll('#category-filters .filter-chip').forEach(c => c.classList.remove('active'));
                    e.target.classList.add('active');
                    this.selectedFilterCategory = e.target.getAttribute('data-category');
                    this.renderEquipmentGrid();
                }
            });
        }

        // Issue Equipment Form
        const issueForm = document.getElementById('issue-equipment-form');
        if (issueForm) {
            const eqSelect = document.getElementById('issue-eq-select');
            if (eqSelect) {
                eqSelect.addEventListener('change', () => this.updateIssueFormLimits());
            }

            const issueDateInput = document.getElementById('issue-date');
            const returnDateInput = document.getElementById('return-date');
            if (issueDateInput && returnDateInput) {
                issueDateInput.addEventListener('change', () => this.validateIssueDates());
                returnDateInput.addEventListener('change', () => this.validateIssueDates());
            }

            issueForm.addEventListener('submit', (e) => this.handleIssueSubmit(e));
        }

        // Mobile Nav Toggle
        const navToggle = document.getElementById('mobile-nav-toggle');
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                document.querySelector('.sidebar').classList.toggle('mobile-open');
            });
        }

        // Modal backdrop closes
        document.querySelectorAll('.modal-backdrop').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
    }

    switchView(viewName) {
        const currentUser = this.getCurrentUser();
        const protectedViews = ['dashboard', 'equipment', 'issue', 'return', 'profile', 'event-register'];

        if (protectedViews.includes(viewName) && !currentUser) {
            this.showToast('Access denied. Please login first.', 'warning');
            viewName = 'login';
        }

        this.currentView = viewName;

        const sidebar = document.querySelector('.sidebar');
        const mainWrapper = document.querySelector('.main-wrapper');
        const topHeader = document.querySelector('.top-header');

        if (viewName === 'landing' || viewName === 'login' || viewName === 'register') {
            if (sidebar) sidebar.style.display = 'none';
            if (mainWrapper) mainWrapper.style.marginLeft = '0';
            if (topHeader) topHeader.style.display = 'none';
        } else {
            if (sidebar) sidebar.style.display = 'flex';
            if (mainWrapper) mainWrapper.style.marginLeft = '';
            if (topHeader) topHeader.style.display = 'flex';
        }

        document.querySelectorAll('.page-view').forEach(view => {
            view.classList.remove('active');
        });

        const activeViewEl = document.getElementById(`view-${viewName}`);
        if (activeViewEl) {
            activeViewEl.classList.add('active');
        }

        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-view-target') === viewName) {
                item.classList.add('active');
            }
        });

        if (viewName === 'dashboard') this.renderDashboard();
        if (viewName === 'events') this.renderEventsGrid();
        if (viewName === 'event-register') this.renderEventRegisterForm();
        if (viewName === 'equipment') this.renderEquipmentGrid();
        if (viewName === 'issue') this.renderIssueForm();
        if (viewName === 'return') this.renderReturnList();
        if (viewName === 'profile') this.renderProfile();

        window.scrollTo(0, 0);
    }

    /**
     * LAB PRACTICAL #3: JavaScript Form Validation Engine
     */
    handleRegistration(e) {
        e.preventDefault();

        const fNameInput = document.getElementById('reg-first-name');
        const lNameInput = document.getElementById('reg-last-name');
        const emailInput = document.getElementById('reg-email');
        const mobileInput = document.getElementById('reg-mobile');
        const addressInput = document.getElementById('reg-address');
        const passwordInput = document.getElementById('reg-password');
        const regAlert = document.getElementById('reg-error-alert');

        const fName = fNameInput.value.trim();
        const lName = lNameInput.value.trim();
        const email = emailInput.value.trim();
        const mobile = mobileInput.value.trim();
        const address = addressInput.value.trim();
        const password = passwordInput.value.trim();

        let isValid = true;
        let errors = [];

        [fNameInput, lNameInput, emailInput, mobileInput, addressInput, passwordInput].forEach(inp => {
            if (inp) inp.classList.remove('is-invalid');
        });

        // 1. First Name Validation: Alphabets only and length >= 6
        const alphaRegex = /^[A-Za-z]+$/;
        if (!fName || !alphaRegex.test(fName) || fName.length < 6) {
            fNameInput.classList.add('is-invalid');
            errors.push("First Name must contain alphabets only and be at least 6 characters long.");
            isValid = false;
        }

        // 5. Last Name Validation: Should not be empty
        if (!lName) {
            lNameInput.classList.add('is-invalid');
            errors.push("Last Name should not be empty.");
            isValid = false;
        }

        // 3. Email ID Validation: Standard pattern name@domain.com
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            emailInput.classList.add('is-invalid');
            errors.push("Email ID must follow standard pattern (name@domain.com).");
            isValid = false;
        }

        // 4. Mobile Number Validation: 10 digits only
        const mobileRegex = /^\d{10}$/;
        if (!mobile || !mobileRegex.test(mobile)) {
            mobileInput.classList.add('is-invalid');
            errors.push("Mobile Number must contain exactly 10 numeric digits.");
            isValid = false;
        }

        // 5. Address Validation: Should not be empty
        if (!address) {
            addressInput.classList.add('is-invalid');
            errors.push("Address cannot be empty.");
            isValid = false;
        }

        // 2. Password Validation: Minimum 6 characters length
        if (!password || password.length < 6) {
            passwordInput.classList.add('is-invalid');
            errors.push("Password must be at least 6 characters length.");
            isValid = false;
        }

        if (!isValid) {
            if (regAlert) {
                regAlert.style.display = 'block';
                regAlert.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <strong>Validation Errors Detected:</strong><ul style="margin-top:4px; padding-left:20px;">${errors.map(err => `<li>${err}</li>`).join('')}</ul>`;
            }
            alert(`Validation Errors:\n${errors.join('\n')}`);
            return;
        }

        const newStudentId = `24102C00${Math.floor(55 + Math.random() * 40)}`;
        const newUser = {
            id: newStudentId,
            password: password,
            name: `${fName} ${lName}`,
            role: "Student",
            email: email,
            department: "Computer Engineering",
            semester: "4th Semester",
            phone: `+91 ${mobile}`,
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250",
            joinedDate: "August 2026"
        };

        USERS.push(newUser);
        sessionStorage.setItem('currentUser', JSON.stringify(newUser));

        if (regAlert) regAlert.style.display = 'none';
        this.updateUserUI(newUser);
        this.showToast(`Registration Successful! Student ID: ${newStudentId}`, "success");
        this.switchView('dashboard');
    }

    handleLogin(e) {
        e.preventDefault();

        if (this.isLockedOut) {
            this.showToast("Too many failed attempts. Please try again later.", "danger");
            return;
        }

        const collegeIdInput = document.getElementById('login-college-id');
        const passwordInput = document.getElementById('login-password');
        const errorAlert = document.getElementById('login-error-alert');

        const collegeId = collegeIdInput.value.trim();
        const password = passwordInput.value.trim();

        collegeIdInput.classList.remove('is-invalid');
        passwordInput.classList.remove('is-invalid');
        if (errorAlert) errorAlert.style.display = 'none';

        if (!collegeId) {
            collegeIdInput.classList.add('is-invalid');
            return;
        }

        if (!password || password.length < 6) {
            passwordInput.classList.add('is-invalid');
            return;
        }

        const registeredUser = USERS.find(u => u.id === collegeId);

        if (!registeredUser) {
            this.registerFailedAttempt();
            this.showLoginError("Student / User not registered in Campus Management System.");
            return;
        }

        if (registeredUser.password !== password) {
            this.registerFailedAttempt();
            this.showLoginError("Incorrect Password.");
            return;
        }

        this.failedAttempts = 0;
        sessionStorage.setItem('currentUser', JSON.stringify(registeredUser));
        
        this.updateUserUI(registeredUser);
        this.showToast("Authentication Verified", "success");

        const verificationModal = document.getElementById('modal-verified');
        const verifiedNameSpan = document.getElementById('verified-student-name');
        if (verifiedNameSpan) verifiedNameSpan.textContent = registeredUser.name;

        if (verificationModal) {
            this.openModal('modal-verified');
            setTimeout(() => {
                this.closeModal('modal-verified');
                this.switchView('dashboard');
            }, 1200);
        } else {
            this.switchView('dashboard');
        }
    }

    registerFailedAttempt() {
        this.failedAttempts++;
        if (this.failedAttempts >= 3) {
            this.triggerLockout();
        }
    }

    triggerLockout() {
        this.isLockedOut = true;
        const loginBtn = document.getElementById('login-submit-btn');
        const errorAlert = document.getElementById('login-error-alert');

        let secondsLeft = 30;

        loginBtn.disabled = true;
        this.showLoginError("Too many failed attempts. Please try again later.");

        this.lockoutTimer = setInterval(() => {
            secondsLeft--;
            loginBtn.innerHTML = `<i class="fa-solid fa-clock"></i> Try again in ${secondsLeft}s`;

            if (secondsLeft <= 0) {
                clearInterval(this.lockoutTimer);
                this.isLockedOut = false;
                this.failedAttempts = 0;
                loginBtn.disabled = false;
                loginBtn.innerHTML = `<i class="fa-solid fa-lock"></i> Verify & Sign In`;
                if (errorAlert) errorAlert.style.display = 'none';
            }
        }, 1000);
    }

    showLoginError(message) {
        const errorAlert = document.getElementById('login-error-alert');
        if (errorAlert) {
            errorAlert.style.display = 'block';
            errorAlert.textContent = message;
        } else {
            this.showToast(message, 'danger');
        }
    }

    logout() {
        sessionStorage.removeItem('currentUser');
        this.showToast('Logged out of ERP portal', 'info');
        
        const loginForm = document.getElementById('login-form');
        if (loginForm) loginForm.reset();

        const errorAlert = document.getElementById('login-error-alert');
        if (errorAlert) errorAlert.style.display = 'none';

        this.switchView('login');
    }

    updateUserUI(user) {
        if (!user) return;
        document.querySelectorAll('.js-user-name').forEach(el => el.textContent = user.name);
        document.querySelectorAll('.js-user-id').forEach(el => el.textContent = user.id);
        document.querySelectorAll('.js-user-dept').forEach(el => el.textContent = user.department);
        document.querySelectorAll('.js-user-avatar').forEach(el => el.src = user.avatar);
    }

    /* Event Schedule & Catalog Component (Feature 1) */
    renderEventsGrid() {
        const container = document.getElementById('events-grid-container');
        if (!container) return;

        let filtered = this.state.events;

        if (this.selectedEventCategory !== 'All') {
            filtered = filtered.filter(evt => evt.category === this.selectedEventCategory);
        }

        if (this.searchQuery) {
            filtered = filtered.filter(evt => 
                evt.title.toLowerCase().includes(this.searchQuery) ||
                evt.category.toLowerCase().includes(this.searchQuery) ||
                evt.venue.toLowerCase().includes(this.searchQuery)
            );
        }

        if (filtered.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px; color: var(--text-muted);">
                    <i class="fa-solid fa-calendar-xmark" style="font-size: 3rem; margin-bottom: 12px; opacity: 0.5;"></i>
                    <p>No events found matching your criteria.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filtered.map(evt => `
            <div class="eq-card">
                <div class="eq-thumb">
                    <img src="${evt.image}" alt="${evt.title}">
                    <span class="eq-badge badge-instock">${evt.category}</span>
                </div>
                <div class="eq-content">
                    <span class="eq-category"><i class="fa-regular fa-clock"></i> ${evt.time}</span>
                    <h3 class="eq-title">${evt.title}</h3>
                    <p class="eq-desc">${evt.description}</p>
                    <div class="eq-meta" style="flex-direction: column; align-items: flex-start; gap: 4px;">
                        <span><i class="fa-solid fa-location-dot" style="color: var(--primary-light);"></i> ${evt.venue}</span>
                        <span><i class="fa-solid fa-calendar-day" style="color: var(--accent);"></i> Date: <strong>${evt.date}</strong></span>
                    </div>
                </div>
                <div class="eq-card-footer">
                    <button class="btn btn-primary btn-block btn-sm" onclick="app.openEventBookingFor('${evt.id}')">
                        <i class="fa-solid fa-ticket"></i> Register for Event
                    </button>
                </div>
            </div>
        `).join('');
    }

    openEventBookingFor(eventId) {
        this.switchView('event-register');
        const select = document.getElementById('event-select');
        if (select) select.value = eventId;
    }

    renderEventRegisterForm() {
        const select = document.getElementById('event-select');
        if (!select) return;

        select.innerHTML = `
            <option value="">-- Select Campus Event --</option>
            ${this.state.events.map(evt => `
                <option value="${evt.id}">
                    ${evt.title} (${evt.date} @ ${evt.venue})
                </option>
            `).join('')}
        `;
    }

    handleEventRegistration(e) {
        e.preventDefault();
        const currentUser = this.getCurrentUser();
        const eventSelect = document.getElementById('event-select');
        const passType = document.getElementById('event-ticket-type').value;

        if (!eventSelect.value) {
            alert("Please select an event to register.");
            return;
        }

        const selectedEvt = this.state.events.find(evt => evt.id === eventSelect.value);

        const newReg = {
            id: `REG-EVT-${Math.floor(100 + Math.random() * 900)}`,
            userId: currentUser ? currentUser.id : "24102C0043",
            eventId: selectedEvt.id,
            eventName: selectedEvt.title,
            date: selectedEvt.date,
            venue: selectedEvt.venue,
            passType: passType,
            status: "Confirmed"
        };

        this.state.registeredEvents.push(newReg);
        this.saveState();

        this.showToast(`Successfully registered for ${selectedEvt.title}!`, 'success');
        document.getElementById('event-booking-form').reset();
        this.switchView('dashboard');
    }

    /* Dashboard Component */
    renderDashboard() {
        const currentUser = this.getCurrentUser();
        if (currentUser) {
            document.querySelectorAll('.js-user-name').forEach(el => el.textContent = currentUser.name);
        }

        const eq = this.state.equipment;
        const totalEq = eq.reduce((acc, curr) => acc + curr.quantity, 0);
        const activeIssued = this.state.issuedItems.filter(i => i.status !== 'Returned').length;
        const pendingCount = this.state.pendingRequests.length;
        const regEventsCount = this.state.registeredEvents.length;
        const totalPenalty = this.calculateTotalPenalty();

        document.getElementById('dash-registered-events').textContent = regEventsCount;
        document.getElementById('dash-total-eq').textContent = totalEq;
        document.getElementById('dash-issued-eq').textContent = activeIssued;
        document.getElementById('dash-pending-req').textContent = pendingCount;
        document.getElementById('dash-penalty-amt').textContent = `₹${totalPenalty}`;

        // Render Events Table
        const eventsTable = document.getElementById('dash-events-table');
        if (eventsTable) {
            eventsTable.innerHTML = this.state.registeredEvents.map(reg => `
                <tr>
                    <td>
                        <strong style="color: var(--text-primary); font-size: 0.85rem;">${reg.eventName}</strong>
                    </td>
                    <td>
                        <div style="font-size: 0.78rem;">${reg.date}</div>
                        <div style="font-size: 0.72rem; color: var(--text-muted);">${reg.venue}</div>
                    </td>
                    <td>
                        <span class="status-badge status-returned">${reg.passType}</span>
                    </td>
                </tr>
            `).join('');
        }

        // Render Recent Activity Table
        const recentTable = document.getElementById('dash-recent-table');
        if (recentTable) {
            const allItems = [...this.state.issuedItems].reverse().slice(0, 5);
            recentTable.innerHTML = allItems.map(item => `
                <tr>
                    <td>
                        <div style="font-weight: 600; font-size: 0.85rem;">${item.equipmentName}</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">${item.category}</div>
                    </td>
                    <td>${item.dueDate}</td>
                    <td>
                        ${item.penaltyAmount > 0 ? `<strong style="color: var(--danger);">₹${item.penaltyAmount}</strong>` : '₹0'}
                    </td>
                </tr>
            `).join('');
        }
    }

    calculateTotalPenalty() {
        const today = new Date("2026-08-06");
        let total = 0;

        this.state.issuedItems.forEach(item => {
            if (item.status !== 'Returned') {
                const dueDate = new Date(item.dueDate);
                if (today > dueDate) {
                    const diffTime = Math.abs(today - dueDate);
                    const daysOverdue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    item.daysLate = daysOverdue;
                    item.penaltyAmount = daysOverdue * 50;
                    item.status = 'Overdue';
                    total += item.penaltyAmount;
                } else {
                    item.daysLate = 0;
                    item.penaltyAmount = 0;
                    item.status = 'Issued';
                }
            }
        });
        return total;
    }

    /* Equipment View Component */
    renderEquipmentGrid() {
        const container = document.getElementById('equipment-grid-container');
        if (!container) return;

        let filtered = this.state.equipment;

        if (this.selectedFilterCategory !== 'All') {
            filtered = filtered.filter(item => item.category === this.selectedFilterCategory);
        }

        if (this.searchQuery) {
            filtered = filtered.filter(item => 
                item.name.toLowerCase().includes(this.searchQuery) || 
                item.category.toLowerCase().includes(this.searchQuery) ||
                item.description.toLowerCase().includes(this.searchQuery)
            );
        }

        if (filtered.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px; color: var(--text-muted);">
                    <i class="fa-solid fa-box-open" style="font-size: 3rem; margin-bottom: 12px; opacity: 0.5;"></i>
                    <p>No equipment matching your criteria was found.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filtered.map(item => {
            let stockBadge = 'badge-instock';
            let stockText = 'In Stock';
            if (item.available === 0) {
                stockBadge = 'badge-outstock';
                stockText = 'Out of Stock';
            } else if (item.available < 5) {
                stockBadge = 'badge-lowstock';
                stockText = `Low Stock (${item.available} Left)`;
            }

            return `
                <div class="eq-card">
                    <div class="eq-thumb">
                        <img src="${item.image}" alt="${item.name}" loading="lazy">
                        <span class="eq-badge ${stockBadge}">${stockText}</span>
                    </div>
                    <div class="eq-content">
                        <span class="eq-category">${item.category}</span>
                        <h3 class="eq-title">${item.name}</h3>
                        <p class="eq-desc">${item.description}</p>
                        <div class="eq-meta">
                            <span>Available: <strong>${item.available} / ${item.quantity}</strong></span>
                            <span>Max: <strong>${item.maxDays} Days</strong></span>
                        </div>
                    </div>
                    <div class="eq-card-footer">
                        <button class="btn btn-primary btn-block btn-sm" 
                            ${item.available === 0 ? 'disabled' : ''} 
                            onclick="app.openIssueModalFor('${item.id}')">
                            <i class="fa-solid fa-paper-plane"></i> Request Equipment
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    openIssueModalFor(equipmentId) {
        this.switchView('issue');
        const eqSelect = document.getElementById('issue-eq-select');
        if (eqSelect) {
            eqSelect.value = equipmentId;
            this.updateIssueFormLimits();
        }
    }

    /* Issue Equipment Form Component */
    renderIssueForm() {
        const currentUser = this.getCurrentUser();
        if (currentUser) {
            this.updateUserUI(currentUser);
        }

        const eqSelect = document.getElementById('issue-eq-select');
        if (!eqSelect) return;

        eqSelect.innerHTML = `
            <option value="">-- Select Equipment Item --</option>
            ${this.state.equipment.map(item => `
                <option value="${item.id}" ${item.available === 0 ? 'disabled' : ''}>
                    ${item.name} (${item.category}) - ${item.available} Available [Max ${item.maxDays} days]
                </option>
            `).join('')}
        `;

        const today = new Date().toISOString().split('T')[0];
        const issueDateInput = document.getElementById('issue-date');
        if (issueDateInput) issueDateInput.value = today;

        this.updateIssueFormLimits();
    }

    updateIssueFormLimits() {
        const eqSelect = document.getElementById('issue-eq-select');
        const maxInfoBox = document.getElementById('issue-max-days-info');
        const selectedId = eqSelect.value;

        if (!selectedId) {
            maxInfoBox.style.display = 'none';
            return;
        }

        const equipment = this.state.equipment.find(e => e.id === selectedId);
        if (equipment) {
            maxInfoBox.style.display = 'block';
            maxInfoBox.innerHTML = `
                <i class="fa-solid fa-info-circle" style="color: var(--primary-light);"></i>
                Borrow Limit for <strong>${equipment.name}</strong> is <strong>${equipment.maxDays} days</strong>.
                Return date cannot exceed this duration.
            `;

            const issueDateVal = document.getElementById('issue-date').value || new Date().toISOString().split('T')[0];
            const issueDate = new Date(issueDateVal);
            issueDate.setDate(issueDate.getDate() + equipment.maxDays);
            
            const returnDateInput = document.getElementById('return-date');
            if (returnDateInput) {
                returnDateInput.value = issueDate.toISOString().split('T')[0];
                returnDateInput.max = issueDate.toISOString().split('T')[0];
            }
        }
    }

    validateIssueDates() {
        const eqSelect = document.getElementById('issue-eq-select');
        const issueDateInput = document.getElementById('issue-date');
        const returnDateInput = document.getElementById('return-date');
        const errorFeedback = document.getElementById('issue-date-error');

        if (!eqSelect.value || !issueDateInput.value || !returnDateInput.value) return true;

        const equipment = this.state.equipment.find(e => e.id === eqSelect.value);
        const issueDate = new Date(issueDateInput.value);
        const returnDate = new Date(returnDateInput.value);

        if (returnDate < issueDate) {
            returnDateInput.classList.add('is-invalid');
            errorFeedback.textContent = "Return date cannot be earlier than issue date.";
            return false;
        }

        const diffDays = Math.ceil((returnDate - issueDate) / (1000 * 60 * 60 * 24));

        if (diffDays > equipment.maxDays) {
            returnDateInput.classList.add('is-invalid');
            errorFeedback.textContent = `Return date exceeds maximum borrowing limit of ${equipment.maxDays} days!`;
            return false;
        }

        returnDateInput.classList.remove('is-invalid');
        return true;
    }

    handleIssueSubmit(e) {
        e.preventDefault();
        if (!this.validateIssueDates()) return;

        const currentUser = this.getCurrentUser();
        const eqSelect = document.getElementById('issue-eq-select');
        const issueDate = document.getElementById('issue-date').value;
        const returnDate = document.getElementById('return-date').value;
        const purpose = document.getElementById('issue-purpose').value;

        const equipment = this.state.equipment.find(e => e.id === eqSelect.value);

        const newReq = {
            id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
            userId: currentUser ? currentUser.id : "24102C0043",
            equipmentId: equipment.id,
            equipmentName: equipment.name,
            category: equipment.category,
            requestDate: issueDate,
            durationDays: Math.ceil((new Date(returnDate) - new Date(issueDate)) / (1000 * 60 * 60 * 24)),
            expectedReturnDate: returnDate,
            purpose: purpose || "Academic Project",
            status: "Pending Approval"
        };

        this.state.pendingRequests.push(newReq);
        this.saveState();

        this.showToast(`Issue request for ${equipment.name} submitted successfully!`, 'success');
        document.getElementById('issue-equipment-form').reset();
        this.switchView('dashboard');
    }

    /* Return Equipment Component */
    renderReturnList() {
        const tbody = document.getElementById('return-items-tbody');
        if (!tbody) return;

        this.calculateTotalPenalty();

        const activeIssued = this.state.issuedItems.filter(i => i.status !== 'Returned');

        if (activeIssued.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px; color: var(--text-muted);">
                        <i class="fa-solid fa-circle-check" style="font-size: 2.5rem; color: var(--success); margin-bottom: 10px; display: block;"></i>
                        No active equipment issues. All items returned!
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = activeIssued.map(item => `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <img src="${item.image}" style="width: 44px; height: 44px; border-radius: 8px; object-fit: cover;">
                        <div>
                            <div style="font-weight: 700;">${item.equipmentName}</div>
                            <div style="font-size: 0.78rem; color: var(--accent);">${item.id}</div>
                        </div>
                    </div>
                </td>
                <td>${item.issueDate}</td>
                <td>${item.dueDate}</td>
                <td>
                    <span class="status-badge status-${item.status.toLowerCase()}">
                        <i class="fa-solid fa-circle" style="font-size: 0.4rem;"></i>
                        ${item.status} ${item.daysLate > 0 ? `(${item.daysLate}d Overdue)` : ''}
                    </span>
                </td>
                <td>
                    ${item.penaltyAmount > 0 ? `
                        <div style="color: var(--danger); font-weight: 800;">
                            ₹${item.penaltyAmount}
                            <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 400;">₹50/day fine</div>
                        </div>
                    ` : '<span style="color: var(--success); font-weight: 600;">₹0 (No Fine)</span>'}
                </td>
                <td>
                    <button class="btn btn-success btn-sm" onclick="app.promptReturnModal('${item.id}')">
                        <i class="fa-solid fa-rotate-left"></i> Return Now
                    </button>
                </td>
            </tr>
        `).join('');
    }

    promptReturnModal(issueId) {
        const item = this.state.issuedItems.find(i => i.id === issueId);
        if (!item) return;

        const body = document.getElementById('return-modal-body');
        body.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="${item.image}" style="width: 90px; height: 90px; border-radius: 12px; object-fit: cover; margin-bottom: 12px;">
                <h3>Return ${item.equipmentName}</h3>
                <p style="font-size: 0.85rem; color: var(--text-secondary);">Issue ID: ${item.id}</p>
            </div>

            <div style="background: var(--bg-surface-elevated); padding: 16px; border-radius: 10px; margin-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.88rem;">
                    <span style="color: var(--text-muted);">Issue Date:</span>
                    <strong>${item.issueDate}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.88rem;">
                    <span style="color: var(--text-muted);">Due Date:</span>
                    <strong>${item.dueDate}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.88rem;">
                    <span style="color: var(--text-muted);">Return Date:</span>
                    <strong style="color: var(--success);">2026-08-06 (Today)</strong>
                </div>
            </div>

            ${item.penaltyAmount > 0 ? `
                <div class="penalty-box">
                    <div>
                        <div style="font-size: 0.85rem; font-weight: 700; color: var(--danger);">Late Return Fine</div>
                        <div style="font-size: 0.78rem; color: var(--text-secondary);">${item.daysLate} days overdue @ ₹50/day</div>
                    </div>
                    <div class="penalty-amount">₹${item.penaltyAmount}</div>
                </div>
            ` : `
                <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid var(--success); color: var(--success); padding: 12px; border-radius: 8px; text-align: center; font-weight: 600; font-size: 0.88rem; margin-bottom: 16px;">
                    <i class="fa-solid fa-circle-check"></i> Returned on time! No penalty applicable.
                </div>
            `}
        `;

        document.getElementById('confirm-return-btn').onclick = () => this.executeReturn(item.id);
        this.openModal('modal-return-confirm');
    }

    executeReturn(issueId) {
        const item = this.state.issuedItems.find(i => i.id === issueId);
        if (!item) return;

        item.status = 'Returned';
        item.returnDate = '2026-08-06';

        const equipment = this.state.equipment.find(e => e.id === item.equipmentId);
        if (equipment) {
            equipment.available = Math.min(equipment.quantity, equipment.available + 1);
        }

        this.saveState();
        this.closeModal('modal-return-confirm');
        this.showToast(`Returned ${item.equipmentName} successfully!`, 'success');
        this.renderReturnList();
        this.renderDashboard();
    }

    /* Student Profile Component */
    renderProfile() {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return;

        document.getElementById('prof-name').textContent = currentUser.name;
        document.getElementById('prof-id').textContent = currentUser.id;
        document.getElementById('prof-email').textContent = currentUser.email;
        document.getElementById('prof-dept').textContent = currentUser.department;
        document.getElementById('prof-sem').textContent = currentUser.semester;
        document.getElementById('prof-phone').textContent = currentUser.phone;
        document.getElementById('prof-joined').textContent = currentUser.joinedDate;
        
        const totalIssuedHistory = this.state.issuedItems.length;
        const returnedCount = this.state.issuedItems.filter(i => i.status === 'Returned').length;
        const activeCount = this.state.issuedItems.filter(i => i.status !== 'Returned').length;

        document.getElementById('prof-stat-total').textContent = totalIssuedHistory;
        document.getElementById('prof-stat-active').textContent = activeCount;
        document.getElementById('prof-stat-returned').textContent = returnedCount;
    }

    /* UI Helper Engine */
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('active');
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('active');
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast-item toast-${type}`;
        
        let iconClass = 'fa-info-circle';
        if (type === 'success') iconClass = 'fa-circle-check';
        if (type === 'danger') iconClass = 'fa-triangle-exclamation';
        if (type === 'warning') iconClass = 'fa-triangle-exclamation';

        toast.innerHTML = `
            <i class="fa-solid ${iconClass}"></i>
            <span style="font-size: 0.88rem; font-weight: 500;">${message}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    }
}

// Global App Initialization
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new ERPApp();
});
