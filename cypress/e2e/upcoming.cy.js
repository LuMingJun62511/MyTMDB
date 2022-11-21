import '../support/commands';
let upcoming;

describe("Check upcoming page ", () => {
    before(() => {
        cy.request(
            `https://api.themoviedb.org/3/movie/upcoming?api_key=${Cypress.env("TMDB_KEY")}&language=en-US&page=1`
        ).its("body")
            .then((response) => {
                upcoming = response.results;
            });
    });
    it("able to go to upcoming page", () => {
        cy.visit("/");
        cy.get("button").contains("Upcoming").click();
        cy.checkUrl(`/upcoming`);
    })

    beforeEach(() => {
        cy.visit(`/movies/upcoming`);
    })
    describe("The static data of upcoming page is correct", () => {
        it("header of upcoming page is correct", () => {
            cy.get("h3").contains("Upcoming Movies");
            cy.get(".MuiCardHeader-root").should("have.length", 20);
        })

        it("icons of upcoming page are correct", () => {
            cy.checkIcon('FavoriteIcon').should("not.exist");
            cy.checkIcon('PlaylistAddIcon').should("exist");
        })

    });

    describe("The dynamic data of upcoming page is correct", () => {
        it("title of upcoming page is correct", () => {
            cy.get(".MuiCardHeader-content")
            .eq(1)
            .find("p")
            .contains(upcoming[1].title);
        })

        it("buttons of upcoming page are correct", () => {
            cy.get(".MuiSvgIcon-root[data-testid = 'PlaylistAddIcon']")
            cy.get(".MuiButtonBase-root[aria-label='add to playlist']").eq(0).click()
        })
    });
});
