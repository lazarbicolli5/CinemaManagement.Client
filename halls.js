$(document).ready(function () {
    const $hallsList = $("#hallsList");

  
    function getHalls() {
        fetch("http://localhost:5031/api/hall")
            .then(response => response.json())
            .then(halls => {
                renderHalls(halls); 
            })
            .catch(error => {
                console.error("Error:", error);
                alert("An error occurred while fetching halls.");
            });
    }

    function renderHalls(halls) {
        $hallsList.empty(); 
        if (halls.length === 0) {
            $hallsList.html('<li class="list-group-item text-muted">No halls available.</li>');
            return;
        }

        halls.forEach((hall) => {
            const $hallItem = $("<li>")
                .addClass("list-group-item d-flex justify-content-between align-items-center")
                .html(`
                    <span><strong>${hall.name}</strong> - ${hall.seatCount} seats</span>
                    <button class="btn btn-danger btn-sm delete-hall" data-id="${hall.id}">Delete</button>
                `);
            $hallsList.append($hallItem);
        });
    }


    $("#hallForm").on("submit", function (e) {
        e.preventDefault();

        const hallName = $("#hallName").val();
        const seats = $("#seats").val();

        fetch("http://localhost:5031/api/hall", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: hallName, seatCount: seats })
        })
        .then(response => response.json())
        .then(() => {
            alert("Hall added successfully!");
            getHalls(); 
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred while adding the hall.");
        });
    });

    
    $hallsList.on("click", ".delete-hall", function () {
        const hallId = $(this).data("id");

        if (confirm("Are you sure you want to delete this hall?")) {
            fetch(`http://localhost:5031/api/hall/${hallId}`, {
                method: "DELETE"
            })
            .then(() => {
                alert("Hall deleted successfully!");
                getHalls();
            })
            .catch(error => {
                console.error("Error:", error);
                alert("An error occurred while deleting the hall.");
            });
        }
    });


    getHalls();
});


   