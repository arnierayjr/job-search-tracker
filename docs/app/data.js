const AUTH = {
  SESSION_KEY: 'jobtrace_session',
  REMEMBER_KEY: 'jobtrace_remember_email',

  getCurrentUser() {
    try {
      const s = sessionStorage.getItem(this.SESSION_KEY) || localStorage.getItem(this.SESSION_KEY);
      return s ? JSON.parse(s) : null;
    } catch(e) { return null; }
  },

  getRememberedEmail() {
    return localStorage.getItem(this.REMEMBER_KEY) || '';
  },

  _createSession(email, name, remember) {
    const id = btoa(email.toLowerCase().trim()).replace(/=/g, '');
    const user = { email: email.toLowerCase().trim(), name: name || '', id };
    // Always clear both storages first to avoid stale sessions
    localStorage.removeItem(this.SESSION_KEY);
    sessionStorage.removeItem(this.SESSION_KEY);
    if (remember) {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
      localStorage.setItem(this.REMEMBER_KEY, email.toLowerCase().trim());
    } else {
      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
      localStorage.removeItem(this.REMEMBER_KEY);
    }
    return user;
  },

  async _hashPassword(password, email) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + email.toLowerCase().trim());
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  },

  async register(email, name, password) {
    const emailNorm = email.toLowerCase().trim();
    const id = btoa(emailNorm).replace(/=/g, '');
    const passwordHash = await this._hashPassword(password, emailNorm);
    localStorage.setItem('jobtrace_auth_' + id, JSON.stringify({ passwordHash }));
    return this._createSession(emailNorm, name, false);
  },

  async verifyAndSignIn(email, password, remember) {
    const emailNorm = email.toLowerCase().trim();
    const id = btoa(emailNorm).replace(/=/g, '');
    const authRaw = localStorage.getItem('jobtrace_auth_' + id);
    const userData = localStorage.getItem('jobtrace_v1_' + id);
    const name = userData ? (JSON.parse(userData).user?.name || '') : '';

    if (!authRaw) {
      // Legacy account — no password hash yet. Sign them in and save their password going forward.
      if (!userData) return false;
      const passwordHash = await this._hashPassword(password, emailNorm);
      localStorage.setItem('jobtrace_auth_' + id, JSON.stringify({ passwordHash }));
      this._createSession(emailNorm, name, remember);
      return true;
    }

    const { passwordHash } = JSON.parse(authRaw);
    const inputHash = await this._hashPassword(password, emailNorm);
    if (inputHash !== passwordHash) return false;
    this._createSession(emailNorm, name, remember);
    return true;
  },

  async resetPassword(email, newPassword) {
    const emailNorm = email.toLowerCase().trim();
    const id = btoa(emailNorm).replace(/=/g, '');
    const passwordHash = await this._hashPassword(newPassword, emailNorm);
    localStorage.setItem('jobtrace_auth_' + id, JSON.stringify({ passwordHash }));
  },

  signOut() {
    localStorage.removeItem(this.SESSION_KEY);
    sessionStorage.removeItem(this.SESSION_KEY);
    window.location.href = '/app/auth/index.html';
  },

  requireAuth() {
    const user = this.getCurrentUser();
    if (!user) {
      window.location.href = '/app/auth/index.html';
      return null;
    }
    return user;
  },

  hasAccount(email) {
    const id = btoa(email.toLowerCase().trim()).replace(/=/g, '');
    return !!(localStorage.getItem('jobtrace_auth_' + id) || localStorage.getItem('jobtrace_v1_' + id));
  }
};

const DB = {
  get KEY() {
    const user = AUTH.getCurrentUser();
    return user ? 'jobtrace_v1_' + user.id : 'jobtrace_v1';
  },

  get() {
    try {
      const raw = localStorage.getItem(this.KEY);
      return raw ? JSON.parse(raw) : this._seed();
    } catch(e) { return this._seed(); }
  },

  save(data) {
    localStorage.setItem(this.KEY, JSON.stringify(data));
  },

  _seed() {
    const data = {
      user: {
        name: '',
        initials: '',
        status: 'ACTIVELY HUNTING',
        targetRole: '',
        location: ''
      },
      applications: [],
      contacts: []
    };
    this.save(data);
    return data;
  },

  // Applications
  getApplications() { return this.get().applications; },
  getApplication(id) { return this.get().applications.find(a => a.id === id) || null; },
  saveApplication(app) {
    const data = this.get();
    const idx = data.applications.findIndex(a => a.id === app.id);
    if (idx >= 0) data.applications[idx] = app;
    else data.applications.push(app);
    this.save(data);
  },
  addApplication(app) {
    const data = this.get();
    app.id = 'app-' + Date.now();
    app.statusLog = [{ date: app.dateApplied, status: app.status, notes: 'Application submitted' }];
    data.applications.unshift(app);
    this.save(data);
    return app;
  },

  // Contacts
  getContacts() { return this.get().contacts; },
  addContact(contact) {
    const data = this.get();
    contact.id = 'contact-' + Date.now();
    contact.dateAdded = new Date().toISOString().split('T')[0];
    data.contacts.unshift(contact);
    this.save(data);
    return contact;
  },
  deleteContact(id) {
    const data = this.get();
    data.contacts = data.contacts.filter(c => c.id !== id);
    this.save(data);
  },

  // User
  getUser() { return this.get().user; },
  saveUser(user) {
    const data = this.get();
    data.user = { ...data.user, ...user };
    this.save(data);
  },

  // Status config
  STATUS: {
    applied:       { label: 'Applied',       color: '#2563eb', bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.2)' },
    'phone-screen':{ label: 'Phone Screen',  color: '#0891b2', bg: 'rgba(8,145,178,0.08)',   border: 'rgba(8,145,178,0.2)' },
    interview:     { label: 'Interview',     color: '#7c3aed', bg: 'rgba(124,58,237,0.08)',  border: 'rgba(124,58,237,0.2)' },
    offer:         { label: 'Offer',         color: '#16a34a', bg: 'rgba(22,163,74,0.08)',   border: 'rgba(22,163,74,0.2)' },
    rejected:      { label: 'Rejected',      color: '#dc2626', bg: 'rgba(220,38,38,0.08)',   border: 'rgba(220,38,38,0.2)' },
    withdrawn:     { label: 'Withdrawn',     color: '#64748b', bg: 'rgba(100,116,139,0.08)', border: 'rgba(100,116,139,0.2)' }
  },

  statusBadge(status) {
    const s = this.STATUS[status] || this.STATUS.applied;
    return `<span style="font-family:'Inter',sans-serif;font-size:0.68rem;font-weight:600;padding:0.2rem 0.6rem;border-radius:100px;background:${s.bg};color:${s.color};border:1px solid ${s.border}">${s.label}</span>`;
  }
};
