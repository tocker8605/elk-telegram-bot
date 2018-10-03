module.exports = {
    messages: {
        HELP:   "[모바일서비스 모니터링 챗봇]\n" +
                "당신의 아이디 : {0}\n\n" +
                "명령어 목록 :\n" +
                "- /help : 헬프\n" +
                "- /subscribe : 챗봇얼럿 구독참여(허용된자만)\n" +
                "- /unsubscribe : 챗봇얼럿 구독해제\n",

        ALERT_ELK:  "{0}의 서버로그에서 {1} 관련 오류가 다량발생했습니다.\n" +
                    "발생 빈도는 최근 {2}분당 {3}건입니다.\n",

        CRITICAL_ELK:   "일래스틱서치 모듈과 통신에 실패했습니다. 로그모니터링이 불가합니다\n" +
                        "오류내용 : {0}\n"
    },
    template: function(message, ...text) {
        return message.replace(/{(\d+)}/g, (match, number) => {
            return (text.length > number)? text[number] : match;
        });
    }
};