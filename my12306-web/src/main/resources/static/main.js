fish.View.configure({manage: true});

require(['modules/views/checkTicket'], function (CheckTicket) {
    new CheckTicket().render();
});