const {messages, template} = require('../messages/messageTemplateModule');
const request = require('request');

module.exports = function(message, matches) {
    return new Promise((resolve, reject) => {

        if (matches.length > 4) {
            let indexPattern = matches[1] || '*';
            let queryKey = matches[2];
            let queryValue = matches[3];
            let dateMath = matches[4] || 'now-1d';
            let queryMap = {}; queryMap[queryKey] = queryValue;
            request.post({
                uri: "http://localhost:9200/" + indexPattern + "/_search",
                headers: {
                    "Content-type": "application/json",
                },
                json: {
                    "query": {
                        "bool": {
                            "must": [
                                {
                                    "match": queryMap
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
                resolve(template(messages.METHOD_ELK, results.length, results.map(v => v['_source'][queryKey]).join('\n')));
            });
        }
        else {
            reject('잘못된 사용 방법입니다. :\n/es [indexPattern] [queryKey] [queryMap] [dateMath]');
        }
    });
};