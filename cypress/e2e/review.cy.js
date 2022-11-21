import '../support/commands';

let movies;
let movieId;
let reviews;
describe("Check review content", () => { //最外围的主要测试，
    before(() => {
        cy.request(
            `https://api.themoviedb.org/3/discover/movie?api_key=${Cypress.env("TMDB_KEY")}&language=en-US&include_adult=false&include_video=false&page=1`
        ).its("body")
            .then((response) => {
                movies = response.results;
            });
    });

    describe("test whether able to access review form", () => {
        beforeEach(() => {
            cy.visit("/");
            cy.get("button[aria-label='add to favorites']").eq(2).click();
            cy.get("button").contains("Favorites").click();
        })
        it("static data in Review form is correct", () => {
            cy.checkIcon('RateReviewIcon').eq(0).click();
            cy.get("h2").contains("Write a review");
        })
        it("dynamic data in Review form is correct", () => {
            cy.checkIcon('RateReviewIcon').eq(0).click();
            cy.get("h3").contains(movies[2].title)
        })
    });


    describe("From the home page to a movie's details", () => {
        before(() => {
            cy.request(
                `https://api.themoviedb.org/3/movie/${movies[1].id}/reviews?api_key=${Cypress.env("TMDB_KEY")}`
            ).its("body")
                .then((response) => {
                    reviews = response.results;
                });
        });
        beforeEach(() => {
            cy.visit(`/movies/${movies[1].id}`);
        })
        it("header of review is correct", () => {
            cy.get(".MuiFab-root").contains("Reviews").click();
            cy.get("th").contains("Author")
            cy.get("th").contains("Excerpt")
            cy.get("th").contains("More")
        })

        it(" test the reviews", () => {
            cy.get(".MuiFab-root").contains("Reviews").click();
            cy.get(".full").contains("Full Review").eq(0).click();
            cy.get("p").eq(0).contains(reviews[0].author);
            cy.get("p").eq(1).contains(reviews[0].content.substring(0, 7));
        });
    });
});
