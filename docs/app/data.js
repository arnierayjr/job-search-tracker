const DB = {
  KEY: 'jobtrace_v1',

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

  // Status config
  STATUS: {
    applied:      { label: 'APPLIED',       color: '#f5a623', bg: 'rgba(245,166,35,0.1)',   border: 'rgba(245,166,35,0.25)' },
    'phone-screen':{ label: 'PHONE SCREEN', color: '#60a5fa', bg: 'rgba(96,165,250,0.1)',   border: 'rgba(96,165,250,0.25)' },
    interview:    { label: 'INTERVIEW',      color: '#60a5fa', bg: 'rgba(96,165,250,0.1)',   border: 'rgba(96,165,250,0.25)' },
    offer:        { label: 'OFFER',          color: '#3ddc84', bg: 'rgba(61,220,132,0.1)',   border: 'rgba(61,220,132,0.25)' },
    rejected:     { label: 'REJECTED',       color: '#ff6b6b', bg: 'rgba(255,107,107,0.1)', border: 'rgba(255,107,107,0.25)' },
    withdrawn:    { label: 'WITHDRAWN',      color: '#7a7f8a', bg: 'rgba(122,127,138,0.1)', border: 'rgba(122,127,138,0.25)' }
  },

  statusBadge(status) {
    const s = this.STATUS[status] || this.STATUS.applied;
    return `<span style="font-family:'DM Mono',monospace;font-size:0.62rem;letter-spacing:0.08em;padding:0.25rem 0.65rem;border-radius:100px;background:${s.bg};color:${s.color};border:1px solid ${s.border}">${s.label}</span>`;
  }
};
