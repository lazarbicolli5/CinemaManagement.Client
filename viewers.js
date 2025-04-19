$(document).ready(function () {
    const $viewersList = $("#viewersList");

    function getViewers() {
        fetch("http://localhost:5031/api/viewer")
            .then(response => {
                if (!response.ok) throw new Error("Network response was not ok");
                return response.json();
            })
            .then(renderViewers)
            .catch(error => console.error("Error:", error));
    }

    function renderViewers(viewers) {
        $viewersList.empty();

        if (!viewers.length) {
            $viewersList.html('<li class="list-group-item text-muted">No viewers available.</li>');
            return;
        }

        viewers.forEach(viewer => {
            const $viewerItem = $(`
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <span><strong>${viewer.name}</strong> - ${viewer.email}</span>
                    <button class="btn btn-danger btn-sm delete-viewer" data-id="${viewer.id}">Delete</button>
                </li>
            `);
            $viewersList.append($viewerItem);
        });
    }

   
    $viewersList.on("click", ".delete-viewer", function () {
        const viewerId = $(this).data("id");

        fetch(`http://localhost:5031/api/viewer/${viewerId}`, {
            method: "DELETE"
        })
        .then(response => {
            if (response.ok) {
                getViewers();
            } else {
                alert("Failed to delete viewer.");
            }
        })
        .catch(error => console.error("Error:", error));
    });

    $("#viewerForm").off("submit").on("submit", function (event) {
        event.preventDefault();

        const name = $("#viewerName").val().trim();
        const email = $("#viewerEmail").val().trim();

        if (!name || !email) {
            alert("Please fill in both name and email.");
            return;
        }

        const viewerData = { name, email };

        fetch("http://localhost:5031/api/viewer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(viewerData)
        })
        .then(response => {
            if (!response.ok) throw new Error("Failed to add viewer");
            return response.json();
        })
        .then(() => {
            getViewers();
            $("#viewerName").val("");
            $("#viewerEmail").val("");
        })
        .catch(error => console.error("Error:", error));
    });

 
    getViewers();
});
