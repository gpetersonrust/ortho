function physicianPopupCard(expert) {

  




  let popup_container = document.createElement('div');
  popup_container.classList.add('physician-popup-container');
  popup_container.id = 'physician-popup-container';


  // variables; 
  let title = expert.name;
  let job_title = expert.title;
    let image_url = expert.thumbnail;
    console.log(expert.specialty);
  let specialty = expert.specialty.reduce((acc, curr) => {
    const specialties = {
        sportsmedicine: 'Sports Medicine',
        spineneckback: 'Spine (Neck & Back)',
        handwrist: 'Hand & Wrist',
        footankle: 'Foot & Ankle',
        jointreplacement: 'Joint Replacement',
        pediatric: 'Pediatric',
        shoulder: 'Shoulder',
        hipknee: 'Hip & Knee',
        trauma: 'Trauma',
        oncology: 'Oncology',
        generalorthopaedics: 'General Orthopaedics',
        jointreplacementankle: 'Joint Replacement – Ankle',
        jointreplacementknee: 'Joint Replacement – Knee',
        jointreplacementhip: 'Joint Replacement – Hip'
    };
  let specialty = specialties[curr];    
     
    curr = curr.charAt(0).toUpperCase() + curr.slice(1);
    let html = `<div class="specialty-text"> ${specialty} </div>`;
    return acc + html;
  }, '');
  let locations = expert.location.split('<br />').reduce((acc, curr) => {
    // remove <p> and </p> tags from html
    curr = curr.replace(/<\/?p>/g, '');
    // upper case first letter
    curr = curr.charAt(0).toUpperCase() + curr.slice(1);

    let html = `<div class="location-text"> ${curr} </div>`;
    return acc + html;
  },
      '');
    let affilation_image = expert.affilation_image;





  popup_container.innerHTML = `<div class="physician-popup">
      <div class="physician-popup-inner">
          <img class="profile-pic"src="${image_url}" />
          <div class="content">
              <div class="info">
                  <div class="name"> ${title}</div>
                  <div class="job-title"> ${job_title} </div>
              </div>
              <img class="logo" src="${affilation_image}" />
              <div class="location-and-specialty">
                  <div class="locations">
                      <svg class="location-svg" width="32" height="31" viewBox="0 0 32 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g clip-path="url(#clip0_105_662)">
                              <path d="M18.0966 14.8542C19.9049 14.8542 21.3257 13.4333 21.3257 11.625C21.3257 9.81666 19.9049 8.39583 18.0966 8.39583C16.2882 8.39583 14.8674 9.81666 14.8674 11.625C14.8674 13.4333 16.2882 14.8542 18.0966 14.8542ZM18.0966 2.58333C23.1341 2.58333 27.1382 6.5875 27.1382 11.625C27.1382 18.3417 18.0966 28.4167 18.0966 28.4167C18.0966 28.4167 9.05491 18.3417 9.05491 11.625C9.05491 6.5875 13.0591 2.58333 18.0966 2.58333ZM6.47158 11.625C6.47158 17.4375 13.0591 25.4458 14.2216 26.8667L12.9299 28.4167C12.9299 28.4167 3.88824 18.3417 3.88824 11.625C3.88824 7.49166 6.60074 4.13333 10.3466 2.97083C8.02158 5.0375 6.47158 8.1375 6.47158 11.625Z" fill="white" />
                          </g>
                          <defs>
                              <clipPath id="clip0_105_662">
                                  <rect width="31" height="31" fill="white" transform="translate(0.0132446)" />
                              </clipPath>
                          </defs>
                      </svg>
                      <div class="location-inner">
                         ${locations}
                      </div>
                  </div>
                  <div class="specialty">
                      <svg class="specialty-svg" width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M23.2566 3.875H7.75663C7.04326 3.875 6.46497 4.4533 6.46497 5.16667V25.8333C6.46497 26.5467 7.04326 27.125 7.75663 27.125H23.2566C23.97 27.125 24.5483 26.5467 24.5483 25.8333V5.16667C24.5483 4.4533 23.97 3.875 23.2566 3.875Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M15.5066 20.6667V15.5M18.09 18.0833H12.9233M11.6316 7.75C11.6316 8.09257 11.7677 8.42111 12.0099 8.66335C12.2522 8.90558 12.5807 9.04167 12.9233 9.04167H18.09C18.4325 9.04167 18.7611 8.90558 19.0033 8.66335C19.2455 8.42111 19.3816 8.09257 19.3816 7.75V3.875H11.6316V7.75Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <div class="specialty-inner">
                      ${specialty}
                      </div>
                  </div>
              </div>
              <div class="learn-more">
                    <a href="${expert.permalink}">Learn More</a>
              </div>
          </div>
      </div>
      <div id='physician-close-modal' class="physician-close-modal">
          <div class="physician-close-modal-text"> x </div>
      </div>
  </div>
  `;



  document.body.appendChild(popup_container);
  //  get modal and delete modal once clicked 
  let close_modal = document.getElementById('physician-close-modal');
  close_modal.onclick = () => {
    popup_container.remove();
    // unlock body
    document.body.style.overflow = 'auto';
    // height of body auto
    document.body.style.height = 'auto';
  };





}

export { physicianPopupCard };