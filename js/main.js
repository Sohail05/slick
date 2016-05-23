var app = new Vue({

    el: '#app',
    data: {
        url: '',
        domain: '',
        route: '',
        port: '',
        protocol: 'HTTP',
        protocols: ['HTTP', 'HTTPS'],
        method: 'GET',
        methods: ['GET', 'POST'],
        type: 'json',
        types: ['json'],
        response: '',
        responseHeader: '',
        button: "Request!",
        formData: {},
        parameters: [],
        globalVariableName: 'slick_tmp',
        buttonText: {
            default: 'Request!',
            loading: '<i class="fa fa-circle-o-notch fa-spin" aria-hidden="true"></i>',
        },
    },
    watch: {
        url() {
            this.setData();
            this.updateProtocol();
        },
        protocol(value){

            let protocolIndex = this.protocols.indexOf(value.toUpperCase());
            this.protocol = protocolIndex != -1 ? this.protocols[protocolIndex] : this.protocols[0];
            this.updateProtocol();
        }
    },
    computed: {
    },
    components: {
        variable: {
            data: '',
            props: ["parameter"],
            template: '#variable-template',
            methods: {
                remove: (parameter) => app.parameters.$remove(parameter),
            }
        },
    },
    methods: {

        submit: function() {

            var self = this,
                params = [],
                requestUrl = "",
                xhr, formData;

            formData = new FormData(document.querySelector('form'));

            if (this.method === "GET") {
                formData.forEach(function(value, name) {
                    params.push(name + "=" + value);
                });
                requestUrl = `${this.url}${params.join("&")}`;
            } else {
                requestUrl = this.url;
            }

            xhr = new XMLHttpRequest;
            xhr.open(this.method, requestUrl, true);

            xhr.onload = () => self.button = self.buttonText.loading;

            xhr.onloadend = () => {
                self.button = self.buttonText.default;
                self.response = xhr.response;
                self.responseHeader = xhr.getAllResponseHeaders();
            };

            xhr.send(formData);

        },
        addParameter: function() {
            this.parameters.push({name: '',value: '',type: 'text'});
        },
        createTmp: function() {
            window[this.globalVariableName] = JSON.parse(this.response);
            console.log(this.globalVariableName, window[this.globalVariableName]);
        },
        setData: function() {
            const RegexArray = [
              { name: 'protocol', regex: /^(?:(\w*):\/\/)/gmi },
              { name: 'domain',   regex: /^(?:\w*:\/\/)?([\w\.]*)/gmi },
              { name: 'port',     regex: /^(?:\w*:\/\/)?(?:[\w\.]*)?(?::([0-9]*))/gmi},
              { name: 'route',    regex: /^(?:\w*:\/\/)?(?:[\w\.]*)?(?::[0-9]*)?([^:\?\s]*)/gmi},
            //  { name: 'parameters', regex : /^(?:\w*:\/\/)?(?:[\w\.]*)?(?::[0-9]*)?(?:[^:\?\s]*)?(?:\?(^\s))/gmi }
            ];

            RegexArray.forEach( (piece) => {
                let result = piece.regex.exec(this.url);
                if (result) { this[piece.name] = result[1]; }
            });
        },updateData: function(){
          //this.url = `${this.protocol.toLowerCase()}://${this.domain}:${this.port}${this.route}`;
        },updateProtocol: function(){
          let regex = /^(?:(\w*):\/\/)(.*)/gmi;
          let result = regex.exec(this.url);
          this.url = result ? this.protocol.toLowerCase() + "://" + result[2] : this.protocol.toLowerCase() + "://" + this.url;
        }
    }

});
