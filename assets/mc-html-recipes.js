var $tooltip = $();
var $win = $(window), winWidth, winHeight, width, height;
$(document).on({
    'mouseenter.minetip': function(e) {
        $tooltip.remove();
        var $elem = $(this),
            title = $elem.attr('data-minetip-title');
        if (title === undefined) {
            title = $elem.attr('title');
            if (title !== undefined) {
                title = $.trim(title.replace(/&/g, '\\\\&'));
                $elem.attr('data-minetip-title', title);
            }
        }
        if (title === undefined || title !== '' && title.replace(/&([0-9a-fl-or])/g, '') === '') {
            var childElem = $elem[0],
                childTitle;
            do {
                if (childElem.hasAttribute('title')) {
                    childTitle = childElem.title;
                }
                childElem = childElem.firstChild;
            } while (childElem && childElem.nodeType === 1);
            if (childTitle === undefined) {
                return;
            }
            if (!title) {
                title = '';
            }
            title += $.trim(childTitle.replace(/&/g, '\\&'));
            $elem.attr('data-minetip-title', title);
        }
        if (!$elem.data('minetip-ready')) {
            $elem.find('[title]').addBack().removeAttr('title');
            $elem.data('minetip-ready', true);
        }
        if (title === '') {
            return;
        }
        var content = '<span class="minetip-title">' + title + '&r</span>';
        var description = $.trim($elem.attr('data-minetip-text'));
        if (description) {
            description = description.replace(/\//g, '&#47;');
            content += '<span class="minetip-description">' + description.replace(/\/n/g, '<br>') + '&r</span>';
        }
        while (content.search(/&[0-9a-fl-o]/) > -1) {
            content = content.replace(/&([0-9a-fl-o])(.*?)(&r|$)/g, '<span class="format-$1">$2</span>&r');
        }
        content = content.replace(/&r/g, '');
        $tooltip = $('<div id="minetip-tooltip">');
        $tooltip.html(content).appendTo('body');
        winWidth = $win.width();
        winHeight = $win.height();
        width = $tooltip.outerWidth(true);
        height = $tooltip.outerHeight(true);
        $elem.trigger('mousemove', e);
    },
    'mousemove.minetip': function(e, trigger) {
        if (!$tooltip.length) {
            $(this).trigger('mouseenter');
            return;
        }
        e = trigger || e;
        var top = e.clientY - 34;
        var left = e.clientX + 14;
        if (left + width > winWidth) {
            left -= width + 36;
        }
        if (left < 0) {
            left = 0;
            top -= height - 22;
            if (top < 0) {
                top += height + 47;
            }
        } else if (top < 0) {
            top = 0;
        } else if (top + height > winHeight) {
            top = winHeight - height;
        }
        $tooltip.css({
            top: top,
            left: left
        });
    },
    'mouseleave.minetip': function() {
        if (!$tooltip.length) {
            return;
        }
        $tooltip.remove();
        $tooltip = $();
    }
}, '.minetip, .invslot-item');

(function() {
    var $content = $(document);
    var advanceFrame = function(parentElem, parentSelector) {
        var curFrame = parentElem.querySelector(parentSelector + ' > .animated-active');
        $(curFrame).removeClass('animated-active');
        var $nextFrame = $(curFrame && curFrame.nextElementSibling || parentElem.firstElementChild);
        return $nextFrame.addClass('animated-active');
    };
    var hidden;
    if (typeof document.hidden !== 'undefined') {
        hidden = 'hidden';
    } else if (typeof document.msHidden !== 'undefined') {
        hidden = 'msHidden';
    } else if (typeof document.webkitHidden !== 'undefined') {
        hidden = 'webkitHidden';
    }
    setInterval(function() {
        if (hidden && document[hidden]) {
            return;
        }
        $content.find('.animated').each(function() {
            if ($(this).hasClass('animated-paused')) {
                return;
            }
            var $nextFrame = advanceFrame(this, '.animated');
            if ($nextFrame.hasClass('animated-subframe')) {
                advanceFrame($nextFrame[0], '.animated-subframe');
            }
        });
    }, 2000);
}());

$.get("assets/mc-html-recipes.json", function(data) {
    var itemsPerRow = data['width'] / 32;

    $('.inv-sprite').each(function(i, el) {
        el = $(el);
        
        var id = el.data('mchr-id');
        var item = el.data('mchr-item');
        if (item != undefined) {
            if (data.nameIdMap[item] != undefined) {
                id = data.nameIdMap[item];
            } else {
                console.log('Item not found: ' + item);
            }
        }

        if (id != null && id != undefined) {
            var x = -(id % itemsPerRow * 32);
            var y = -Math.floor(id / itemsPerRow) * 32;

            el.css('background-position', `${x}px ${y}px`);
        }
    });
}, "json");
