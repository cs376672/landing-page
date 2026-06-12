const GVIZ_URL = 'https://docs.google.com/spreadsheets/d/1H1jNQYD59Ksr1ter56N_TXRznNHfWAJWaPVRSNS-s7Y/gviz/tq?tq=&tqx=out:json';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    container.classList.add('is-loading');

    fetchSheetData()
        .then(data => {
            applyDataToDOM(data);
        })
        .catch(err => {
            console.error('데이터 불러오기 실패:', err);
        })
        .finally(() => {
            setTimeout(() => {
                container.classList.remove('is-loading');
                document.querySelectorAll('.skeleton-block').forEach(el => el.remove());
                document.querySelectorAll('.skeleton-img').forEach(el => el.classList.remove('skeleton-img'));
                document.querySelectorAll('.skeleton-text').forEach(el => el.classList.remove('skeleton-text'));
            }, 300);
        });
});

function fetchSheetData() {
    return fetch(GVIZ_URL)
        .then(response => response.text())
        .then(text => {
            // Google gviz API 응답에서 순수 JSON 부분만 추출
            const jsonStr = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
            const data = JSON.parse(jsonStr);
            
            const rows = data.table.rows;
            let parsedData = {
                links: []
            };
            
            // 데이터가 세로가 아닌 가로(열 단위)로 입력된 형태를 파싱
            if (rows && rows.length >= 3) {
                const numCols = rows[0].c.length;
                for(let i=1; i<numCols; i++) {
                    const type = rows[0].c[i] ? rows[0].c[i].v : null;
                    const title = rows[1].c[i] ? rows[1].c[i].v : null;
                    const value = rows[2].c[i] ? rows[2].c[i].v : null;
                    const bgColor = (rows[3] && rows[3].c[i]) ? rows[3].c[i].v : null;
                    const textColor = (rows[4] && rows[4].c[i]) ? rows[4].c[i].v : null;
                    
                    if(type === 'profile') {
                        if(title === 'hero_title') parsedData.hero_title = value;
                        if(title === 'profile_desc') parsedData.profile_desc = value;
                        if(title === 'profile_img_url') parsedData.profile_img_url = value;
                    } else if(type === 'link') {
                        parsedData.links.push({
                            title: title,
                            url: value,
                            bg_color: bgColor,
                            text_color: textColor
                        });
                    }
                }
            }
            
            // 누락된 프로필 이미지가 있을 경우 기본값 세팅
            if (!parsedData.profile_img_url) {
                parsedData.profile_img_url = "https://github.com/cs376672.png";
            }
            if (!parsedData.profile_desc) {
                parsedData.profile_desc = "새로운 기술로 일상을 더 편리하게 만드는 데 관심이 많아요. 현재 안티그래비티 AI와 함께 웹 페이지 구현을 기획하고 테스트하고 있습니다. 소통 환영해요!";
            }
            
            return parsedData;
        });
}

function applyDataToDOM(data) {
    const heroTitle = document.getElementById('hero-title');
    const profileDesc = document.getElementById('profile-desc');
    const profileImg = document.getElementById('profile-img');
    const linksContainer = document.getElementById('links-container');

    if (data.hero_title) heroTitle.innerText = data.hero_title;
    if (data.profile_desc) profileDesc.innerText = data.profile_desc;
    if (data.profile_img_url) profileImg.src = data.profile_img_url;

    if (data.links && Array.isArray(data.links)) {
        data.links.forEach(link => {
            const a = document.createElement('a');
            a.href = link.url;
            // 전화걸기나 이메일 등 외부 링크에 대한 _blank 설정
            if (!link.url.startsWith('tel:') && !link.url.startsWith('mailto:')) {
                a.target = "_blank";
            }
            a.className = "link-button";
            a.innerText = link.title;
            
            if (link.bg_color) a.style.backgroundColor = link.bg_color;
            if (link.text_color) a.style.color = link.text_color;
            
            linksContainer.appendChild(a);
        });
    }
}
