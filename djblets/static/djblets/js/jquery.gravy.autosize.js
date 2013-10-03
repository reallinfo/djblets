/*
 * Copyright 2008-2010 Christian Hammond.
 * Copyright 2010-2013 Beanbag, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */
(function($) {


/*
 * Auto-sizes a text area to make room for the contained content.
 */
$.widget("ui.autoSizeTextArea", {
    options: {
        fadeSpeedMS: 200,
        growOnKeyUp: true,
        minHeight: 100
    },

    _init: function() {
        var self = this;

        this._proxyEl = $("<pre/>")
            .appendTo("body")
            .move(-10000, -10000, "absolute");

        /*
         * Set white-space to pre-wrap on browsers that support it.
         */
        this._proxyEl.css({
            "white-space": "pre-wrap",
            "word-wrap": "break-word"
        });

        this.element.css("overflow", "hidden");
        this.oldLength = this.element.val().length;

        if (this.options.growOnKeyUp) {
            this.element
                .keyup(function() {
                    self.autoSize();
                });
        }
    },

    destroy: function() {
        this._proxyEl.remove();
        $.Widget.prototype.destroy.call(this);
    },

    /*
     * Auto-sizes a text area to match the content.
     *
     * This works by setting a proxy element to match the exact width of
     * our text area and then filling it with text. The proxy element will
     * grow to accommodate the content. We then set the text area to the
     * resulting width.
     */
    autoSize: function(force, animate, animateFrom) {
        var needsResize = false,
            newLength = this.element.val().length,
            newHeight = 0,
            normHeight = this.element[0].scrollHeight +
                         (this.element.height() -
                          this.element[0].clientHeight),
            targetHeight;

        if (normHeight != this.element.height()) {
            /* We know the height grew, so queue a resize. */
            needsResize = true;
            newHeight = normHeight;
        } else if (this.oldLength > newLength || force) {
            /* The size may have decreased. Check the number of lines. */
            needsResize = true;

            this._proxyEl
                .width(this.element.width())
                .move(-10000, -10000)
                .text(this.element.val() + "\n");
            newHeight = this._proxyEl.outerHeight();
        }

        if (needsResize) {
            targetHeight = Math.max(this.options.minHeight, newHeight);

            if (animate) {
                this.element
                    .height(animateFrom)
                    .animate({
                        height: targetHeight
                    }, this.options.fadeSpeedMS)
                    .triggerHandler("resize");
            } else {
                this.element
                    .height(targetHeight)
                    .triggerHandler("resize");
            }
        }

        this.oldLength = newLength;
    },

    setMinHeight: function(minHeight) {
        this.options.minHeight = minHeight;
    }
});


})(jQuery);

// vim: set et:
