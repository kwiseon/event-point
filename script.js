// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    // 슬라이더 관련 요소들
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    let slideInterval;

    // 슬라이드쇼 시작
    const startSlideShow = () => {
        if (slideInterval) clearInterval(slideInterval);
        slideInterval = setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 2000); // 2초 간격
    };
    if (slides.length > 1) {
        startSlideShow();
    }

    // 이하 기존 폼 관련 코드...
    const form = document.getElementById('pointForm');
    if (!form) return;
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const messageDiv = document.getElementById('message');
    const submitButton = form.querySelector('button[type="submit"]');
    const modal = document.getElementById('successModal');

    // 초기화 함수
    const init = () => {
        form.addEventListener('submit', handleSubmit);
        phoneInput.addEventListener('input', handlePhoneInput);
        [nameInput, emailInput, phoneInput].forEach(input => {
            input.addEventListener('input', validateForm);
        });
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
        messageDiv.style.display = 'block';
        
        // 5초 후 메시지 자동 제거
        setTimeout(() => {
            messageDiv.style.display = 'none';
            messageDiv.textContent = '';
            messageDiv.className = 'message';
        }, 5000);
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
            const scriptURL = 'https://script.google.com/macros/s/AKfycbxUmcQW471JkaBp_jzmAFA03G2-TbkkBHDic9LwZiLHsSFcjDH-QOzd1CBnNXgwkIkjxw/exec';
            
            // fetch 요청 (JSON 방식)
            const response = await fetch(scriptURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                // 성공 시 처리
                showSuccessModal();
                form.reset();
                submitButton.disabled = true;
            } else {
                const errorData = await response.text();
                console.error('Server response:', errorData);
                throw new Error(`서버 응답 오류: ${response.status} ${response.statusText}`);
            }

        } catch (error) {
            console.error('Detailed error:', error);
            
            // 오류 메시지 구체화
            let errorMessage = '신청 중 오류가 발생했습니다. ';
            
            if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                errorMessage += '인터넷 연결을 확인해주세요.';
            } else if (error.message.includes('서버 응답 오류')) {
                errorMessage += '잠시 후 다시 시도해주세요.';
            } else {
                errorMessage += '다시 시도해주세요.';
            }
            
            showMessage(errorMessage, 'error');
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