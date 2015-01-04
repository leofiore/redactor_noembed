#A Redactor oEmbed Plugin using noembed.com

This plugin is loosely based on [itteco's iframely plugin](https://github.com/itteco/redactor-oembed) and extends it in some way.

This plugin allow rich media embeds via oEmbed using [noembed service](https://github.com/leedo/noembed).

##Warning: hack

**Use this plugin at your own risk**. It use some quirks and hacks to ease the manage the embedded objects, interacting with the #redactor-image-resizer object.

##Usage

    <!-- Prereqs -->
    <script type="text/javascript" src="http://code.jquery.com/jquery-latest.min.js"></script>
    <script src="http://imperavi.com/js/redactor/redactor.js"></script>

    <!-- Redactor's plugin -->
    <!-- Setup noembed redactor plugin. -->
    <script src="redactor_noembed.js"></script>
    <!-- Call Redactor -->
    <script type="text/javascript">

        $(document).ready(function() {
            $('#redactor').redactor({
                focus: true,
                plugins: ['noembed']
            });
        });
    </script>
