let mouseOver = false;
let selectedLisences = null;
let selectedLisencesType = null;
let selectedLisencesCost = null;
let selectedJob = null;
let selectedJobId = null;

Open = function() {
    $(".container").fadeIn(150);
}

Close = function() {
    $(".container").fadeOut(150, function(){
        ResetPages();
    });
    $.post('https://qb-cityhall/close');
    $(selectedJob).removeClass("job-selected");
    $(selectedLisences).removeClass("job-selected");
}

SetJobs = function(jobs) {
    $.each(jobs, (job, name) => {
        let html = `<div class="job-page-block" data-job="${job}"><p>${name}</p></div>`;
        $('.job-page-blocks').append(html);
    })
}

ResetPages = function() {
    $(".cityhall-option-blocks").show();
    $(".cityhall-Lisences-page").hide();
    $(".cityhall-job-page").hide();
}

$(document).ready(function(){
    window.addEventListener('message', function(event) {
        switch(event.data.action) {
            case "open":
                Open();
                break;
            case "close":
                Close();
                break;
            case "setJobs":
                SetJobs(event.data.jobs);
                break;
        }
    })
});

$(document).on('keydown', function() {
    switch(event.keyCode) {
        case 27: // ESC
            Close();
            break;
    }
});

$('.cityhall-option-block').click(function(e){
    e.preventDefault();
    let blockPage = $(this).data('page');
    $(".cityhall-option-blocks").fadeOut(100, () => {
        $(`.cityhall-${blockPage}-page`).fadeIn(100);
    });
    if (blockPage == "Lisences") {
        $(".Lisences-page-blocks").html("");
        $.post('https://qb-cityhall/requestLicenses', JSON.stringify({}), function(licenses){
            $.each(licenses, (i, license) => {
                let elem = `<div class="Lisences-page-block" data-type="${i}" data-cost="${license.cost}"><p>${license.label}</p></div>`;
                $(".Lisences-page-blocks").append(elem);
            });
        });
    }
});

$(document).on("click", ".Lisences-page-block", function(e){
    e.preventDefault();
    selectedLisencesType = $(this).data('type');
    selectedLisencesCost = $(this).data('cost');
    if (selectedLisences == null) {
        $(this).addClass("Lisences-selected");
        $(".hover-description").fadeIn(10);
        selectedLisences = this;
        $(".request-Lisences-button").fadeIn(100);
        $(".request-Lisences-button").html(`<p>Buy $${selectedLisencesCost}</p>`);
    } else if (selectedLisences == this) {
        $(this).removeClass("Lisences-selected");
        selectedLisences = null;
        $(".request-Lisences-button").fadeOut(100);
    } else {
        $(selectedLisences).removeClass("Lisences-selected");
        $(this).addClass("Lisences-selected");
        selectedLisences = this;
        $(".request-Lisences-button").html("<p>Buy</p>");
    }
});

$(".request-Lisences-button").click(function(e){
    e.preventDefault();
    $.post('https://qb-cityhall/requestId', JSON.stringify({
        type: selectedLisencesType,
        cost: selectedLisencesCost
    }))
    ResetPages();
});

$(document).on("click", ".job-page-block", function(e){
    e.preventDefault();
    selectedJobId = $(this).data('job');
    if (selectedJob == null) {
        $(this).addClass("job-selected");
        selectedJob = this;
        $(".apply-job-button").fadeIn(100);
    } else if (selectedJob == this) {
        $(this).removeClass("job-selected");
        selectedJob = null;
        $(".apply-job-button").fadeOut(100);
    } else {
        $(selectedJob).removeClass("job-selected");
        $(this).addClass("job-selected");
        selectedJob = this;
    }
});

$(document).on('click', '.apply-job-button', function(e){
    e.preventDefault();
    $.post('https://qb-cityhall/applyJob', JSON.stringify(selectedJobId))
    ResetPages();
});

$(document).on('click', '.back-to-main', function(e){
    e.preventDefault();
    $(selectedJob).removeClass("job-selected");
    $(selectedLisences).removeClass("job-selected");
    ResetPages();
});
