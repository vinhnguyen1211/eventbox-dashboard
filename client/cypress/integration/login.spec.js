/// <reference types="Cypress" />

import settings from '../settings.json'

describe('Login', () => {
  beforeEach(() => {
    cy.viewport(settings.viewportWidth, settings.viewportHeight)
  })

  describe('Login as ADMINISTRATOR', () => {
    it('Visit Website', () => {
      cy.visit('http://localhost:3000')
      cy.wait(settings.wait)

      // Login
      cy.get('li[name="SIGNIN_BUTTON_OPEN_MODAL"]').should('be.visible').click({ force: true })
      cy.get('input[name="SIGNIN_USERNAME_INPUT"]').should('be.visible').type(settings.admin)
      cy.get('input[name="SIGNIN_PASSWORD_INPUT"]').should('be.visible').type(settings.adminPassword)
      cy.get('button[name="SIGNIN_BUTTON"]').should('be.visible').click({ force: true })
      cy.wait(settings.wait)

      cy.get('span[name="SIGNIN_USERINFO"]').should('be.visible')
      cy.get('span[name="SIGNIN_USERINFO"]').should('have.text',settings.adminDisplayName)
      cy.wait(settings.wait)
    })
  })

  describe('Login as HOST', () => {
    it('Visit Website', () => {
      cy.visit('http://localhost:3000')
      cy.wait(settings.wait)

      // Login
      cy.get('li[name="SIGNIN_BUTTON_OPEN_MODAL"]').should('be.visible').click({ force: true })
      cy.get('input[name="SIGNIN_USERNAME_INPUT"]').should('be.visible').type(settings.host)
      cy.get('input[name="SIGNIN_PASSWORD_INPUT"]').should('be.visible').type(settings.hostPassword)
      cy.get('button[name="SIGNIN_BUTTON"]').should('be.visible').click({ force: true })
      cy.wait(settings.wait)

      cy.get('span[name="SIGNIN_USERINFO"]').should('be.visible')
      cy.get('span[name="SIGNIN_USERINFO"]').should('have.text',settings.hostDisplayName)
      cy.wait(settings.wait)
    })
  })

  describe('Login as NORMAL USER', () => {
    it('Visit Website', () => {
      cy.visit('http://localhost:3000')
      cy.wait(settings.wait)

      // Login
      cy.get('li[name="SIGNIN_BUTTON_OPEN_MODAL"]').should('be.visible').click({ force: true })
      cy.get('input[name="SIGNIN_USERNAME_INPUT"]').should('be.visible').type(settings.user)
      cy.get('input[name="SIGNIN_PASSWORD_INPUT"]').should('be.visible').type(settings.userPassword)
      cy.get('button[name="SIGNIN_BUTTON"]').should('be.visible').click({ force: true })
      cy.wait(settings.wait)

      cy.get('span[name="SIGNIN_USERINFO"]').should('be.visible')
      cy.get('span[name="SIGNIN_USERINFO"]').should('have.text',settings.userDisplayName)
      cy.wait(settings.wait)
    })
  })
})