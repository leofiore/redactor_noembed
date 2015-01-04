if (!RedactorPlugins) var RedactorPlugins = {};

RedactorPlugins.noembed = function() {
    "use strict";
    var detach = function(idx, el){
                    var $el = $(el),
                        child = $el.children(":last-child").detach(),
                        parent = $el.parent();
                    $el.remove();
                    parent.append(child);
                };
    return {
        init: function() {
            var that = this;
            var urlRe = /^\s*(https?:\/\/[^ \/,"]+\/[^ ,"]+)\s*$/i;
            this.$editor.on("click", function(e){
                $("#redactor-image-box.noembed").each(detach);
            });
            this.$editor.on('keyup', function(e) {
                if (e.keyCode === 13) {
                    var current = that.selection.getCurrent();
                    while(current && current.noteType !== 3 && current.nodeName.toLowerCase() !== 'p') {
                        current = current.parentNode;
                    }
                    var prev = current.previousSibling;
                    if (!prev) {
                        return;
                    }
                    if (prev.getAttribute('parsed-noembed-link')) {
                        return;
                    }
                    var links = $(prev).find('a');
                    if (links.length) {
                        if (links.get(0).getAttribute('parsed-noembed-link'))
                            return;
                        prev.setAttribute('parsed-noembed-link', '1');
                        links.attr('parsed-noembed-link', '1');
                        that.noembed.fetchUrl(links.get(0).href, prev);
                        return;
                    }
                    //Extreme way (or, link is not parsed yet by redactor)
                    var text = $(prev).text();
                    if (!text) {
                        return;
                    }
                    var m = text.match(urlRe);
                    if (m) {
                        prev.setAttribute('parsed-noembed-link', '1');
                        that.noembed.fetchUrl(m[1], prev);
                    }
                }
                if (e.keyCode === 8) {
                    $("#redactor-image-box.noembed").remove();
                }
            });
        },
        fetchUrl: function(uri, node) {
            var that = this;
            $.ajax({
                url: 'http://noembed.com/embed',
                dataType: "jsonp",
                data: {
                    url: uri,
                    nowrap: "on"
                },
                success: function(data, textStatus, jqXHR) {
                    if (data && data.html) {
                        var $node = $(data.html);
                        $node.find('a').attr('parsed-noembed-link', '1');
                        var el = that.insert.node($node.get(0), false);

                        $(el).on(
                            "click",
                            function(evt){
                                var node = evt.currentTarget,
                                    parent = node.parentNode,
                                    box = $(
                                        '<span style="float: none;" id="redactor-image-box" data-redactor="verified" contenteditable="false" class="noembed">' + 
                                        '    <span style="margin-left: -19.5px;" id="redactor-image-editter" data-redactor="verified" contenteditable="false">Edit</span>' +
                                        '    <span id="redactor-image-resizer" data-redactor="verified" contenteditable="false"></span>' + 
                                        '</span>');

                                $("#redactor-image-box").each(detach);
                                box.append(parent.removeChild(node));
                                parent.appendChild(box.get(0));
                                evt.stopPropagation();
                            }
                        );
                    }
                    if (!data.error && node && node.parentNode)
                        node.parentNode.removeChild(node);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.error(jqXHR && jqXHR.responseText || textStatus);
                }
            });
        }
    };
};
