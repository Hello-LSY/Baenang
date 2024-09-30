const UpdateBusinessCardScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { businessCard } = route.params;
  const auth = useSelector((state) => state.auth);

  const [name, setName] = useState(businessCard.name || '');
  const [country, setCountry] = useState(businessCard.country || '');
  const [email, setEmail] = useState(businessCard.email || '');
  const [sns, setSns] = useState(businessCard.sns || '');
  const [introduction, setIntroduction] = useState(businessCard.introduction || '');
  const [image, setImage] = useState(null); // 선택한 이미지 URI 상태
  const [imageUrl, setImageUrl] = useState(businessCard.imageUrl || null); // 기존 이미지 URL 초기화

  const handleUpdateCard = async () => {
    const updatedBusinessCardData = { name, country, email, sns, introduction };

    try {
      // 이미지가 선택된 경우에만 업로드
      if (image) {
        const uploadedImageUrl = await uploadImage(image, auth.memberId);
        updatedBusinessCardData.imageUrl = uploadedImageUrl; // 업로드된 이미지 URL 추가
      } else {
        updatedBusinessCardData.imageUrl = imageUrl; // 기존 이미지 URL 사용
      }

      // 수정이 완료된 후에 다시 명함 정보를 불러오도록 개선
      await dispatch(updateBusinessCard({ cardId: businessCard.cardId, businessCardData: updatedBusinessCardData }));
      await dispatch(fetchBusinessCard(auth.memberId)); // 수정 후 명함 정보 다시 불러오기
      Alert.alert('성공', '명함이 성공적으로 수정되었습니다.');
      navigation.goBack();
    } catch (error) {
      console.error('명함 수정 중 오류:', error);
      Alert.alert('오류', '명함 수정 중 오류가 발생했습니다.');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      console.log('이미지 선택됨:', result.uri);
    } else {
      console.log('이미지 선택 취소');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>명함 수정</Text>
      <TextInput
        style={styles.input}
        placeholder="이름"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="국가"
        value={country}
        onChangeText={setCountry}
      />
      <TextInput
        style={styles.input}
        placeholder="이메일"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="SNS"
        value={sns}
        onChangeText={setSns}
      />
      <TextInput
        style={styles.input}
        placeholder="소개"
        value={introduction}
        onChangeText={setIntroduction}
      />
      <Button title="이미지 선택" onPress={pickImage} />
      {image && <Text>선택된 이미지: {String(image)}</Text>}
      <Button title="명함 수정" onPress={handleUpdateCard} />
    </View>
  );
};
