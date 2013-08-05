/*!
 * jQuery lightweight plugin boilerplate
 * Original author: @ajpiano
 * Further changes, comments: @addyosmani
 * Licensed under the MIT license
 */


// the semi-colon before the function invocation is a safety
// net against concatenated scripts and/or other plugins
// that are not closed properly.
;(function ( $, window, document, undefined ) {

    // undefined is used here as the undefined global
    // variable in ECMAScript 3 and is mutable (i.e. it can
    // be changed by someone else). undefined isn't really
    // being passed in so we can ensure that its value is
    // truly undefined. In ES5, undefined can no longer be
    // modified.

    // window and document are passed through as local
    // variables rather than as globals, because this (slightly)
    // quickens the resolution process and can be more
    // efficiently minified (especially when both are
    // regularly referenced in our plugin).

    // Create the defaults once
    var pluginName = "WonksInteractiveVideo",
        defaults = {
            propertyName: "value"
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

        this._video = null;
        this._skipKeyFrame = false;
        this._interval = null;
        this._playing = false;
//        this.options.keyframes = [];

        // jQuery has an extend method that merges the
        // contents of two or more objects, storing the
        // result in the first object. The first object
        // is generally empty because we don't want to alter
        // the default options for future instances of the plugin
        this.options = $.extend( {}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;

        this._init();
    }

    Plugin.prototype._init = function () {
        // Place initialization logic here
        // We already have access to the DOM element and
        // the options via the instance, e.g. this.element
        // and this.options

        this._video = $(this.element).get(0);
        this._video.play();

        var self = this;
        var el = $(this.element);

        el.on("timeupdate", function (e) {
            self.setKeyframes(parseInt(self._video.currentTime));
        });

        el.on('seeking', function(e){
            console.log('seeking');
            button.off('click.WonksInteractiveVideo');
            self._skipKeyFrame = false;
            clearInterval(self._interval);
        });

        var play_button = self.createButton('play-button', '[Play]');
        play_button.on('click.WonksInteractiveVideo',function(e){
            e.preventDefault();
            self.play();
        });

        var pause_button = self.createButton('pause-button', '[Pause]');
        pause_button.on('click.WonksInteractiveVideo',function(e){
            e.preventDefault();
            self.pause();
        });

    };

    Plugin.prototype.createButton = function(css_id, text) {
        var id = '#' + css_id;
        var create_button = $(id);

        if (!create_button.length) {
            $(this.element).parent().append('<a id="' + css_id + '" href="#">' + text + '</a>');
            create_button = $(id);
        }
        return create_button;
    }

    // test function
    Plugin.prototype.doSomething = function() {
    };

    //
    Plugin.prototype.play = function() {
        if (!this._playing) {
            this._playing = true;
            this._video.play();
            clearInterval(this._interval);
        }
    };

    Plugin.prototype.pause = function() {
        this._video.pause();
        this._playing = false;
        clearInterval(this._interval);
    };

    Plugin.prototype.goToAndPlay = function(secs) {
        this._video.currentTime = secs;
        if (!this._playing) {
            this.play();
            clearInterval(this._interval);
        }
    };

    Plugin.prototype.addContinueButton = function(start_again) {

        var self = this;
        var button = self.createButton('continue-button', '');

        if (button.html() == '') {

            button.html('[Continue!!]');
            button.on('click.WonksInteractiveVideo',function(e){
                e.preventDefault();
                button.off('click.WonksInteractiveVideo');
                self._skipKeyFrame = true;
                self.goToAndPlay(start_again);
                button.html('');
                console.log('clicked continue ' + start_again + ' ' + self._skipKeyFrame);
                clearInterval(self._interval);

                self._interval = setInterval(function() {
                    self._skipKeyFrame = false;
                    clearInterval(self._interval);
//                    self._interval = 0;
                    console.log('clearInterval');
                }, 1100);

            });
        }
    }

    Plugin.prototype.setKeyframes = function(current_time) {
        for (var i=0; i<this.options.keyframes.length; i++) {
            var stop = this.options.keyframes[i][0];
            if (current_time == stop && this._skipKeyFrame === false) {
                //console.log('looping ' + this._skipKeyFrame);
                this.goToAndPlay(this.options.keyframes[i][1]);
                this.addContinueButton(stop);
            }
        }
    };




    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if ( !$.data(this, "plugin_" + pluginName )) {
                $.data( this, "plugin_" + pluginName,
                new Plugin( this, options ));
            }
        });
    }

})( jQuery, window, document );
