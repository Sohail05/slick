var app = new Vue({

    el: '#app',
    data: {
        protocol: 'HTTP',
        protocols: ['HTTP', 'HTTPS'],
        method: 'GET',
        methods: ['GET', 'POST'],
        url: '',
        type: 'json',
        types: ['json'],
        encrypt: 'application/x-www-form-urlencoded',
        encrypts: ['application/x-www-form-urlencoded', 'multipart/form-data', 'text/plain'],
        response: '',
        responseHeader: '',
        button: "Request!",
        formData: {},
        parameters: [],
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
            data: '',
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

            var self = this, params = [], requestUrl = "", xhr ,formData;

            formData = new FormData(document.querySelector('form'));

            if (this.method === "GET") {
                formData.forEach(function(value, name) {
                    params.push(name + "=" + value);
                });
                requestUrl = this.url + "?" + params.join("&");
            } else {
                requestUrl = this.url;
            }

            xhr = new XMLHttpRequest;
            xhr.open(this.method, requestUrl, true);

            xhr.onload = function(e) {
                self.button = self.buttonText.loading;
            };

            xhr.onloadend = function(e) {
                self.button = self.buttonText.default;
                self.response = xhr.response;
                self.responseHeader = xhr.getAllResponseHeaders();
            };

            xhr.send(formData);


        },
        add: function() {
            this.parameters.push({
                name: '',
                value: '',
                type: 'text'
            });
        },

    }

});
