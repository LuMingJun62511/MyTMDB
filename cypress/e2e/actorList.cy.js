let actors;
let movies;
describe("Check actor list", () => { //最外围的主要测试，
    before(() => {
        cy.request(
            `https://api.themoviedb.org/3/discover/movie?api_key=${Cypress.env("TMDB_KEY")}&language=en-US&include_adult=false&include_video=false&page=1`
        ).its("body")
            .then((response) => {
                movies = response.results;
            });
    });
    before(() => {
        cy.request(
            `https://api.themoviedb.org/3/movie/${movies[4].id}/credits?api_key=${Cypress.env("TMDB_KEY")}&language=en-US`
        ).its("body")
            .then((response) => {
                actors = response.cast;
            });
    });

    beforeEach(() => {
        cy.visit(`/movies/${movies[4].id}`);
    })

    describe("dynamic data in actor list is correct", () => {
        it("test the length of actor list", () => {
            cy.get(".MuiBox-root").should("have.length", actors.length + 1);
        })
        it("test navigate to the actor's detail information ", () => {
            cy.get(".MuiCardContent-root").eq(0).click();
            cy.url().should("include", `/actors/${actors[0].id}`)
        })

        it("test the name and character of certain actor", () => {
            cy.get(".MuiCardContent-root").eq(0).contains(actors[0].name);
            cy.get(".MuiCardContent-root").eq(0).contains(actors[0].character);
        })
    });

    describe("static data in actor list is correct", () => {
        it("test the title and character of certain actor", () => {
            cy.get("h3").contains("Main Characters");
        })
    });
});


