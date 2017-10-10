/* eslint-env jest */
'use strict'

const path = require('path')
const { createServiceRegistry } = require('../index')

describe('service-registry', () => {
  test('initializes with empty services', () => {
    const registry = createServiceRegistry()
    expect(registry.services).toEqual({})
  })

  test('setService adds a new service', () => {
    const registry = createServiceRegistry()
    registry.setService('age', 16)
    expect(registry.services.age).toEqual(16)
  })

  test('removeService removes a service', () => {
    const registry = createServiceRegistry()
    registry.setService('age', 16)
    registry.removeService('age')
    expect(registry.services).toEqual({})
  })

  test('registerModuleServices registers module', () => {
    const registry = createServiceRegistry()
    registry.registerModuleServices(
      path.join(__dirname, '..', '__mocks__', 'twelve')
    )
    expect(registry.services.age).toEqual(12)
  })

  test('registerModuleServices fails if module cannot be found', () => {
    const logger = {
      warn: jest.fn(),
      info: jest.fn()
    }
    const registry = createServiceRegistry({ logger })
    registry.registerModuleServices('some-module-that-does-not-exist')
    expect(registry.services).toEqual({})
    expect(logger.warn).toHaveBeenCalled()
    expect(logger.info).not.toHaveBeenCalled()
  })

  test('registerModuleServices fails if module cannot be found and provides additional debug info', () => {
    const logger = {
      warn: jest.fn(),
      info: jest.fn()
    }
    const registry = createServiceRegistry({ logger, debug: true })
    registry.registerModuleServices('some-module-that-does-not-exist')
    expect(registry.services).toEqual({})
    expect(logger.warn).toHaveBeenCalled()
    expect(logger.info).toHaveBeenCalled()
  })

  test('serviceRegistry is chainable', () => {
    const registry = createServiceRegistry()
      .setService('age', 16)
      .setService('height', `6'4"`)
      .removeService('age')
      .registerModuleServices(path.join(__dirname, '..', '__mocks__', 'twelve'))
    expect(registry.services).toEqual({
      age: 12,
      height: `6'4"`
    })
  })
})
