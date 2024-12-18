import React, { useState } from 'react';
import {View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper';

const questions = [
  {
    question: '여행을 떠나기 전 항공편은?',
    options: ['저렴하지만 선호하지 않는 시간대', '비싸지만 선호하는 시간대'],
    type: 'single',
  },
  {
    question:
      '항공사 소멸 예정 마일리지가 많다!\n 가장 원하는 서비스 3개를 순서대로 골라보자',
    options: [
      '탑승혜택',
      '기내식 등급 업그레이드',
      '공항 라운지 이용권',
      '좌석등급 업그레이드',
      '수하물 용량 업그레이드',
    ],
    type: 'multiple',
    selectCount: 3,
  },
  {
    question: '여행 날짜가 얼마 남지 않았는데, \n여행기간에 폭설이 예상된다면...',
    options: ['예약했는데 당연히 떠나야지!', '취소하자!'],
    type: 'single',
  },
  {
    question: '여행 당일,\n어떤 방법으로 티켓을 발급할까?',
    options: [
      '오프라인 셀프 체크인',
      '온라인 체크인',
      '오프라인 대면 카운터 체크인',
      '유료사전 좌석 지정',
    ],
    type: 'single',
  },
  {
    question: '항공기 좌석을 선택할 때,\n나는 어떤 좌석을 선호할까?',
    options: ['창가자리', '복도자리', '중간자리'],
    type: 'single',
  },
  {
    question: '탑승시간이 다가올 때 나는,\n언제 탑승하러 갈까?',
    options: [
      '가장 먼저 줄을 선다',
      '줄이 생기면 뒤따라 선다',
      '기다렸다가 줄이 짧아지면 천천히 일어난다',
    ],
    type: 'single',
  },
  {
    question:
      '드디어 도착! 배가 너무 고프다...\n가장 가고 싶은 식당 스타일 3가지를 순서대로 골라보자!',
    options: [
      '현지인 특화 음식점',
      '평소 즐겨 먹던 종류의 음식점',
      '프랜차이즈 음식점',
      'sns 핫플레이스 음식점',
      '눈에 보이는 가까운 음식점',
    ],
    type: 'multiple',
    selectCount: 3,
  },
  {
    question:
      '식당에 도착해서 음식을 시켜야한다. \n가장 먼저 시도하는 주문 방법\n상위 3개는?',
    options: [
      '메뉴판의 사진을 보고 주문한다',
      '직원에게 추천을 받는다',
      '인터넷에 식당을 검색해본다',
      '옆테이블의 메뉴를 따라 주문한다',
      '번역기를 통해 메뉴판을 읽어보려한다',
    ],
    type: 'multiple',
    selectCount: 3,
  },
  {
    question:
      '밥 먹고 커피나 한잔 할까?\n가장 가고 싶은 카페 스타일 3가지를 순서대로 골라보자!',
    options: [
      'sns 핫플레이스 현지 유명카페',
      '특색있는 테마카페 (ex, 동물카페)',
      '전문 프랜차이즈 카페',
      '테이크아웃 위주의 프렌차이즈 카페',
      '인터넷 리뷰 좋은 카페',
      '눈에 보이는 가까운 카페',
    ],
    type: 'multiple',
    selectCount: 3,
  },
];

const TravelerPersonalityTest = ({navigation}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [multipleSelections, setMultipleSelections] = useState([]);

  const handleSingleAnswer = (answerIndex) => {
    setAnswers([...answers, answerIndex]);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setMultipleSelections([]);
    } else {
      calculateResult();
    }
  };

  const handleMultipleAnswer = (answerIndex) => {
    const newSelections = [...multipleSelections];
    const index = newSelections.indexOf(answerIndex);
    if (index > -1) {
      newSelections.splice(index, 1);
    } else if (newSelections.length < questions[currentQuestion].selectCount) {
      newSelections.push(answerIndex);
    }
    setMultipleSelections(newSelections);
  };

  const submitMultipleAnswer = () => {
    if (multipleSelections.length === questions[currentQuestion].selectCount) {
      setAnswers([...answers, multipleSelections]);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setMultipleSelections([]);
      } else {
        calculateResult();
      }
    }
  };

  const calculateResult = () => {
    let result = {
      민감: 0,
      즉흥: 0,
      미디어: 0,
      도전: 0,
      소비: 0,
      신속: 0,
    };

    // 질문 1: 비용 vs 편의
    if (answers[0] === 0) result.소비 += 10;
    else result.소비 += 20;

    // 질문 2: 마일리지 사용 선호도
    if (Array.isArray(answers[1])) {
      answers[1].forEach((choice, index) => {
        if (choice === 0 || choice === 3) result.소비 += (3 - index) * 5;
        if (choice === 1 || choice === 2) result.도전 += (3 - index) * 5;
      });
    }

    // 질문 3: 위험 감수
    if (answers[2] === 0) {
      result.도전 += 20;
      result.즉흥 += 10;
    } else {
      result.민감 += 20;
    }

    // 질문 4: 체크인 방식
    if (answers[3] === 1) result.신속 += 20;
    if (answers[3] === 3) result.소비 += 10;

    // 질문 5: 좌석 선호도
    if (answers[4] === 0) result.민감 += 10;
    if (answers[4] === 1) result.신속 += 10;

    // 질문 6: 탑승 시간
    if (answers[5] === 0) result.민감 += 15;
    if (answers[5] === 2) result.즉흥 += 15;

    // 질문 7: 식당 선호도
    if (Array.isArray(answers[6])) {
      answers[6].forEach((choice, index) => {
        if (choice === 0 || choice === 3) result.도전 += (3 - index) * 5;
        if (choice === 1 || choice === 2) result.민감 += (3 - index) * 5;
        if (choice === 3) result.미디어 += (3 - index) * 5;
      });
    }

    // 질문 8: 메뉴 주문 방식
    if (Array.isArray(answers[7])) {
      answers[7].forEach((choice, index) => {
        if (choice === 1 || choice === 3) result.도전 += (3 - index) * 5;
        if (choice === 2 || choice === 4) result.민감 += (3 - index) * 5;
      });
    }

    // 질문 9: 카페 선호도
    if (Array.isArray(answers[8])) {
      answers[8].forEach((choice, index) => {
        if (choice === 0 || choice === 1) result.도전 += (3 - index) * 5;
        if (choice === 2 || choice === 3) result.민감 += (3 - index) * 5;
        if (choice === 0 || choice === 4) result.미디어 += (3 - index) * 5;
      });
    }

    // 결과를 백분율로 변환
    Object.keys(result).forEach((key) => {
      result[key] = Math.min(100, Math.round((result[key] / 100) * 100));
    });

    // 결과 출력
    // console.log(JSON.stringify(result, null, 2));
    // alert(JSON.stringify(result, null, 2));

    // 여기에 결과를 표시하는 화면으로 네비게이션하는 코드를 추가할 수 있습니다.
    navigation.replace('ResultScreen', { result });
  };

  if (currentQuestion >= questions.length) {
    return (
      <View style={styles.container}>
        <Text>테스트가 완료되었습니다!</Text>
      </View>
    );
  }

  const currentQuestionData = questions[currentQuestion];
  const questionNumber = `Q${currentQuestion + 1}`;
  const progress = (currentQuestion + 1) / questions.length;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 진행률 (프로그레스바) */}
      <View style={styles.progressBarWrapper}>
        <ProgressBar
          progress={progress}
          color="#2196F3"
          style={styles.progressBar}
        />
      </View>

      {/* 질문 번호 */}
      <Text style={styles.questionNumber}>{questionNumber}</Text>

      {/* 질문 텍스트 */}
      <Text style={styles.question}>{currentQuestionData.question}</Text>
      
      {/* 선택옵션 */}
      {currentQuestionData.options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.option,
            currentQuestionData.type === 'multiple' &&
              multipleSelections.includes(index) &&
              styles.selectedOption,
          ]}
          onPress={() =>
            currentQuestionData.type === 'single'
              ? handleSingleAnswer(index)
              : handleMultipleAnswer(index)
          }
        >
          <Text>{option}</Text>
        </TouchableOpacity>
      ))}
      {currentQuestionData.type === 'multiple' && (
        <TouchableOpacity
          style={[
            styles.submitButton,
            multipleSelections.length !== currentQuestionData.selectCount &&
              styles.disabledButton,
          ]}
          onPress={submitMultipleAnswer}
          disabled={
            multipleSelections.length !== currentQuestionData.selectCount
          }
        >
          <Text style={styles.submitButtonText}>선택 완료</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff', // 전체 배경을 밝은 톤으로 설정
  },
  questionNumber: {
    fontSize: 24, // 질문 번호 크기를 키움
    fontWeight: 'bold',
    color: '#333', // 다크 그레이 색상으로 가독성 향상
    marginBottom: 20,
  },
  question: {
    fontSize: 20, // 질문 텍스트 크기
    marginBottom: 40,
    textAlign: 'center',
    color: '#4A4A4A', // 약간 진한 그레이
    paddingHorizontal: 20,
  },
  option: {
    backgroundColor: '#ffffff', // 옵션 배경을 흰색으로
    paddingVertical: 15,
    marginVertical: 10, // 위아래 여백 추가
    borderRadius: 25, // 둥글게 처리
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1, // 옵션에 테두리 추가
    borderColor: '#D1D5DB', // 연한 그레이로 테두리 색상 설정
    shadowColor: '#000', // 그림자 추가
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1, // 그림자 효과를 위한 설정 (안드로이드)
  },
  selectedOption: {
    backgroundColor: '#e6f4ff',
    borderColor: '#0c94fb' // 선택된 옵션을 더 눈에 띄게 파란색 계열로 변경
  },
  submitButton: {
    backgroundColor: '#42A5F5', // 버튼 색상을 진한 파란색으로
    marginTop: 30,
    borderRadius: 25,
    width: '60%', // 버튼 크기 설정
    height: 50, // 높이를 고정하여 일관된 버튼 크기 유지
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#B0BEC5', // 비활성화된 버튼 색상
  },
  submitButtonText: {
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  progressBar: {
    height: 12, // 프로그레스바 높이를 살짝 키움
    borderRadius: 6,
    backgroundColor: '#E3F2FD', // 밝은 블루 계열로 설정
    width: '100%',
  },
  progressBarWrapper: {
    width: '90%', // 넓이를 더 넓게 설정하여 화면에 맞춤
    marginBottom: 40,
  },
});


export default TravelerPersonalityTest;
