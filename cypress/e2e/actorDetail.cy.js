import '../support/commands';

let popular;
let actorDetails;
let externalID;
let actorCredits;
describe("Check actor details page", () => {
    before(() => {
        cy.requestPopular(1).its("body").then((response) => { popular = response.results });
    })

    before(() => {
        cy.request(
            `https://api.themoviedb.org/3/person/${popular[5].id}?api_key=${Cypress.env("TMDB_KEY")}&language=en-US`
        ).its("body")
            .then((response) => {
                actorDetails = response;
            });

        cy.request(
            `https://api.themoviedb.org/3/person/${popular[5].id}/external_ids?api_key=${Cypress.env("TMDB_KEY")}&language=en-US`
        ).its("body")
            .then((response) => {
                externalID = response;
            });

        cy.request(
            `https://api.themoviedb.org/3/person/${popular[5].id}/movie_credits?api_key=${Cypress.env("TMDB_KEY")}&language=en-US`
        ).its("body")
            .then((response) => {
                actorCredits = response.cast;
            });
    });

    describe("able to navigate to actor detail page", () => {
        beforeEach(() => {
            cy.visit(`/people/popular`);
        })
        it("navigate to correct actor detail page", () => {
            cy.get("h2").eq(5).click();
            cy.checkUrl(`/actors/${popular[5].id}`);
        })
    });

    describe("basic data in actor detail page is correct", () => {
        beforeEach(() => {
            cy.visit(`/actors/${popular[5].id}`);
        })
        it("test the basic info of actor", () => {
            cy.get(".MuiTypography-body1").contains(actorDetails.birthday);
            cy.get(".MuiTypography-body1").contains(actorDetails.known_for_department);
            cy.get(".MuiTypography-body1").contains(actorDetails.place_of_birth);
        })
        it("test the movies actor take part in ", () => {
            cy.get("h5").contains(actorCredits[0].title);
        })
    });

    describe("buttons to external link are correct", () => {
        beforeEach(() => {
            cy.visit(`/actors/${popular[5].id}`);
        })
        it("buttons exist and with correct icons ", () => {
            if (externalID.facebook_id) {
                cy.checkIcon('FacebookIcon')
            }
            if (externalID.twitter_id) {
                cy.checkIcon('TwitterIcon')
            }
            if (externalID.instagram_id) {
                cy.checkIcon('InstagramIcon')
            }
        })
    });

    describe("jump to movie detail is correct", () => {
        beforeEach(() => {
            cy.visit(`/actors/${popular[5].id}`);
        })
        it("test navigate to the actor's detail information ", () => {
            cy.get("h5").contains(actorCredits[0].title).eq(0).click();
            cy.checkUrl(`/movies/${actorCredits[0].id}`);
        })
    });
});


