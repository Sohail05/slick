var app = new Vue({

    el: '#app',
    data: {
        protocol: 'HTTP',
        protocols: ['HTTP', 'HTTPS', 'FILE'],
        method: 'GET',
        methods: ['GET', 'POST', 'PUT'],
        url: '',
        type: 'json',
        types: ['html', 'json', 'jsonp', 'script'],
        response: '',
        button: "Request!",
        parameters: [],
        dataFormat: { name:'', value:'' },
        buttonText: {
            default: 'Request!',
            loading: '<i class="fa fa-circle-o-notch fa-spin" aria-hidden="true"></i>',
        },
    },
    watch: {
        url: function(value) {
            if (this.splitURL[1]) {
                var index = this.protocols.indexOf(this.splitURL[1].toUpperCase() || "");
                this.protocol = index != -1 ? this.protocols[index] : this.protocols[0];
            }
        },
        protocol: function(value) {
            var pieces = this.splitURL;
            pieces[0] = '';
            pieces[1] = value.toLowerCase() + "://";
            this.url = pieces.join('');
        },
    },
    computed: {

        splitURL: function() {
            //[0] original string
            //[1] protocol
            //[2] domain
            //[3] path
            //[4] variables
            var re = /^(?:(\w*):\/\/)?([\w\.]*)?([^\?\s]*)?(?:\?(.*))?/gmi;
            var match = re.exec(this.url);
            return match;
        }

    },
    components: {
        variable: {
            data: function() {
                return app.dataFormat;
            },
            props: ["parameter"],
            template: '#variable-template',
            methods: {
                remove: function(parameter) {
                    app.parameters.$remove(parameter);
                },
            }
        },
    },
    methods: {

        submit: function() {

            var self = this;
            self.button = self.buttonText.loading;

            aja()
                .url(this.url)
                .cache(false)
                .type(this.type)
                .on('success', function(response) {
                    self.response = response;
                    self.button = self.buttonText.default;
                }).on('error', function(response) {
                    self.response = response;
                    self.button = self.buttonText.default;
                }).go();
        },

        add: function() {
            this.parameters.push( this.dataFormat );
        },

    }

});
