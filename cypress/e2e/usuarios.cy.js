import { createNewEmail, createNewName } from '../support/utils';

let email, nome, userID;

describe('Cadastro Simples de Usuário', () => {
  it('Cadastrar Usuário', () => {
    email = createNewEmail();
    nome = createNewName();

    cy.request({
      method: 'POST',
      url: '/usuarios',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: {
        nome: nome,
        email: email,
        password: 'password123',
        administrador: 'true'
      }
    }).should((response) => {
      userID = response.body._id;
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('message', 'Cadastro realizado com sucesso!!!!!!');
    })
  })

  // Buscar usuário e verificar se ele está cadastrado
  it('Buscar usuário por ID', () => {
    cy.request({
      method: 'GET',
      url: `/usuarios/${userID}`,
      headers: {
        'Accept': 'application/json'
      }
    }).should((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('nome', nome);
      expect(response.body).to.have.property('email', email);
      expect(response.body).to.have.property('administrador');
      expect(response.body).to.have.property('_id');
    })
  })

  // Atualizar o usuário
  it('Atualizar Usuário por ID', () => {
    cy.request({
      method: 'PUT',
      url: `/usuarios/${userID}`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: {
        nome: nome,
        email: email,
        password: 'novaSenha',
        administrador: 'false'
      }
    }).should((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('message', 'Registro alterado com sucesso');
    })
  })

  // Buscar usuário e verificar se ele foi atualizado
  it('Buscar usuário por ID', () => {
    cy.log(userID);
    cy.request({
      method: 'GET',
      url: `/usuarios/${userID}`,
      headers: {
        'Accept': 'application/json'
      }
    }).should((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('nome', nome);
      expect(response.body).to.have.property('email', email);
      expect(response.body).to.have.property('password', 'novaSenha');
      expect(response.body).to.have.property('administrador');
      expect(response.body).to.have.property('_id');
    })
  })

  // Excluir Usuário
  it('Excluir Usuário por ID', () => {
    cy.request({
      method: 'DELETE',
      url: `/usuarios/${userID}`,
      headers: {
        'Accept': 'application/json'
      }
    }).should((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('message', 'Registro excluído com sucesso');
    })
  })

  // Buscar usuário e verificar que ele não está mais cadastrado
  it('Buscar usuário por ID e verificar que ele foi excluido', () => {
    cy.request({
      method: 'GET',
      url: `/usuarios/${userID}`,
      headers: {
        'Accept': 'application/json'
      },
      failOnStatusCode: false
    }).should((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('message', 'Usuário não encontrado');
    })
  })
})
