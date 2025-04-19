$(document).ready(function () {
    const $movieForm = $("#movieForm");
    const $titleInput = $("#title");
    const $durationInput = $("#duration");
    const $genreInput = $("#genre");
    const $moviesList = $("#moviesList");

    function getMovies() {
        return fetch("http://localhost:5031/api/movie")
            .then(response => response.json())
            .catch(error => {
                console.error("Error fetching movies:", error);
            });
    }

    function renderMovies(movies) {
        $moviesList.empty();
        if (movies.length === 0) {
            $moviesList.html('<li class="list-group-item text-muted">No movies available.</li>');
            return;
        }
        movies.forEach((movie) => {
            const $movieItem = $("<li>")
                .addClass("list-group-item d-flex justify-content-between align-items-center")
                .html(`
                    <span><strong>${movie.title}</strong> (${movie.genre}, ${movie.duration} min)</span>
                `);
            $moviesList.append($movieItem);
        });
    }

    $movieForm.on("submit", function (e) {
        e.preventDefault();
        const movieData = {
            title: $titleInput.val(),
            duration: parseInt($durationInput.val(), 10),
            genre: $genreInput.val()
        };

        fetch("http://localhost:5031/api/movie", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(movieData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to add movie");
            }
            return response.json();
        })
        .then(data => {
            alert("Movie added successfully!");
            $movieForm[0].reset();
            getMovies().then(renderMovies);
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred while adding the movie.");
        });
    });

    getMovies().then(renderMovies);
});
