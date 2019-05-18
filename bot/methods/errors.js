const {messages, template} = require('../messages/messageTemplateModule');
const request = require('request');

module.exports = function(message, matches) {
    return new Promise((resolve, reject) => {

        if (matches.length === 3) {
            let indexPattern = matches[1] || '*';
            let dateMath = matches[2] || 'now-1d';
            request.post({
                uri: "http://localhost:9200/" + indexPattern + "/_search",
                headers: {
                    "Content-type": "application/json",
                },
                json: {
                    "size": 30,
                    "query": {
                        "bool": {
                            "must": [
                                {
                                    "match": {
                                        "loglevel": "ERROR"
                                    }
                                },
                                {
                                    "range": {
                                        "@timestamp": {
                                            "gte": dateMath,
                                            "lte": "now"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }, (error, response, body) => {
                if (error != null) {
                    return reject(template(messages.CRITICAL_ELK, error));
                }
                let results = body['hits']['hits'] || [];
                resolve(template(messages.ERRORS_ELK, results.length, results.slice(0, 30).map(v => v['_source']['errormsg']).join('\n')));
            });
        }
        else {
            reject('잘못된 사용 방법입니다. :\n/errors [indexPattern:*] [dateMath:now-1d]');
        }
    });
};