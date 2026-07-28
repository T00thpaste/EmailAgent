const emailCache = {
    emails: [],
    emailMap: new Map(),
    latestHistoryId: null,
    initialized: false,

    getAll() {
        return this.emails;
    },

    replaceAll(emails) {
        this.emails = emails;
        this.emailMap.clear();

        for (const email of emails) {
            this.emailMap.set(email.id, email);
        }

        this.initialized = true;
    },

    has(id) {
        return this.emailMap.has(id);
    },

    get(id) {
        return this.emailMap.get(id);
    },

    addEmail(email) {
        if (this.has(email.id)) return;

        this.emails.unshift(email);
        this.emailMap.set(email.id, email);
    },

    setLatestHistoryId(id) {
        this.latestHistoryId = id;
    },

    getLatestHistoryId() {
        return this.latestHistoryId;
    },

    isInitialized() {
        return this.initialized;
    }
};

export default emailCache;