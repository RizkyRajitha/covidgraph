describe("Cypress", () => {
  it("is working", () => {
    expect(true).to.equal(true);
  });

  it("visits the app", () => {
    cy.visit("http://localhost:3000");
  });


  

});


describe('Request', () => {
    it('displays data from API', () => {
      cy.request('https://lvv3icabfe.execute-api.us-east-1.amazonaws.com/default/helloworld')
        .should((response) => {
          expect(response.status).to.eq(200)
        //   expect(response.body).to.have.length(10)
          expect(response).to.have.property('headers')
          expect(response).to.have.property('duration')
        })
    })
  })



  describe('Links', () => {
    it('displays data from API', () => {
      cy.request('https://lvv3icabfe.execute-api.us-east-1.amazonaws.com/default/helloworld')
        .should((response) => {
          expect(response.status).to.eq(200)
        //   expect(response.body).to.have.length(10)
          expect(response).to.have.property('headers')
          expect(response).to.have.property('duration')
        })
    })
  })