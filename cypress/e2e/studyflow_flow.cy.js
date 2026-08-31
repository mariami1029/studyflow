describe('StudyFlow Main Functionality E2E Flow', () => {
  const user = {
    fullName: 'John Doe',
    email: `user_${Date.now()}@studyflow.com`,
    password: 'Password123!',
  };

  it('მთლიანი ფუნქციონალური ნაკადის ტესტირება', () => {
    // 1. რეგისტრაცია
    cy.intercept('POST', '**/api/auth/register*').as('registerReq');
    cy.intercept('POST', '**/api/auth/login*').as('loginReq');

    cy.visit('https://studyflow.ge/register');
    cy.get('input[placeholder*="Full Name"], input[name="fullName"]').type(user.fullName);
    cy.get('input[type="email"]').type(user.email);
    cy.get('input[type="password"]').first().type(user.password);
    cy.get('input[type="password"]').last().type(user.password);
    
    cy.get('button[type="submit"]').click();
    cy.wait('@registerReq', { timeout: 60000 }).its('response.statusCode').should('be.oneOf', [200, 201]);

    // 2. დალოგინება
    cy.visit('https://studyflow.ge/login');
    cy.get('input[type="email"]').type(user.email);
    cy.get('input[type="password"]').type(user.password);
    cy.get('button[type="submit"]').click();
    cy.wait('@loginReq', { timeout: 60000 }).its('response.statusCode').should('eq', 200);

    // 3. ავტორიზაციის დადასტურება
    cy.url({ timeout: 15000 }).should('include', '/dashboard');

    // 4. საგნის დამატება
    cy.get('a, button').contains('საგნები').click();
    cy.get('button').contains('დამატება').click();
    cy.get('form input, div[role="dialog"] input, .modal input').eq(0).type('ALG-200');
    cy.get('form input, div[role="dialog"] input, .modal input').eq(1).type('Algoritms');
    cy.get('form input, div[role="dialog"] input, .modal input').eq(2).type('Zazuna Zuzu');
    cy.get('button[type="submit"], form button').contains(/შენახვა|Save|დამატება/i).click();
    cy.contains('Algoritms').should('be.visible');

    // 5. დავალების დამატება
    cy.get('a, button').contains('დავალებები').click();
    cy.get('button').contains('დამატება').click();
    cy.get('form input, div[role="dialog"] input').eq(0).type('1st assignment');
    cy.get('form input, div[role="dialog"] input').eq(1).type('Algoritms');
    cy.get('input[type="date"]').type('2026-08-11');
    cy.get('button[type="submit"], form button').contains(/შენახვა|Save/i).click();
    cy.contains('1st assignment').should('be.visible');

    // 6. დავალებაზე სტატუსის შეცვლა Completed-ზე და ქულის დამატება
    cy.contains('1st assignment')
      .parents('tr, div')
      .find('select')
      .then(($select) => {
        if ($select.length > 0) {
          cy.wrap($select).select('Completed');
        }
      });

    cy.contains('1st assignment')
      .parents('tr, div')
      .find('input[type="number"]')
      .clear()
      .type('97{enter}');

    // 7. ცხრილის (Schedule) დამატება
    cy.get('a, button').contains('ცხრილი').click();
    cy.get('button').contains('დამატება').click();
    
    cy.get('body').then(($body) => {
      if ($body.find('select').length > 0) {
        cy.get('select').first().select(1);
      }
    });

    cy.get('form input, div[role="dialog"] input').eq(0).type('Algoritms', { force: true });
    cy.get('input[type="time"]').eq(0).type('09:00');
    cy.get('input[type="time"]').eq(1).type('10:30');
    cy.get('button[type="submit"], form button').contains(/შენახვა|Save|დამატება/i).click();
    cy.contains('Algoritms').should('be.visible');

    // 8. გამოცდის (Exam) დამატება
    cy.get('a, button').contains('გამოცდები').click();
    cy.get('button').contains('დამატება').click();
    cy.get('form input, div[role="dialog"] input').first().type('Midterm Exam', { force: true });
    
    cy.get('body').then(($body) => {
      if ($body.find('input[type="date"]').length > 0) {
        cy.get('input[type="date"]').type('2026-09-01');
      }
    });

    cy.get('button[type="submit"], form button, div[role="dialog"] button').contains(/შენახვა|Save|დამატება/i).click({ force: true });
    cy.contains('Midterm Exam', { timeout: 8000 }).should('be.visible');

    // 9. საგნის წაშლა
    cy.get('a, button').contains('საგნები').click();
    cy.contains('Algoritms')
      .parents('.subject-card, tr, div')
      .find('button')
      .first()
      .click({ force: true });

    // 10. დავალების წაშლა
    cy.get('a, button').contains('დავალებები').click();
    cy.contains('1st assignment')
      .parents('tr, div')
      .find('button')
      .first()
      .click({ force: true });

    // 11. ცხრილის წაშლა
    cy.get('a, button').contains('ცხრილი').click();
    cy.contains('Algoritms')
      .parents('.class-card, tr, div')
      .find('button')
      .first()
      .click({ force: true });

    // 12. გამოცდის წაშლა
    cy.get('a, button').contains('გამოცდები').click();
    cy.contains('Midterm Exam')
      .parents('tr, div')
      .find('button')
      .first()
      .click({ force: true });

    // 13. AI ასისტენტი
    cy.get('a, button').contains('AI').click();
    cy.get('textarea, input[placeholder*="AI"]').type('როგორ მოვემზადო გამოცდისთვის?');
    cy.get('button[type="submit"]').click();
    cy.contains('როგორ მოვემზადო გამოცდისთვის?').should('be.visible');

    // 14. დალოგაუთება (ზუსტი single element-ის არჩევით)
    cy.on('window:confirm', () => true);
    cy.contains(user.email)
      .closest('div')
      .parent()
      .find('button')
      .last()
      .click({ force: true });

    cy.url({ timeout: 10000 }).should('include', '/login');
  });
});