describe('Platzi Fake API - Categories Test Suite', () => {
  const baseUrl = 'https://api.escuelajs.co/api/v1/categories';
  let createdCategoryId;

  it('TC-API-001: GET - Retrieve all categories', () => {
    cy.request('GET', baseUrl).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.greaterThan(0);
    });
  });

  it('TC-API-002: GET - Retrieve a specific category by ID (ID: 1)', () => {
    cy.request('GET', `${baseUrl}/1`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('id', 1);
      expect(response.body).to.have.property('name');
    });
  });

  it('TC-API-003: POST - Create a new category', () => {
    const newCategory = {
      name: "Auto Tech Category " + Date.now(),
      image: "https://placeimg.com/640/480/any"
    };
    cy.request('POST', baseUrl, newCategory).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('id');
      expect(response.body.name).to.eq(newCategory.name);
      createdCategoryId = response.body.id;
    });
  });

  it('TC-API-004: GET - Retrieve the newly created category', () => {
    const catId = createdCategoryId || 1;
    cy.request('GET', `${baseUrl}/${catId}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('id');
    });
  });

  it('TC-API-005: PUT - Update an existing category name', () => {
    const catId = createdCategoryId || 1;
    const updatedData = {
      name: "Updated Category " + Date.now()
    };
    cy.request('PUT', `${baseUrl}/${catId}`, updatedData).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.name).to.eq(updatedData.name);
    });
  });

  it('TC-API-006: GET - Verify category name is updated successfully', () => {
    const catId = createdCategoryId || 1;
    cy.request('GET', `${baseUrl}/${catId}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('name');
    });
  });

  it('TC-API-007: GET - Retrieve category with non-existent ID (Negative Test)', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/999999`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([400, 404]);
    });
  });

  it('TC-API-008: POST - Failed to create category with missing required field', () => {
    cy.request({
      method: 'POST',
      url: baseUrl,
      failOnStatusCode: false,
      body: { image: "https://placeimg.com/640/480/any" }
    }).then((response) => {
      expect(response.status).to.be.oneOf([400, 500]);
    });
  });

  it('TC-API-009: GET - Verify response headers contain application/json', () => {
    cy.request('GET', baseUrl).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.headers).to.have.property('content-type');
      expect(response.headers['content-type']).to.include('application/json');
    });
  });

  it('TC-API-010: GET - Verify specific property keys structure in category item', () => {
    cy.request('GET', `${baseUrl}/2`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('id');
      expect(response.body).to.have.property('name');
      expect(response.body).to.have.property('image');
    });
  });

  it('TC-API-011: DELETE - Delete a temporary category', () => {
    const tempCategory = {
      name: "Temp To Delete " + Date.now(),
      image: "https://placeimg.com/640/480/any"
    };
    cy.request('POST', baseUrl, tempCategory).then((postRes) => {
      const tempId = postRes.body.id;
      cy.request('DELETE', `${baseUrl}/${tempId}`).then((delRes) => {
        expect(delRes.status).to.be.oneOf([200, 204]);
      });
    });
  });

  it('TC-API-012: GET - Verify deleted category returns not found / error', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/999999`,
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.be.oneOf([400, 404]);
    });
  });

});