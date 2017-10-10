'use strict'

const R = require('ramda')

class ServiceRegistry {
  constructor (options) {
    this.services = {}
    this.configure(options)
  }

  configure ({ logger = console, debug = false } = {}) {
    this.logger = logger
    this.debug = debug
    return this
  }

  setService (serviceName, service) {
    this.services = R.assoc(serviceName, service, this.services)
    return this
  }

  getService (serviceName) {
    return this.services[serviceName]
  }

  registerModuleServices (modulePath, parentModule) {
    try {
      const { registerServices } = parentModule.require(modulePath)
      registerServices(this)
    } catch (exception) {
      this.logger.warn(
        `service-registry cannot register services from module ${modulePath}: ${exception.message}`
      )
      if (this.debug) {
        this.logger.info(exception.stack)
      }
    }
    return this
  }

  removeService (serviceName) {
    this.services = R.dissoc(serviceName, this.services)
    return this
  }
}

module.exports = exports = new ServiceRegistry()
exports.ServiceRegistry = ServiceRegistry
