module.exports = {
    messages: {
        HELP:   "[모바일서비스 모니터링 챗봇]\n" +
                "당신의 아이디 : {0}\n\n" +
                "명령어 목록 :\n" +
                "- /help : 헬프\n" +
                "- /errors [indexPattern:*] [dateMath:now-1d] : 최근 주어진 기간동안 주어진 인덱스의 에러 갯수를 표시합니다. 최대 30건",

        SCHEDULE_ELK:  "{0}의 서버로그에서 {1} 관련 오류가 다량발생했습니다.\n" +
                    "발생 빈도는 최근 {2}당 {3}건입니다.\n",

        ERRORS_ELK:     "로그검색 결과는 {0}건입니다.\n" +
                        "======================\n\n" +
                        "{1}",

        CRITICAL_ELK:   "일래스틱서치 모듈과 통신에 실패했습니다. 로그모니터링이 불가합니다\n" +
                        "오류내용 : {0}\n"
    },
    template: function(message, ...text) {
        return message.replace(/{(\d+)}/g, (match, number) => {
            return (text.length > number)? text[number] : match;
        });
    }
};