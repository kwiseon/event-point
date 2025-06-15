// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('pointForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const messageDiv = document.getElementById('message');
    const submitButton = form.querySelector('button[type="submit"]');
    const modal = document.getElementById('successModal');

    // 슬라이더 관련 요소들
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    let currentSlide = 0;
    let slideInterval;

    // 초기화 함수
    const init = () => {
        form.addEventListener('submit', handleSubmit);
        phoneInput.addEventListener('input', handlePhoneInput);
        [nameInput, emailInput, phoneInput].forEach(input => {
            input.addEventListener('input', validateForm);
        });

        // 슬라이더 초기화
        startSlideShow();

        // 인디케이터 클릭 이벤트
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                stopSlideShow();
                updateSlide(index);
                startSlideShow();
            });
        });
    };

    // 슬라이드쇼 시작
    const startSlideShow = () => {
        // 기존 인터벌이 있다면 제거
        if (slideInterval) {
            clearInterval(slideInterval);
        }
        // 3초마다 다음 슬라이드로 전환
        slideInterval = setInterval(() => {
            updateSlide((currentSlide + 1) % slides.length);
        }, 3000);
    };

    // 슬라이드쇼 정지
    const stopSlideShow = () => {
        if (slideInterval) {
            clearInterval(slideInterval);
        }
    };

    // 슬라이드 업데이트
    const updateSlide = (index) => {
        // 현재 활성화된 슬라이드와 인디케이터의 active 클래스 제거
        slides[currentSlide].classList.remove('active');
        indicators[currentSlide].classList.remove('active');
        
        // 새로운 슬라이드와 인디케이터에 active 클래스 추가
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        
        // 현재 슬라이드 인덱스 업데이트
        currentSlide = index;
    };

    // 전화번호 입력 처리
    const handlePhoneInput = (event) => {
        let value = event.target.value.replace(/[^0-9]/g, '');
        
        // 11자리로 제한
        if (value.length > 11) {
            value = value.slice(0, 11);
        }
        
        event.target.value = value;
    };

    // 폼 유효성 검사
    const validateForm = () => {
        const isNameValid = nameInput.value.trim().length > 0;
        const isEmailValid = isValidEmail(emailInput.value);
        const isPhoneValid = isValidPhone(phoneInput.value);
        const isAgreementValid = document.getElementById('agree').checked;

        submitButton.disabled = !(isNameValid && isEmailValid && isPhoneValid && isAgreementValid);
        
        return isNameValid && isEmailValid && isPhoneValid && isAgreementValid;
    };

    // 이메일 유효성 검사
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // 전화번호 유효성 검사
    const isValidPhone = (phone) => {
        return phone.length >= 10 && phone.length <= 11;
    };

    // 메시지 표시
    const showMessage = (message, type = 'error') => {
        messageDiv.textContent = message;
        messageDiv.className = `message ${type}`;
    };

    // 로딩 상태 토글
    const toggleLoading = (isLoading) => {
        const buttonContent = submitButton.querySelector('.button-content');
        if (isLoading) {
            submitButton.disabled = true;
            buttonContent.innerHTML = '<div class="loading-spinner"></div>처리 중...';
        } else {
            buttonContent.innerHTML = '신청하기';
            submitButton.disabled = false;
        }
    };

    // 폼 제출 처리
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            showMessage('모든 필드를 올바르게 입력해주세요.');
            return;
        }

        toggleLoading(true);

        try {
            // 폼 데이터 수집
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                phone: phoneInput.value.trim(),
                agreement: document.getElementById('agree').checked ? '동의' : '미동의'
            };

            // 구글 시트로 데이터 전송
            const scriptURL = 'https://script.google.com/macros/s/AKfycbx0mbVH4-aoFM24pbRgy0BoBZrP7MtL26Oa2vlTJ_0qTEScIBCM80MrrLoqHLSelQwi/exec';
            
            // FormData 객체 생성
            const form = new FormData();
            form.append('name', formData.name);
            form.append('email', formData.email);
            form.append('phone', formData.phone);
            form.append('agreement', formData.agreement);

            // fetch 요청
            const response = await fetch(scriptURL, {
                method: 'POST',
                body: form
            });

            if (response.ok) {
                // 성공 시 처리
                showSuccessModal();
                form.reset();
                submitButton.disabled = true;
            } else {
                throw new Error('Failed to submit data');
            }

        } catch (error) {
            showMessage('신청 중 오류가 발생했습니다. 다시 시도해주세요.');
            console.error('Form submission error:', error);
        } finally {
            toggleLoading(false);
        }
    };

    // 성공 모달 표시
    const showSuccessModal = () => {
        modal.style.display = 'flex';
        modal.classList.add('show');
        
        // 3초 후 모달 닫기
        setTimeout(() => {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }, 3000);
    };

    // 애플리케이션 초기화
    init();
}); 