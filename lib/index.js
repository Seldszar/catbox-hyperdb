const hyperdb = require("hyperdb");

class Adapter {
  /**
   * Create a new adapter.
   *
   * @param {Object} options The adapter options.
   * @param {String} [options.path] The path to the database directory.
   * @param {Object} [options.client] An existing HyperDB instance.
   * @param {String} [options.partition] The partition name used to isolate the cached results across multiple clients.
   */
  constructor(options) {
    this.options = options;
    this.client = null;
  }

  async start() {
    if (this.options.client) {
      this.client = this.options.client;
    }

    if (this.client) {
      return Promise.resolve();
    }

    return new Promise(resolve => {
      this.client = hyperdb(this.options.path, {
        valueEncoding: "json",
      });

      this.client.once("ready", () => {
        resolve();
      });
    });
  }

  async stop() {
    return Promise.resolve();
  }

  isReady() {
    return this.client && this.client.opened;
  }

  validateSegmentName(segment) {
    if (!name) {
      return new Error("Empty string.");
    }

    if (name.indexOf("\0") !== -1) {
      return new Error("Includes null character.");
    }

    return null;
  }

  generateKey(key) {
    const parts = [];

    if (this.options.partition) {
      parts.push(encodeURIComponent(this.options.partition));
    }

    parts.push(encodeURIComponent(key.segment));
    parts.push(encodeURIComponent(key.id));

    return parts.join(":");
  }

  async get(key) {
    if (!this.client) {
      throw Error("Adapter not started.");
    }

    return new Promise((resolve, reject) => {
      this.client.get(this.generateKey(key), (error, nodes) => {
        if (error) {
          return reject(error);
        }

        if (nodes.length === 0) {
          return resolve(null);
        }

        return resolve(nodes[0].value);
      });
    });
  }

  async set(key, value, ttl) {
    if (!this.client) {
      throw Error("Adapter not started.");
    }

    return new Promise((resolve, reject) => {
      const envelope = {
        stored: Date.now(),
        item: value,
        ttl,
      };

      this.client.put(this.generateKey(key), envelope, error => {
        if (error) {
          return reject(error);
        }

        return resolve();
      });
    });
  }

  async drop(key) {
    if (!this.client) {
      throw Error("Adapter not started.");
    }

    return new Promise((resolve, reject) => {
      this.client.del(this.generateKey(key), error => {
        if (error) {
          return reject(error);
        }

        return resolve();
      });
    });
  }
}

module.exports = Adapter;
