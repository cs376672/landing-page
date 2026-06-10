const mockDataFromSheet = {
    "profile_img_url": "https://github.com/cs376672.png",
    "hero_title": "안녕하세요, AI 바이브 코딩을 배우고 있는 27살 정지우입니다 👋",
    "profile_desc": "새로운 기술로 일상을 더 편리하게 만드는 데 관심이 많아요. 현재 안티그래비티 AI와 함께 웹 페이지 구현을 기획하고 테스트하고 있습니다. 소통 환영해요!",
    "links": [
        { "title": "📞 010-9275-9991", "url": "tel:01092759991", "bg_color": "#10b981", "text_color": "#ffffff" },
        { "title": "📧 cs376672@gmail.com", "url": "mailto:cs376672@gmail.com", "bg_color": "#3b82f6", "text_color": "#ffffff" },
        { "title": "💬 카카오톡 QR코드", "url": "kakao_qr.png", "bg_color": "#FEE500", "text_color": "#191919" }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    container.classList.add('is-loading');

    fetchSheetData()
        .then(data => {
            applyDataToDOM(data);
        })
        .catch(err => console.error(err))
        .finally(() => {
            setTimeout(() => {
                container.classList.remove('is-loading');
                document.querySelectorAll('.skeleton-block').forEach(el => el.remove());
            }, 300);
        });
});

function fetchSheetData() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockDataFromSheet);
        }, 1500);
    });
}

function applyDataToDOM(data) {
    const heroTitle = document.getElementById('hero-title');
    const profileDesc = document.getElementById('profile-desc');
    const profileImg = document.getElementById('profile-img');
    const linksContainer = document.getElementById('links-container');

    // 텍스트 및 이미지 반영
    if (data.hero_title) heroTitle.innerText = data.hero_title;
    if (data.profile_desc) profileDesc.innerText = data.profile_desc;
    if (data.profile_img_url) profileImg.src = data.profile_img_url;

    // 링크 버튼들 동적 렌더링
    if (data.links && Array.isArray(data.links)) {
        data.links.forEach(link => {
            const a = document.createElement('a');
            a.href = link.url;
            a.target = "_blank"; // 새 창 열기
            a.className = "link-button";
            a.innerText = link.title;
            a.style.backgroundColor = link.bg_color;
            if (link.text_color) {
                a.style.color = link.text_color;
            }
            
            linksContainer.appendChild(a);
        });
    }
}
