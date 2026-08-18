import emailCache from "../cache/emailCache.js";

const emailRepository = {
    getAll() {
        return emailCache.getAll();
    },

    replaceAll(emails) {
        return emailCache.replaceAll(emails);
    },

    addEmail(email) {
        emailCache.addEmail(email);
    },

    getLatestHistoryId() {
        return emailCache.getLatestHistoryId();
    },

    setLatestHistoryId(id) {
        emailCache.setLatestHistoryId(id);
    },

    isInitialized() {
        return emailCache.isInitialized();
    }
};

export default emailRepository;