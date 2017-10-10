/* eslint-env jest */
'use strict'

const path = require('path')
const { ServiceRegistry } = require('../index')

describe('service-registry', () => {
  test('initializes with empty services', () => {
    const registry = new ServiceRegistry()
    expect(registry.services).toEqual({})
  })

  test('setService adds a new service', () => {
    const registry = new ServiceRegistry()
    registry.setService('age', 16)
    expect(registry.services.age).toEqual(16)
    expect(registry.getService('age')).toEqual(16)
  })

  test('removeService removes a service', () => {
    const registry = new ServiceRegistry()
    registry.setService('age', 16)
    registry.removeService('age')
    expect(registry.services).toEqual({})
  })

  test('registerModuleServices registers module', () => {
    const registry = new ServiceRegistry()
    registry.registerModuleServices(
      path.join(__dirname, '..', '__mocks__', 'twelve'),
      require
    )
    expect(registry.services.age).toEqual(12)
  })

  test('registerModuleServices fails if module cannot be found', () => {
    const logger = {
      warn: jest.fn(),
      info: jest.fn()
    }
    const registry = new ServiceRegistry({ logger })
    registry.registerModuleServices('some-module-that-does-not-exist', require)
    expect(registry.services).toEqual({})
    expect(logger.warn).toHaveBeenCalled()
    expect(logger.info).not.toHaveBeenCalled()
  })

  test('registerModuleServices fails if module cannot be found and provides additional debug info', () => {
    const logger = {
      warn: jest.fn(),
      info: jest.fn()
    }
    const registry = new ServiceRegistry({ logger, debug: true })
    registry.registerModuleServices('some-module-that-does-not-exist', require)
    expect(registry.services).toEqual({})
    expect(logger.warn).toHaveBeenCalled()
    expect(logger.info).toHaveBeenCalled()
  })

  test('serviceRegistry is chainable', () => {
    const registry = new ServiceRegistry()
      .configure({ logger: console })
      .setService('age', 16)
      .setService('height', `6'4"`)
      .removeService('age')
      .registerModuleServices(
        path.join(__dirname, '..', '__mocks__', 'twelve'),
        require
      )
    expect(registry.services).toEqual({
      age: 12,
      height: `6'4"`
    })
  })
})
