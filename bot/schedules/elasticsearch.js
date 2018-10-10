const request = require('request');
const {messages, template} = require('../messages/messageTemplateModule');

// https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-range-query.html#ranges-on-dates

function elasticRequest(alertTitle, indexPattern, queryMap, periodDateMath, alertLength) {
    return new Promise((resolve, reject) => {
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
                                        "gte": periodDateMath,
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
            if (results.length > alertLength) {
                resolve(template(messages.ALERT_ELK, alertTitle, indexPattern + ':' + JSON.stringify(queryMap), periodDateMath, results.length));
            }
            else {
                resolve();
            }
        });
    });
}

module.exports = {
    elasticsearchReadTimeOut : () => {return elasticRequest('뉴썸', 'log-analytics-*', {'errormsg': 'read time out'}, 'now-60d', 5)}
};