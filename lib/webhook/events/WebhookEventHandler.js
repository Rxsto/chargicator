const fs = require('fs');

class WebhookEventHandler {

  constructor(client) {
    this.client = client;
    this.events = new Map();
  }

  initialize(directory) {
    fs.readdirSync(directory).forEach(file => {
      const event = require(directory + file);
      const instance = new event(this.client);
      console.info(`Initializing event ${instance.name} ...`);
      this.events.set(instance.name, instance);
    });
  }

  handle(req) {
    const event = this.events.get(req.body.event_type);
    if (typeof event !== 'undefined') {
      console.info('Handling incoming request ...');
      event.run(req.body);
    }
  }
}

module.exports = WebhookEventHandler;
