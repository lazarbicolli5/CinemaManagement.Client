$(document).ready(function () {
    const $scheduleForm = $("#scheduleForm");
    const $movieNameInput = $("#movieName");
    const $scheduleTimeInput = $("#scheduleTime");
    const $hallIdInput = $("#hallId");
    const $schedulesList = $("#schedulesList");

    
    
    function getSchedules() {
        return fetch("http://localhost:5031/api/schedule")
            .then(response => response.json())
            .catch(error => {
                console.error("Error fetching schedules:", error);
            });
    }

   
    function renderSchedules(schedules) {
        $schedulesList.empty();
        if (schedules.length === 0) {
            $schedulesList.html('<li class="list-group-item text-muted">No schedules available.</li>');
            return;
        }
        schedules.forEach((schedule, index) => {
            const $scheduleItem = $("<li>")
                .addClass("list-group-item d-flex justify-content-between align-items-center")
                .html(`
                    <span><strong>${schedule.movieName}</strong> - ${new Date(schedule.scheduleTime).toLocaleString()} - Hall: ${schedule.hall.name}</span>
                    <button class="btn btn-danger btn-sm delete-schedule" data-index="${index}">Delete</button>
                `);
            $schedulesList.append($scheduleItem);
        });
    }

   
    $scheduleForm.on("submit", function (e) {
        e.preventDefault();
        const scheduleData = {
            movieName: $movieNameInput.val(),
            scheduleTime: $scheduleTimeInput.val(),
            
        };

        fetch("http://localhost:5031/api/schedule", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(scheduleData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            alert("Schedule added successfully!");
            console.log("Created:", data);
            $scheduleForm[0].reset();
            getSchedules().then(renderSchedules); 
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred while adding the schedule.");
        });
    });

    
});
