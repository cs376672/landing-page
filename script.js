const GOOGLE_APP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyCLgYWT-uW2R93EcFO0hd95xZFHpH2y2_Q2yo07S3Ug_KDhjHBPvxGi8nY0j4-4jNYdA/exec';

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
    return fetch(GOOGLE_APP_SCRIPT_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
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
            a.target = "_blank";
            a.className = "link-button";
            a.innerText = link.title;
            
            if (link.bg_color) a.style.backgroundColor = link.bg_color;
            if (link.text_color) a.style.color = link.text_color;
            
            linksContainer.appendChild(a);
        });
    }
}
