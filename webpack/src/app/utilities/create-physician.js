import { physicianPopupCard } from "../js/physicianPopupCard";

 

export const createPhysician = (data) => {
    let physicianCard = document.createElement('div');
    // href data.permalink
    // physicianCard.href = data.permalink;


    /**
     *    use later
     *    <div data-value="${data.id}" class="user physician-menu-item"><img decoding="async" class="user-icon" src="${site_url}/wp-content/uploads/2024/04/User.png"></div>
     */
    physicianCard.classList.add('physician-card');
    
    physicianCard.dataset.physican_data = JSON.stringify(data);


    physicianCard.innerHTML = `
    <p><img decoding="async" class="physician-card-thumbnail" src="${data.thumbnail}"></p>

    <div class="physician-card-content">
        <div class="name">${data.name}</div>
        <div class="title">${data.title}</div>
        <div class="location-container">
            <div class
            ="location">${data.affiliation_choice}</div>
        </div>
    </div>

    <div class="physician-menu">
     
        <div data-value="${data.phone}" class="telephone physician-menu-item"><img decoding="async" class="phone-icon" src="${site_url}/wp-content/uploads/2024/04/specialty-2024.png"></div>
        <div data-value="${data.location}" class="location2 physician-menu-item"><img decoding="async" class="map-icon" src="${site_url}/wp-content/uploads/2024/04/Map.png"></div>
    </div>
    `;

    // get physician-card-thumbnail and attach onclick listener 
    let thumbnail = physicianCard.querySelector('.physician-card-thumbnail');
    thumbnail.addEventListener('click', () => {
        window
            .location
            .href = data.permalink;
    }
    );
    // get each physician-menu-item and attach onclick listener 
    let physicianMenuItems = physicianCard.querySelectorAll('.physician-menu-item');
    physicianMenuItems.forEach(menuItem => {
        menuItem.addEventListener('click', (e) => {
            let value = e.currentTarget.dataset.value;
            if (e.currentTarget.classList.contains('user')) {
                // use permalink to go to the physician page
                window.location.href = data.permalink;
            } else if (e.currentTarget.classList.contains('telephone')) {
                physicianPopupCard(data);
                 
            } else if (e.currentTarget.classList.contains('location2')) {
                physicianPopupCard(data);
            }
        });
    });
    return physicianCard;
}


export const fetchPhysicians = async () => {
    try {
            // add wp_rest_nonce to header 
    let headers = new Headers();
    headers.append('X-WP-Nonce', wp_rest_nonce);
        // use ajax-url with ortho/v1/get_experts endpoint
        let response = await fetch(ajax_url + 'ortho/v1/get_experts', {
            method: 'GET',
            headers: headers
        });
        let data = await response.json();


        console.log(data, 'data');
          if (!data?.success) {
            console.log(data.message, 'no success');
            throw new Error('Error fetching physicians');
        }
       
 
        // if data has experts property and is an array return the data
        if (data?.experts && Array.isArray(data.experts)) {
            const sortedExperts = data.experts.sort((a, b) => {
                // Split the names into first and last names
                const [aLastName, aFirstName] = a.name.split(' ').reverse();
                const [bLastName, bFirstName] = b.name.split(' ').reverse();
        
                // Compare last names
                if (aLastName !== bLastName) {
                    return aLastName.localeCompare(bLastName);
                } else {
                    // If last names are equal, compare first names
                    return aFirstName.localeCompare(bFirstName);
                }
            });

            return sortedExperts;
             
            
        } else {
            console.log(data.message, 'no experts');
            throw new Error('Error fetching physicians');
        }
     } catch (error) {
        //  return error message
        return error.message;
         
    }
}