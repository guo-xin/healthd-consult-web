let _config; //eslint-disable-line no-underscore-dangle

export default {
    setConfig(config = {}) {
        _config = config;
    },

    getConfig() {
        return _config || {};
    }
};
