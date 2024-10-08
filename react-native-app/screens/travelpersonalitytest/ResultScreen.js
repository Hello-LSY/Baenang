import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { ProgressBar } from 'react-native-paper';

// 이미지 파일을 여행자 유형에 맞게 불러오기
import comfortSeeking from '../../assets/images/testResultImage/ComportSeeking.png';
import spontaneous from '../../assets/images/testResultImage/Spontaneous.png';
import mediaFocused from '../../assets/images/testResultImage/MediaFocused.png';
import adventurous from '../../assets/images/testResultImage/Adventurous.png';
import luxurySeeking from '../../assets/images/testResultImage/LuxurySeeking.png';
import quickDecider from '../../assets/images/testResultImage/QuickDecider.png';
import balanced from '../../assets/images/testResultImage/Balanced.png';

// 여행자 유형에 맞는 이미지를 매핑
const travelerImages = {
    'Comfort-Seeking Traveler': comfortSeeking,
    'Spontaneous Traveler': spontaneous,
    'Media-Focused Traveler': mediaFocused,
    'Adventurous Traveler': adventurous,
    'Luxury-Seeking Traveler': luxurySeeking,
    'Quick-Decider Traveler': quickDecider,
    'Balanced Traveler': balanced,
};

const ResultScreen = ({ route }) => {
    const { result } = route.params;

    // 결과 데이터를 바탕으로 여행자 유형을 반환하는 함수
    const getTravelerType = () => {
        if (result.민감 >= 50) return { kor: '민감형 여행자', eng: 'Comfort-Seeking Traveler' };
        if (result.즉흥 >= 50) return { kor: '즉흥형 여행자', eng: 'Spontaneous Traveler' };
        if (result.미디어 >= 50) return { kor: '미디어 중심 여행자', eng: 'Media-Focused Traveler' };
        if (result.도전 >= 50) return { kor: '모험형 여행자', eng: 'Adventurous Traveler' };
        if (result.소비 >= 50) return { kor: '소비 중심 여행자', eng: 'Luxury-Seeking Traveler' };
        if (result.신속 >= 50) return { kor: '신속형 여행자', eng: 'Quick-Decider Traveler' };
        return { kor: '균형형 여행자', eng: 'Balanced Traveler' };
    };

    const travelerType = getTravelerType();

    // 각 속성에 대한 Progress Bar를 렌더링하는 함수
    const renderProgressBarsHorizontal = () => {
        return Object.keys(result).map((key) => (
            <View key={key} style={styles.horizontalContainer}>
                {/* 항목명 */}
                <Text style={styles.progressBarLabel}>{key}:</Text>
                
                {/* ProgressBar를 감싸는 View */}
                <View style={styles.progressBarWrapper}>
                    <ProgressBar
                        progress={result[key] / 100} // 0 ~ 1의 값으로 변환
                        color="#4b8efc"
                        style={styles.horizontalProgressBar} // 스타일 수정
                    />
                </View>
                
                {/* 퍼센티지 값 */}
                <Text style={styles.progressValue}>{result[key]}%</Text>
            </View>
        ));
    };

    // 각 여행자 유형에 따른 결과 메시지를 반환하는 함수
    const renderResultMessage = () => {
        switch (travelerType.kor) {
            case '민감형 여행자':
                return (
                    <Text style={styles.resultMessage}>
                        여행 중 예상치 못한 변화에 민감하게 반응하며, 철저한 계획을 선호합니다.  
                        예상치 못한 변화에 대비해 철저하게 준비하는 스타일입니다.
                    </Text>
                );
            case '즉흥형 여행자':
                return (
                    <Text style={styles.resultMessage}>
                        상황에 맞춰 자유롭게 여행하며 계획보다는 순간적인 결정과 재미를 추구합니다.
                    </Text>
                );
            case '미디어 중심 여행자':
                return (
                    <Text style={styles.resultMessage}>
                        여행 중 다양한 경험과 기억을 사진이나 영상으로 남기기를 좋아하며, SNS를 통해 공유하는 것을 즐깁니다.
                    </Text>
                );
            case '모험형 여행자':
                return (
                    <Text style={styles.resultMessage}>
                        새로운 도전과 경험을 즐기며, 예측 불가능한 상황도 잘 극복해냅니다.
                    </Text>
                );
            case '소비 중심 여행자':
                return (
                    <Text style={styles.resultMessage}>
                        여행 중 고급스러운 경험을 추구하며, 편안함과 즐거움을 위한 추가 지출을 아끼지 않습니다.
                    </Text>
                );
            case '신속형 여행자':
                return (
                    <Text style={styles.resultMessage}>
                        빠른 결정과 효율성을 중시하며, 계획을 세우는 과정에서 신속한 결정을 내리는 것을 좋아합니다.
                    </Text>
                );
            default:
                return (
                    <Text style={styles.resultMessage}>
                        다양한 여행 스타일을 가지고 있으며, 상황에 따라 유연하게 대처하는 유형입니다.
                    </Text>
                );
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>여행 테스트 결과</Text>
            
            {/* 여행자 유형에 맞는 이미지 표시 */}
            <Image source={travelerImages[travelerType.eng]} style={styles.image} />

            {/* 여행자 유형 텍스트 */}
            <Text style={styles.travelerType}>{travelerType.kor}</Text>
            <Text style={styles.travelerTypeEng}>({travelerType.eng})</Text>

            {/* 여행자 유형 설명 메시지 */}
            <View style={styles.resultMessageContainer}>
                {renderResultMessage()}
            </View>

            <Text style={styles.travelerTypeEng}>상세 점수</Text>

            {/* 각 속성에 대한 Progress Bar 표시 */}
            {renderProgressBarsHorizontal()}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f0f8ff', // 배경색 설정
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        marginBottom: 30,
    },
    horizontalContainer: {
        flexDirection: 'row', // 가로로 정렬
        alignItems: 'center',
        marginVertical: 10,
        width: '90%', // 전체 화면에 맞게 설정
    },
    progressBarLabel: {
        width: '20%', // 항목명 비율 설정
        fontSize: 16,
        color: '#333',
        textAlign: 'left', // 텍스트 왼쪽 정렬
    },
    progressBarWrapper: {
        flex: 1,
        justifyContent: 'center',
    },
    horizontalProgressBar: {
        height: 10,
        borderRadius: 5,
        backgroundColor: '#e0e0e0',
    },
    progressValue: {
        width: '10%', // 퍼센티지 값 비율 설정
        fontSize: 14,
        color: '#666',
        textAlign: 'right',
    },
    travelerType: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#4b8efc', // 여행자 유형 텍스트 색상 설정
        textAlign: 'center', // 텍스트 가운데 정렬
    },
    travelerTypeEng: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center', // 텍스트 가운데 정렬
    },
    resultMessage: {
        fontSize: 18,
        marginBottom: 30,
        textAlign: 'center',
        color: '#333',
    },
    resultMessageContainer: {
        padding: 20,
        width: '100%',
    },
});

export default ResultScreen;
