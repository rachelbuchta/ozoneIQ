describe('OzoneIQ Landing Page', () => {
  before(() => {
    cy.visit('http://localhost:3000')
  })

  it ('Should be able to visit the landing page with logo, an option to select current location or choose a location', () => {
      cy
        .get('.logoWrapper').find('img').should('have.attr','src').should('include', '/static/media/logo4.1ade1652.png')
        .get('form').find('.currentLocal').should('be.visible')
        .get('form').find('.chooseLocal').should('be.visible')
      cy.url().should('include', '/')
  })
})

describe('OzoneIQ Dashboard Page - Current Location', () => {
  before(() => {
    cy.visit('http://localhost:3000')
      cy.fixture('aqiData.json')
        .then((data) => {
        cy.intercept('GET','http://api.airvisual.com/v2/nearest_city?key=26e9573a-6960-4337-b548-ec068499ad9f', {
          statusCode: 201,
          body: data.currentLocation
        })
    })
})

  it('Should be able to click Current Location and navigate to dashboard with air quality information pertaining to that location', () => {
    cy
      .get('.currentLocal').click()
      .get('.main-dashboard').should('be.visible')
    cy.url().should('include', 'dashboard')
  })

  it('Should display the current city and temperature', () => {
    cy
      .get('.location-name-temp-container').find('.location-name').should('contain', 'Centennial, Colorado')
      .get('.temp-container').find('.temperature').should('contain', '30 F')
  })

  it('Should display the current AQI', () => {
    cy
      .get('.aqi-container').find('.aqi-level').should('contain', 'GOOD')
      .get('.aqi-container').find('.aqi-number').should('contain', '27')
      .get('.aqi-container').find('.aqi-description').should('contain', 'satisfactory')
  })

  it('Should display the current main pollutant, humidity, pressure, and wind speed', () => {
    cy
      .get('.additional-info-container').get('.additional-info').find('.pollutant-icon').should('have.attr', 'alt', 'Outline of smoke stack')
      .get('.additional-info-container').get('.additional-info').find('.pollutant').should('contain', 'o3')
    
    cy
      .get('.additional-info-container').get('.additional-info').find('.humidity-icon').should('have.attr', 'alt', 'Outline of rain drop')
      .get('.additional-info-container').get('.additional-info').find('.humidity').should('contain', 69)
    
    cy
      .get('.additional-info-container').get('.additional-info').find('.pressure-icon').should('have.attr', 'alt', 'Outline of a pressure guage')
      .get('.additional-info-container').get('.additional-info').find('.pressure').should('contain', '1020')
   
    cy
      .get('.additional-info-container').get('.additional-info').find('.wind-icon').should('have.attr', 'alt', 'Outline of wind blowing')
      .get('.additional-info-container').get('.additional-info').find('.wind').should('contain', '7 mph N')
  })

  it('Should have a footer with four possible icons to click', () => {
    cy
      .get('footer')
      .find('.Nav-btn').should('have.length', 4)
      .get('footer')
  })
  
  it('Should be able to click the saved locations icon and be taken to the saved locations page', () => {
    cy
      .get('footer')
      .find('.saved-local-nav-btn').click()
    cy.url().should('include', 'saved-locations')
  })
  //come back and test the saved locations page, information and mroe pages
  it('Should be able to click the question mark icon and be taken to the AQI information page', () => {
    cy
      .get('footer')
      .find('.aqi-nav-btn').click()
    cy.url().should('include', 'resources')
  })

  it('Should be able to click the \'more\' icon and be taken to the about/contact page', () => {
    cy
      .get('footer')
      .find('.more-nav-btn').click()
    cy.url().should('include', 'about-us')
  })
})

describe('OzoneIQ Dashboard Page - Chosen Location', () => {
  before(() => {
    cy.visit('http://localhost:3000')
      cy.fixture('aqiData.json')
        .then((data) => {
          cy.intercept('GET','http://api.airvisual.com/v2/city?city=lafayette&state=louisiana&country=usa&key=26e9573a-6960-4337-b548-ec068499ad9f', {
            statusCode: 201,
            body: data.chosenLocation
          })
      })
})

  it('Should be able to input a Chosen Location and navigate to dashboard with air quality information pertaining to that location', () => {
    cy
      .get('form input').type('lafayette, louisiana, usa')
      .get('.chooseLocal .searchButton').click()
      .get('.main-dashboard').should('be.visible')
  })

   it('Should display the current city and temperature', () => {
    cy
      .get('.location-name-temp-container').find('.location-name').should('contain', 'Lafayette, Louisiana')
      .get('.temp-container').find('.temperature').should('contain', '73 F')
  })

   it('Should display the current AQI', () => {
    cy
      .get('.aqi-container').find('.aqi-level').should('contain', 'GOOD')
      .get('.aqi-container').find('.aqi-number').should('contain', '4')
      .get('.aqi-container').find('.aqi-description').should('contain', 'satisfactory')
  })

  it('Should display the current main pollutant, humidity, pressure, and wind speed', () => {
    cy
      .get('.additional-info-container').get('.additional-info').find('.pollutant-icon').should('have.attr', 'alt', 'Outline of smoke stack')
      .get('.additional-info-container').get('.additional-info').find('.pollutant').should('contain', 'p2')
  
    cy
      .get('.additional-info-container').get('.additional-info').find('.humidity-icon').should('have.attr', 'alt', 'Outline of rain drop')
      .get('.additional-info-container').get('.additional-info').find('.humidity').should('contain', 64)

    cy
      .get('.additional-info-container').get('.additional-info').find('.pressure-icon').should('have.attr', 'alt', 'Outline of a pressure guage')
      .get('.additional-info-container').get('.additional-info').find('.pressure').should('contain', '1019')

    cy
      .get('.additional-info-container').get('.additional-info').find('.wind-icon').should('have.attr', 'alt', 'Outline of wind blowing')
      .get('.additional-info-container').get('.additional-info').find('.wind').should('contain', '4 mph S')
  })

  it('Should have a footer with four possible icons to click', () => {
     cy
      .get('footer')
      .find('.Nav-btn').should('have.length', 4)
      .get('footer')
  })
})

describe('OzoneIQ Dashboard Page - Chosen Location - Error Handling 404 status', () => {
  before(() => {
      cy.intercept('GET','http://api.airvisual.com/v2/nearest_city?key=26e9573a-6960-4337-b548-ec068499ad9f', {
        statusCode: 404
      })
      cy.visit('http://localhost:3000')
  })

  it('Should display user friend error handling about how to find a location included in api data', () => {

  })
})

describe('OzoneIQ AQI Info Page', () => {
  before(() => {
    cy.visit('http://localhost:3000')
      cy.fixture('aqiData.json')
        .then((data) => {
          cy.intercept('GET','http://api.airvisual.com/v2/nearest_city?key=26e9573a-6960-4337-b548-ec068499ad9f', {
          statusCode: 201,
          body: data.currentLocation
        })
    })
})
  
  it.skip('Should be able to navigate to the AQI Info page', () => {
    // cy.get('.landing-page-nav').find('.aqi-nav-btn').click()
    //have to come back to this one
  })

  it('Should display the AQI ratings with descriptions of the rating', () => {
    cy
      .get('.currentLocal').click()
      .get('.main-dashboard').should('be.visible')
    cy.get('.aqi-nav-btn').click()
    cy.get('.aqi-section').should('be.visible')
      .get('.color-blocks').find('.aqi-color-blocks').should('have.length', 6)
  })

  it('Should display the details of what each AQI range is and the risk it poses to your health', () => {
    // cy
    //   .get('.currentLocal').click()
    //   .get('.main-dashboard').should('be.visible')
    // cy.get('.aqi-nav-btn').click()
    // cy.get('.aqi-section').should('be.visible')
    cy.get('.color-blocks').find('.green').contains('0 - 50').click().find('p').contains('Air quality is satisfactory, and air pollution poses little or no risk.')
    cy.url().should('include', 'resources')
  })

  it('Should display the details of what AQI is in the info section', () => {
    cy
      .get('.info').find('.aqi-info-text').should('have.length', 3)
    cy.url().should('include', 'resources')
  })

  it('Should be able to click more and navigate to another information section that includes how to stay safe and ways to limit your carbon footprint', () => {
    cy.get('.more-btn').click().get('.resources-section').get('h2').contains('How can I stay safe?')
      .get('h2').contains('How can I limit my carbon footprint?')
      .get('.text-area').children('li')
    cy.url().should('include', 'resources2')

  })

  it('Should be able to click back and navigate to first page of resources', () => {
    cy
      .get('.back-btn').click()
    cy.url().should('include', 'resources')
  })
})

describe('OzoneIQ About Us Page', () => {
  before(() => {
    cy.visit('http://localhost:3000')
      cy.fixture('aqiData.json')
        .then((data) => {
          cy.intercept('GET','http://api.airvisual.com/v2/nearest_city?key=26e9573a-6960-4337-b548-ec068499ad9f', {
           statusCode: 201,
           body: data.currentLocation
        })
    })
})

  it('Should display the AQI ratings with descriptions of the rating', () => {
    cy
      .get('.currentLocal').click()
      .get('.main-dashboard').should('be.visible')
    cy.get('.more-nav-btn').click()
      .get('.about-section').children('.contact-article', '.about-app')
    cy.url().should('include', 'about-us')
  
})

  it('Should have all of our pictures and links to our personal github pages', () => {
    cy
      .get('.contact-article').find('.contact-info').should('have.length', 3).children('.prof-pic', '.github-link')
    cy.url().should('include', 'about-us')
  })

  it('Should display a section about the inspiration of the app', () => {
    cy
      .get('.about-app')
    cy.url().should('include', 'about-us')
  })

})

describe('OzoneIQ Favorites Locations Page', () => {
  before(() => {
    cy.visit('http://localhost:3000')
      cy.fixture('aqiData.json')
        .then((data) => {
          cy.intercept('GET','http://api.airvisual.com/v2/nearest_city?key=26e9573a-6960-4337-b548-ec068499ad9f', {
           statusCode: 201,
           body: data.currentLocation
        })
    })
})

  it('Should be able to click saved locations icon on footer and navigate to favorited locations page', () => {
    cy
      .get('.currentLocal').click()
      .get('.main-dashboard').should('be.visible')
    cy.get('.saved-local-nav-btn').click()
    cy.url().should('include', 'saved-locations')
  })
})
  