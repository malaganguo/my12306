define(['modules/modules12306/views/AlphaView',
    'modules/module-b/views/BetaView'], function(AlphaView, BetaView) {
    var IndexView = fish.View.extend({
        el: 'body',

        initialize: function() {
            this.setViews({
                '': [new AlphaView(), new BetaView()]
            });
        }
    });

    return IndexView;
});
