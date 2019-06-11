/// <reference types="Cypress" />

import settings from '../settings.json'

const URL = process.env.NODE_ENV !== 'production' ? settings.devURL : settings.URL

describe('Login', () => {
  beforeEach(() => {
    cy.viewport(settings.viewportWidth, settings.viewportHeight)
  })

  describe('Login as ADMINISTRATOR', () => {
    it('Visit Website', () => {
      cy.visit(URL)
      cy.wait(settings.wait)
    })

    it('Open login form', () => {
      cy.get('li[name="SIGNIN_BUTTON_OPEN_MODAL"]').should('be.visible').click({ force: true })
    })

    it('Start login', () => {
      cy.get('input[name="SIGNIN_USERNAME_INPUT"]').should('be.visible').type(settings.admin)
      cy.get('input[name="SIGNIN_PASSWORD_INPUT"]').should('be.visible').type(settings.adminPassword)
      cy.get('button[name="SIGNIN_BUTTON"]').should('be.visible').click({ force: true })
      cy.wait(settings.wait)
    })

    it('Validate login response', () => {
      cy.get('span[name="SIGNIN_USERINFO"]').should('be.visible')
      cy.get('span[name="SIGNIN_USERINFO"]').should('have.text',settings.adminDisplayName)
      cy.wait(settings.wait)
    })
  })

  describe('Login as HOST', () => {
    it('Visit Website', () => {
      cy.visit(URL)
      cy.wait(settings.wait)
    })

    it('Open login form', () => {
      cy.get('li[name="SIGNIN_BUTTON_OPEN_MODAL"]').should('be.visible').click({ force: true })
    })

    it('Start login', () => {
      cy.get('input[name="SIGNIN_USERNAME_INPUT"]').should('be.visible').type(settings.host)
      cy.get('input[name="SIGNIN_PASSWORD_INPUT"]').should('be.visible').type(settings.hostPassword)
      cy.get('button[name="SIGNIN_BUTTON"]').should('be.visible').click({ force: true })
      cy.wait(settings.wait)
    })

    it('Validate login response', () => {
      cy.get('span[name="SIGNIN_USERINFO"]').should('be.visible')
      cy.get('span[name="SIGNIN_USERINFO"]').should('have.text',settings.hostDisplayName)
      cy.wait(settings.wait)
    })
  })

  describe('Login as NORMAL USER', () => {
    it('Visit Website', () => {
      cy.visit(URL)
      cy.wait(settings.wait)
    })

    it('Open login form', () => {
      cy.get('li[name="SIGNIN_BUTTON_OPEN_MODAL"]').should('be.visible').click({ force: true })
    })

    it('Start login', () => {
      cy.get('input[name="SIGNIN_USERNAME_INPUT"]').should('be.visible').type(settings.user)
      cy.get('input[name="SIGNIN_PASSWORD_INPUT"]').should('be.visible').type(settings.userPassword)
      cy.get('button[name="SIGNIN_BUTTON"]').should('be.visible').click({ force: true })
      cy.wait(settings.wait)
    })

    it('Validate login response', () => {
      cy.get('span[name="SIGNIN_USERINFO"]').should('be.visible')
      cy.get('span[name="SIGNIN_USERINFO"]').should('have.text',settings.userDisplayName)
      cy.wait(settings.wait)
    })
  })
})