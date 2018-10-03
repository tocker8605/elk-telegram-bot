const request = require('request');
const botModule = require('../botModule');
const {messages, template} = require('../messages/messageTemplateModule');

// http://localhost:9200/log-analytics-*/_search?q=errormsg:Duplicate%20entry
// https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-range-query.html#ranges-on-dates

module.exports = function() {
    return new Promise((resolve, reject) => {
        request.post({
            uri: "http://localhost:9200/log-analytics-*/_search?q=errormsg:Duplicate entry",
            headers: {
                "Content-type": "application/json",
            },
            json: {
                "query": {
                    "range" : {
                        "@timestamp" : {
                            "gte": "2018-08-01 00:00:00",
                            "lte": "now",
                            "format": "yyyy-MM-dd HH:mm:ss"
                        }
                    }
                }
            }
        }, (error, response, body) => {
            if (error != null) {
                return reject(error);
            }
            let results = body['hits']['hits'] || [];
            if (results.length > 0) {
                botModule.sendMessageToSubscriber(
                    template(messages.ALERT_ELK, '뉴썸', 'Read timeout', 5, results.length)
                ).then((values) => {
                    return resolve(values);
                }).catch((error) => {
                    return reject(error);
                })
            }

            resolve();
        });
    }).catch((reason => {
        botModule.sendMessageToSubscriber(template(messages.CRITICAL_ELK, reason));
    }));
};